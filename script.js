const cursorLabel = document.querySelector(".cursor-label");
const workRows = document.querySelectorAll(".work-row");
const revealItems = document.querySelectorAll(".section-head, .work-row, .case-intro, .case-writing, .metrics, .archive article, .about-body, .contact-links, .project-nav");

if (cursorLabel && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorLabel.style.left = `${event.clientX}px`;
    cursorLabel.style.top = `${event.clientY}px`;
  });

  workRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      cursorLabel.textContent = row.dataset.cursor || "View";
      cursorLabel.classList.add("is-visible");
    });

    row.addEventListener("mouseleave", () => {
      cursorLabel.classList.remove("is-visible");
    });
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}
