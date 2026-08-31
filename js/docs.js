(function () {
  // ---- shared sidebar ----
  var NAV = [
    ["Getting Started", [["index.html", "Overview"], ["wiring.html", "Wiring"], ["first-power-up.html", "First power-up"], ["status-lights.html", "Status lights"]]],
    ["Robot Code", [["code.html", "Setup & install"], ["code-config.html", "Configuration"], ["code-control.html", "Control requests"], ["code-closedloop.html", "Closed-loop control"], ["code-telemetry.html", "Status signals"], ["code-api.html", "API reference"]]],
    ["Safety & Current Limits", [["current-limits.html", "How the limits work"], ["limits-by-mechanism.html", "Limits by mechanism"], ["power-thermal.html", "Power & thermal budget"]]],
    ["Hardware Reference", [["specifications.html", "Specifications"], ["mounting.html", "Mounting"], ["orientation.html", "Orientation"]]],
    ["SWYFT Link", [["swyft-link.html", "Install & connect"], ["swyft-link-using.html", "Using SWYFT Link"], ["dfu.html", "Firmware & DFU"]]],
    ["Troubleshooting", [["troubleshooting.html", "Troubleshooting"], ["faults.html", "Faults & errors"]]]
  ];
  var side = document.querySelector(".sidebar");
  if (side) {
    var page = side.getAttribute("data-page") || "";
    var h = '<a class="wordmark" href="index.html"><span class="swyft">SWYFT</span><span class="robotics">ROBOTICS</span></a>';
    h += '<div class="side-search"><hr><div class="field" role="button" tabindex="0">'
       + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>Search</div><hr></div>';
    h += '<div class="nav-scroll">';
    for (var g = 0; g < NAV.length; g++) {
      h += '<nav class="nav-group"><p class="nav-eyebrow">' + NAV[g][0] + "</p>";
      for (var i = 0; i < NAV[g][1].length; i++) {
        var it = NAV[g][1][i];
        h += "<a" + (it[0] === page ? ' class="active"' : "") + ' href="' + it[0] + '">' + it[1] + "</a>";
      }
      h += "</nav>";
    }
    h += "</div>";
    h += '<div class="side-help"><a class="help" href="mailto:support@swyftrobotics.com">'
       + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Help &amp; contact</a></div>';
    side.innerHTML = h;

    // Keep the sidebar scrolled to the same spot across page loads.
    var scroller = side.querySelector(".nav-scroll");
    if (scroller) {
      var saved = null;
      try { saved = sessionStorage.getItem("navScroll"); } catch (e) {}
      if (saved !== null) {
        scroller.scrollTop = parseInt(saved, 10) || 0;
      } else {
        var act = scroller.querySelector("a.active");
        if (act) scroller.scrollTop = act.offsetTop - scroller.clientHeight / 2;
      }
      scroller.addEventListener("scroll", function () {
        try { sessionStorage.setItem("navScroll", scroller.scrollTop); } catch (e) {}
      }, { passive: true });
      // Before leaving, store the current spot so the next page restores it.
      window.addEventListener("beforeunload", function () {
        try { sessionStorage.setItem("navScroll", scroller.scrollTop); } catch (e) {}
      });
    }
  }

  // ---- search (⌘K / click) ----
  var INDEX = [
    { t: "Overview", u: "index.html", s: "Getting Started" },
    { t: "Wiring", u: "wiring.html", s: "Getting Started", k: "power can usb-c breaker connect leads polarity" },
    { t: "First power-up", u: "first-power-up.html", s: "Getting Started", k: "enable duty first run bench" },
    { t: "Specifications", u: "specifications.html", s: "Hardware Reference", k: "voltage current torque speed encoder dimensions" },
    { t: "Mechanical dimensions", u: "specifications.html#mechanical", s: "Specifications", k: "size drawing shaft mounting holes envelope weight" },
    { t: "Electrical ratings", u: "specifications.html#electrical", s: "Specifications", k: "voltage current limit stator supply operating" },
    { t: "Performance", u: "specifications.html#performance", s: "Specifications", k: "free speed stall torque" },
    { t: "Thermal", u: "specifications.html#thermal", s: "Specifications", k: "temperature trip fold overtemp" },
    { t: "Mounting", u: "mounting.html", s: "Hardware Reference", k: "holes bolt circle pattern install face" },
    { t: "Orientation", u: "orientation.html", s: "Hardware Reference", k: "direction invert clockwise ccw output face" },
    { t: "Setup & install", u: "code.html", s: "Robot Code", k: "vendordep vendor library install java wpilib" },
    { t: "Configuration", u: "code-config.html", s: "Robot Code", k: "configurator current limit neutral mode save flash" },
    { t: "Control requests", u: "code-control.html", s: "Robot Code", k: "duty velocity position current follower setcontrol" },
    { t: "Closed-loop control", u: "code-closedloop.html", s: "Robot Code", k: "pid gains kp ki slot velocity position tuning" },
    { t: "Status signals", u: "code-telemetry.html", s: "Robot Code", k: "telemetry getlatest getters rpm current voltage temperature" },
    { t: "API reference", u: "code-api.html", s: "Robot Code", k: "methods java class signatures" },
    { t: "Install & connect", u: "swyft-link.html", s: "SWYFT Link", k: "ipk systemcore usb-c connect browser" },
    { t: "Using SWYFT Link", u: "swyft-link-using.html", s: "SWYFT Link", k: "tune config control identify save flash" },
    { t: "Firmware & DFU", u: "dfu.html", s: "SWYFT Link", k: "update recover flash bootloader" },
    { t: "How the limits work", u: "current-limits.html", s: "Safety & Current Limits", k: "stator supply current limit duty" },
    { t: "Limits by mechanism", u: "limits-by-mechanism.html", s: "Safety & Current Limits", k: "drivetrain intake elevator arm swerve recommended" },
    { t: "Power & thermal budget", u: "power-thermal.html", s: "Safety & Current Limits", k: "breaker divide heat budget" },
    { t: "Status lights", u: "status-lights.html", s: "Getting Started", k: "led colours blink fault red green orange" },
    { t: "Troubleshooting", u: "troubleshooting.html", s: "Troubleshooting", k: "problem fix not spinning motor" },
    { t: "Faults & errors", u: "faults.html", s: "Troubleshooting", k: "fault error overtemp undervoltage estop encoder" }
  ];
  var overlay = document.createElement("div");
  overlay.className = "search-modal";
  overlay.innerHTML = '<div class="search-box"><input type="text" placeholder="Search the docs…" autocomplete="off" spellcheck="false"><div class="search-results"></div></div>';
  document.body.appendChild(overlay);
  var input = overlay.querySelector("input");
  var results = overlay.querySelector(".search-results");
  var sel = -1, cur = [];
  function render(q) {
    q = q.trim().toLowerCase();
    cur = q ? INDEX.filter(function (e) { return (e.t + " " + e.s + " " + (e.k || "")).toLowerCase().indexOf(q) >= 0; }).slice(0, 12) : [];
    if (q && !cur.length) { results.innerHTML = '<div class="sr-empty">No matches</div>'; return; }
    results.innerHTML = cur.map(function (e, i) {
      return '<a class="' + (i === sel ? "sel" : "") + '" href="' + e.u + '"><span class="sr-t">' + e.t + '</span><span class="sr-s">' + e.s + "</span></a>";
    }).join("");
  }
  function openSearch() { overlay.classList.add("open"); input.value = ""; sel = -1; render(""); setTimeout(function () { input.focus(); }, 10); }
  function closeSearch() { overlay.classList.remove("open"); }
  input.addEventListener("input", function () { sel = -1; render(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, cur.length - 1); render(input.value); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(input.value); }
    else if (e.key === "Enter") { var g = cur[sel] || cur[0]; if (g) location.href = g.u; }
    else if (e.key === "Escape") { closeSearch(); }
  });
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".side-search .field")) openSearch();
  });

  // ---- image lightbox ----
  var zoomables = document.querySelectorAll(".zoomable");
  if (zoomables.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    var lbImg = document.createElement("img");
    lb.appendChild(lbImg);
    document.body.appendChild(lb);
    function closeLb() { lb.classList.remove("open"); }
    zoomables.forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); lbImg.src = el.getAttribute("src"); lb.classList.add("open"); });
    });
    lb.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  // ---- Java syntax highlight + copy button ----
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function highlightJava(raw) {
    var re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(@\w+)|\b(import|package|public|private|protected|final|static|void|class|interface|enum|new|return|if|else|for|while|true|false|null|extends|implements|this|super|boolean|int|double|float|long|char|var|throws|throw|try|catch)\b|\b(\d[\d._]*[fFdDlL]?)\b|\b([A-Z][A-Za-z0-9_]*)\b/g;
    var out = "", last = 0, m;
    while ((m = re.exec(raw))) {
      out += esc(raw.slice(last, m.index));
      var cls = m[1] ? "tok-com" : m[2] ? "tok-str" : m[3] ? "tok-ann" : m[4] ? "tok-kw" : m[5] ? "tok-num" : "tok-type";
      out += '<span class="' + cls + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(raw.slice(last));
  }
  document.querySelectorAll(".code-panel").forEach(function (panel) {
    var code = panel.querySelector("code");
    if (code) code.innerHTML = highlightJava(code.textContent);
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy-btn"; btn.textContent = "Copy";
    panel.appendChild(btn);
    btn.addEventListener("click", function () {
      var text = code ? code.textContent : "";
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied"; btn.classList.add("done");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1500);
      });
    });
  });

  // ---- animated status lights (tap to play) ----
  document.querySelectorAll(".ledpair").forEach(function (el) {
    el.addEventListener("click", function () { el.classList.toggle("on"); });
  });

  // ---- scroll-spy TOC ----
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (!links.length) return;
  var heads = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
  function setActive(id) { links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); }); }
  var ticking = false;
  function upd() {
    ticking = false;
    var off = 100, idx = 0;
    for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top - off <= 0) idx = i; else break; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = heads.length - 1;
    setActive(heads[idx].id);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  upd();
})();
