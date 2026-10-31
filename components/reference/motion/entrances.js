let footerRuns = 0;
export function entranceMotion({ gsap, ScrollTrigger, rm, splitOnce }, page) {
  if (rm) return;
  var clear = "transform,opacity";
  function bookPage() {
    gsap
      .timeline({ defaults: { ease: "power3.out", clearProps: clear } })
      .timeScale(1.5)
      .from("#pg-book .bk-intro h1", { y: 10, opacity: 0, duration: 0.35 })
      .from(
        "#pg-book .bk-intro p",
        { y: 8, opacity: 0, duration: 0.3 },                                  
        "-=.25",                                                              
      )
      .from(
        "#pg-book form .field, #pg-book form .bk-consent, #pg-book form .bk-btn, #pg-book form .form-msg",
        { y: 8, opacity: 0, duration: 0.3, stagger: 0.02 },                   
        "-=.2",                                                               
      );
  }
  function calcPage() {
    gsap
      .timeline({ defaults: { ease: "power3.out", clearProps: clear } })
      .timeScale(1.5)
      .from(
        ".cx-hero .sp-dots",
        { opacity: 0, scale: 1.05, duration: 1.6, ease: "power2.out" },
        0,
      )
      .from(".cx-hero h1", { y: 40, opacity: 0, duration: 1 }, 0.05)
      .from(".cx-hero .sp-lead", { y: 24, opacity: 0, duration: 0.8 }, "-=.7")
      .from(
        ".cx-hero .sp-cta .pill",
        { y: 20, opacity: 0, scale: 0.94, duration: 0.7, stagger: 0.1 },
        "-=.55",
      )
      .from(
        ".cx-hero .sp-stats > div",
        { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 },
        "-=.4",
      )
      .from(
        ".calc-sec .calc-grid > *",
        { y: 44, opacity: 0, duration: 1, stagger: 0.14 },
        "-=.5",
      );
  }
    function blogPage() {
    var h = document.querySelector("#pg-blog .bf h1");
    if (h)
      gsap.from(splitOnce(h), {
        yPercent: 115,
        rotate: 2,
        duration: 1,
        stagger: 0.06,
        ease: "power4.out",
      });
  }

  if (page === "book") bookPage();
  if (page === "calculator") calcPage();
  if (page === "blog") blogPage();
  if (!footerRuns++)
  gsap.from(".site-foot .foot-grid > *", {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    clearProps: clear,
    scrollTrigger: { trigger: ".site-foot", start: "top 92%", once: true },
  });
}
