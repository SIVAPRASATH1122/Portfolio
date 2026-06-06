/* ============================================================
   PORTFOLIO — main.js
   Sivaprasath M | Full Stack Developer
   ============================================================ */

/* ── Custom Cursor ──────────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Expand cursor ring on interactive elements
document.querySelectorAll('a, button, .project-item, .skill-card, .cert-card, .contact-link').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width       = '52px';
    cursorRing.style.height      = '52px';
    cursorRing.style.borderColor = 'rgba(200,240,62,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width       = '36px';
    cursorRing.style.height      = '36px';
    cursorRing.style.borderColor = 'rgba(200,240,62,0.4)';
  });
});


/* ── Scroll: Progress Bar + Back-to-top ─────────────────────── */
const progressBar = document.getElementById('progress-bar');
const backTopBtn  = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  const pct      = (scrolled / total) * 100;

  progressBar.style.width = pct + '%';
  backTopBtn.classList.toggle('visible', scrolled > 400);
});


/* ── Reveal on Scroll ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.07 + 's';
  revealObserver.observe(el);
});


/* ── Animated Number Counter ────────────────────────────────── */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current  = 0;
      const step   = target / 40;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);

      countObserver.unobserve(el);
    }
  });
});

document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));


/* ── Active Nav Link on Scroll ──────────────────────────────── */
/* ── Active Nav Link on Scroll ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    if (href === '#' + currentSection) {
      link.style.color = 'var(--text)';
    } else {
      link.style.color = '';
    }
  });
});


/* ── Mobile Hamburger Menu ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');

    hamburger.textContent =
      navMenu.classList.contains('open')
        ? '✕'
        : '☰';
  });
}

/* ── Contact Form ───────────────────────────────────────────── */
const formBtn = document.getElementById('form-btn');

formBtn.addEventListener('click', submitForm);

function submitForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const company = document.getElementById('cf-company').value.trim();
  const type    = document.getElementById('cf-type').value;
  const message = document.getElementById('cf-message').value.trim();

  // Basic validation
  if (!name || !email) {
    setButtonState('⚠ Please fill required fields', '#ff6b35', false);
    setTimeout(() => setButtonState('Send Message →', '', false), 2500);
    return;
  }

  if (!isValidEmail(email)) {
    setButtonState('⚠ Please enter a valid email', '#ff6b35', false);
    setTimeout(() => setButtonState('Send Message →', '', false), 2500);
    return;
  }

  // Simulate sending
  setButtonState('Sending...', '', true);

  setTimeout(() => {
    setButtonState('✓ Message Sent!', 'var(--accent2)', false);

    // Open mailto as fallback
    const subject = encodeURIComponent(`Portfolio Contact${type ? ' — ' + type : ''} from ${name}`);
    const body    = encodeURIComponent(
      `Hi Sivaprasath,\n\n${message}\n\nFrom: ${name}${company ? ' @ ' + company : ''}\nEmail: ${email}`
    );
    window.location.href = `mailto:sivasindhu2244@gmail.com?subject=${subject}&body=${body}`;

    // Reset after delay
    setTimeout(() => {
      setButtonState('Send Message →', '', false);
      document.getElementById('cf-name').value    = '';
      document.getElementById('cf-email').value   = '';
      document.getElementById('cf-company').value = '';
      document.getElementById('cf-type').value    = '';
      document.getElementById('cf-message').value = '';
    }, 3500);
  }, 1200);
}

/**
 * Update the form submit button state.
 * @param {string} label    - Button text
 * @param {string} bg       - CSS background value (empty = default accent)
 * @param {boolean} disabled - Whether to disable the button
 */
function setButtonState(label, bg, disabled) {
  formBtn.textContent  = label;
  formBtn.style.background = bg || '';
  formBtn.disabled     = disabled;
}

/**
 * Simple email validation.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
