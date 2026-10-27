export function pillMotion({ gsap, rm, scope, listen, cleanup }) {
  if (!matchMedia("(hover:hover)").matches) return;
  var C = {
    dark: { fill: "#ffffff", text: "#0f2b3f" },
    outline: { fill: "#0f2b3f", text: "#ffffff" },
    light: { fill: "#1e2939", text: "#ffffff" },
  };
  function kind(p) {
    return p.classList.contains("dark")
      ? "dark"
      : p.classList.contains("light")
        ? "light"
        : p.classList.contains("outline")
          ? "outline"
          : null;
  }
  function fillOf(p) {
    if (!p._f) {
      p._f = document.createElement("span");
      p._f.className = "pill-fill";
      p._f.setAttribute("aria-hidden", "true");
      p.insertBefore(p._f, p.firstChild);
      p._base = getComputedStyle(p).color;
      cleanup(() => {
        p._f?.remove();
        delete p._f;
        delete p._base;
        p.classList.remove("hov");
      });
    }
    return p._f;
  }
  function pos(p, e) {
    var r = p.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      w: r.width,
      h: r.height,
    };
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
  function pillOf(e) {
    var p = e.target.closest && e.target.closest(".pill");
    if (!p || (e.relatedTarget && p.contains(e.relatedTarget)) || !kind(p))
      return null;
    return p;
  }
  listen(scope, "mouseover", function (e) {
    var p = pillOf(e);
    if (!p) return;
    var c = C[kind(p)],
      f = fillOf(p),
      o = pos(p, e);
    f._s = reach(o);
    p.classList.add("hov");
    gsap.killTweensOf(f);
    gsap.killTweensOf(p, "color");
    gsap.set(f, { x: o.x, y: o.y, backgroundColor: c.fill });
    gsap.fromTo(
      f,
      { scale: 0 },
      { scale: f._s, duration: rm ? 0 : 0.6, ease: "power3.out" },
    );
    gsap.to(p, {
      color: c.text,
      duration: rm ? 0 : 0.3,
      delay: rm ? 0 : 0.1,
      ease: "power2.out",
    });
  });
  listen(scope, "mouseout", function (e) {
    var p = pillOf(e);
    if (!p || !p._f) return;
    var f = p._f,
      o = pos(p, e),
      cur = gsap.getProperty(f, "scale");
    p.classList.remove("hov");
    gsap.killTweensOf(f);
    gsap.killTweensOf(p, "color");
    if (cur >= f._s * 0.98) gsap.set(f, { x: o.x, y: o.y, scale: reach(o) });
    gsap.to(f, { scale: 0, duration: rm ? 0 : 0.5, ease: "power3.inOut" });
    gsap.to(p, { color: p._base, duration: rm ? 0 : 0.3, ease: "power2.out" });
  });
}
