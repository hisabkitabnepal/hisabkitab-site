export function pillMotion({ gsap, rm, scope, listen, cleanup }) {
  if (!matchMedia("(hover:hover)").matches) return;
  var C = {
    dark: { fill: "#ffffff", text: "#0f2b3f" },
    outline: { fill: "#0f2b3f", text: "#ffffff" },
    light: { fill: "#1e2939", text: "#ffffff" },
  };
  var CARDS = "#pg-blog .bs article, #pg-blog .bl article";
  function kind(p) {
    return p.classList.contains("dark")
      ? "dark"
      : p.classList.contains("light")
        ? "light"
        : p.classList.contains("outline")
          ? "outline"
          : null;
  }
  // Resolve what the pointer is over: a pill, a side card, or a grid card (its icon tile fills).
  function targetOf(e) {
    var el = e.target.closest && e.target.closest(".pill, " + CARDS);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return null;
    if (el.classList.contains("pill")) {
      var k = kind(el);
      return k
        ? { trigger: el, host: el, fill: C[k].fill, text: C[k].text, pill: true }
        : null;
    }
    var host = el.matches("#pg-blog .bl article") ? el.querySelector("i") : el;
    return host
      ? { trigger: el, host: host, fill: "#1e2939", pill: false }
      : null;
  }
  function fillOf(h, trigger) {
    if (!h._f) {
      h._f = document.createElement("span");
      h._f.className = "pill-fill";
      h._f.setAttribute("aria-hidden", "true");
      h.insertBefore(h._f, h.firstChild);
      h._base = getComputedStyle(h).color;
      h._trigger = trigger;
      cleanup(() => {
        h._f?.remove();
        delete h._f;
        delete h._base;
        h._trigger?.classList.remove("hov");
        delete h._trigger;
      });
    }
    return h._f;
  }
  function pos(h, e, clamp) {
    var r = h.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    if (clamp) {
      x = Math.max(0, Math.min(r.width, x));
      y = Math.max(0, Math.min(r.height, y));
    }
    return { x: x, y: y, w: r.width, h: r.height };
  }
  function reach(o) {
    return (
      Math.max(
        Math.hypot(o.x, o.y),
        Math.hypot(o.w - o.x, o.y),
        Math.hypot(o.x, o.h - o.y),
        Math.hypot(o.w - o.x, o.h - o.y),
      ) /
        10 +
      0.5
    );
  }
  listen(scope, "mouseover", function (e) {
    var t = targetOf(e);
    if (!t) return;
    var h = t.host,
      f = fillOf(h, t.trigger),
      o = pos(h, e, !t.pill);
    f._s = reach(o);
    t.trigger.classList.add("hov");
    gsap.killTweensOf(f);
    gsap.set(f, { x: o.x, y: o.y, backgroundColor: t.fill });
    gsap.fromTo(
      f,
      { scale: 0 },
      { scale: f._s, duration: rm ? 0 : 0.6, ease: "power3.out" },
    );
    if (t.pill) {
      gsap.killTweensOf(h, "color");
      gsap.to(h, {
        color: t.text,
        duration: rm ? 0 : 0.3,
        delay: rm ? 0 : 0.1,
        ease: "power2.out",
      });
    }
  });
  listen(scope, "mouseout", function (e) {
    var t = targetOf(e);
    if (!t || !t.host._f) return;
    var h = t.host,
      f = h._f,
      o = pos(h, e, !t.pill),
      cur = gsap.getProperty(f, "scale");
    t.trigger.classList.remove("hov");
    gsap.killTweensOf(f);
    if (cur >= f._s * 0.98) gsap.set(f, { x: o.x, y: o.y, scale: reach(o) });
    gsap.to(f, { scale: 0, duration: rm ? 0 : 0.5, ease: "power3.inOut" });
    if (t.pill) {
      gsap.killTweensOf(h, "color");
      gsap.to(h, { color: h._base, duration: rm ? 0 : 0.3, ease: "power2.out" });
    }
  });
}