import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove shadow from the circular image. It's likely shadow-xl, shadow-2xl, shadow-lg, drop-shadow-xl
content = re.sub(r'shadow-(sm|md|lg|xl|2xl|inner|none|\[[^\]]+\])', '', content)
content = re.sub(r'drop-shadow-(sm|md|lg|xl|2xl|none|\[[^\]]+\])', '', content)

# Check where the image is
img_pattern = r'<img[^>]+src="[^"]*"[^>]*>'
matches = re.findall(img_pattern, content)
for m in matches:
    print("Found img:", m)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed shadows in about.ejs")
