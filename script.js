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
  const honeycomb = document.querySelector('.background-grid');
  if (honeycomb) {
    // Pin to top left
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      pin: honeycomb,
      pinSpacing: false
    });

    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      animation: gsap.to(honeycomb, {
        scale: 0.3,
        x: () => -window.innerWidth/2 + 100,
        y: () => -window.innerHeight/2 + 100,
        ease: "none"
      })
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
        glassCard.className = 'project-card-glass';

        // HTML for fixed elements
        let topBarHTML = `
          <div class="project-top-bar">
            <div class="project-counter">
              <div class="counter-circle">
                <span class="counter-label">PROJECT</span>
                <div class="text-container">
                  <span class="counter-numbers">${proj.id} &nbsp;|&nbsp; ${proj.total}</span>
                </div>
              </div>
            </div>
            <div class="text-container" style="text-align: right;">
               <div class="project-type">${proj.type}</div>
            </div>
          </div>
        `;

        let mainContentHTML = `
          <div class="project-main-content">
            <div class="project-info-side">
              <h3 class="project-title">${proj.title}</h3>
              <div class="tech-stack">${proj.stack}</div>
              <p class="project-description">${proj.description}</p>
              <a href="${proj.link}" class="visit-site-link">(&nbsp;&nbsp;&nbsp;VISIT SITE &#x2197;&nbsp;&nbsp;&nbsp;)</a>
            </div>
            <div class="project-preview-side">
               ${proj.image}
            </div>
          </div>
        `;

        glassCard.innerHTML = topBarHTML + mainContentHTML;
        container.appendChild(glassCard);
        projectsSection.appendChild(container);
      });
    })
    .catch(error => console.error('Error loading projects:', error));

});
