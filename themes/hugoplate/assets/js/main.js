// main script

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-scroll-bottom]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  });

  const homeRevealItems = document.querySelectorAll(".home-image, .home-text");
  if (homeRevealItems.length) {
    const revealItem = (item) => {
      if (item.classList.contains("visible")) return;
      const section = item.closest("section");
      if (section) {
        const sectionItems = Array.from(
          section.querySelectorAll(".home-image, .home-text")
        );
        const order = sectionItems.indexOf(item);
        item.style.setProperty("--home-delay", `${order * 60}ms`);
      }
      item.classList.add("visible");
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealItem(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px -16% 0px" }
      );
      homeRevealItems.forEach((item) => observer.observe(item));
    } else {
      homeRevealItems.forEach(revealItem);
    }
  }

});