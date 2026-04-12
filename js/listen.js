// listen.js — Full essay text-to-speech for article pages
//
// Fixes for known Chrome Web Speech API bugs:
//   1. "Silent speak" bug — cancel() + 100ms delay before speak() clears stale state
//   2. Chrome ~15s stall bug — heartbeat pause/resume every 14s keeps it alive
//   3. Utterance GC bug — module-level reference keeps utterance alive

(function () {
  'use strict';

  // ── Voice priority list ────────────────────────────────────────────────────
  const VOICE_EN = [
    'Google US English',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Steffan Online (Natural)',
    'Microsoft Natasha Online (Natural)',
    'Samantha',
    'Karen',
    'Daniel',
    'Google UK English Female',
    'Google UK English Male',
  ];
  const VOICE_HI = ['Google हिन्दी', 'Lekha', 'Veena'];

  function getBestVoice(lang) {
    const voices   = window.speechSynthesis.getVoices();
    const priority = (lang === 'mr-IN' || lang === 'hi-IN') ? VOICE_HI : VOICE_EN;
    for (const name of priority) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    const root = lang.split('-')[0];
    return voices.find(v => v.lang.startsWith(root))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0]
        || null;
  }

  // ── Split text into ≤150-char chunks at sentence boundaries ───────────────
  // Chrome silently drops long utterances. Short chunks survive reliably.
  function splitChunks(text, max) {
    max = max || 150;
    // Split on sentence-ending punctuation followed by space/end
    const sentences = text.split(/(?<=[.!?\u0964\u0965])\s+/);
    const chunks = [];
    let buf = '';
    for (const s of sentences) {
      if (buf.length + s.length > max && buf.length > 0) {
        chunks.push(buf.trim());
        buf = s;
      } else {
        buf = buf ? buf + ' ' + s : s;
      }
    }
    if (buf.trim()) chunks.push(buf.trim());
    return chunks.filter(c => c.length > 0);
  }

  // ── Build essay text ───────────────────────────────────────────────────────
  function getEssayText() {
    const h1   = document.querySelector('h1');
    const body = document.querySelector('.article-body');
    if (!body) return null;
    // Strip emoji — some TTS engines say "emoji" aloud
    const clean = s => s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}✈️🚀🎓]/gu, '').trim();
    const title = h1 ? clean(h1.textContent) + '. ' : '';
    return title + clean(body.innerText);
  }

  function detectLang() {
    const tag = document.querySelector('.category-tag');
    if (tag && tag.classList.contains('cat-marathi')) return 'mr-IN';
    return 'en-US';
  }

  // ── State ──────────────────────────────────────────────────────────────────
  let chunks    = [];
  let chunkIdx  = 0;
  let voice     = null;
  let lang      = 'en-US';
  let state     = 'stopped';
  let btn       = null;
  let heartbeat = null;

  // ── Heartbeat — keeps Chrome alive past its ~15s stall bug ────────────────
  function startHeartbeat() {
    stopHeartbeat();
    heartbeat = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 14000);
  }
  function stopHeartbeat() {
    clearInterval(heartbeat);
    heartbeat = null;
  }

  // ── Button state ──────────────────────────────────────────────────────────
  function setBtn(s) {
    state = s;
    if (!btn) return;
    const icon  = btn.querySelector('.ls-icon');
    const label = btn.querySelector('.ls-label');
    if (s === 'playing') {
      icon.textContent  = '⏸';
      label.textContent = 'Pause';
      btn.classList.add('ls-active');
    } else if (s === 'paused') {
      icon.textContent  = '▶';
      label.textContent = 'Resume';
      btn.classList.add('ls-active');
    } else {
      icon.textContent  = '🎧';
      label.textContent = 'Listen to essay';
      btn.classList.remove('ls-active');
    }
  }

  function stop() {
    stopHeartbeat();
    window.speechSynthesis.cancel();
    chunks   = [];
    chunkIdx = 0;
    setBtn('stopped');
  }

  // ── Speak one chunk, chain to next on end ─────────────────────────────────
  function speakChunk(idx) {
    if (idx >= chunks.length) { stop(); return; }

    const u   = new SpeechSynthesisUtterance(chunks[idx]);
    u.lang    = lang;
    u.rate    = 0.9;
    u.pitch   = 1.0;
    if (voice) u.voice = voice;

    u.onend = () => {
      if (state === 'playing') speakChunk(idx + 1);
    };
    u.onerror = e => {
      // 'interrupted' / 'canceled' fire on manual cancel — not an error
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS error:', e.error);
        stop();
      }
    };

    window.speechSynthesis.speak(u);
  }

  // ── Begin reading ─────────────────────────────────────────────────────────
  function beginReading() {
    const text = getEssayText();
    if (!text) {
      console.warn('listen.js: no .article-body found on this page');
      return;
    }

    lang     = detectLang();
    chunks   = splitChunks(text);
    chunkIdx = 0;

    function go() {
      voice = getBestVoice(lang);

      // Fix 1: always cancel first, then wait one tick so Chrome fully clears
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (chunks.length === 0) return;
        setBtn('playing');
        startHeartbeat();
        speakChunk(0);
      }, 120);
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      go();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        go();
      };
    }
  }

  // ── Inject button into article header ─────────────────────────────────────
  function inject() {
    const header = document.querySelector('.article-page-header');
    if (!header || !document.querySelector('.article-body')) return;

    btn = document.createElement('button');
    btn.className = 'ls-btn';
    btn.title     = 'Listen to the full essay (uses browser text-to-speech)';
    btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    const divider = header.querySelector('.article-divider');
    if (divider) header.insertBefore(btn, divider);
    else         header.appendChild(btn);

    btn.addEventListener('click', () => {
      if (!window.speechSynthesis) {
        alert('Your browser does not support text-to-speech.\nTry Chrome, Edge, or Safari.');
        return;
      }

      if (state === 'stopped') {
        beginReading();
      } else if (state === 'playing') {
        window.speechSynthesis.pause();
        stopHeartbeat();
        setBtn('paused');
      } else if (state === 'paused') {
        window.speechSynthesis.resume();
        startHeartbeat();
        setBtn('playing');
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    stopHeartbeat();
    window.speechSynthesis?.cancel();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
