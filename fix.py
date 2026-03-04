import re

with open("style.css", "r") as f:
    css = f.read()

# Fix layout removing 100% and 100vh
css = css.replace("html, body {\n  \n", "html, body {\n  height: 100%;\n")
css = css.replace("  width: 100%;\n  \n  z-index: 100;", "  width: 100%;\n  height: 100%;\n  z-index: 100;")
css = css.replace(".layout-wrapper {\n  display: flex;\n  \n}", ".layout-wrapper {\n  display: flex;\n  min-height: 100vh;\n}")
css = css.replace("  width: 2px;\n  \n  background-color", "  width: 2px;\n  height: 100%;\n  background-color")
css = css.replace("  text-align: center;\n  \n}", "  text-align: center;\n  min-height: 100vh;\n}")
css = css.replace("  width: 100%;\n  \n  pointer-events:", "  width: 100%;\n  height: 100%;\n  pointer-events:")
css = css.replace("  width: 100%;\n  \n  border-radius:", "  width: 100%;\n  height: 100%;\n  border-radius:")
css = css.replace("  flex-direction: column;\n  \n  position: relative;", "  flex-direction: column;\n  height: 100%;\n  position: relative;")
css = css.replace("  width: 100%;\n  \n}", "  width: 100%;\n  height: 100%;\n}")
css = css.replace("  width: 100%;\n  \n  background: rgba", "  width: 100%;\n  height: 100%;\n  background: rgba")
css = css.replace("  .stack-cards-container {\n    \n    position: absolute;", "  .stack-cards-container {\n    height: 100%;\n    position: absolute;")
css = css.replace("    width: 55%;\n    \n    position: absolute;", "    width: 55%;\n    height: 100%;\n    position: absolute;")

with open("style.css", "w") as f:
    f.write(css)
