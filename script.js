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

      // Create base container
      const container = document.createElement('div');
      container.className = 'project-container';

      // Create glass card
      const glassCard = document.createElement('div');
      glassCard.className = 'project-card-glass';

      // HTML for fixed elements
      let topBarHTML = `
        <div class="project-top-bar">
          <div class="project-counter">
            <div class="counter-circle">
              <span class="counter-label">PROJECT</span>
              <div class="text-container" style="height: 1.2rem; width: 60px; overflow: hidden; position: relative;">
                ${data.map((proj, i) => `<span class="fixed-text counter-numbers ${i===0?'active':''}" data-index="${i}">${proj.id} &nbsp;|&nbsp; ${proj.total}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="text-container" style="height: 1rem; width: 200px; text-align: right;">
             ${data.map((proj, i) => `<div class="fixed-text project-type ${i===0?'active':''}" data-index="${i}">${proj.type}</div>`).join('')}
          </div>
        </div>
      `;

      let mainContentHTML = `
        <div class="project-main-content">
          <div class="project-info-side">
            <div class="text-container" style="height: 8rem;">
              ${data.map((proj, i) => `<h3 class="fixed-title project-title ${i===0?'active':''}" data-index="${i}">${proj.title}</h3>`).join('')}
            </div>
            <div class="text-container" style="height: 3.5rem;">
              ${data.map((proj, i) => `<div class="fixed-stack tech-stack ${i===0?'active':''}" data-index="${i}">${proj.stack}</div>`).join('')}
            </div>
            <div class="text-container" style="height: 4rem;">
              ${data.map((proj, i) => `<p class="fixed-desc project-description ${i===0?'active':''}" data-index="${i}">${proj.description}</p>`).join('')}
            </div>
            <div class="text-container" style="height: 2rem;">
              ${data.map((proj, i) => `<a href="${proj.link}" class="fixed-link visit-site-link ${i===0?'active':''}" data-index="${i}">(&nbsp;&nbsp;&nbsp;VISIT SITE &#x2197;&nbsp;&nbsp;&nbsp;)</a>`).join('')}
            </div>
          </div>

          <div class="stack-cards-container">
            ${data.map((proj, i) => `<div class="stack-card" style="z-index: ${data.length - i}">${proj.image}</div>`).join('')}
          </div>
        </div>
      `;

      glassCard.innerHTML = topBarHTML + mainContentHTML;
      container.appendChild(glassCard);
      projectsSection.appendChild(container);

      // Initialize Stacking Cards GSAP ScrollTrigger
      initStackingCards(data.length);
    })
    .catch(error => console.error('Error loading projects:', error));

  function initStackingCards(numProjects) {
    const cards = gsap.utils.toArray('.stack-card');
    if (cards.length < 2) return; // Need at least 2 cards to stack

    // Pin the projects section
    // Make the section height proportional to the number of projects to scroll through
    gsap.set('.projects-section', { height: `${numProjects * 100}vh` });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".projects-section",
        start: "top top",
        end: `+=${(numProjects - 1) * 100}%`,
        pin: ".project-container",
        scrub: 1,
        onUpdate: self => {
          // Determine which project should be active based on scroll progress
          const progress = self.progress;
          // Calculate active index (0 to numProjects - 1)
          let activeIndex = Math.min(
            numProjects - 1,
            Math.floor(progress * numProjects)
          );

          // Edge case for scrubbing right at the end
          if (progress === 1) activeIndex = numProjects - 1;

          updateFixedContent(activeIndex);
        }
      }
    });

    // Animate cards sliding up
    cards.forEach((card, i) => {
      if (i === 0) return; // First card is already visible

      tl.to(card, {
        top: "0%",
        ease: "none"
      }, (i - 1)); // Stagger the animations
    });
  }

  let currentIndex = 0;
  function updateFixedContent(newIndex) {
    if (newIndex === currentIndex) return;

    // Toggle active class on all text groups
    const groups = ['.counter-numbers', '.project-type', '.project-title', '.tech-stack', '.project-description', '.visit-site-link'];

    groups.forEach(groupSelector => {
      const elements = document.querySelectorAll(groupSelector);
      elements.forEach(el => {
        if (parseInt(el.getAttribute('data-index')) === newIndex) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    });

    currentIndex = newIndex;
  }

});
