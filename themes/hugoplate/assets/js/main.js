// main script

document.addEventListener("DOMContentLoaded", function () {
  const startTyping = (title) => {
    const text = title.textContent.trim();
    if (!text) return;

    title.setAttribute("aria-label", text);
    title.classList.add("typing-active");
    title.textContent = "";

    let characterIndex = 0;
    const typeNextCharacter = () => {
      title.textContent += text[characterIndex];
      characterIndex += 1;

      if (characterIndex < text.length) {
        window.setTimeout(typeNextCharacter, 35);
      } else {
        window.setTimeout(() => {
          title.classList.remove("typing-active");
        }, 750);
      }
    };

    typeNextCharacter();
  };

  const startCounter = (counter) => {
    const match = counter.textContent.match(/^(\s*)([\d,]+)([\s\S]*)$/);
    if (!match) return;

    const target = Number(match[2].replace(/,/g, ""));
    if (!Number.isFinite(target) || target < 1) return;

    const prefix = match[1];
    const suffix = match[3];
    const start = 1;
    const duration = 1000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      counter.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) requestAnimationFrame(updateCounter);
    };

    counter.textContent = `${prefix}${start}${suffix}`;
    requestAnimationFrame(updateCounter);
  };

  const animatedItems = document.querySelectorAll(
    "[data-typing-effect], [data-stat-counter]"
  );
  if (animatedItems.length) {
    const startAnimation = (item) => {
      if (item.dataset.animationStarted) return;
      item.dataset.animationStarted = "true";

      if (item.matches("[data-typing-effect]")) {
        startTyping(item);
      } else {
        startCounter(item);
      }
    };

    if ("IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      animatedItems.forEach((item) => animationObserver.observe(item));
    } else {
      animatedItems.forEach(startAnimation);
    }
  }

  document.querySelectorAll("[data-scroll-bottom]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector("#bottom");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  });

  const homeRevealItems = document.querySelectorAll(
    ".home-image, .home-text, [data-slide-left], [data-slide-right]"
  );

  if (homeRevealItems.length) {
    const revealItem = (item) => {
      if (item.classList.contains("visible")) return;
      const section = item.closest("section");
      if (section) {
        const sectionItems = Array.from(
          section.querySelectorAll(
            ".home-image, .home-text, [data-slide-left], [data-slide-right]"
          )
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

  const parallaxItems = document.querySelectorAll("[data-parallax]");
  if (parallaxItems.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let parallaxFrame;

    const updateParallax = () => {
      parallaxFrame = undefined;
      const viewportCenter = window.innerHeight / 2;

      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const speed = Number.parseFloat(item.dataset.parallaxSpeed) || 0.1;
        const direction = item.dataset.parallaxDirection === "down" ? 1 : -1;
        const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
        const offset = distanceFromCenter * speed * direction;
        item.style.setProperty("--parallax-offset", `${offset}px`);
      });
    };

    const requestParallaxUpdate = () => {
      if (parallaxFrame === undefined) {
        parallaxFrame = window.requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
    requestParallaxUpdate();
  }
});