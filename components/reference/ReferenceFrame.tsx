"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { mountReferenceMotion } from "./motion/runtime";
import {
  referenceHashTarget,
  referencePageFromPath,
} from "@/lib/reference/navigation";
export type ReferencePage =
  "home" | "services" | "about" | "blog" | "article" | "book" | "calculator";
// Lives for the whole session (module scope), so route changes never repeat these.
let fontsSettled = false;
const warmed = new Set<string>();
const PREFETCH_ROUTES = [
  "/services",
  "/about",
  "/blog",
  "/tools",
  "/free-consultation",
  "/guides/business-structures-nepal",
];

export function ReferenceFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const page = referencePageFromPath(pathname);
  useLayoutEffect(() => {
    const el = ref.current!;
    let dispose = () => {};
    let dead = false;
    function compatibleHash() {
      const target = referenceHashTarget(location.hash);
      if (target && target !== location.pathname) location.replace(target);
    }
    compatibleHash();
    window.addEventListener("hashchange", compatibleHash);
    const go = () => {
      if (dead) return;
      fontsSettled = true;
      // Visible in DevTools > Performance > Timings, or performance.getEntriesByName("ref-mount").
      performance.mark("ref-mount-start");
      dispose = mountReferenceMotion(el, page);
      performance.measure("ref-mount", "ref-mount-start");
      el.dataset.ready = "1";
    };
    // Only the first page load may wait for fonts. Later route changes never
    // hide the page behind a font check (font-display: swap covers the rest).
    if (fontsSettled || document.fonts.status === "loaded") go();
    else
      Promise.race([
        Promise.all(
          ["400", "500", "600", "700"].map((w) =>
            document.fonts.load(`${w} 1em Manrope`),
          ),
        ),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ])
        .catch(() => {})
        .then(go);
    return () => {
      dead = true;
      window.removeEventListener("hashchange", compatibleHash);
      dispose();
      delete el.dataset.ready;
    };
  }, [pathname, page]);
  // Warm the main routes once the browser is idle, so the first click on a
  // tab is served from the router cache instead of a network round trip.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;
    const run = () => PREFETCH_ROUTES.forEach((r) => router.prefetch(r));
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 2000);
    return () => clearTimeout(id);
  }, [router]);
  // Also prefetch on hover / touch / keyboard focus. This covers every plain
  // <a> on the site (hero, footer, cards) and the blog cards that use router.push.
  const warm = (e: SyntheticEvent) => {
    const t = e.target as Element;
    if (!t.closest) return;
    let path: string | null = null;
    const a = t.closest("a[href]") as HTMLAnchorElement | null;
    if (a && !a.target && a.origin === location.origin) path = a.pathname;
    else {
      const card = t.closest("[data-slug]") as HTMLElement | null;
      if (card?.dataset.slug) path = "/blog/" + card.dataset.slug;
    }
    if (!path || path === location.pathname || warmed.has(path)) return;
    warmed.add(path);
    router.prefetch(path);
  };
  return (
    <div
      className={"reference-page" + (page === "calculator" ? " on-calc" : "")}
      ref={ref}
      onMouseOver={warm}
      onTouchStart={warm}
      onFocus={warm}
      onClick={(e) => {
        if (
          e.defaultPrevented ||
          e.button ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        const a = (e.target as Element).closest("a");
        if (!a || a.target || a.hasAttribute("download")) return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.search === location.search)
          return;
        e.preventDefault();
        router.push(url.pathname + url.search + url.hash);
      }}
    >
      {children}
    </div>
  );
}
export function CalculatorBanner() {
  const [closed, setClosed] = useState(false);
  useLayoutEffect(() => {
    try {
      setClosed(sessionStorage.getItem("xbarClosed") === "1");
    } catch {}
  }, []);
  return (
    <div
      className="xbar"
      id="xbar"
      role="region"
      aria-label="Free consultation"
      hidden={closed}
    >
      <span>Want the exact figure, not an estimate?</span>
      <a className="pill light" href="/free-consultation">
        Book Free Consultation <span className="arr">›</span>
      </a>
      <button
        className="xbar-x"
        id="xbarX"
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setClosed(true);
          try {
            sessionStorage.setItem("xbarClosed", "1");
          } catch {}
        }}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </button>
    </div>
  );
}
