// listen.js — Full essay text-to-speech for article pages
// Injected into all article pages via <script src="../js/listen.js">
// Uses Web Speech API with smart voice selection for best available quality.

(function () {
  'use strict';

  // ── Pick the best available voice ──────────────────────────────────────────
  // Browser TTS quality varies wildly. Priority list picks neural/natural voices
  // when available. "Google US English" (Chrome) is noticeably more human.
  // "Samantha" (macOS Safari) is also very natural.
  const VOICE_PRIORITY_EN = [
    'Google US English',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Steffan Online (Natural)',
    'Microsoft Natasha Online (Natural)',
    'Samantha',                          // macOS — very natural
    'Karen',                             // macOS AU
    'Daniel',                            // macOS UK
    'Google UK English Female',
    'Google UK English Male',
  ];
  const VOICE_PRIORITY_HI = [
    'Google हिन्दी',
    'Lekha',   // macOS Hindi
    'Veena',   // macOS
  ];

  function getBestVoice(lang) {
    const voices = window.speechSynthesis.getVoices();
    const priority = lang === 'mr-IN' || lang === 'hi-IN'
      ? VOICE_PRIORITY_HI
      : VOICE_PRIORITY_EN;

    for (const name of priority) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    // Fallback: first voice matching the language
    const langRoot = lang.split('-')[0];
    return voices.find(v => v.lang.startsWith(langRoot))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0]
        || null;
  }

  // ── Detect article language ───────────────────────────────────────────────
  function detectLang() {
    const tag = document.querySelector('.category-tag');
    if (tag && tag.classList.contains('cat-marathi')) return 'mr-IN';
    return 'en-US';
  }

  // ── Build the text to speak ───────────────────────────────────────────────
  // Reads the h1 title + full article body text.
  // Strips emoji characters which TTS reads as "emoji" on some engines.
  function getEssayText() {
    const h1  = document.querySelector('h1');
    const body = document.querySelector('.article-body');
    if (!body) return null;
    const title   = h1 ? h1.textContent.replace(/[\u{1F000}-\u{1FFFF}✈️🚀]/gu, '').trim() + '. ' : '';
    const content = body.innerText.replace(/[\u{1F000}-\u{1FFFF}✈️🚀]/gu, '').trim();
    return title + content;
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let utterance = null;
  let state     = 'stopped'; // 'stopped' | 'playing' | 'paused'
  let btn       = null;

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
    window.speechSynthesis.cancel();
    utterance = null;
    setBtn('stopped');
  }

  function beginReading() {
    const text = getEssayText();
    if (!text) return;
    const lang = detectLang();

    utterance       = new SpeechSynthesisUtterance(text);
    utterance.lang  = lang;
    utterance.rate  = 0.9;   // Slightly slower than default = easier to follow
    utterance.pitch = 1.0;

    utterance.onend   = () => setBtn('stopped');
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') setBtn('stopped');
    };

    function speak() {
      const voice = getBestVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
      setBtn('playing');
    }

    // Voices may not be loaded yet on first call — wait if needed
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
    }
  }

  // ── Inject listen button into article header ──────────────────────────────
  function inject() {
    const header = document.querySelector('.article-page-header');
    if (!header || !document.querySelector('.article-body')) return;

    btn = document.createElement('button');
    btn.className   = 'ls-btn';
    btn.title       = 'Listen to the full essay using your browser\'s text-to-speech';
    btn.innerHTML   = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    // Insert just above the article divider line
    const divider = header.querySelector('.article-divider');
    if (divider) {
      header.insertBefore(btn, divider);
    } else {
      header.appendChild(btn);
    }

    btn.addEventListener('click', () => {
      if (!window.speechSynthesis) {
        alert('Your browser does not support text-to-speech.\nTry Chrome, Edge, or Safari.');
        return;
      }

      if (state === 'stopped') {
        beginReading();
      } else if (state === 'playing') {
        window.speechSynthesis.pause();
        setBtn('paused');
      } else if (state === 'paused') {
        window.speechSynthesis.resume();
        setBtn('playing');
      }
    });
  }

  // Cancel speech if user navigates away
  window.addEventListener('beforeunload', () => window.speechSynthesis?.cancel());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
