document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.ticker.lagSmoothing(0);

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

  // Hexagon "Hive" Organic Animation
  const honeycomb = document.querySelector('.background-grid');
  const hexPaths = document.querySelectorAll('.hex-path');
  if (honeycomb && hexPaths.length > 0) {
    const hexTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    // Stagger organic movement for individual hexagons to float fully across the screen
    hexPaths.forEach((path, i) => {
      // Initial placement: ensure they cover the screen, not just the center
      gsap.set(path, {
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        scale: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
        transformOrigin: "center center"
      });

      // Target position: subtle floating
      let targetX = (Math.random() - 0.5) * window.innerWidth * 2;
      let targetY = (Math.random() - 0.5) * window.innerHeight * 2;
      let targetScale = 1.5 + Math.random() * 3;
      let targetOpacity = 0.3 + Math.random() * 0.4;

      hexTl.to(path, {
        x: targetX,
        y: targetY,
        scale: targetScale,
        opacity: targetOpacity,
        transformOrigin: "center center",
        ease: "power1.inOut"
      }, 0);
    });
  }

  // Fetch JSON and build Projects section
  fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) return;

      data.forEach((proj, i) => {
        // Create base container
        const container = document.createElement('div');
        container.className = 'project-container';
        container.style.zIndex = i + 1; // Natural stacking via sticky

        // Create glass card
        const glassCard = document.createElement('div');
        glassCard.className = 'project-card glass-card';

        // HTML for fixed elements
        // Circle circumference for r=49 is 2 * Math.PI * 49 = ~307.8
        let topBarHTML = `
          <div class="project-top-bar">
            <div class="project-counter">
              <div class="counter-circle">
                <svg class="counter-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"
                          stroke-dasharray="308" stroke-dashoffset="308" class="counter-stroke"></circle>
                </svg>
                <div class="counter-content" style="opacity: 0;">
                  <span class="counter-label">PROJECT</span>
                  <div class="text-container">
                    <span class="counter-numbers">${proj.id} &nbsp;|&nbsp; ${proj.total}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-container" style="text-align: right;">
               <div class="project-type" style="opacity: 0; transform: translateX(20px);">${proj.type}</div>
            </div>
          </div>
        `;

        // Wrap tech stack items in spans for staggered animation
        let techStackHTML = proj.stack.split(' • ').map(tech => `<span class="tech-item" style="opacity: 0;">${tech}</span>`).join(' <span class="tech-bullet" style="opacity: 0;">•</span> ');

        let mainContentHTML = `
          <div class="project-main-content">
            <div class="project-info-side">
              <h3 class="project-title" style="opacity: 0; transform: translateX(-50px);">${proj.title}</h3>
              <div class="tech-stack-container" style="position: relative;">
                <div class="tech-line tech-line-top" style="position: absolute; top: 0; left: 0; height: 1px; width: 0%; background: rgba(255, 255, 255, 0.1);"></div>
                <div class="tech-stack" style="border: none;">${techStackHTML}</div>
                <div class="tech-line tech-line-bottom" style="position: absolute; bottom: 0; left: 0; height: 1px; width: 0%; background: rgba(255, 255, 255, 0.1);"></div>
              </div>
              <p class="project-description" style="opacity: 0; transform: translateX(-30px);">${proj.description}</p>
              <a href="${proj.link}" class="visit-site-link" style="opacity: 0; transform: translateY(20px);">(&nbsp;&nbsp;&nbsp;VISIT SITE &#x2197;&nbsp;&nbsp;&nbsp;)</a>
            </div>
            <div class="project-preview-side" style="opacity: 0; transform: scale(0.95);">
               ${proj.image}
            </div>
          </div>
        `;

        glassCard.innerHTML = `<div class="project-card-inner">${topBarHTML}${mainContentHTML}</div>`;
        container.appendChild(glassCard);
        projectsSection.appendChild(container);
      });

      // Initialize Project Card Animations
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        // Find elements within this card
        const circleStroke = card.querySelector('.counter-stroke');
        const counterContent = card.querySelector('.counter-content');
        const projType = card.querySelector('.project-type');
        const title = card.querySelector('.project-title');
        const techLines = card.querySelectorAll('.tech-line');
        const techItems = card.querySelectorAll('.tech-item, .tech-bullet');
        const desc = card.querySelector('.project-description');
        const link = card.querySelector('.visit-site-link');
        const preview = card.querySelector('.project-preview-side');

        // Build Entrance Timeline
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" }
        });

        // Entrance Sequence
        tl.to(circleStroke, { strokeDashoffset: 0, duration: 1 })
          .to(counterContent, { opacity: 1, duration: 0.5 }, "-=0.5")
          .to(projType, { x: 0, opacity: 1, duration: 0.6 }, "-=0.4")
          .to(title, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .to(techLines, { width: "100%", duration: 0.6 }, "-=0.6")
          .to(techItems, { opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.4")
          .to(desc, { x: 0, opacity: 1, duration: 0.6 }, "-=0.6")
          .to(link, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
          .to(preview, { scale: 1, opacity: 1, duration: 0.8 }, "-=0.8");

        // Trigger on Scroll
        ScrollTrigger.create({
          trigger: card,
          start: "top 40%", // Start when top of card covers 60% of the previous card
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(), // Play again if scrolling back up
        });

        // Exit Sequence (when next card covers this one)
        // We find the next card container (the parent wrapper)
        const currentContainer = card.closest('.project-container');
        const nextContainer = currentContainer.nextElementSibling;

        if (nextContainer && nextContainer.classList.contains('project-container')) {
          ScrollTrigger.create({
            trigger: nextContainer,
            start: "top 75%", // Exit when next card covers 25% of current card
            onEnter: () => tl.reverse(), // Animate OUT
            onLeaveBack: () => tl.play() // Animate IN when next card scrolls back down
          });
        }
      });
    })
    .catch(error => console.error('Error loading projects:', error));

});
