"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { referencePageFromPath } from "@/lib/reference/navigation";

const menu = [
  ["Business registration", "Structure, documents, filing"],
  ["Monthly accounting", "Bookkeeping and summaries"],
  ["Tax & annual filings", "VAT, income tax, company filings"],
  ["Audit assistance", "Records and auditor support"],
  ["Financial reporting", "P&L, balance sheet, cash flow"],
  ["Business closure", "Wind down and clear what is owed"],
];

export function Navigation() {
  const pathname = usePathname();
  const page = referencePageFromPath(pathname);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const subRef = useRef<HTMLDivElement>(null);

  // Build the open/close timeline once; play/reverse it from `open`.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const nav = navRef.current;
    if (!panel || !nav) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(panel, { height: 0, autoAlpha: 0 });
      gsap.set(".m-item", { y: 18, autoAlpha: 0 });
      gsap.set(".hb-top", { transformOrigin: "50% 50%" });
      gsap.set(".hb-bot", { transformOrigin: "50% 50%" });
      const t = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onReverseComplete: () => {
          gsap.set(panel, { autoAlpha: 0 });
        },
      });
      t.to(panel, { autoAlpha: 1, height: "auto", duration: reduce ? 0 : 0.5 }, 0)
        .to(".hb-top", { y: 3.5, rotate: 45, duration: reduce ? 0 : 0.35 }, 0)
        .to(".hb-bot", { y: -3.5, rotate: -45, duration: reduce ? 0 : 0.35 }, 0)
        .to(
          ".m-item",
          {
            y: 0,
            autoAlpha: 1,
            duration: reduce ? 0 : 0.45,
            stagger: reduce ? 0 : 0.06,
          },
          reduce ? 0 : 0.12,
        );
      tl.current = t;
    }, nav);
    return () => {
      ctx.revert();
      tl.current = null;
    };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) t.timeScale(1).play();
    else t.timeScale(1.4).reverse();
  }, [open]);

  // Services sub-list accordion.
  useEffect(() => {
    const el = subRef.current;
    if (!el) return;
    gsap.to(el, {
      height: svcOpen ? "auto" : 0,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(".m-chev", {
      rotate: svcOpen ? 180 : 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [svcOpen]);

  const close = useCallback(() => {
    setOpen(false);
    setSvcOpen(false);
  }, []);

  // Close on route change, Escape, or when leaving the mobile breakpoint.
  useEffect(() => {
    close();
  }, [pathname, close]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const mq = matchMedia("(min-width: 981px)");
    const onMq = () => mq.matches && close();
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <header className={"nav" + (open ? " menu-open" : "")} id="nav" ref={navRef}>
      <a className="logo" href="/" aria-label="Hisab Kitab home">
        <img
          className="logo-mark"
          src="/reference/hk-emblem.webp"
          alt=""
          width={32}
          height={32}
        />
        <span className="logo-word">Hisab Kitab</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <div className="has-dd">
          <a
            href="/services"
            aria-haspopup="true"
            className={page === "services" ? "on" : undefined}
          >
            Services{" "}
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 3.5l3.5 3.5 3.5-3.5" />
            </svg>
          </a>
          <div className="dd-menu" role="menu">
            <div className="dd-grid">
              {menu.map(([title, description], index) => (
                <a
                  className="dd-i"
                  href={`/services#svp-${index + 1}`}
                  role="menuitem"
                  key={title}
                >
                  {title}
                  <small>{description}</small>
                </a>
              ))}
            </div>
          </div>
        </div>
        <a href="/tools" className={page === "calculator" ? "on" : undefined}>
          Tax Calculator
        </a>
        <a href="/about" className={page === "about" ? "on" : undefined}>
          About Us
        </a>
        <a
          href="/blog"
          className={page === "blog" || page === "article" ? "on" : undefined}
        >
          Blog
        </a>
      </nav>
      <div className="nav-right">
        <a className="pill outline magnet nav-cta" href="/free-consultation">
          Book Free Consultation <span className="arr">›</span>
        </a>
        <button
          type="button"
          className="hb"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line className="hb-top" x1="4" y1="8.5" x2="20" y2="8.5" />
            <line className="hb-bot" x1="4" y1="15.5" x2="20" y2="15.5" />
          </svg>
        </button>
      </div>
      <div
        className="m-panel"
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="m-in" aria-label="Mobile">
          <div className="m-item m-svc">
            <button
              type="button"
              className={"m-row" + (page === "services" ? " on" : "")}
              aria-expanded={svcOpen}
              onClick={() => setSvcOpen((v) => !v)}
            >
              Services
              <svg className="m-chev" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M1.5 3.5l3.5 3.5 3.5-3.5" />
              </svg>
            </button>
            <div className="m-sub" ref={subRef}>
              <a className="m-subi" href="/services" onClick={close}>
                All services
              </a>
              {menu.map(([title, description], index) => (
                <a
                  className="m-subi"
                  href={`/services#svp-${index + 1}`}
                  key={title}
                  onClick={close}
                >
                  {title}
                  <small>{description}</small>
                </a>
              ))}
            </div>
          </div>
          <a
            href="/tools"
            className={"m-item m-row" + (page === "calculator" ? " on" : "")}
            onClick={close}
          >
            Tax Calculator
          </a>
          <a
            href="/about"
            className={"m-item m-row" + (page === "about" ? " on" : "")}
            onClick={close}
          >
            About Us
          </a>
          <a
            href="/blog"
            className={
              "m-item m-row" +
              (page === "blog" || page === "article" ? " on" : "")
            }
            onClick={close}
          >
            Blog
          </a>
          <a
            className="m-item m-cta pill dark"
            href="/free-consultation"
            onClick={close}
          >
            Book Free Consultation <span className="arr">›</span>
          </a>
        </nav>
      </div>
    </header>
  );
}