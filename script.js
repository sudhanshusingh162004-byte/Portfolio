const cursor = document.querySelector(".custom-cursor");
const header = document.querySelector(".site-header");
const activePage = document.body.dataset.page;
const countTargets = document.querySelectorAll(".count-up");
const loader = document.querySelector(".page-loader");



document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = document.querySelector('.page-loader');
  const loaderCount = document.querySelector('.loader-count');
  
  // Ambient Glow Tracker
  const ambientGlow = document.querySelector('.ambient-glow');
  if (ambientGlow) {
    document.addEventListener('mousemove', (e) => {
      if (typeof gsap !== 'undefined') {
        gsap.to(ambientGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.5,
          ease: 'power3.out'
        });
      }
    });
  }
});


// Loader Logic
if (loader) {
  const countValue = loader.querySelector(".loader-count-value");
  const lineFill = loader.querySelector(".loader-line-fill");
  const nameEl = loader.querySelector(".loader-name");
  const duration = 1800;
  
  let loaderStart;
  if (countValue) countValue.textContent = "0";

  // Glitch the name in — finishes when loader hits ~75%
  if (nameEl) {
    const nameText = 'Sudhanshu Singh';
    const GCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
    const GCOL = '#7aab68';
    const targetDuration = duration * 0.45; // finish at 45% mark

    const nonSpaceIndices = [];
    for (let i = 0; i < nameText.length; i++) {
      if (nameText[i] !== ' ') nonSpaceIndices.push(i);
    }
    const nameTickDelay = Math.round(targetDuration / nonSpaceIndices.length);

    const resolvedName = new Set();
    // store current random chars so they don't flicker every tick
    const currentChars = {};
    nonSpaceIndices.forEach(i => {
      currentChars[i] = GCHARS[Math.floor(Math.random() * GCHARS.length)];
    });

    function renderName() {
      // resolve one random unresolved char
      const unres = nonSpaceIndices.filter(i => !resolvedName.has(i));
      if (unres.length > 0) {
        resolvedName.add(unres[Math.floor(Math.random() * unres.length)]);
      }

      // only re-randomise ~40% of remaining unresolved chars per tick (less flicker)
      unres.forEach(i => {
        if (Math.random() < 0.4) {
          currentChars[i] = GCHARS[Math.floor(Math.random() * GCHARS.length)];
        }
      });

      let html = '';
      for (let i = 0; i < nameText.length; i++) {
        if (nameText[i] === ' ') { html += ' '; continue; }
        if (resolvedName.has(i)) {
          html += `<span style="color:rgba(255,255,255,0.9)">${nameText[i]}</span>`;
        } else {
          html += `<span style="color:${GCOL}">${currentChars[i]}</span>`;
        }
      }
      nameEl.innerHTML = html;

      if (resolvedName.size < nonSpaceIndices.length) {
        setTimeout(() => requestAnimationFrame(renderName), nameTickDelay);
      }
    }
    requestAnimationFrame(renderName);
  }

  const animateLoader = (timestamp) => {
    if (!loaderStart) loaderStart = timestamp;
    const rawProgress = Math.min((timestamp - loaderStart) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
    const percent = Math.round(easedProgress * 100);
    if (countValue) countValue.textContent = percent;
    if (lineFill) lineFill.style.transform = `scaleX(${easedProgress})`;
    
    if (rawProgress < 1) {
      requestAnimationFrame(animateLoader);
    } else {
      // Slide loader up to reveal page
      loader.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.classList.add("has-loaded-before");
        const shell = document.querySelector('.page-shell');
        if (shell) {
          shell.style.transition = 'opacity 0.5s ease';
          shell.style.opacity = '1';
        }
        initHeroAnimations();
      }, 520);
    }
  };
  window.setTimeout(() => requestAnimationFrame(animateLoader), 100);
} else {
  window.setTimeout(initHeroAnimations, 100);
}

// Active Nav Logic
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === activePage) link.classList.add("is-active");
});

// GSAP Init
if (typeof gsap !== 'undefined') {
  gsap.config({ nullTargetWarn: false });
}

