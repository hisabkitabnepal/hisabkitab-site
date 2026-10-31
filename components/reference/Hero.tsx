export function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1 data-split="">
          {"Fastest way to"}
          <br />
          {"set up and run"}
          <br />
          <span className="accent">{"your business"}</span>
        </h1>
        <p className="hero-p">
          {
            "Choose Hisab Kitab as your accounting partner to register faster and file with confidence. Register your company, set up your books, and stay compliant in minutes."
          }
        </p>
        <a className="pill dark magnet" href="/free-consultation">
          {"Register a Business "}
          <span className="arr">{"›"}</span>
        </a>
      </div>
      <div className="hero-right">
        <div className="setup" id="setup">
          <h3>{"Your company setup"}</h3>
          <div className="sub">{"Updates as each step clears"}</div>
          <div className="step done">
            <span className="chk">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path pathLength="1" d="M3.5 8.4l3 3 6-6.4"></path>
              </svg>
            </span>
            <span className="st-l">{"Company name approved"}</span>
            <span className="tag">{"Done"}</span>
          </div>
          <div className="step">
            <span className="chk">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path pathLength="1" d="M3.5 8.4l3 3 6-6.4"></path>
              </svg>
            </span>
            <span className="st-l">
              {"Registered with the Company Registrar"}
            </span>
            <span className="tag">{"Pending"}</span>
          </div>
          <div className="step">
            <span className="chk">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path pathLength="1" d="M3.5 8.4l3 3 6-6.4"></path>
              </svg>
            </span>
            <span className="st-l">{"PAN and VAT issued"}</span>
            <span className="tag">{"Pending"}</span>
          </div>
          <div className="step">
            <span className="chk">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path pathLength="1" d="M3.5 8.4l3 3 6-6.4"></path>
              </svg>
            </span>
            <span className="st-l">{"Books ready for filing"}</span>
            <span className="tag">{"Pending"}</span>
          </div>
          <div className="prog">
            <div className="prog-top">
              <span>{"Setup progress"}</span>
              <span id="pct">{"25%"}</span>
            </div>
            <div className="bar">
              <i id="barFill"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
