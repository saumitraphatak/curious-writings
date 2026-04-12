(function () {
  var utt           = null;
  var selectedVoice = null;
  var voiceList     = [];

  var PREFER = [
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

  function loadVoices(select) {
    var all = window.speechSynthesis.getVoices();
    if (!all.length) return false;

    // English + Hindi/Marathi only, preferred voices first
    var top = [], rest = [];
    all.filter(function (v) {
      return v.lang.startsWith('en') || v.lang.startsWith('hi') || v.lang.startsWith('mr');
    }).forEach(function (v) {
      var pref = PREFER.some(function (n) { return v.name.includes(n); });
      if (pref) top.push(v); else rest.push(v);
    });
    voiceList = top.concat(rest);

    select.innerHTML = '';
    voiceList.forEach(function (v, i) {
      var opt         = document.createElement('option');
      opt.value       = i;
      var label       = v.name.replace(' Online (Natural)', ' ✦').replace(' Online', '');
      opt.textContent = label + '  [' + v.lang + ']';
      select.appendChild(opt);
    });

    // Auto-select first preferred voice
    selectedVoice = voiceList[0] || null;
    return true;
  }

  function getBodyText() {
    var body = document.querySelector('.article-body');
    return body ? body.innerText.trim() : null;
  }

  function inject() {
    var header = document.querySelector('.article-page-header');
    if (!header || !document.querySelector('.article-body')) return;

    // ── controls row ──
    var row       = document.createElement('div');
    row.className = 'ls-controls';

    var btn       = document.createElement('button');
    btn.className = 'ls-btn';
    btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    var label       = document.createElement('span');
    label.className = 'ls-voice-label';
    label.textContent = 'Voice:';

    var select       = document.createElement('select');
    select.className = 'ls-voice-select';
    select.title     = 'Choose a voice';

    // placeholder until voices load
    var placeholder       = document.createElement('option');
    placeholder.textContent = 'Loading voices…';
    placeholder.disabled  = true;
    placeholder.selected  = true;
    select.appendChild(placeholder);

    select.addEventListener('change', function () {
      selectedVoice = voiceList[parseInt(select.value)] || null;
    });

    row.appendChild(btn);
    row.appendChild(label);
    row.appendChild(select);

    var divider = header.querySelector('.article-divider');
    if (divider) header.insertBefore(row, divider);
    else         header.appendChild(row);

    // ── voice loading — retry until voices appear ──
    // Chrome fires onvoiceschanged early; Safari loads sync; Firefox may delay.
    // Polling every 200ms for up to 3s catches all cases.
    var attempts = 0;
    function tryLoad() {
      if (loadVoices(select)) return; // success
      if (++attempts < 15) setTimeout(tryLoad, 200);
    }
    window.speechSynthesis.onvoiceschanged = function () { loadVoices(select); };
    tryLoad();

    // ── button ──
    function resetBtn() {
      btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
      btn.classList.remove('ls-active');
    }

    btn.addEventListener('click', function () {
      if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in this browser. Try Chrome or Safari.');
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utt = null;
        resetBtn();
        return;
      }

      var text = getBodyText();
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
