/* Shared page chrome: nav state, mobile menu, reveal-on-scroll. */
(function () {
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (nav && !nav.classList.contains("is-static")) {
    var onScroll = function () { nav.classList.toggle("is-solid", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".nav-links a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }
  window.observeReveals = function (root) {
    var els = (root || document).querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  };
  window.observeReveals();
})();
