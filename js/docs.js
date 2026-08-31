(function () {
  // ---- shared sidebar ----
  var NAV = [
    ["Getting Started", [["index.html", "Overview"], ["wiring.html", "Wiring"], ["first-power-up.html", "First power-up"]]],
    ["Hardware Reference", [["specifications.html", "Specifications"], ["mounting.html", "Mounting"], ["orientation.html", "Orientation"]]],
    ["Robot Code", [["code.html", "Setup & install"], ["code-features.html", "Feature guide"], ["code-api.html", "API reference"]]],
    ["SWYFT Link", [["swyft-link.html", "Install & connect"], ["swyft-link-using.html", "Using SWYFT Link"], ["dfu.html", "Firmware & DFU"]]],
    ["Safety & Current Limits", [["current-limits.html", "How the limits work"], ["limits-by-mechanism.html", "Limits by mechanism"], ["power-thermal.html", "Power & thermal budget"]]],
    ["Status Lights", [["status-lights.html", "Status lights"]]],
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
    { t: "Feature guide", u: "code-features.html", s: "Robot Code", k: "control duty telemetry leds neutral follower" },
    { t: "API reference", u: "code-api.html", s: "Robot Code", k: "methods java class" },
    { t: "Install & connect", u: "swyft-link.html", s: "SWYFT Link", k: "ipk systemcore usb-c connect browser" },
    { t: "Using SWYFT Link", u: "swyft-link-using.html", s: "SWYFT Link", k: "tune config control identify save flash" },
    { t: "Firmware & DFU", u: "dfu.html", s: "SWYFT Link", k: "update recover flash bootloader" },
    { t: "How the limits work", u: "current-limits.html", s: "Safety & Current Limits", k: "stator supply current limit duty" },
    { t: "Limits by mechanism", u: "limits-by-mechanism.html", s: "Safety & Current Limits", k: "drivetrain intake elevator arm swerve recommended" },
    { t: "Power & thermal budget", u: "power-thermal.html", s: "Safety & Current Limits", k: "breaker divide heat budget" },
    { t: "Status lights", u: "status-lights.html", s: "Status Lights", k: "led colours blink fault red green orange" },
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
