// Original showcase and Services animation recipes; resources are owned by runtime.js.
export function servicesMotion(runtime, standalone) {
  const {
    gsap,
    ScrollTrigger,
    rm,
    scope,
    lenis,
    listen,
    ticker,
    context,
    splitOnce,
  } = runtime;
  let sxTick;
  function startSx() {
    var root = scope.querySelector("#services");
    var heads = Array.prototype.slice.call(root.querySelectorAll(".sx-t")),
      vis = Array.prototype.slice.call(root.querySelectorAll(".sx-v"));
    var mks = vis.map(function (v) {
        return v.querySelector(".mk");
      }),
      k = heads.map(function () {
        return 0;
      });
    var off = [196, 204, 216],
      on = [15, 43, 63];
    heads.forEach(function (h, i) {
      listen(h, "click", function () {
        var p = vis[i].parentNode,
          y =
            p.getBoundingClientRect().top +
            scrollY -
            (innerHeight - vis[i].offsetHeight) / 2;
        if (lenis)
          lenis.scrollTo(y, {
            duration: 1.8,
            easing: function (t) {
              return 1 - Math.pow(1 - t, 4);
            },
          });
        else scrollTo({ top: y, behavior: "smooth" });
      });
    });
    sxTick = function (time, dt) {
      var vh = innerHeight,
        mid = vh / 2 + 37,
        f = rm ? 1 : 1 - Math.pow(0.0008, dt / 1000);
      vis.forEach(function (v, i) {
        var r = v.getBoundingClientRect(),
          c = r.top + r.height / 2;
        var t = Math.max(0, 1 - Math.abs(c - mid) / (vh * 0.55));
        t = t * t * (3 - 2 * t);
        k[i] += (t - k[i]) * f;
        heads[i].style.color =
          "rgb(" +
          on
            .map(function (d, n) {
              return Math.round(off[n] + (d - off[n]) * k[i]);
            })
            .join(",") +
          ")";
        if (!rm)
          mks[i].style.transform =
            "translateY(" + ((c - mid) * -0.09).toFixed(1) + "px)";
      });
    };
    ticker(sxTick);
    startSxAnim(root);
  }
  /* Services cards: a small looping animation inside each mock, running only while its card is on screen */
  function startSxAnim(root, pre) {
    if (rm) return;
    context(function () {
      var q = function (n, sel) {
        return gsap.utils.toArray(
          "#" + (pre || "services-") + n + " " + sel,
          root,
        );
      };
      var hold = function (tl, d) {
        return tl.to({}, { duration: d });
      };
      function watch(n, tl) {
        ScrollTrigger.create({
          trigger: root.querySelector(
            "#" + (pre || "services-") + n + " .sx-v",
          ),
          start: "top 90%",
          end: "bottom 10%",
          onToggle: function (st) {
            if (st.isActive) tl.play();
            else tl.pause();
          },
        });
      }
      // 1 Registration checklist: the steps tick off one by one
      var cx = q(1, ".cx"),
        em = q(1, ".ri em");
      function reset1() {
        cx.forEach(function (c) {
          c.classList.remove("on");
        });
        em.forEach(function (e) {
          e.textContent = "Next";
        });
      }
      reset1();
      var t1 = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset1 });
      cx.forEach(function (c, i) {
        t1.call(
          function () {
            c.classList.add("on");
            em[i].textContent = "Done";
          },
          [],
          0.6 + i * 0.9,
        );
      });
      hold(t1, 2.4);
      watch(1, t1);
      // 2 Monthly snapshot: the bars grow in
      var bars = q(2, ".bars i");
      gsap.set(bars, { scaleY: 0 });
      var t2 = gsap.timeline({ repeat: -1, paused: true });
      t2.to(bars, {
        scaleY: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
      });
      hold(t2, 2.2);
      t2.to(bars, {
        scaleY: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "power2.in",
      });
      hold(t2, 0.3);
      watch(2, t2);
      // 3 Filing type: the highlight moves down the list
      var di = q(3, ".di"),
        off = {
          backgroundColor: "rgba(234,244,251,0)",
          boxShadow: "inset 0 0 0 1px rgba(207,227,241,0)",
        },
        on = {
          backgroundColor: "#eaf4fb",
          boxShadow: "inset 0 0 0 1px #cfe3f1",
        };
      gsap.set(di, off);
      gsap.set(di[0], on);
      var t3 = gsap.timeline({ repeat: -1, paused: true });
      di.forEach(function (d, i) {
        hold(t3, 1.1);
        t3.to(d, Object.assign({ duration: 0.35 }, off)).to(
          di[(i + 1) % di.length],
          Object.assign({ duration: 0.35 }, on),
          "<",
        );
      });
      watch(3, t3);
      // 4 Auditor request list: the progress bars fill
      var fills = q(4, ".pgb i");
      gsap.set(fills, { scaleX: 0 });
      var t4 = gsap.timeline({ repeat: -1, paused: true });
      t4.to(fills, {
        scaleX: 1,
        duration: 1.4,
        stagger: 0.25,
        ease: "power2.out",
      });
      hold(t4, 2);
      t4.to(fills, { scaleX: 0, duration: 0.6, ease: "power2.in" });
      hold(t4, 0.3);
      watch(4, t4);
      // 5 Financial reports: the line draws itself
      var lp = q(5, ".lp"),
        ar = q(5, ".ar");
      gsap.set(lp, { strokeDashoffset: 1 });
      gsap.set(ar, { opacity: 0 });
      var t5 = gsap.timeline({ repeat: -1, paused: true });
      t5.to(lp, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.inOut",
      }).to(ar, { opacity: 1, duration: 0.8 }, "-=.6");
      hold(t5, 2);
      t5.to([lp, ar], { opacity: 0, duration: 0.5 }).set(lp, {
        strokeDashoffset: 1,
        opacity: 1,
      });
      hold(t5, 0.3);
      watch(5, t5);
      // 6 Closure steps: the timeline moves forward a step at a time
      var tn = q(6, ".tn");
      function reset6() {
        tn.forEach(function (t, i) {
          t.classList.remove("on");
          t.classList.toggle("cur", i === 0);
        });
      }
      reset6();
      var t6 = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset6 });
      tn.forEach(function (t, i) {
        t6.call(
          function () {
            t.classList.remove("cur");
            t.classList.add("on");
            if (tn[i + 1]) tn[i + 1].classList.add("cur");
          },
          [],
          0.8 + i * 0.9,
        );
      });
      hold(t6, 2.2);
      watch(6, t6);
    }, root);
  }
  function startSvPage() {
    if (rm) return;
    var root = scope.querySelector("#pg-services");
    context(function () {
      var words = splitOnce(root.querySelector(".sp-head h1"));
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .timeScale(1.6)
        .from(".nav", { yPercent: -100, opacity: 0, duration: 0.9 })
        .from(
          words,
          { yPercent: 115, rotate: 2, duration: 1.1, stagger: 0.06 },
          "-=.5",
        )
        .from(
          ".sp-dots",
          { opacity: 0, scale: 1.05, duration: 1.8, ease: "power2.out" },
          0,
        )
        .from(
          ".sp-lead",
          { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=.7",
        )
        .from(
          ".sp-cta .pill",
          { y: 20, opacity: 0, scale: 0.94, duration: 0.7, stagger: 0.1 },
          "-=.55",
        )
        .from(
          ".sp-stats > div",
          {
            y: 18,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=.3",
        );
      gsap.utils.toArray(".sp-stats [data-count]", root).forEach(function (el) {
        var n = { v: 0 },
          to = parseFloat(el.getAttribute("data-count")),
          suf = el.getAttribute("data-suffix") || "";
        el.textContent = "0" + suf;
        gsap.to(n, {
          v: to,
          duration: 1.6,
          delay: 1.6,
          ease: "power3.out",
          onUpdate: function () {
            el.textContent = Math.round(n.v) + suf;
          },
        });
      });
      gsap.utils.toArray(".sp-row", root).forEach(function (row) {
        var panel = row.querySelector(".sx-v"),
          card = panel.querySelector(".mk"),
          txt = row.querySelectorAll(".sp-c > *");
        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
            defaults: { ease: "power3.out" },
          })
          .from(
            panel,
            { y: 70, opacity: 0, duration: 1.2, ease: "expo.out" },
            0,
          )
          .from(
            card,
            { y: 40, opacity: 0, scale: 0.94, duration: 1.1, ease: "expo.out" },
            0.2,
          )
          .from(txt, { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.25);
      });
      gsap.from(".sp-note", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".sp-note", start: "top 92%", once: true },
      });
    }, root);
  }

  if (standalone) {
    startSvPage();
    startSxAnim(scope.querySelector("#pg-services"), "svp-");
  } else startSx();
}
