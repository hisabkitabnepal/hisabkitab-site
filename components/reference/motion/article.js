export function articleMotion({
  gsap,
  ScrollTrigger,
  rm,
  scope,
  lenis,
  listen,
  ticker,
  context,
  splitOnce,
}) {
  let arTick;
  function startArticle() {
    var root = scope.querySelector("#pg-article");
    if (!root) return;
    var heads = Array.prototype.slice.call(root.querySelectorAll(".ar-t")),
      secs = Array.prototype.slice.call(root.querySelectorAll(".ar-sec"));
    var k = heads.map(function () {
        return 0;
      }),
      off = [196, 204, 216],
      on = [15, 43, 63];
    heads.forEach(function (h, i) {
      listen(h, "click", function () {
        var y = secs[i].getBoundingClientRect().top + scrollY - 96;
        if (lenis)
          lenis.scrollTo(y, {
            duration: 1.6,
            easing: function (t) {
              return 1 - Math.pow(1 - t, 4);
            },
          });
        else scrollTo({ top: y, behavior: "smooth" });
      });
    });
    arTick = function (time, dt) {
      var mid = innerHeight * 0.42,
        act = 0,
        f = rm ? 1 : 1 - Math.pow(0.0008, dt / 1000);
      secs.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= mid) act = i;
      });
      heads.forEach(function (h, i) {
        k[i] += ((i === act ? 1 : 0) - k[i]) * f;
        h.style.color =
          "rgb(" +
          on
            .map(function (d, n) {
              return Math.round(off[n] + (d - off[n]) * k[i]);
            })
            .join(",") +
          ")";
      });
    };
    ticker(arTick);
    if (rm) return;
    context(function () {
      var words = splitOnce(root.querySelector(".ar-h1"));
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .timeScale(1.5)
        .from(
          ".ar-dots",
          { opacity: 0, scale: 1.05, duration: 1.6, ease: "power2.out" },
          0,
        )
        .from(
          ".ar-back, .ar-meta",
          { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 },
          0.1,
        )
        .from(
          words,
          {
            yPercent: 115,
            rotate: 2,
            duration: 1.1,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.25,
        )
        .from(
          ".ar-stats > div",
          { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=.5",
        )
        .from(".ar-l", { y: 20, opacity: 0, duration: 0.9 }, "-=.5");
      gsap.utils.toArray(".ar-sec").forEach(function (el, i) {
        gsap.from(el.children, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: i ? "top 88%" : "top 95%",
            once: true,
          },
        });
      });
      gsap.from(".ar-end", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ar-end", start: "top 92%", once: true },
      });
      gsap.from(".ar-more h3", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ar-more", start: "top 88%", once: true },
      });
      gsap.from(".ar-more article", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ar-more .bl",
          start: "top 90%",
          once: true,
        },
      });
    }, root);
  }

  startArticle();
}
