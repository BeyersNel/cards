"""Print the full Kling prompt for one card: python3 -I tools/prompt.py clubs-A"""
import json, sys
d = json.load(open('art/prompts.json'))
key = sys.argv[1]
s = d['style']
print(' '.join([s['before'], d['palettes'][key.split('-')[0]], d['scenes'][key], s['after']]))
