document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hamburger Menu Logic
  const menuToggle = document.querySelector(".menu-toggle");
  const overlayMenu = document.querySelector(".overlay-menu");
  const overlayLinks = document.querySelectorAll(".overlay-links li a");

  let isMenuOpen = false;

  // Create a timeline for the menu animation
  // We use paused: true so we can trigger it on click
  const menuTl = gsap.timeline({ paused: true });

  // Set up animation based on screen size using matchMedia
  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop: Slide in from right
    menuTl.clear();
    menuTl.to(overlayMenu, { duration: 0.5, x: 0, ease: "power3.inOut" })
          .fromTo(overlayLinks, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" }, "-=0.2");
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile: Slide down from top
    menuTl.clear();
    menuTl.to(overlayMenu, { duration: 0.5, y: 0, ease: "power3.inOut" })
          .fromTo(overlayLinks, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" }, "-=0.2");
  });

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle("is-active");
    overlayMenu.classList.toggle("is-open");

    if (isMenuOpen) {
      menuTl.play();
    } else {
      menuTl.reverse();
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  // Close menu when a link is clicked
  overlayLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // Responsive GSAP ScrollTrigger setup
  // Only pin on desktop (min-width: 768px)

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

    // Hide all infos initially
    gsap.set(infos, { autoAlpha: 0, y: 20 });

    // Show the first one immediately if present
    if (infos[0]) {
      gsap.to(infos[0], { autoAlpha: 1, y: 0, duration: 0.5 });
      infos[0].classList.add("active");
    }

    let currentIndex = 0;

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
      if (index === currentIndex) return; // Prevent redundant animations

      const previousIndex = currentIndex;
      currentIndex = index;

      // Animate out previous
      if (infos[previousIndex]) {
        gsap.to(infos[previousIndex], { autoAlpha: 0, y: -20, duration: 0.4, onComplete: () => {
          infos[previousIndex].classList.remove("active");
        }});
      }

      // Animate in current
      if (infos[currentIndex]) {
        // Reset position before animating in (so it comes from below)
        gsap.set(infos[currentIndex], { y: 20 });
        gsap.to(infos[currentIndex], { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.2 });
        infos[currentIndex].classList.add("active");
      }
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
