(function () {
  var utt = null; // kept outside click handler so browser can't GC it

  function inject() {
    var header = document.querySelector('.article-page-header');
    var body   = document.querySelector('.article-body');
    if (!header || !body) return;

    var btn = document.createElement('button');
    btn.className = 'ls-btn';
    btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    var divider = header.querySelector('.article-divider');
    if (divider) header.insertBefore(btn, divider);
    else         header.appendChild(btn);

    btn.addEventListener('click', function () {
      if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in this browser. Try Chrome or Safari.');
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utt = null;
        btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
        btn.classList.remove('ls-active');
        return;
      }

      var h1   = document.querySelector('h1');
      var text = (h1 ? h1.innerText + '. ' : '') + body.innerText;

      utt        = new SpeechSynthesisUtterance(text);
      utt.onend  = function () {
        btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
        btn.classList.remove('ls-active');
        utt = null;
      };

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
