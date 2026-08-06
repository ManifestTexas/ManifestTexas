#!/usr/bin/env python3
"""
build-assets.py — regenerates web-optimized images in assets/img/ from the
untouched source files in assets/originals/.

Run:  python3 tools/build-assets.py
Deps: pillow  (pip install pillow)

Originals are never modified. If you drop a new flyer into assets/originals/,
add it to FLYERS below and re-run.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "originals")
OUT = os.path.join(ROOT, "assets", "img")
os.makedirs(OUT, exist_ok=True)

FLYERS = [
    ("GETTER-4X5-2K.jpeg", "flyer-getter-austin"),
    ("BE39BCD3-2457-456A-90F9-F2B3E165DA01.jpeg", "flyer-token-dallas"),
    ("E55304EF-C857-4FAA-989E-0DB4A99415AD.jpeg", "flyer-token-austin"),
]
LOGO = "IMG_8322.jpeg"


def save_pair(im, base, width, q=82):
    w, h = im.size
    im2 = im.resize((width, round(h * width / w)), Image.LANCZOS)
    im2.save(os.path.join(OUT, base + ".webp"), "WEBP", quality=q, method=6)
    im2.convert("RGB").save(os.path.join(OUT, base + ".jpg"), "JPEG",
                            quality=q, optimize=True, progressive=True)
    return im2


# --- Flyers: full card image + small archive thumb -------------------------
for src, base in FLYERS:
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    save_pair(im, base, 1100)
    save_pair(im, base + "-thumb", 520, q=78)

# --- Logo: trim the black field, then key black out to alpha so the chrome
#     wordmark sits on any surface. A black-plate JPEG is kept for OG/social.
logo = Image.open(os.path.join(SRC, LOGO)).convert("RGB")
gray = logo.convert("L")
bbox = gray.point(lambda p: 255 if p > 14 else 0).getbbox()
logo_c = logo.crop(bbox)
pad = round(logo_c.size[0] * 0.03)
canvas = Image.new("RGB", (logo_c.size[0] + pad * 2, logo_c.size[1] + pad * 2), (0, 0, 0))
canvas.paste(logo_c, (pad, pad))

alpha = canvas.convert("L").point(lambda p: min(255, int(p * 2.6)))
rgba = canvas.convert("RGBA")
rgba.putalpha(alpha)
w, h = rgba.size
for width, name in ((1200, "logo-manifest-texas.png"), (400, "logo-manifest-texas-sm.png")):
    rgba.resize((width, round(h * width / w)), Image.LANCZOS).save(os.path.join(OUT, name), "PNG", optimize=True)

# Social / OG card: 1200x630 logo centered on black
og = Image.new("RGB", (1200, 630), (5, 6, 7))
mark = canvas.copy()
mw = 760
mark = mark.resize((mw, round(mark.size[1] * mw / mark.size[0])), Image.LANCZOS)
og.paste(mark, ((1200 - mark.size[0]) // 2, (630 - mark.size[1]) // 2))
og.save(os.path.join(OUT, "og-manifest-texas.jpg"), "JPEG", quality=88, optimize=True)

# Favicon source (square, black plate)
fav = Image.new("RGB", (512, 512), (5, 6, 7))
fm = canvas.copy()
fm = fm.resize((440, round(fm.size[1] * 440 / fm.size[0])), Image.LANCZOS)
fav.paste(fm, ((512 - fm.size[0]) // 2, (512 - fm.size[1]) // 2))
fav.save(os.path.join(OUT, "favicon-512.png"), "PNG", optimize=True)

print("wrote:", sorted(os.listdir(OUT)))
