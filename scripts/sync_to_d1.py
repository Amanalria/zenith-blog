import os, glob, json, subprocess

content_dir = "/root/edge-blog/src/content/blog"
sql_file = "/root/edge-blog/scripts/seed_posts.sql"

files = sorted(glob.glob(os.path.join(content_dir, "*.md")))
print(f"Found {len(files)} files to sync to D1.")

statements = ["DELETE FROM posts;"]

for f in files:
    with open(f, "r", encoding="utf-8") as fp:
        raw = fp.read()
    
    parts = raw.split("---", 2)
    fm_raw = parts[1]
    body = parts[2].strip()
    
    # Simple regex parsing of frontmatter
    import re
    title = re.search(r'title:\s*\"([^\"]+)\"', fm_raw)
    desc = re.search(r'description:\s*\"([^\"]+)\"', fm_raw)
    date = re.search(r'pubDate:\s*([0-9-]+)', fm_raw)
    cat = re.search(r'category:\s*\"([^\"]+)\"', fm_raw)
    author = re.search(r'author:\s*\"([^\"]+)\"', fm_raw)
    author_role = re.search(r'authorRole:\s*\"([^\"]+)\"', fm_raw)
    image = re.search(r'image:\s*\"([^\"]+)\"', fm_raw)
    image_alt = re.search(r'imageAlt:\s*\"([^\"]+)\"', fm_raw)
    read_time = re.search(r'readTime:\s*\"([^\"]+)\"', fm_raw)
    slug = re.search(r'customSlug:\s*\"([^\"]+)\"', fm_raw)
    tags_m = re.search(r'tags:\s*(\[.*?\])', fm_raw)
    
    title_str = title.group(1) if title else ""
    desc_str = desc.group(1) if desc else ""
    date_str = date.group(1) if date else "2026-09-27"
    cat_str = cat.group(1) if cat else "Entertainment"
    author_str = author.group(1) if author else "Aman Alria"
    role_str = author_role.group(1) if author_role else "Chief Editor & Film Journalist"
    image_str = image.group(1) if image else "/images/spiderman-brand-new-day-box-office-mcu-review.webp"
    alt_str = image_alt.group(1) if image_alt else title_str
    read_str = read_time.group(1) if read_time else "12 min read"
    slug_str = slug.group(1) if slug else os.path.basename(f).replace('.md', '')
    tags_str = tags_m.group(1) if tags_m else '["Movies"]'
    
    # Escape single quotes for SQL
    def esc(s):
        return s.replace("'", "''")
    
    sql = f"""INSERT INTO posts (slug, title, description, content, category, author, author_role, image, image_alt, tags, read_time, published_at, updated_at) VALUES ('{esc(slug_str)}', '{esc(title_str)}', '{esc(desc_str)}', '{esc(body)}', '{esc(cat_str)}', '{esc(author_str)}', '{esc(role_str)}', '{esc(image_str)}', '{esc(alt_str)}', '{esc(tags_str)}', '{esc(read_str)}', '{esc(date_str)}', '{esc(date_str)}');"""
    statements.append(sql)

with open(sql_file, "w", encoding="utf-8") as fp:
    fp.write("\n".join(statements))

print(f"Generated {len(statements)} SQL statements in {sql_file}.")
