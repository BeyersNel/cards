"""Trim a generated painting to its picture area and save it for the site.

usage: python3 -I tools/crop-art.py <in.png> <out.webp>

Strips any uniform paper margin and border line the generator added around
the picture, then saves a 1000px-wide WebP.
"""
import sys
from PIL import Image, ImageStat

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
grey = im.convert('L')
w, h = im.size


def flat(box):
    """A strip that is all one tone: paper margin or a ruled border line."""
    return ImageStat.Stat(grey.crop(box)).stddev[0] < 16


def trim(edge):
    limit = (w if edge in 'lr' else h) // 8
    n = 0
    while n < limit:
        if edge == 'l':
            box = (n, h // 6, n + 1, h * 5 // 6)
        elif edge == 'r':
            box = (w - n - 1, h // 6, w - n, h * 5 // 6)
        elif edge == 't':
            box = (w // 6, n, w * 5 // 6, n + 1)
        else:
            box = (w // 6, h - n - 1, w * 5 // 6, h - n)
        if not flat(box):
            break
        n += 1
    return n


l, r, t, b = (trim(e) for e in 'lrtb')
# step past any rounded corner / border line once a margin was found
pad = lambda n: n + (14 if n else 0)
box = (pad(l), pad(t), w - pad(r), h - pad(b))
art = im.crop(box)
art = art.resize((1000, round(1000 * art.height / art.width)), Image.LANCZOS)
art.save(dst, 'WEBP', quality=78, method=6)
print(f'{src}: trimmed l{l} r{r} t{t} b{b} -> {art.size}')
