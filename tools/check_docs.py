"""Validate the static pages; optionally compile every Java example.

python tools/check_docs.py
python tools/check_docs.py --java-jar PATH --wpilib-maven PATH --javac PATH
Compilation verifies the real API signatures, not motor behavior on hardware.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse
import hashlib
import os
import re
import subprocess
import tempfile
ROOT = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.refs, self.errors, self.codes = set(), [], [], []
        self.h1 = 0
        self.stack = []
        self.in_pre = self.in_code = False
        self.snippet = ''
        self.prose = []
        self.feed(text)
        if self.stack: self.errors.append('Unclosed elements: '+', '.join(self.stack))

    def handle_starttag(self, tag, attrs):
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(tag)
        a = dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: self.errors.append('Duplicate ID: '+a['id'])
            self.ids.add(a['id'])
        for key in ('href', 'src'):
            if key in a: self.refs.append(a[key])
        if tag == 'img' and not a.get('alt') and 'lightbox' not in a.get('class',''):
            # Empty lightbox image is populated with source alt text on opening.
            if 'src' in a: self.errors.append('Image missing alternative text')
        if tag == 'h1': self.h1 += 1
        if tag == 'pre': self.in_pre = True
        if tag == 'code' and self.in_pre: self.in_code = True; self.snippet = ''

    def handle_data(self, data):
        if self.in_code: self.snippet += data
        elif not self.in_pre: self.prose.append(data)

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append('Unexpected closing element: '+tag)
        else:
            self.stack.pop()
        if tag == 'code' and self.in_code: self.codes.append(self.snippet); self.in_code = False
        if tag == 'pre': self.in_pre = False

def check():
    failures, count = [], 0
    docs = {}
    for path in sorted(ROOT.glob('*.html')):
        text = path.read_text(encoding='utf-8')
        d = Document(text); docs[path] = d
        failures += [f'{path.name}: {e}' for e in d.errors]
        if d.h1 != 1: failures.append(f'{path.name}: expected one h1, got {d.h1}')
        if '\ufffd' in text: failures.append(f'{path.name}: replacement character')
        if re.search(r'[A-Za-z]\?[A-Za-z]', ' '.join(d.prose)):
            failures.append(f'{path.name}: possible damaged punctuation inside a word')
        if 'files/swyft-link-usb.html' in text:
            failures.append(f'{path.name}: use the live USB app URL, not an HTML download')
    for path,d in docs.items():
        for ref in d.refs:
            url = urlsplit(ref)
            if url.scheme or url.netloc: continue
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            count += 1
            if not target.is_relative_to(ROOT): failures.append(f'{path.name}: escaped site root: {ref}')
            elif not target.exists(): failures.append(f'{path.name}: missing target: {ref}')
            elif url.fragment and target in docs and unquote(url.fragment) not in docs[target].ids:
                failures.append(f'{path.name}: missing anchor: {ref}')
    css = (ROOT/'css/docs.css').read_text(encoding='utf-8-sig')
    for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', css):
        if not urlsplit(ref).scheme and not (ROOT/'css'/ref).resolve().exists():
            failures.append('CSS resource missing: '+ref)
    import json
    apps = json.loads((ROOT/'files/downloads.json').read_text(encoding='utf8'))
    if 'SWYFT-Link-SystemCore.ipk' not in apps:
        failures.append('Expected the current SystemCore download in downloads.json')
    for name, expected in apps.items():
        path = ROOT/'files'/name
        if not path.resolve().is_relative_to((ROOT/'files').resolve()):
            failures.append('Download path escapes files directory: '+name)
            continue
        if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            failures.append('App artifact differs from reviewed build: '+name)
    if failures: raise SystemExit('\n'.join(failures))
    if len(docs) != 21: raise SystemExit(f'Expected 21 documentation pages, found {len(docs)}')
    print(f'PASS: {len(docs)} pages, {count} local references, CSS assets, unique IDs, image alternatives, text encoding and {len(apps)} app hash.')
    return docs

def compile_examples(docs, jar, maven, javac):
    jars = [Path(jar)] + [p for p in Path(maven).rglob('*.jar') if '-sources' not in p.name and '-javadoc' not in p.name]
    if len(jars) < 2 or not jars[0].is_file(): raise SystemExit('Missing Cyclone JAR or WPILib dependencies')
    snippets = [(path.name,s) for path,d in docs.items() for s in d.codes]
    with tempfile.TemporaryDirectory(prefix='cyclone-docs-java-') as tmp:
        folder = Path(tmp); sources = []
        for i,(page,snippet) in enumerate(snippets):
            public_class = re.search(r'public class (\w+)\b', snippet)
            if public_class:
                src = folder/(public_class.group(1)+'.java'); source = snippet
            else:
                imports = '\n'.join(re.findall(r'^import .*?;', snippet, re.M))
                body = re.sub(r'^import .*?;\s*', '', snippet, flags=re.M)
                src = folder/f'Example{i}.java'
                source = f'import com.swyftrobotics.cyclone.v4.*;\n{imports}\nclass Example{i} {{\nvoid example(SwyftCyclone motor, SwyftCyclone follower, double kP, double kI, double positionKp) {{\n{body}\n}}\n}}'
            src.write_text(source, encoding='utf-8'); sources.append(src)
        # Argument file avoids Windows command-line limits from the WPILib classpath.
        cp = os.pathsep.join(str(p.resolve()).replace('\\','/') for p in jars)
        args = folder/'compile.args'
        args.write_text('-encoding UTF-8\n-classpath "'+cp+'"\n-d "'+str(folder).replace('\\','/')+'"\n'+'\n'.join('"'+str(p).replace('\\','/')+'"' for p in sources), encoding='utf-8')
        result = subprocess.run([javac, '@'+str(args)], capture_output=True, text=True)
        if result.returncode:
            print('\n'.join(f'Example{i}: {page}' for i,(page,_) in enumerate(snippets)))
            raise SystemExit(result.stdout+result.stderr)
        print(f'PASS: all {len(snippets)} Java examples compile against {jars[0].name}. No hardware operations executed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--java-jar'); parser.add_argument('--wpilib-maven'); parser.add_argument('--javac')
    args = parser.parse_args()
    documents = check()
    if args.java_jar:
        if not args.wpilib_maven or not args.javac: parser.error('--java-jar requires --wpilib-maven and --javac')
        compile_examples(documents, args.java_jar, args.wpilib_maven, args.javac)
