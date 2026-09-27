import os, sys

content_dir = "/root/edge-blog/src/content/blog"

# Clear old long-named files first
for f in os.listdir(content_dir):
    if f.endswith('.md'):
        os.remove(os.path.join(content_dir, f))

print("Cleared old markdown files.")
