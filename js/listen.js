(function () {
  var utt          = null;
  var selectedVoice = null;

  // Voices that sound noticeably more human — shown at top of list
  var PREFER = [
    'Google US English',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Steffan Online (Natural)',
    'Microsoft Natasha Online (Natural)',
    'Samantha',   // macOS — very natural
    'Karen',      // macOS AU
    'Daniel',     // macOS UK
    'Google UK English Female',
    'Google UK English Male',
  ];

  function sortedVoices() {
    var all = window.speechSynthesis.getVoices();
    // English voices only (or Hindi/Marathi if on that page)
    var eng = all.filter(function (v) {
      return v.lang.startsWith('en') || v.lang.startsWith('hi') || v.lang.startsWith('mr');
    });
    // Put preferred voices first
    var top = [], rest = [];
    eng.forEach(function (v) {
      var isPref = PREFER.some(function (name) { return v.name.includes(name); });
      if (isPref) top.push(v); else rest.push(v);
    });
    return top.concat(rest);
  }

  function buildVoiceSelect(select) {
    var voices = sortedVoices();
    if (!voices.length) return;

    select.innerHTML = '';
    voices.forEach(function (v, i) {
      var opt      = document.createElement('option');
      opt.value    = i;
      var label    = v.name.replace(' Online (Natural)', ' ✦').replace(' Online', '');
      opt.textContent = label + ' (' + v.lang + ')';
      opt.dataset.idx = i;
      if (!selectedVoice && PREFER.some(function (n) { return v.name.includes(n); })) {
        opt.selected  = true;
        selectedVoice = v;
      }
      select.appendChild(opt);
    });
    // If no preferred voice was found, default to first
    if (!selectedVoice && voices.length) selectedVoice = voices[0];

    select.addEventListener('change', function () {
      selectedVoice = voices[parseInt(select.value)];
    });
  }

  function getEssayText() {
    var h1   = document.querySelector('h1');
    var body = document.querySelector('.article-body');
    if (!body) return null;
    return (h1 ? h1.innerText + '. ' : '') + body.innerText;
  }

  function inject() {
    var header = document.querySelector('.article-page-header');
    var body   = document.querySelector('.article-body');
    if (!header || !body) return;

    // Wrapper row
    var row         = document.createElement('div');
    row.className   = 'ls-controls';

    // Play/stop button
    var btn         = document.createElement('button');
    btn.className   = 'ls-btn';
    btn.innerHTML   = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    // Voice picker
    var select      = document.createElement('select');
    select.className = 'ls-voice-select';
    select.title    = 'Choose a voice';

    var hint        = document.createElement('span');
    hint.className  = 'ls-voice-label';
    hint.textContent = 'voice';

    row.appendChild(btn);
    row.appendChild(hint);
    row.appendChild(select);

    var divider = header.querySelector('.article-divider');
    if (divider) header.insertBefore(row, divider);
    else         header.appendChild(row);

    // Populate voices (may need to wait for async load)
    function tryPopulate() {
      var voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        buildVoiceSelect(select);
      } else {
        window.speechSynthesis.onvoiceschanged = function () {
          window.speechSynthesis.onvoiceschanged = null;
          buildVoiceSelect(select);
        };
      }
    }
    tryPopulate();

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

      var text = getEssayText();
      if (!text) return;

      utt           = new SpeechSynthesisUtterance(text);
      utt.rate      = 0.92;
      if (selectedVoice) utt.voice = selectedVoice;

      utt.onend = function () { resetBtn(); utt = null; };
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
