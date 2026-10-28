"use client";
import { usePathname } from "next/navigation";
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
  const page = referencePageFromPath(usePathname());
  return (
    <header className="nav" id="nav">
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
        <a className="pill outline magnet" href="/free-consultation">
          Book Free Consultation <span className="arr">›</span>
        </a>
      </div>
    </header>
  );
}
