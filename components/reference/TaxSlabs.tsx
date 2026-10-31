"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { slabDetails } from "@/lib/reference/rb-data.ts";

/** Each underline is tied to scroll position: it draws as the row rises into
 *  view and retracts when you scroll back up. Reads and writes are batched and
 *  the line is moved with transform only, and the listener is attached only
 *  while the list is near the viewport. */
export function TaxSlabs() {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const rows = Array.from(list.children) as HTMLElement[];
    const lines = rows.map((r) => r.querySelector<HTMLElement>(".rb-line")!);
    const last = rows.map(() => -1);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let active = false;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const tops = rows.map((r) => r.getBoundingClientRect().top); // read
      tops.forEach((top, i) => {
        // write
        const p = reduce
          ? 1
          : Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.4)));
        if (Math.abs(p - last[i]) < 0.003) return;
        last[i] = p;
        lines[i].style.transform = "scaleX(" + p.toFixed(3) + ")";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const on = () => {
      if (active) return;
      active = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    };
    const off = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    update();
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? on() : off()),
            { rootMargin: "150px 0px" },
          );
    if (io) io.observe(list);
    else on();
    return () => {
      io?.disconnect();
      off();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <ol
      className="rb-slabs"
      ref={ref}
      aria-label="Sole-proprietor income tax slabs"
    >
      {slabDetails.map((s) => (
        <li
          className="rb-slab"
          key={s.tag}
          style={{ "--w": s.width } as CSSProperties}
        >
          <h3>{s.label}</h3>
          <p>{s.note}</p>
          <span className="rb-rate">{s.rate}</span>
          <i className="rb-line" aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}
