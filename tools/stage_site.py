"""Stage the public static site, excluding engineering notes and unused downloads."""
from pathlib import Path
import re
import shutil
import json
from urllib.parse import urlsplit, unquote
from check_docs import Document, ROOT, check

docs = check()
output = ROOT/'_site'
if output.exists():
    raise SystemExit('_site already exists. Use a fresh checkout or move the old preview before staging.')
assets = set(docs)
downloads = json.loads((ROOT/'files/downloads.json').read_text(encoding='utf8'))
assets.update(ROOT/'files'/name for name in downloads)
assets.add(ROOT/'files/downloads.json')
for doc in docs.values():
    for ref in doc.refs:
        url = urlsplit(ref)
        if url.path and not url.scheme and not url.netloc:
            assets.add((ROOT/unquote(url.path)).resolve())
for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', (ROOT/'css/docs.css').read_text(encoding='utf-8-sig')):
    if not urlsplit(ref).scheme: assets.add((ROOT/'css'/ref).resolve())
assets.update([ROOT/'CNAME', ROOT/'.nojekyll'])
for source in sorted(assets):
    relative = source.relative_to(ROOT)
    target = output/relative
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,target)
print(f'Staged {len(assets)} public files in {output}; engineering notes and unlinked legacy assets excluded.')
