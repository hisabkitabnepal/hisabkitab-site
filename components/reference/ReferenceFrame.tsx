"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { mountReferenceMotion } from "./motion/runtime";
import { referenceHashTarget } from "@/lib/reference/navigation";
export type ReferencePage =
  "home" | "services" | "about" | "blog" | "article" | "book" | "calculator";
export function ReferenceFrame({
  page,
  children,
}: {
  page: ReferencePage;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    function compatibleHash() {
      const target = referenceHashTarget(location.hash);
      if (target && target !== location.pathname) location.replace(target);
    }
    compatibleHash();
    window.addEventListener("hashchange", compatibleHash);
    const cleanup = mountReferenceMotion(ref.current!, page);
    return () => {
      window.removeEventListener("hashchange", compatibleHash);
      cleanup();
    };
  }, [page]);
  return (
    <div
      className={"reference-page" + (page === "calculator" ? " on-calc" : "")}
      ref={ref}
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
