(function () {
  var utt = null;

  function inject() {
    var header = document.querySelector('.article-page-header');
    var body   = document.querySelector('.article-body');
    if (!header || !body) return;

    var btn       = document.createElement('button');
    btn.className = 'ls-btn';
    btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';

    var divider = header.querySelector('.article-divider');
    if (divider) header.insertBefore(btn, divider);
    else         header.appendChild(btn);

    btn.addEventListener('click', function () {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utt = null;
        btn.innerHTML = '<span class="ls-icon">🎧</span><span class="ls-label">Listen to essay</span>';
        btn.classList.remove('ls-active');
        return;
      }

      utt        = new SpeechSynthesisUtterance(body.innerText.trim());
      utt.rate   = 0.92;
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

  // Stop audio when leaving the page
  window.addEventListener('beforeunload', function () {
    window.speechSynthesis.cancel();
  });

  // Also stop when tab becomes hidden (switching tabs, minimising)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) window.speechSynthesis.cancel();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
