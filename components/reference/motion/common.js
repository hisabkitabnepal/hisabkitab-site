export function commonMotion({ gsap, ScrollTrigger, rm, scope, splitOnce }) {
  const $ = (s, c) => (c || scope).querySelector(s),
    $$ = (s, c) => Array.from((c || scope).querySelectorAll(s));
  if (rm) return;
  // Calculator heading: words rise in, then the subtitle fades up. Replays each time the section comes into view.
  var chH = $(".calc-sec .services-head h2"),
    chP = $(".calc-sec .services-head p"),
    chA = $("#calcMore");
  if (chH) {
    var chTl = gsap
      .timeline({ paused: true, defaults: { ease: "power4.out" } })
      .from(splitOnce(chH), {
        yPercent: 110,
        rotate: 2,
        duration: 0.9,
        stagger: 0.07,
      })
      .from(
        chP,
        { y: 14, opacity: 0, duration: 0.7, ease: "power3.out" },
        "-=.55",
      )
      .from(
        chA,
        { y: 10, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=.4",
      );
    ScrollTrigger.create({
      trigger: ".calc-sec .services-head",
      start: "top 88%",
      end: "bottom top",
      onEnter: function () {
        chTl.restart();
      },
      onEnterBack: function () {
        chTl.restart();
      },
    });
  }

  // Replay the calculator count-up every time the section scrolls into view

  // Scroll headings + reveals
  $$("h2[data-split]").forEach(function (h) {
    if (h.closest(".calc-sec") || h.closest(".contact")) return;
    gsap.from(splitOnce(h), {
      yPercent: 115,
      rotate: 2,
      duration: 1,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: h.closest(".calc-sec")
        ? { trigger: ".calc-sec", start: "top 85%", once: true }
        : { trigger: h, start: "top 85%", once: true },
    });
  });
  var ctaH = $(".contact h2");
  if (ctaH)
    gsap.fromTo(
      splitOnce(ctaH),
      { opacity: 0.18 },
      {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: ctaH,
          start: "top 82%",
          end: "bottom 52%",
          scrub: 0.6,
        },
      },
    );
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // FAQ rows
  ScrollTrigger.batch(".acc", {
    start: "top 92%",
    once: true,
    onEnter: function (b) {
      gsap.from(b, {
        y: 34,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    },
  });

  // Nav shadow once scrolled
  ScrollTrigger.create({
    start: 10,
    end: "max",
    toggleClass: { targets: "#nav", className: "scrolled" },
  });
}
