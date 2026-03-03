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

  // Hexagon "Hive" Animation
  gsap.to(".hex-bg", {
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1 // smooth scrubbing
    },
    x: () => -window.innerWidth * 0.5,
    y: () => -window.innerHeight * 0.5,
    opacity: 0,
    stagger: 0.05,
    ease: "power2.inOut"
  });

  // Full Screen Snapping for Projects
  ScrollTrigger.create({
    trigger: ".projects-section",
    start: "top top",
    end: "bottom bottom",
    snap: {
      snapTo: 1 / (document.querySelectorAll(".project-container").length - 1),
      duration: {min: 0.2, max: 0.5},
      delay: 0.1,
      ease: "power1.inOut"
    }
  });

});
