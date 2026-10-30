"use client";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  legalEmail,
  legalKeyFromHash,
  legalPhone,
  legalUpdated,
  legalViews,
  type LegalKey,
} from "@/lib/reference/legal";

const keys: LegalKey[] = ["terms", "privacy"];

/** Renders a paragraph with the [mail] / [tel] / **bold** / newline tokens used in lib/reference/legal.ts. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line.split(/(\[mail\]|\[tel\]|\*\*[^*]+\*\*)/).map((part, j) => {
            if (part === "[mail]")
              return (
                <a key={j} href={`mailto:${legalEmail}`}>
                  {legalEmail}
                </a>
              );
            if (part === "[tel]")
              return (
                <a key={j} href={`tel:${legalPhone.href}`}>
                  {legalPhone.label}
                </a>
              );
            if (part.startsWith("**"))
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            return part;
          })}
        </Fragment>
      ))}
    </>
  );
}

export function Legal() {
  const [active, setActive] = useState<LegalKey>("terms");
  const [section, setSection] = useState<string>(legalViews.terms.sections[0].id);
  const sheetRef = useRef<HTMLElement>(null);
  const first = useRef(true);
  const view = legalViews[active];

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 , behavior: "instant" });
  }, []);

  // Pick the tab from the URL hash (#terms / #privacy) and follow hash changes.
  useLayoutEffect(() => {
    const sync = () => setActive(legalKeyFromHash(location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Reset the highlighted section, scroll to top and fade the sheet in when the tab changes.
  useEffect(() => {
    setSection(legalViews[active].sections[0].id);
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    const sheet = sheetRef.current;
    if (!sheet || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      sheet,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
    return () => {
      tween.kill();
    };
  }, [active]);

  // Highlight the table-of-contents entry for the section being read.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = legalViews[active].sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = (document.querySelector(".nav")?.getBoundingClientRect().bottom ?? 0) + 16;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  }

  return (
    <section className="pg lg-page" id="pg-legal" data-page="legal">
      <div className="lg-head">
        <div>
          <h1>{view.title}</h1>
          <p className="lg-upd">Last updated {legalUpdated}</p>
        </div>
        <div className="lg-tabs" role="tablist" aria-label="Legal documents">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={active === k}
              className={active === k ? "on" : undefined}
              onClick={() => {
                if (location.hash !== "#" + k) location.hash = k;
              }}
            >
              {legalViews[k].label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg-body" key={active}>
        <nav className="lg-toc" aria-label={`${view.title} sections`}>
          <p>On this page</p>
          {view.sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={section === s.id ? "on" : undefined}
              onClick={() => jump(s.id)}
            >
              <i>{String(i + 1).padStart(2, "0")}</i>
              <span>{s.title}</span>
            </button>
          ))}
        </nav>
        <article className="lg-sheet" ref={sheetRef}>
          <p className="lg-intro">{view.intro}</p>
          {view.sections.map((s, i) => (
            <section className="lg-sec" id={s.id} key={s.id}>
              <span className="lg-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2>{s.title}</h2>
                {s.body.map((p, j) => (
                  <p className={p.includes("\n") ? "lg-addr" : undefined} key={j}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}