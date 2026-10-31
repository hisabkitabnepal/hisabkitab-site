export function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-in">
        <div className="topbar-g">
          <a href="tel:+9779747857130">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {"+977 974 785 7130"}
          </a>
          <span className="tb topbar-addr">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {"Samakhusi, Kathmandu"}
          </span>
        </div>
        <div className="topbar-g">
          <a href="https://wa.me/9779747857130" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
            {"WhatsApp"}
          </a>
          <a className="topbar-mail" href="mailto:hisabkitabnepal@outlook.com">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            {"hisabkitabnepal@outlook.com"}
          </a>
        </div>
      </div>
    </div>
  );
}
