// Modul quizi: har bir modul papkasidagi quiz-data.js window.QUIZ ni beradi.
(function () {
  "use strict";

  var QUIZ = window.QUIZ;
  var app = document.getElementById("app");
  var KEYS = "ABCDEFGH";
  var PASS = 0.8;
  var storeKey = "quiz-best-" + QUIZ.id;

  var state;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function readBest() {
    try { var v = localStorage.getItem(storeKey); return v === null ? null : Number(v); }
    catch (e) { return null; }
  }
  function writeBest(v) {
    try { localStorage.setItem(storeKey, String(v)); } catch (e) { /* ixtiyoriy */ }
  }

  // To'g'ri/Noto'g'ri savollarda variantlar tartibi saqlanadi, qolganlari aralashtiriladi.
  function prepare(q) {
    var idx = q.options.map(function (_, i) { return i; });
    var order = q.options.length > 2 ? shuffle(idx) : idx;
    return {
      src: q,
      options: order.map(function (i) { return q.options[i]; }),
      answer: order.reduce(function (acc, orig, pos) {
        if (q.answer.indexOf(orig) !== -1) acc.push(pos);
        return acc;
      }, []),
      picked: [],
      checked: false,
      correct: false
    };
  }

  function start() {
    state = { i: 0, items: QUIZ.questions.map(prepare) };
    render();
  }

  function sameSet(a, b) {
    return a.length === b.length && a.every(function (x) { return b.indexOf(x) !== -1; });
  }

  function current() { return state.items[state.i]; }

  function toggle(pos) {
    var it = current();
    if (it.checked) return;
    if (it.src.type === "multi") {
      var k = it.picked.indexOf(pos);
      if (k === -1) it.picked.push(pos); else it.picked.splice(k, 1);
    } else {
      it.picked = [pos];
    }
    render();
  }

  function check() {
    var it = current();
    if (it.checked || !it.picked.length) return;
    it.checked = true;
    it.correct = sameSet(it.picked, it.answer);
    render();
  }

  function next() {
    if (state.i < state.items.length - 1) { state.i++; render(); }
    else renderResult();
  }

  function header() {
    return el("header", {}, [
      el("p", { class: "kicker", text: QUIZ.id + "-modul · Quiz" }),
      el("h1", { text: QUIZ.title.replace(/^\d+-modul\s*·\s*/i, "") }),
      QUIZ.subtitle ? el("p", { text: QUIZ.subtitle }) : null
    ]);
  }

  function lessonLink(q) {
    if (!q.lesson) return null;
    return el("a", { href: q.lesson.href, text: "📖 Darsga qaytish: " + q.lesson.title });
  }

  function render() {
    var it = current();
    var q = it.src;
    var total = state.items.length;
    var multi = q.type === "multi";

    var list = el("ul", { class: "options", role: multi ? "group" : "radiogroup" });
    it.options.forEach(function (text, pos) {
      var cls = "opt" + (multi ? " multi" : "");
      if (it.checked) {
        if (it.answer.indexOf(pos) !== -1) cls += " correct";
        else if (it.picked.indexOf(pos) !== -1) cls += " wrong";
      }
      var btn = el("button", {
        type: "button",
        class: cls,
        "aria-pressed": String(it.picked.indexOf(pos) !== -1)
      }, [el("span", { class: "key", text: KEYS[pos] }), el("span", { text: text })]);
      btn.disabled = it.checked;
      btn.addEventListener("click", function () { toggle(pos); });
      list.appendChild(el("li", {}, [btn]));
    });

    var feedback = null;
    if (it.checked) {
      feedback = el("div", { class: "feedback " + (it.correct ? "ok" : "bad"), role: "status" }, [
        el("strong", { text: it.correct ? "✓ To'g'ri!" : "✗ Noto'g'ri" }),
        el("p", { text: q.explain }),
        lessonLink(q)
      ]);
    }

    var primary = el("button", {
      type: "button",
      class: "btn",
      text: !it.checked ? "Tekshirish" : (state.i === total - 1 ? "Natijani ko'rish" : "Keyingi savol →")
    });
    primary.disabled = !it.checked && !it.picked.length;
    primary.addEventListener("click", it.checked ? next : check);

    var score = state.items.filter(function (x) { return x.checked && x.correct; }).length;
    var done = state.i + (it.checked ? 1 : 0);

    app.replaceChildren(
      header(),
      el("div", { class: "progress" }, [
        el("div", { class: "progress-meta" }, [
          el("span", { text: "Savol " + (state.i + 1) + " / " + total }),
          el("span", { text: "To'g'ri: " + score })
        ]),
        el("div", { class: "bar" }, [el("span", { style: "width:" + (done / total * 100) + "%" })])
      ]),
      el("section", { class: "card" }, [
        el("p", { class: "q", text: q.q }),
        el("p", { class: "hint", text: multi ? "Bir nechta to'g'ri javob bor — hammasini belgilang." : "Bitta javobni tanlang." }),
        list,
        feedback,
        el("div", { class: "actions" }, [
          el("span", { class: "kbd", text: "Klaviatura: A–" + KEYS[it.options.length - 1] + " tanlash, Enter — davom etish" }),
          primary
        ])
      ])
    );
    primary.focus({ preventScroll: true });
  }

  function renderResult() {
    var items = state.items;
    var total = items.length;
    var score = items.filter(function (x) { return x.correct; }).length;
    var pct = Math.round(score / total * 100);
    var prevBest = readBest();
    if (prevBest === null || pct > prevBest) writeBest(pct);
    var best = Math.max(pct, prevBest === null ? 0 : prevBest);

    var verdict = score / total >= PASS
      ? "🎉 Ajoyib! Keyingi modulga tayyorsiz."
      : "Yana bir oz takrorlang — xato qilgan mavzularga qayting.";

    var retry = el("button", { type: "button", class: "btn", text: "Qaytadan yechish" });
    retry.addEventListener("click", start);

    var actions = [retry];
    if (QUIZ.next) actions.push(el("a", {
      class: "btn ghost",
      href: QUIZ.next.href,
      text: "Keyingi modul: " + QUIZ.next.label.replace(/^\d+-modul\s*·\s*/i, "") + " →"
    }));

    var wrong = items.filter(function (x) { return !x.correct; });
    var review = null;
    if (wrong.length) {
      review = el("section", { class: "review" }, [el("h2", { text: "Xatolar ustida ishlash (" + wrong.length + ")" })]);
      wrong.forEach(function (it) {
        var pick = function (arr) { return arr.map(function (p) { return it.options[p]; }).join("; "); };
        review.appendChild(el("div", { class: "review-item" }, [
          el("p", { text: it.src.q }),
          el("p", { class: "your", text: "Sizning javobingiz: " + pick(it.picked) }),
          el("p", { class: "right", text: "To'g'ri javob: " + pick(it.answer) }),
          lessonLink(it.src)
        ]));
      });
    }

    app.replaceChildren(
      header(),
      el("div", { class: "progress" }, [el("div", { class: "bar" }, [el("span", { style: "width:100%" })])]),
      el("section", { class: "card result", role: "status" }, [
        el("div", { class: "score", text: score + " / " + total }),
        el("p", { class: "verdict", text: verdict }),
        el("p", { class: "best", text: pct + "% · Eng yaxshi natija: " + best + "% · O'tish chegarasi: " + Math.round(PASS * 100) + "%" }),
        el("div", { class: "actions" }, actions),
        review
      ])
    );
    retry.focus({ preventScroll: true });
  }

  document.addEventListener("keydown", function (e) {
    if (!state || e.ctrlKey || e.metaKey || e.altKey) return;
    if (state.i >= state.items.length) return;
    var onQuestion = !!document.querySelector(".opt");
    if (!onQuestion) return;
    var pos = KEYS.indexOf(e.key.toUpperCase());
    if (pos !== -1 && e.key.length === 1 && pos < current().options.length) { toggle(pos); e.preventDefault(); }
    else if (e.key === "Enter" && !(document.activeElement && document.activeElement.tagName === "A")) {
      // Enter har doim davom ettiradi (fokus variant tugmasida bo'lsa ham).
      e.preventDefault();
      if (current().checked) next(); else check();
    }
  });

  // GitHub Pages'da .md fayllar render qilinmaydi (.nojekyll) — ularni GitHub'dagi ko'rinishiga yo'naltiramiz.
  function fixMdLinks() {
    var host = location.hostname;
    if (!/\.github\.io$/.test(host)) return;
    var owner = host.split(".")[0];
    var repo = location.pathname.split("/")[1];
    var base = "/" + repo + "/";
    document.querySelectorAll("a[href$='.md']").forEach(function (a) {
      var path = new URL(a.getAttribute("href"), location.href).pathname;
      if (path.indexOf(base) !== 0) return;
      a.href = "https://github.com/" + owner + "/" + repo + "/blob/main/" + path.slice(base.length);
    });
  }
  new MutationObserver(fixMdLinks).observe(document.body, { childList: true, subtree: true });

  document.title = QUIZ.id + "-modul quizi";
  start();
  fixMdLinks();
})();
