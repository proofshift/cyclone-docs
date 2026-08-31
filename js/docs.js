(function () {
  // ---- shared sidebar (one source of nav for every page) ----
  var NAV = [
    ["Getting Started", [
      ["index.html", "Overview"],
      ["wiring.html", "Wiring"],
      ["first-power-up.html", "First power-up"]
    ]],
    ["Hardware Reference", [
      ["specifications.html", "Specifications"],
      ["mounting.html", "Mounting"],
      ["orientation.html", "Orientation"]
    ]],
    ["Robot Code", [
      ["code.html", "Setup & install"],
      ["code-features.html", "Feature guide"],
      ["code-api.html", "API reference"]
    ]],
    ["SWYFT Link", [
      ["swyft-link.html", "Install & connect"],
      ["swyft-link-using.html", "Using SWYFT Link"],
      ["dfu.html", "Firmware & DFU"]
    ]],
    ["Safety & Current Limits", [
      ["current-limits.html", "How the limits work"],
      ["limits-by-mechanism.html", "Limits by mechanism"],
      ["power-thermal.html", "Power & thermal budget"]
    ]],
    ["Status Lights", [
      ["status-lights.html", "Status lights"]
    ]],
    ["Troubleshooting", [
      ["troubleshooting.html", "Troubleshooting"],
      ["faults.html", "Faults & errors"]
    ]]
  ];

  var side = document.querySelector(".sidebar");
  if (side) {
    var page = side.getAttribute("data-page") || "";
    var h = "";
    h += '<a class="wordmark" href="index.html"><span class="swyft">SWYFT</span><span class="robotics">ROBOTICS</span></a>';
    h += '<div class="side-search"><hr>'
       + '<div class="field" role="button" tabindex="0">'
       + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>Search</div>'
       + '<hr></div>';
    h += '<div class="nav-scroll">';
    for (var g = 0; g < NAV.length; g++) {
      h += '<nav class="nav-group"><p class="nav-eyebrow">' + NAV[g][0] + "</p>";
      var items = NAV[g][1];
      for (var i = 0; i < items.length; i++) {
        var cls = items[i][0] === page ? ' class="active"' : "";
        h += "<a" + cls + ' href="' + items[i][0] + '">' + items[i][1] + "</a>";
      }
      h += "</nav>";
    }
    h += "</div>";
    h += '<div class="side-help"><a class="help" href="mailto:support@swyftrobotics.com">'
       + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
       + "Help &amp; contact</a></div>";
    side.innerHTML = h;
  }

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
      el.addEventListener("click", function (e) {
        e.preventDefault();
        lbImg.src = el.getAttribute("data-full") || el.getAttribute("src");
        lb.classList.add("open");
      });
    });
    lb.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  // ---- scroll-spy TOC ----
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (!links.length) return;
  var heads = links
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);
  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
  }
  var ticking = false;
  function update() {
    ticking = false;
    var offset = 100, idx = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top - offset <= 0) idx = i;
      else break;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = heads.length - 1;
    setActive(heads[idx].id);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
