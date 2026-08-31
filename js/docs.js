(function () {
  // ---- image lightbox (enlarge in the same window) ----
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
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  var ticking = false;
  function update() {
    ticking = false;
    var offset = 100;   // a heading is "current" once its top passes this line
    var idx = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top - offset <= 0) idx = i;
      else break;
    }
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) idx = heads.length - 1;
    setActive(heads[idx].id);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
