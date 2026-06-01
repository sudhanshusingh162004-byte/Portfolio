const cursorLabel = document.querySelector(".cursor-label");
const hoverTargets = document.querySelectorAll("[data-cursor]");
const revealTargets = document.querySelectorAll(".section-head, .story-band h2, .featured-project h2, .principles h2, .experience h2, .about h2, .contact h2");

if (cursorLabel && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorLabel.style.left = `${event.clientX}px`;
    cursorLabel.style.top = `${event.clientY}px`;
  });

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorLabel.textContent = target.dataset.cursor || "View";
      cursorLabel.classList.add("is-visible");
    });

    target.addEventListener("mouseleave", () => {
      cursorLabel.classList.remove("is-visible");
    });
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal-target"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}
