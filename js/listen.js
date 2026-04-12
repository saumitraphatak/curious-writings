(function () {
  var utt           = null;
  var selectedVoice = null;
  var allVoices     = [];

  var PREFER = [
    'Google US English',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Steffan Online (Natural)',
    'Samantha', 'Karen', 'Daniel',
    'Google UK English Female',
    'Google UK English Male',
  ];

  function populateSelect(select) {
    var voices = window.speechSynthesis.getVoices();
    if (!voices.length) return false;

    // preferred first, then rest
    var top = [], rest = [];
    voices.forEach(function (v) {
      PREFER.some(function (n) { return v.name.includes(n); })
        ? top.push(v) : rest.push(v);
    });
    allVoices = top.concat(rest);

    select.innerHTML = '';
    allVoices.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = v.name + ' (' + v.lang + ')';
      select.appendChild(o);
    });

    selectedVoice = allVoices[0] || null;
    select.value  = '0';
    return true;
  }

  function inject() {
    var header = document.querySelector('.article-page-header');
    var body   = document.querySelector('.article-body');
    if (!header || !body) return;

    // ── button ──────────────────────────────────────────────────────────────
    var btn       = document.createElement('button');
    btn.className = 'ls-btn';
    btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
    btn.style.marginBottom = '0.5rem';

    // ── voice row (hard-coded visible styles — not relying on CSS file) ──────
    var voiceRow = document.createElement('div');
    voiceRow.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:1.2rem;';

    var voiceLabel = document.createElement('label');
    voiceLabel.textContent = 'Voice:';
    voiceLabel.style.cssText = 'font-size:13px; color:#8A8A82; font-family:system-ui,sans-serif;';

    var select = document.createElement('select');
    select.style.cssText = [
      'border: 1px solid #ccc',
      'border-radius: 20px',
      'padding: 4px 12px',
      'font-size: 13px',
      'font-family: system-ui, sans-serif',
      'background: #fff',
      'color: #333',
      'cursor: pointer',
      'min-width: 220px',
      'max-width: 340px',
    ].join(';');

    var placeholder = document.createElement('option');
    placeholder.textContent = 'Loading voices…';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    select.addEventListener('change', function () {
      selectedVoice = allVoices[parseInt(select.value)] || null;
    });

    voiceRow.appendChild(voiceLabel);
    voiceRow.appendChild(select);

    // ── insert into page ─────────────────────────────────────────────────────
    var divider = header.querySelector('.article-divider');
    if (divider) {
      header.insertBefore(btn, divider);
      header.insertBefore(voiceRow, divider);
    } else {
      header.appendChild(btn);
      header.appendChild(voiceRow);
    }

    // ── load voices — poll until available (Chrome fires event early) ────────
    var attempts = 0;
    function tryLoad() {
      if (populateSelect(select)) return;
      if (++attempts < 20) setTimeout(tryLoad, 300);
    }
    window.speechSynthesis.onvoiceschanged = function () { populateSelect(select); };
    tryLoad();

    // ── play / stop ──────────────────────────────────────────────────────────
    function resetBtn() {
      btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
      btn.classList.remove('ls-active');
    }

    btn.addEventListener('click', function () {
      if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported. Try Chrome or Safari.');
        return;
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utt = null;
        resetBtn();
        return;
      }

      var text = body.innerText.trim();
      if (!text) return;

      utt        = new SpeechSynthesisUtterance(text);
      utt.rate   = 0.92;
      if (selectedVoice) utt.voice = selectedVoice;
      utt.onend  = function () { resetBtn(); utt = null; };
      utt.onerror = function () { resetBtn(); utt = null; };

      window.speechSynthesis.speak(utt);
      btn.innerHTML = '<span class="ls-icon">⏹</span><span class="ls-label">Stop</span>';
      btn.classList.add('ls-active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
