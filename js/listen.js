// listen.js — Full essay text-to-speech for article pages
//
// Root cause of "speak() but no audio" in Chrome:
//   SpeechSynthesisUtterance created as a local variable gets garbage-collected
//   by V8 before the browser's TTS engine can speak it. Fix: always keep a
//   module-level reference (currentUtterance) so GC never touches it.

(function () {
  'use strict';

  // ── Module-level reference — CRITICAL: prevents Chrome GC killing the utterance
  let currentUtterance = null;
  let state     = 'stopped';
  let btn       = null;
  let heartbeat = null;

  // ── Voice priority ─────────────────────────────────────────────────────────
  function getBestVoice(lang) {
    const voices = window.speechSynthesis.getVoices();
    const prefer = (lang === 'mr-IN' || lang === 'hi-IN')
      ? ['Google हिन्दी', 'Lekha', 'Veena']
      : [
          'Google US English',
          'Microsoft Aria Online (Natural)',
          'Microsoft Jenny Online (Natural)',
          'Samantha',
          'Karen',
          'Daniel',
          'Google UK English Female',
        ];
    for (const name of prefer) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    const root = lang.split('-')[0];
    return voices.find(v => v.lang.startsWith(root))
        || voices.find(v => v.lang.startsWith('en'))
        || null;
  }

  // ── Build essay text ───────────────────────────────────────────────────────
  function getEssayText() {
    const h1   = document.querySelector('h1');
    const body = document.querySelector('.article-body');
    if (!body) return null;
    const strip = s => s.replace(/[^\S\n]+/g, ' ')
                        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, '')
                        .trim();
    return (h1 ? strip(h1.textContent) + '. ' : '') + strip(body.innerText);
  }

  function detectLang() {
    const tag = document.querySelector('.category-tag');
    return (tag && tag.classList.contains('cat-marathi')) ? 'mr-IN' : 'en-US';
  }

  // ── Heartbeat: keeps Chrome alive past its ~15s stall ─────────────────────
  function startHeartbeat() {
    stopHeartbeat();
    heartbeat = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 13000);
  }
  function stopHeartbeat() { clearInterval(heartbeat); heartbeat = null; }

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
    currentUtterance = null;
    setBtn('stopped');
  }

  // ── Core: create utterance, assign to MODULE-LEVEL var, then speak ─────────
  function createAndSpeak(text, lang, voice) {
    // Assign to module-level var FIRST — this is what prevents Chrome GC
    currentUtterance          = new SpeechSynthesisUtterance(text);
    currentUtterance.lang     = lang;
    currentUtterance.rate     = 0.9;
    currentUtterance.pitch    = 1.0;
    if (voice) currentUtterance.voice = voice;

    currentUtterance.onend = () => {
      stopHeartbeat();
      setBtn('stopped');
    };
    currentUtterance.onerror = e => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        stop();
      }
    };

    window.speechSynthesis.speak(currentUtterance);
    startHeartbeat();
  }

  // ── Begin reading ──────────────────────────────────────────────────────────
  function beginReading() {
    const text = getEssayText();
    if (!text) { console.warn('listen.js: no .article-body found'); return; }

    const lang = detectLang();

    // Cancel any lingering speech first
    window.speechSynthesis.cancel();

    function go() {
      const voice = getBestVoice(lang);
      setBtn('playing');
      createAndSpeak(text, lang, voice);
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      go();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        go();
      };
      // Fallback: if onvoiceschanged never fires (some browsers), speak anyway
      setTimeout(() => {
        if (state === 'stopped') return; // go() already ran
        go();
      }, 2000);
    }
  }

  // ── Inject button ──────────────────────────────────────────────────────────
  function inject() {
    const header = document.querySelector('.article-page-header');
    if (!header || !document.querySelector('.article-body')) return;

    btn = document.createElement('button');
    btn.className = 'ls-btn';
    btn.title     = 'Listen to the full essay using your browser\'s text-to-speech';
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
