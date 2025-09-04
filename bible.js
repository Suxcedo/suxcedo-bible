<script>
  const searchIndex = {
    "genesis 1": "gen_chapter1.html",
    "genesis 2": "gen_chapter2.html",
    "genesis 3": "gen_chapter3.html",
    "genesis 4": "gen_chapter4.html",
    "genesis 5": "gen_chapter5.html",
    "genesis 6": "gen_chapter6.html",
    "genesis 7": "gen_chapter7.html",
    "genesis 8": "gen_chapter8.html",
    "genesis 9": "gen_chapter9.html",
    "genesis 10": "gen_chapter10.html",
    "genesis 11": "gen_chapter11.html",
    "genesis 12": "gen_chapter12.html",
    "genesis 13": "gen_chapter13.html",
    "genesis 14": "gen_chapter14.html",
    "genesis 15": "gen_chapter15.html",
    "genesis 16": "gen_chapter16.html",
    "genesis 17": "gen_chapter17.html",
    "genesis 18": "gen_chapter18.html",
    "genesis 19": "gen_chapter19.html",
    "genesis 20": "gen_chapter20.html",
    "genesis 21": "gen_chapter21.html",
    "genesis 22": "gen_chapter22.html",
    "genesis 23": "gen_chapter23.html",
    "genesis 24": "gen_chapter24.html",
    "genesis 25": "gen_chapter25.html",
    "genesis 26": "gen_chapter26.html",
    "genesis 27": "gen_chapter27.html",
    "genesis 28": "gen_chapter28.html",
    "genesis 29": "gen_chapter29.html",
    "genesis 30": "gen_chapter30.html",
    "genesis 31": "gen_chapter31.html",
    "genesis 32": "gen_chapter32.html",
    "genesis 33": "gen_chapter33.html",
    "genesis 34": "gen_chapter34.html",
    "genesis 35": "gen_chapter35.html",
    "genesis 36": "gen_chapter36.html",
    "genesis 37": "gen_chapter37.html",
    "genesis 38": "gen_chapter38.html",
    "genesis 39": "gen_chapter39.html",
    "genesis 40": "gen_chapter40.html",
    "genesis 41": "gen_chapter41.html",
    "genesis 42": "gen_chapter42.html",
    "genesis 43": "gen_chapter43.html",
    "genesis 44": "gen_chapter44.html",
    "genesis 45": "gen_chapter45.html",
    "genesis 46": "gen_chapter46.html",
    "genesis 47": "gen_chapter47.html",
    "genesis 48": "gen_chapter48.html",
    "genesis 49": "gen_chapter49.html",
    "genesis 50": "gen_chapter50.html"
  };

  const input = document.querySelector(".search-bar");
  const button = document.querySelector(".search-button");

  // ---------- Helpers ----------
  const norm = s => (s || "").toLowerCase().replace(/\s+/g, "");

  // Accepts: "gen1", "gen 1", "Genesis1", "genesis 1", "gn1", and with verses "gen 39:7"
  function parseQuery(raw) {
    const cleaned = norm(raw);
    let m;

    // gen1 or gen1:7
    if ((m = cleaned.match(/^gen(\d{1,3})(?::(\d{1,3}))?$/))) {
      return { key: "genesis " + Number(m[1]), verse: m[2] ? Number(m[2]) : null };
    }
    // genesis1 or genesis1:7
    if ((m = cleaned.match(/^genesis(\d{1,3})(?::(\d{1,3}))?$/))) {
      return { key: "genesis " + Number(m[1]), verse: m[2] ? Number(m[2]) : null };
    }
    // optional short "gn1" or "gn1:7"
    if ((m = cleaned.match(/^gn(\d{1,3})(?::(\d{1,3}))?$/))) {
      return { key: "genesis " + Number(m[1]), verse: m[2] ? Number(m[2]) : null };
    }
    // already like "genesis 39"
    if ((m = cleaned.match(/^genesis(\d{1,3})$/))) {
      return { key: "genesis " + Number(m[1]), verse: null };
    }
    return { key: raw.trim(), verse: null };
  }

  // ---------- Suggestion dropdown ----------
  const suggestionBox = document.createElement("div");
  suggestionBox.style.position = "absolute";
  suggestionBox.style.zIndex = "1000";
  suggestionBox.style.maxHeight = "200px";
  suggestionBox.style.overflowY = "auto";
  suggestionBox.style.background = "#e0f2ff";
  suggestionBox.style.border = "1px solid #4a90e2";
  suggestionBox.style.color = "#003f8a";
  suggestionBox.style.borderRadius = "5px";
  suggestionBox.style.marginTop = "5px";
  suggestionBox.style.display = "none";
  document.body.appendChild(suggestionBox);

  function updateBoxPosition() {
    const rect = input.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + window.scrollY + "px";
    suggestionBox.style.left = rect.left + window.scrollX + "px";
    suggestionBox.style.width = rect.width + "px";
  }
  window.addEventListener("resize", updateBoxPosition);
  window.addEventListener("scroll", updateBoxPosition);
  updateBoxPosition();

  function showSuggestions() {
    const { key } = parseQuery(input.value);
    const prefix = norm(key);
    suggestionBox.innerHTML = "";

    if (!prefix) {
      suggestionBox.style.display = "none";
      return;
    }

    const suggestions = Object.keys(searchIndex)
      .filter(chap => norm(chap).startsWith(prefix))
      .slice(0, 50);

    if (!suggestions.length) {
      suggestionBox.style.display = "none";
      return;
    }

    suggestions.forEach(chap => {
      const div = document.createElement("div");
      div.textContent = chap;
      div.style.padding = "8px 12px";
      div.style.cursor = "pointer";
      div.addEventListener("mouseover", () => (div.style.background = "#cce4ff"));
      div.addEventListener("mouseout", () => (div.style.background = "#e0f2ff"));
      div.addEventListener("click", () => {
        input.value = chap;
        searchBible();
      });
      suggestionBox.appendChild(div);
    });

    updateBoxPosition();
    suggestionBox.style.display = "block";
  }

  document.addEventListener("click", e => {
    if (!suggestionBox.contains(e.target) && e.target !== input) {
      suggestionBox.style.display = "none";
    }
  });

  // ---------- Search ----------
  function searchBible() {
  const { key, verse } = parseQuery(input.value);
  const keyNorm = norm(key);

  // Compare normalized on BOTH sides (fixes the bug)
  const match = Object.keys(searchIndex).find(chap => norm(chap) === keyNorm);

  if (match) {
    let url = searchIndex[match];
    if (verse) url += `?v=${verse}`; // pass verse along
    window.location.href = url;
  } else if (searchIndex[key.toLowerCase()]) {
    window.location.href = searchIndex[key.toLowerCase()];
  } else {
    alert("Chapter not found. Try e.g. Genesis 3 or gen3");
  }
}

  input.addEventListener("input", showSuggestions);
  input.addEventListener("focus", showSuggestions);
  button.addEventListener("click", searchBible);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBible();
      suggestionBox.style.display = "none";
    }
  });

  // ---------- Optional: auto-scroll to verse if ?v= is present ----------
  (function () {
    const params = new URLSearchParams(window.location.search);
    const v = parseInt(params.get("v"), 10);
    if (!isNaN(v)) {
      const verses = document.querySelectorAll(".verse");
      if (v >= 1 && v <= verses.length) {
        const el = verses[v - 1];
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.style.outline = "3px solid gold";
        setTimeout(() => (el.style.outline = "none"), 2000);
      }
    }
  })();
</script>
