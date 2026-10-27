export function aboutMotion({
  gsap,
  ScrollTrigger,
  rm,
  scope,
  context,
  splitOnce,
}) {
  function startAbout() {
    if (rm) return;
    var root = scope.querySelector("#pg-about");
    context(function () {
      var q = function (s, c) {
        return Array.prototype.slice.call((c || root).querySelectorAll(s));
      };
      var NAVY = "#0f2b3f",
        SOFT = "#F9FDFF",
        LINE = "#e3ecf2";

      /* hero: words rise, panel wipes in, rows follow */
      var words = splitOnce(root.querySelector(".ab-h1"));
      var steps = q(".ab-step"),
        nums = q(".ab-n"),
        fills = q(".ab-link b");
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .timeScale(1.6)
        .from(".ab-hero .pl", { y: 16, opacity: 0, duration: 0.7 })
        .from(
          words,
          { yPercent: 115, rotate: 3, duration: 1.1, stagger: 0.07 },
          "-=.45",
        )
        .from(".ab-lead", { y: 24, opacity: 0, duration: 0.8 }, "-=.6")
        .from(
          ".ab-cta .pill",
          { y: 20, opacity: 0, scale: 0.94, duration: 0.7, stagger: 0.1 },
          "-=.55",
        )
        .fromTo(
          ".ab-panel",
          { clipPath: "inset(0% 0% 0% 100% round 36px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 36px)",
            duration: 1.2,
            ease: "power3.inOut",
            clearProps: "clipPath",
          },
          0.15,
        )
        .from(".ab-panel-l", { y: 12, opacity: 0, duration: 0.7 }, "-=.5")
        .from(
          steps,
          { x: 28, opacity: 0, stagger: 0.1, duration: 0.7 },
          "-=.6",
        );

      /* step card: each step lights up and the dashed link fills, then it resets and loops (paused while off screen) */
      var loop = gsap.timeline({ repeat: -1, delay: 3 });
      [1, 2, 3].forEach(function (i) {
        loop
          .to(fills[i - 1], { scaleY: 1, duration: 0.45, ease: "power2.inOut" })
          .to(
            nums[i],
            {
              backgroundColor: NAVY,
              borderColor: NAVY,
              color: "#fff",
              duration: 0.35,
            },
            "-=.05",
          )
          .fromTo(
            nums[i],
            { scale: 0.72 },
            { scale: 1, duration: 0.7, ease: "back.out(2.4)" },
            "<",
          )
          .to({}, { duration: 1.1 });
      });
      loop
        .to({}, { duration: 1.4 })
        .to(nums.slice(1), {
          backgroundColor: SOFT,
          borderColor: LINE,
          color: NAVY,
          duration: 0.4,
          stagger: 0.06,
        })
        .to(fills, { scaleY: 0, duration: 0.4 }, "<")
        .to({}, { duration: 0.9 });
      ScrollTrigger.create({
        trigger: ".ab-panel",
        start: "top bottom",
        end: "bottom top",
        onToggle: function (s) {
          if (s.isActive) loop.resume();
          else loop.pause();
        },
      });

      /* statement band: eyebrow rises, the line fills in word by word with the scroll */
      var bandWords = splitOnce(root.querySelector(".ab-band h2"));
      gsap.from(".ab-band .ab-eyebrow", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-band", start: "top 78%", once: true },
      });
      gsap.fromTo(
        bandWords,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".ab-band h2",
            start: "top 82%",
            end: "bottom 52%",
            scrub: 0.6,
          },
        },
      );

      /* intro */
      gsap.from(".ab-intro .ab-eyebrow", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-intro", start: "top 88%", once: true },
      });
      gsap.from(splitOnce(root.querySelector(".ab-intro h2")), {
        yPercent: 115,
        rotate: 2,
        duration: 1,
        stagger: 0.06,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".ab-intro h2",
          start: "top 90%",
          once: true,
        },
      });

      /* bento: cards rise in turn, then their text, ticks (drawn) and figures play */
      var cards = q(".ab-c");
      gsap.set(cards, { opacity: 0, y: 70 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: function (batch) {
          batch.forEach(function (card, i) {
            var tl = gsap.timeline({
              delay: i * 0.14,
              defaults: { ease: "power3.out" },
            });
            tl.to(
              card,
              { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
              0,
            )
              .from(
                q(".ab-eyebrow", card),
                { y: 14, opacity: 0, duration: 0.8 },
                0.25,
              )
              .from(q("h3", card), { y: 26, opacity: 0, duration: 1 }, 0.3)
              .from(q("p", card), { y: 20, opacity: 0, duration: 0.9 }, 0.45)
              .from(
                q(".ab-ul li", card),
                { x: -14, opacity: 0, duration: 0.8, stagger: 0.1 },
                0.6,
              )
              .from(
                q(".ab-ul path", card),
                {
                  strokeDashoffset: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                },
                0.75,
              )
              .from(
                q(".ab-stat", card),
                { y: 22, opacity: 0, duration: 0.9, stagger: 0.1 },
                0.6,
              );
            q("[data-count]", card).forEach(function (el) {
              var n = { v: 0 },
                to = parseFloat(el.getAttribute("data-count")),
                suf = el.getAttribute("data-suffix") || "";
              tl.to(
                n,
                {
                  v: to,
                  duration: 1.4,
                  ease: "power3.out",
                  onUpdate: function () {
                    el.textContent = Math.round(n.v) + suf;
                  },
                },
                0.7,
              );
            });
          });
        },
      });
    }, root);
  }

  startAbout();
}
