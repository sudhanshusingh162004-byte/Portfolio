const cursor = document.querySelector(".custom-cursor");
const header = document.querySelector(".site-header");
const activePage = document.body.dataset.page;
const interactiveSelector = "a, button, [role='button'], .project-card";
const revealTargets = document.querySelectorAll(".section-head, .principles h1, .experience h2, .about h1, .contact h2");
const countTargets = document.querySelectorAll(".count-up");

const loader = document.querySelector(".page-loader");

if (loader) {
  const countValue = loader.querySelector(".loader-count-value");
  const duration = 4000;
  const cubicBezier = (x1, y1, x2, y2) => (progress) => {
    let start = 0;
    let end = 1;
    let t = progress;

    for (let i = 0; i < 8; i += 1) {
      t = (start + end) / 2;
      const inv = 1 - t;
      const x = 3 * inv * inv * t * x1 + 3 * inv * t * t * x2 + t * t * t;

      if (x < progress) {
        start = t;
      } else {
        end = t;
      }
    }

    const inv = 1 - t;
    return 3 * inv * inv * t * y1 + 3 * inv * t * t * y2 + t * t * t;
  };
  const loaderEase = cubicBezier(0.25, 0.1, 0.1, 1);
  let loaderStart;

  const animateLoader = (timestamp) => {
    if (!loaderStart) {
      loaderStart = timestamp;
    }

    const rawProgress = Math.min((timestamp - loaderStart) / duration, 1);
    const easedProgress = Math.min(loaderEase(rawProgress), 1);
    const percent = Math.round(easedProgress * 100);

    if (countValue) {
      countValue.textContent = percent;
    }

    loader.style.setProperty("--loader-progress", easedProgress);

    if (rawProgress < 1) {
      requestAnimationFrame(animateLoader);
    }
  };

  requestAnimationFrame(animateLoader);

  window.setTimeout(() => {
    document.body.classList.add("has-loaded-before");
  }, 5300);
}

document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === activePage) {
    link.classList.add("is-active");
  }
});

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.28;
    cursorY += (mouseY - cursorY) * 0.28;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderCursor);
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.classList.add("is-visible");
  });

  document.addEventListener("mouseover", (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.remove("is-hovering");
    }
  });

  requestAnimationFrame(renderCursor);
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.35);
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;

  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("is-transitioning");
    window.setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal-target"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
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
    },
    { threshold: 0.6 }
  );

  countTargets.forEach((target) => countObserver.observe(target));
}
