"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { mountReferenceMotion } from "./motion/runtime";
import {
  referenceHashTarget,
  referencePageFromPath,
} from "@/lib/reference/navigation";
export type ReferencePage =
  "home" | "services" | "about" | "blog" | "article" | "book" | "calculator";
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
      dispose = mountReferenceMotion(el, page);
      el.dataset.ready = "1";
    };
    if (document.fonts.status === "loaded") go();
    else
      Promise.race([
        Promise.all(
          ["400", "500", "600", "700"].map((w) =>
            document.fonts.load(`${w} 1em Manrope`),
          ),
        ),
        new Promise((resolve) => setTimeout(resolve, 1200)),
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
  return (
    <div
      className={"reference-page" + (page === "calculator" ? " on-calc" : "")}
      ref={ref}
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
