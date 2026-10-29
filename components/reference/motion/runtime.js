import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { homeMotion } from "./home";
import { commonMotion } from "./common";
import { servicesMotion } from "./services";
import { aboutMotion } from "./about";
import { articleMotion } from "./article";
import { entranceMotion } from "./entrances";
import { pillMotion } from "./pills";

/** One resource owner per mounted document, including callbacks invoked after setup. */
export function mountReferenceMotion(scope, page) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disposers = [];
  const owner = gsap.context(() => {}, scope);
  const cleanup = (fn) => disposers.push(fn);
  const context = (fn, root = scope) => {
    const ctx = gsap.context(fn, root);
    cleanup(() => ctx.revert());
    return ctx;
  };
  const safe =
    (fn) =>
    (...args) =>
      owner.add(() => fn(...args));
  const listen = (target, event, fn, options) => {
    const handler = safe(fn);
    target.addEventListener(event, handler, options);
    cleanup(() => target.removeEventListener(event, handler, options));
  };
  const ticker = (fn) => {
    gsap.ticker.add(fn);
    cleanup(() => gsap.ticker.remove(fn));
  };
  const splitCache = new WeakMap();
  function splitOnce(el) {
    if (!el) return [];
    if (splitCache.has(el)) return splitCache.get(el);
    function walk(node) {
      const children = Array.from(node.childNodes);
      cleanup(() => node.replaceChildren(...children));
      children.forEach((n) => {
        if (n.nodeType === 3) {
          const fragment = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(" "));
              return;
            }
            const w = document.createElement("span"),
              i = document.createElement("span");
            w.className = "w";
            i.className = "wi";
            i.textContent = part;
            w.appendChild(i);
            fragment.appendChild(w);
          });
          node.replaceChild(fragment, n);
        } else if (n.nodeType === 1) walk(n);
      });
    }
    walk(el);
    const words = el.querySelectorAll(".wi");
    splitCache.set(el, words);
    return words;
  }
  // Timelines change these classes and labels without altering their structure.
  scope
    .querySelectorAll(".step,.cx,.tn,.ri em,.tag,#pct,[data-count]")
    .forEach((el) => {
      const className = el.getAttribute("class"),
        text = el.childElementCount === 0 ? el.textContent : null;
      cleanup(() => {
        if (className === null) el.removeAttribute("class");
        else el.setAttribute("class", className);
        if (text !== null) el.textContent = text;
      });
    });
  let lenis;
  if (!rm) {
    lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      prevent: (node) =>
        node.matches(".rows, textarea") && node.scrollHeight > node.clientHeight,
    });
    lenis.on("scroll", ScrollTrigger.update);
    ticker((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    cleanup(() => {
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    });
  }
  const runtime = {
    gsap,
    ScrollTrigger,
    rm,
    scope,
    lenis,
    cleanup,
    listen,
    ticker,
    context,
    splitOnce,
  };
  owner.add(() => {
    commonMotion(runtime);
    if (page === "home") {
      homeMotion(runtime);
      servicesMotion(runtime, false);
    }
    if (page === "services") servicesMotion(runtime, true);
    if (page === "about") aboutMotion(runtime);
    if (page === "article") articleMotion(runtime);
    entranceMotion(runtime, page);
    pillMotion(runtime);
  });
  let resizeTimer;
  listen(window, "resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
  cleanup(() => clearTimeout(resizeTimer));
  const dropdown = scope.querySelector(".has-dd");
  const menu = dropdown.querySelector(".dd-menu");
  if (dropdown) {
    listen(dropdown, "click", (e) => {
      const a = e.target.closest(".dd-i, .has-dd > a");
      if (a) {
        menu.style.transition = "none";
        // Not recorded by the context, so a route change can't revert it and reopen the menu mid-close.
        owner.ignore(() =>
          gsap.to(menu, {
            opacity: 0,
            y: -8,
            duration: 0.25,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
              if (dropdown.matches(":hover, :focus-within"))
                dropdown.classList.add("shut");
              gsap.set(menu, { clearProps: "opacity,transform,transition" });
            },
          }),
        );
        a.blur();
      }
    });
    listen(dropdown, "mouseleave", () => dropdown.classList.remove("shut"));
  }
  // Preserve local smooth anchors (service showcase and article sections).
  function scrollLocal(hash, immediate = false) {
    const service = /^#services-([1-6])$/.exec(hash);
    const target = scope.querySelector(hash);
    if (!target) return;
    let y = target.getBoundingClientRect().top + scrollY - 92;
    if (service) {
      const visual = target.querySelector(".sx-v");
      y =
        target.getBoundingClientRect().top +
        scrollY -
        (innerHeight - visual.offsetHeight) / 2;
    }
    if (lenis)
      lenis.scrollTo(y, {
        immediate,
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    else
      window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  }
  listen(scope, "click", (e) => {
    const a = e.target.closest("a");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
      return;
    const url = new URL(a.href, location.href);
    if (
      url.pathname !== location.pathname ||
      !url.hash ||
      !/^#(?:services-[1-6]|svp-[1-6]|faq|contact|ar-\d+)$/.test(url.hash)
    )
      return;
    e.preventDefault();
    scrollLocal(url.hash);
  });
  let anchorTimer;
  if (
    /^#(?:services-[1-6]|svp-[1-6]|faq|contact|ar-\d+)$/.test(location.hash)
  ) {
    anchorTimer = setTimeout(() => scrollLocal(location.hash, true), 90);
    cleanup(() => clearTimeout(anchorTimer));
  }
  // Dotted backdrop opacity follows the calculator/contact coverage of the viewport.
  // Drives a single fixed layer's opacity (composited) instead of a page-wide custom property.
  const layer = document.querySelector(".dots-layer");
  let raf = 0;
  function paintDots() {
    raf = 0;
    if (!layer) return;
    const z0 = innerHeight * 0.4,
      z1 = innerHeight * 1.2;
    let coverage = 0;
    scope.querySelectorAll(".calc-sec,.contact").forEach((el) => {
      const b = el.getBoundingClientRect();
      coverage = Math.max(
        coverage,
        Math.max(0, Math.min(b.bottom, z1) - Math.max(b.top, z0)) / (z1 - z0),
      );
    });
    layer.style.opacity = String(Math.max(0, 1 - coverage * 1.4));
  }
  const queueDots = () => {
    if (!raf) raf = requestAnimationFrame(paintDots);
  };
  listen(window, "scroll", queueDots, { passive: true });
  listen(window, "resize", queueDots);
  listen(window, "load", queueDots);
  paintDots();
  cleanup(() => {
    cancelAnimationFrame(raf);
    if (layer) layer.style.opacity = "";
  });
  ScrollTrigger.refresh();
  let alive = true;
  document.fonts.ready.then(() => {
    if (alive) ScrollTrigger.refresh();
  });
  return () => {
    alive = false;
    owner.revert();
    disposers.reverse().forEach((fn) => fn());
  };
}