import re

with open("script.js", "r") as f:
    js = f.read()

# Fix logo animation - "pinned to top-left corner"
search = """  if (honeycomb) {
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      animation: gsap.to(honeycomb, {
        scale: 0.3,
        xPercent: -40,
        yPercent: -40,
        ease: "none"
      })
    });
  }"""

replace = """  if (honeycomb) {
    // Animate to top left and keep fixed
    gsap.to(honeycomb, {
      scale: 0.2,
      x: () => -(window.innerWidth / 2) + 150,
      y: () => -(window.innerHeight / 2) + 150,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }"""

if search in js:
    js = js.replace(search, replace)
else:
    print("Search not found")

with open("script.js", "w") as f:
    f.write(js)
