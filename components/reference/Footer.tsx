export function Footer() {
  return (
    <footer className="site-foot">
      <div className="foot-grid">
        <div className="foot-brand">
          <a className="logo" href="/" aria-label="Hisab Kitab home">
            <img
              className="logo-mark"
              src="/reference/hk-emblem.webp"
              alt=""
              width={40}
              height={40}
            />
            <span className="logo-word">Hisab Kitab</span>
          </a>
          <p className="foot-tag">{"Financial & Tax Consultants"}</p>
          <p className="foot-about">
            {
              "Registration, accounts, tax and business closure. Clear guidance for your next step."
            }
          </p>
          <p className="foot-loc">{"Samakhusi, Kathmandu, Nepal"}</p>
        </div>
        <nav aria-label="Footer">
          <h3 className="foot-h">{"Explore"}</h3>
          <ul className="foot-list">
            <li>
              <a href="/register-business">{"Register a business"}</a>
            </li>
            <li>
              <a href="/services">{"Services"}</a>
            </li>
            <li>
              <a href="/tools">{"Tax calculator"}</a>
            </li>
            <li>
              <a href="/about">{"About us"}</a>
            </li>
            <li>
              <a href="/blog">{"Blog"}</a>
            </li>
          </ul>
        </nav>
        <div>
          <h3 className="foot-h">{"Let’s talk"}</h3>
          <ul className="foot-list">
            <li>
              <a href="tel:+9779747857130">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4.5 3h3l1.4 3.6-1.8 1.3a9 9 0 004 4l1.3-1.8 3.6 1.4v3a1.5 1.5 0 01-1.6 1.5A12.5 12.5 0 013 4.6 1.5 1.5 0 014.5 3z"></path>
                </svg>
                {"+977 974 785 7130"}
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/9779747857130"
                target="_blank"
                rel="noopener"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 2.5a7.5 7.5 0 00-6.4 11.4L2.5 17.5l3.7-1a7.5 7.5 0 104-14z"></path>
                </svg>
                {"WhatsApp"}
              </a>
            </li>
            <li>
              <a href="mailto:hisabkitabnepal@outlook.com">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <rect x="2.5" y="4.5" width="15" height="11" rx="2"></rect>
                  <path d="M3 6l7 5 7-5"></path>
                </svg>
                {"hisabkitabnepal@outlook.com"}
              </a>
            </li>
            <li>
              <a href="/free-consultation">{"Free first consultation"}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-bar">
        <span>{"© 2026 Hisab Kitab"}</span>
        <span>{"Financial & Tax Consultants"}</span>
      </div>
    </footer>
  );
}
