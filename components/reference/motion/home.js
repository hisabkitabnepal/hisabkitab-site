export function homeMotion({ gsap, rm, scope, listen, cleanup, splitOnce }) {
  const $ = (s, c) => (c || scope).querySelector(s),
    $$ = (s, c) => Array.from((c || scope).querySelectorAll(s));
  if (rm) {
    $("#track").style.overflowX = "auto";
    return;
  }
  // Hero intro
  var heroWords = splitOnce($(".hero h1"));
  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .timeScale(1.6)
    .to(".nav", { duration: 0.9 })
    .from(
      heroWords,
      { yPercent: 115, rotate: 3, duration: 1.1, stagger: 0.07 },
      "-=.5",
    )
    .from(".hero-p", { y: 24, opacity: 0, duration: 0.8 }, "-=.6")
    .from(
      ".hero-left .pill",
      { y: 20, opacity: 0, scale: 0.94, duration: 0.7 },
      "-=.55",
    )
    .from(
      ".hero-right",
      { clipPath: "inset(0 0 0 100%)", duration: 1.2, ease: "power3.inOut" },
      0.2,
    )
    .from(
      ".setup",
      { y: 60, opacity: 0, scale: 0.94, duration: 1, ease: "back.out(1.3)" },
      "-=.7",
    )
    .from(
      ".setup .step, .setup .prog",
      { y: 14, opacity: 0, stagger: 0.08, duration: 0.6 },
      "-=.6",
    );

  // Setup card: each step ticks off in place (no layout change), the bar follows, then it resets and loops
  var stepEls = $$(".setup .step"),
    pct = $("#pct"),
    p = { v: 25 };
  function setDone(i, on) {
    var el = stepEls[i];
    el.classList.toggle("done", on);
    $(".tag", el).textContent = on ? "Done" : "Pending";
  }
  function bar(v, d) {
    gsap.to("#barFill", {
      scaleX: v / 100,
      duration: d,
      ease: "power2.inOut",
      overwrite: "auto",
    });
    gsap.to(p, {
      v: v,
      duration: d,
      ease: "power2.inOut",
      overwrite: "auto",
      onUpdate: function () {
        pct.textContent = Math.round(p.v) + "%";
      },
    });
  }
  var loop = gsap.timeline({ repeat: -1, delay: 3 });
  [1, 2, 3].forEach(function (i) {
    loop
      .call(setDone, [i, true])
      .call(bar, [25 * (i + 1), 0.8], "<")
      .to({}, { duration: 1.5 });
  });
  loop
    .to({}, { duration: 1.2 })
    .call(setDone, [3, false])
    .call(bar, [25, 0.9], "<")
    .call(setDone, [2, false], "+=.12")
    .call(setDone, [1, false], "+=.12")
    .to({}, { duration: 1.1 });

  // Logo marquee
  var track = $("#track");
  const originalChildren = Array.from(track.childNodes);
  for (let i = 0; i < 3; i++)
    originalChildren.forEach((n) => {
      const clone = n.cloneNode(true);
      track.appendChild(clone);
      cleanup(() => clone.remove());
    });
  var mq = gsap.to(track, {
    x: function () {
      return -track.scrollWidth / 4;
    },
    duration: 28,
    ease: "none",
    repeat: -1,
  });
  listen(track, "mouseenter", function () {
    gsap.to(mq, { timeScale: 0.25, duration: 0.6 });
  });
  listen(track, "mouseleave", function () {
    gsap.to(mq, { timeScale: 1, duration: 0.6 });
  });
  gsap.from(".trust > *", {
    y: 20,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    scrollTrigger: { trigger: ".trust", start: "top 92%" },
  });
}
