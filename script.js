document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Responsive GSAP ScrollTrigger setup
  // Only pin on desktop (min-width: 768px)
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Pin the left column while scrolling the right column
    ScrollTrigger.create({
      trigger: ".projects-section",
      start: "top top",
      end: "bottom bottom",
      pin: ".projects-left",
      pinSpacing: false
    });

    // Animate active state of project info based on scrolling cards
    const cards = gsap.utils.toArray(".project-card");
    const infos = gsap.utils.toArray(".project-info");

    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top center", // when the top of the card hits the center of the viewport
        end: "bottom center", // when the bottom of the card hits the center of the viewport
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i)
      });
    });

    function setActive(index) {
      infos.forEach((info, i) => {
        if (i === index) {
          info.classList.add("active");
        } else {
          info.classList.remove("active");
        }
      });
    }

    // Set first item as active initially if nothing has scrolled yet
    if (infos.length > 0) {
      infos[0].classList.add("active");
    }

    return () => {
      // cleanup on teardown
    };
  });

  // For Mobile (No Pinning, but we can still highlight active projects if we want)
  mm.add("(max-width: 767px)", () => {
    // Optional: simple active state toggling for mobile if desired
    // For now, we'll let CSS handle the flow naturally without pinning.
    const cards = gsap.utils.toArray(".project-card");
    const infos = gsap.utils.toArray(".project-info");

    // Add active to all by default or let them just be visible
    infos.forEach(info => info.classList.add("active"));
  });
});
