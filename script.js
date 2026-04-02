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
//    + Track lesson visits in localStorage for progress
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

          // Track lesson visit
          try {
            const saved = localStorage.getItem('sql_playground_progress');
            const progress = saved ? JSON.parse(saved) : { version: 1, lessonVisits: {}, assignments: {}, queryHistory: [], settings: {} };
            if (!progress.lessonVisits[part]) {
              progress.lessonVisits[part] = true;
              localStorage.setItem('sql_playground_progress', JSON.stringify(progress));
              updateLessonProgressRing();
            }
          } catch (e) {}
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();


// 2b. Progress ring display on lesson page
(function () {
  updateLessonProgressRing();
})();

function updateLessonProgressRing() {
  try {
    const saved = localStorage.getItem('sql_playground_progress');
    if (!saved) return;
    const progress = JSON.parse(saved);

    // Count completed assignments + visited lessons
    const totalParts = 7;
    let totalScore = 0;

    // Assignment counts per part
    const partAssignmentCounts = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2 };

    for (let p = 1; p <= totalParts; p++) {
      let partScore = 0;
      if (progress.lessonVisits && progress.lessonVisits[p]) partScore += 50;

      const count = partAssignmentCounts[p] || 3;
      let completed = 0;
      for (let a = 1; a <= count; a++) {
        const id = p + '-' + a;
        if (progress.assignments && progress.assignments[id] && progress.assignments[id].completed) {
          completed++;
        }
      }
      partScore += (completed / count) * 50;
      totalScore += partScore;
    }

    const pct = Math.round(totalScore / totalParts);
    const circumference = 2 * Math.PI * 15.5;
    const offset = circumference - (pct / 100) * circumference;

    document.querySelectorAll('.progress-ring-fill').forEach((el) => {
      el.style.strokeDashoffset = offset;
    });
    document.querySelectorAll('.progress-label').forEach((el) => {
      el.textContent = pct + '%';
    });
  } catch (e) {}
}


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


// 4. Interactive challenges — pick-an-answer with immediate feedback
(function () {
  document.querySelectorAll('.challenge').forEach((challenge) => {
    const correctAnswer = challenge.dataset.answer;
    const options = challenge.querySelectorAll('.challenge-opt');
    const feedbacks = challenge.querySelectorAll('.challenge-feedback');

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        // Prevent re-answering
        if (challenge.classList.contains('answered')) return;
        challenge.classList.add('answered');

        const choice = opt.dataset.choice;
        const isCorrect = choice === correctAnswer;

        // Mark the clicked option
        opt.classList.add(isCorrect ? 'correct' : 'wrong');

        // If wrong, also highlight the correct one
        if (!isCorrect) {
          options.forEach((o) => {
            if (o.dataset.choice === correctAnswer) o.classList.add('correct');
          });
        }

        // Disable all options
        options.forEach((o) => { o.disabled = true; });

        // Show the appropriate feedback
        feedbacks.forEach((fb) => {
          if (fb.dataset.for === choice) {
            fb.classList.add('visible');
          }
        });
      });
    });
  });
})();


// 5. Smooth scroll anchor links (if any are added later)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
