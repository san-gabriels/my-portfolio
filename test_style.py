import re

with open("style.css", "r") as f:
    css = f.read()

# Make sure position doesn't conflict with visibility if there's a problem
print("Checking active class:")
# It has position relative and opacity 1. Wait, color might be the issue?

# Let's check text colors
