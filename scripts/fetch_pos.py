import json
import urllib.request
import urllib.parse
import os
import time
from concurrent.futures import ThreadPoolExecutor

CACHE_FILE = 'scripts/datamuse_cache.json'
os.makedirs('scripts', exist_ok=True)

cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
    except Exception:
        cache = {}

with open('src/data/quizletVocabDays.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

unique_words = set()
for day_k, day_v in data.items():
    for word_obj in day_v['words']:
        w = word_obj['word'].strip().lower()
        if w not in cache:
            unique_words.add(w)

to_fetch = list(unique_words)
print(f"Already cached: {len(cache)}, to fetch: {len(to_fetch)}")

def fetch(w):
    # Handle multi-word
    search_w = w
    url = f"https://api.datamuse.com/words?sp={urllib.parse.quote(search_w)}&md=p&max=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            tags = res[0].get('tags', []) if res else []
            pos = [t for t in tags if t in ['n', 'v', 'adj', 'adv', 'u', 'prop']]
            return w, pos
    except Exception:
        return w, []

if to_fetch:
    with ThreadPoolExecutor(max_workers=20) as executor:
        for idx, (w, pos) in enumerate(executor.map(fetch, to_fetch)):
            cache[w] = pos
            if idx % 100 == 0:
                print(f"Fetched {idx}/{len(to_fetch)}")

    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

print(f"Total cached: {len(cache)}")
