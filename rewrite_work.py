import re

html_file = 'work/index.html'
with open(html_file, 'r') as f:
    content = f.read()

# Pattern to find each project card. Note: the missing </div> for project-copy
pattern = r'<a class="project-card" href="([^"]+)">\s*<div class="project-media">\s*<div class="media-placeholder"><span>([^<]+)</span></div>\s*</div>\s*<div class="project-copy">\s*<div class="project-row-top">\s*<span class="project-index">([^<]+)</span>\s*<h2>([^<]+)</h2>\s*<span>([^<]+)</span>\s*</div>\s*<div class="project-row-bottom">\s*<p>([^<]+)</p>\s*<span class="project-arrow">→</span>\s*</div>\s*<div class="project-tags" aria-label="Project tags">\s*(.*?)\s*</div>\s*</a>'

def replacer(match):
    href = match.group(1)
    placeholder_text = match.group(2)
    index = match.group(3)
    title = match.group(4)
    year = match.group(5)
    desc = match.group(6)
    tags_html = match.group(7).strip()
    
    title_lower = title.lower()
    
    new_html = f'''<a class="project-card" href="{href}">
            <div class="project-media">
              <div class="media-placeholder"></div>
            </div>
            <div class="project-copy">
              <div class="project-content-left">
                <h2>{title_lower}</h2>
                <p>{desc}</p>
                <div class="project-tags" aria-label="Project tags">
                  {tags_html}
                </div>
              </div>
              <div class="project-content-right">
                <span class="project-index">{index}</span>
                <span class="project-year">{year}</span>
              </div>
            </div>
          </a>'''
    return new_html

new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(html_file, 'w') as f:
    f.write(new_content)

print(f"Replaced cards in {html_file}")
