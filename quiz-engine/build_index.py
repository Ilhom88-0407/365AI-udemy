"""Bosh sahifa (index.html) ni modullardagi quiz-data.js fayllaridan yaratadi.

Ishga tushirish (repo ildizidan):  python quiz-engine/build_index.py
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# README.md dagi bo'limlar bilan mos
SECTIONS = [
    (1, 9, "🎓 Intro to AI"),
    (10, 19, "🐍 Python"),
    (20, 28, "🌐 NLP"),
    (29, 34, "🤖 LLM va Transformerlar"),
    (35, 42, "🔗 LangChain"),
    (43, 47, "🕸️ LangGraph"),
    (48, 51, "🧭 Vektor bazalar"),
    (52, 61, "🎙️ Nutqni tanish"),
    (62, 67, "🛠️ LLM Engineering"),
    (68, 76, "⚖️ AI etikasi"),
]


def field(src, name):
    m = re.search(r'^\s*' + name + r'\s*:\s*"((?:[^"\\]|\\.)*)"', src, re.M)
    return m.group(1).replace(chr(92) + chr(34), chr(34)) if m else ""


def modules():
    for d in sorted(ROOT.glob("[0-9][0-9]-*")):
        data = d / "quiz-data.js"
        if not data.exists():
            continue
        src = data.read_text(encoding="utf-8")
        title = re.sub(r"^\d+-modul\s*·\s*", "", field(src, "title"), flags=re.I)
        count = len(re.findall(r'^\s*q\s*:', src, re.M))
        yield int(d.name[:2]), d.name, title, field(src, "subtitle"), count


def card(num, folder, title, subtitle, count):
    return (
        f'        <a class="card item" href="{folder}/quiz.html">\n'
        f'          <p class="num">{num:02d}-modul · {count} savol</p>\n'
        f'          <h3>{html.escape(title, False)}</h3>\n'
        f'          <p>{html.escape(subtitle, False)}</p>\n'
        f'        </a>'
    )


def main():
    mods = list(modules())
    parts = []
    for lo, hi, name in SECTIONS:
        group = [m for m in mods if lo <= m[0] <= hi]
        if not group:
            continue
        parts.append(f'      <h2>{html.escape(name, False)} <span>{lo:02d}–{hi:02d}</span></h2>\n'
                     f'      <div class="list">\n' + "\n".join(card(*m) for m in group) + "\n      </div>")
    total = sum(m[4] for m in mods)
    page = TEMPLATE.replace("{{SECTIONS}}", "\n".join(parts)) \
                   .replace("{{MODULES}}", str(len(mods))) \
                   .replace("{{QUESTIONS}}", str(total))
    (ROOT / "index.html").write_text(page, encoding="utf-8")
    print(f"index.html: {len(mods)} modul, {total} savol")


TEMPLATE = """<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Engineer quizlari</title>
  <link rel="stylesheet" href="quiz-engine/quiz.css" />
  <style>
    .list { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    main h2 { font-size: 18px; margin: 32px 0 12px; }
    main h2 span { color: var(--muted); font-weight: 400; font-size: 14px; }
    .item { display: block; text-decoration: none; color: inherit; padding: 16px 18px; }
    .item:hover { border-color: var(--accent); }
    .item .num { color: var(--muted); font-size: 13px; margin: 0 0 2px; }
    .item h3 { font-size: 16px; margin: 0 0 4px; }
    .item p { margin: 0; color: var(--muted); font-size: 14px; }
    .wrap.wide { max-width: 960px; }
  </style>
</head>
<body>
  <main class="wrap wide">
    <header>
      <p class="kicker">365 AI Engineer Bootcamp — o'zbekcha darslik</p>
      <h1>Modul quizlari</h1>
      <p>{{MODULES}} modul, {{QUESTIONS}} savol. Har bir javobdan so'ng izoh va tegishli darsga havola chiqadi.</p>
    </header>
{{SECTIONS}}
    <footer><a href="https://github.com/Ilhom88-0407/365AI-udemy">📘 Darslikni GitHub'da o'qish</a></footer>
  </main>
</body>
</html>
"""

if __name__ == "__main__":
    main()
