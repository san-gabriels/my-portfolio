import time
from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Test desktop layout
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto("http://localhost:3000")

        # Wait for JS to render cards
        page.wait_for_selector(".project-card")

        # Take screenshot of the hero section
        time.sleep(1)

        # We need to simulate the scroll event precisely to trigger the JS animations
        # Lets try mouse wheel again to make sure gsap picks it up
        for _ in range(30):
            page.mouse.wheel(0, 100)
            time.sleep(0.1)

        page.screenshot(path="screenshot_projects_desktop.png")

        browser.close()

if __name__ == "__main__":
    verify_layout()
