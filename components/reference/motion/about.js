export function aboutMotion({ gsap, ScrollTrigger, rm, scope, context, splitOnce }) {
  if (rm) return;
  const root = scope.querySelector("#pg-about, #pg-register");
  if (!root) return;
  context(() => {
    const q = (s, c) => Array.from((c || root).querySelectorAll(s));

    /* hero: headline words rise, then the side copy follows */
    gsap
      .timeline({ defaults: { ease: "power4.out" } })
      .from(splitOnce(root.querySelector(".abx-h1")), {
        yPercent: 115,
        rotate: 3,
        duration: 1.1,
        stagger: 0.07,
      })
      .from(".abx-side", { y: 24, opacity: 0, duration: 0.9 }, "-=.7");

    /* intro heading */
    gsap.from(splitOnce(root.querySelector(".abx-intro h2")), {
      yPercent: 115,
      rotate: 2,
      duration: 1,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: { trigger: ".abx-intro", start: "top 85%", once: true },
    });

    /* stats count up */
    q("[data-count]").forEach((el) => {
      const n = { v: 0 },
        to = parseFloat(el.getAttribute("data-count")),
        suf = el.getAttribute("data-suffix") || "";
      gsap.to(n, {
        v: to,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ".abx-stats", start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(n.v) + suf;
        },
      });
    });

    /* sections ease in on scroll */
    gsap.from(q(".abx-intro-r > *"), {
      y: 26,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".abx-intro-r", start: "top 85%", once: true },
    });
    gsap.from(q(".abx-stat"), {
      y: 34,
      opacity: 0,
      duration: 1,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: { trigger: ".abx-stats", start: "top 90%", once: true },
    });
    gsap.from(q(".abx-how-h > *"), {
      y: 26,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".abx-how-h", start: "top 88%", once: true },
    });
    gsap.from(q(".abx-wall > p, .abx-logo"), {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".abx-wall", start: "top 90%", once: true },
    });

    /* cards rise in turn */
    gsap.set(q(".abx-card"), { opacity: 0, y: 50 });
    ScrollTrigger.batch(q(".abx-card"), {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
        }),
    });
  }, root);
}