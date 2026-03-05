document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hexagon Background Animation
  gsap.to("#hex-bg svg", {
    y: 100,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  // Fetch Projects Data
  fetch('data/projects.json')
    .then(response => response.json())
    .then(projects => {
      const projectsContainer = document.getElementById('projects');

      projects.forEach((project, index) => {
        // Create Card Element
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.zIndex = index + 1;

        // Skills List HTML
        const skillsHtml = project.skills.map(skill => `<li>${skill}</li>`).join('');

        // Card Content
        card.innerHTML = `
          <div class="project-card-inner">
            <div class="card-text">
              <div class="card-total">${project.id} / ${project.total}</div>
              <div class="card-type">${project.type}</div>
              <h2 class="card-title">${project.title}</h2>
              <p class="card-description">${project.description}</p>
              <ul class="card-skills">
                ${skillsHtml}
              </ul>
              <a href="${project.link}" class="card-link">View Project</a>
            </div>
            <div class="card-preview">
              ${project.image_placeholder ? '<span class="preview-placeholder">Image Placeholder</span>' : ''}
            </div>
          </div>
        `;

        projectsContainer.appendChild(card);
      });

      // Animate Card Contents after rendering
      const projectCards = document.querySelectorAll('.project-card');

      projectCards.forEach((card) => {
        const textElements = card.querySelectorAll('.card-title, .card-description, .card-skills, .card-link');

        gsap.fromTo(textElements,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top center", // trigger when top of card hits center of viewport
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
    });

  // Hamburger Menu Logic (Basic)
  const navToggle = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', () => {
      if (navOverlay.style.display === 'flex') {
        navOverlay.style.display = 'none';
      } else {
        navOverlay.style.display = 'flex';
      }
    });
  }
});