function initHeroAnimations() {
  if (typeof gsap !== 'undefined') {
    // Section head (inner page hero) - fade up stagger
    const sectionHead = document.querySelector('.section-head');
    const firstCard = document.querySelector('.project-card');
    if (sectionHead) {
      const label = sectionHead.querySelector('.section-label');
      const heading = sectionHead.querySelector('h1');
      const tl = gsap.timeline({ delay: 0.1 });
      if (label) tl.from(label, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' });
      if (heading) tl.from(heading, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4');
      if (firstCard) {
        firstCard.classList.remove('fade-in');
        const media = firstCard.querySelector('.project-media');
        const copy = firstCard.querySelector('.project-copy');
        const tags = firstCard.querySelector('.project-tags');
        if (media) tl.from(media, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5');
        if (copy) tl.from(copy, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
        if (tags) tl.from(tags, { y: 15, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      }
    }
  }

  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
    const splitElements = document.querySelectorAll('.split-text');
    splitElements.forEach(el => {
      const text = new SplitType(el, { types: 'lines, words' });
      // Animate words up from invisible floor
      text.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('line-wrapper');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        wrapper.style.paddingTop = '0.1em';
        wrapper.style.marginTop = '-0.1em';
        wrapper.style.paddingBottom = '0.45em';
        wrapper.style.marginBottom = '-0.45em';
        wrapper.style.paddingRight = '0.15em';
        wrapper.style.marginRight = '-0.15em';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
      
      // Animate words up from invisible floor
      gsap.from(text.words, {
        y: '160%',
        opacity: 0,
        duration: 1.1,
        stagger: 0.035,
        ease: 'power4.out',
        delay: 0.08
      });
    });
  }
  
  // Begin observing scroll elements only after hero animations have started
  if (typeof initScrollAnimations === 'function') {
    setTimeout(initScrollAnimations, 400);
  }
}

// Cursor and Interactions
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = -100; let mouseY = -100;
  let cursorX = -100; let cursorY = -100;

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.28;
    cursorY += (mouseY - cursorY) * 0.28;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderCursor);
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX; mouseY = event.clientY;
    cursor.classList.add("is-visible");
  });
  requestAnimationFrame(renderCursor);

  // General hovering
  const interactiveSelector = "a, button, [role='button']";
  document.addEventListener("mouseover", (event) => {
    if (event.target.closest(interactiveSelector) && !event.target.closest('.media-placeholder')) {
      cursor.classList.add("is-hovering");
    }
  });
  document.addEventListener("mouseout", (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.remove("is-hovering");
    }
  });

  // Project Card Hover (Morphing)
  const projectCards = document.querySelectorAll('.media-placeholder');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('is-viewing');
      cursor.classList.remove('is-hovering');
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-viewing');
    });
  });

  // Magnetic Elements removed as requested

  // Removed Image Reveal logic as requested

}

// Header State
const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.35);
};
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

// Page Transitions
document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("is-transitioning");
    window.setTimeout(() => window.location.href = href, 300);
  });
});

// Footer glitch — random resolve, 0.3–0.5s total
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
const GLITCH_COLOR = '#7aab68';

document.querySelectorAll('.footer-col a').forEach(link => {
  const original = link.innerText;
  let frame = null;
  let active = false;

  // Build index map: only non-space characters are tracked
  const charIndices = [];
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== ' ') charIndices.push(i);
  }
  const tickDelay = Math.round(620 / (charIndices.length || 1));

  function tick() {
    if (!active) return; // bail if mouse has left

    // resolved tracks positions within charIndices only
    const unresolved = resolvedSet
      ? charIndices.filter(i => !resolvedSet.has(i))
      : [];

    if (unresolved.length > 0) {
      const pick = unresolved[Math.floor(Math.random() * unresolved.length)];
      resolvedSet.add(pick);
    }

    let html = '';
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ') { html += ' '; continue; }
      if (resolvedSet.has(i)) {
        html += `<span style="color:rgba(255,255,255,0.9)">${original[i]}</span>`;
      } else {
        const r = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        html += `<span style="color:${GLITCH_COLOR}">${r}</span>`;
      }
    }
    link.innerHTML = html;

    if (resolvedSet.size < charIndices.length) {
      frame = setTimeout(() => requestAnimationFrame(tick), tickDelay);
    }
  }

  let resolvedSet = new Set();

  link.addEventListener('mouseenter', () => {
    clearTimeout(frame);
    active = true;
    resolvedSet = new Set();
    requestAnimationFrame(tick);
  });

  link.addEventListener('mouseleave', () => {
    active = false;
    clearTimeout(frame);
    link.innerHTML = original;
    resolvedSet = new Set();
  });
});

// Fade-in on Scroll Observer (CSS class toggle)
const FADE_SELECTOR = '.project-card, .footer-col, .sui-footer-top, .section-head, .principle-grid article, .experience-list article, .about-body, .case-intro, .case-writing article, .archive article';

// Add .fade-in immediately so elements are hidden from the start
document.querySelectorAll(FADE_SELECTOR).forEach(el => el.classList.add('fade-in'));

function initScrollAnimations() {
  if ('IntersectionObserver' in window) {
    const fadeTargets = document.querySelectorAll(FADE_SELECTOR);

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -150px 0px' });

    fadeTargets.forEach((el, i) => {
      // Skip first project card — it's handled by the hero timeline
      if (i === 0 && el.classList.contains('project-card')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        fadeObserver.observe(el);
      }
    });
  }
}

// Original Reveal Targets (IntersectionObserver)
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".section-head, .principles h1, .experience h2, .about h1, .contact h2");
  revealTargets.forEach((target) => target.classList.add("reveal-target"));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

// Count Up Observer
if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const end = Number(target.dataset.count || 0);
      const startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / 400, 1);
        const value = Math.round(progress * end);
        target.textContent = String(value).padStart(2, "0");
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(target);
    });
  }, { threshold: 0.6 });
  countTargets.forEach((target) => countObserver.observe(target));
}
