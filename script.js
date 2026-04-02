// ─────────────────────────────────────────────
//  SQL Visual Guide — interactive behaviours
// ─────────────────────────────────────────────

// 1. Reading progress bar
(function () {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();


// 2. Highlight the active section in the page title as you scroll
(function () {
  const sections = document.querySelectorAll('.section[data-part]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const part  = entry.target.dataset.part;
          const title = entry.target.querySelector('.sec-title');
          document.title = title
            ? `Part ${part} — ${title.textContent} | SQL Guide`
            : 'SQL Visual Guide';
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();


// 3. Copy-to-clipboard on SQL blocks
(function () {
  document.querySelectorAll('.sql-block, .pattern-block').forEach((block) => {
    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.className   = 'copy-btn';

    Object.assign(btn.style, {
      position:   'absolute',
      top:        '8px',
      right:      '8px',
      fontSize:   '10px',
      fontFamily: 'var(--font-mono)',
      fontWeight: '600',
      padding:    '3px 8px',
      borderRadius: '4px',
      border:     '1px solid var(--border)',
      background: 'var(--bg)',
      color:      'var(--text-faint)',
      cursor:     'pointer',
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      lineHeight: '1',
      opacity:    '0',
      transition: 'opacity 0.15s',
    });

    // make the parent relatively positioned so the button anchors correctly
    const wrapper = block;
    wrapper.style.position = 'relative';

    wrapper.addEventListener('mouseenter', () => { btn.style.opacity = '1'; });
    wrapper.addEventListener('mouseleave', () => { btn.style.opacity = '0'; });

    btn.addEventListener('click', () => {
      const text = wrapper.innerText.replace(/^copy$/m, '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ copied';
        btn.style.color = 'var(--green)';
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.style.color = 'var(--text-faint)';
        }, 1500);
      });
    });

    wrapper.appendChild(btn);
  });
})();


// 4. Smooth scroll anchor links (if any are added later)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
