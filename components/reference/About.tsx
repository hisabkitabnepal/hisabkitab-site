export function About() {
  return (
    <section className="pg ab-page" id="pg-about">
      <div className="abx-hero">
        <div className="abx-dots" aria-hidden="true" />
        <div className="abx-hero-row">
          <h1 className="ab-h1 abx-h1">
            {"A business has enough moving parts."}
          </h1>
          <div className="abx-side">
            <p>
              {
                "We bring them into focus, from the everyday details to the bigger decisions."
              }
            </p>
            <div className="abx-cta">
              <a className="pill light magnet" href="/free-consultation">
                {"Book Free Consultation"}
              </a>
              <span className="abx-trust">{"Trusted by 10+ companies"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="abx-intro">
        <h2>{"How we help your business"}</h2>
        <div className="abx-intro-r">
          <p>
            {
              "Sales, expenses, documents and deadlines can pull your attention in different directions. We help you understand the work your business needs, from registration and monthly accounts to tax filings and audit support."
            }
          </p>
          <p>
            {
              "Hisab Kitab is a financial and tax consultancy based in Samakhusi, Kathmandu. You run the business. We handle the details and agree practical next steps with you."
            }
          </p>
        </div>
      </div>

      <div className="abx-stats">
        <div className="abx-stat">
          <b data-count="10" data-suffix="+">
            {"10+"}
          </b>
          <small>{"Companies supported"}</small>
        </div>
        <div className="abx-stat">
          <b>{"Free"}</b>
          <small>{"First consultation"}</small>
        </div>
        <div className="abx-stat">
          <b>{"Samakhusi"}</b>
          <small>{"Our office in Kathmandu"}</small>
        </div>
      </div>

      <div className="abx-how">
        <div className="abx-how-h">
          <h2>{"From records to next steps"}</h2>
          <p>{"Four parts of the work, brought together in one place."}</p>
        </div>
        <div className="abx-cards">
          <article className="abx-card">
            <div>
              <span className="abx-ic">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 2.5h6l2.5 2.5v8.5H4z" />
                  <path d="M6.5 8h4M6.5 10.5h4" />
                </svg>
              </span>
              <h3>{"Understand the work"}</h3>
            </div>
            <p>
              {
                "Registration requirements, accounts and supporting records, and the tax and filing duties your business carries."
              }
            </p>
          </article>
          <article className="abx-card">
            <div>
              <span className="abx-ic">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2.5 13V8M6.8 13V4M11.2 13V9M14 13H2" />
                </svg>
              </span>
              <h3>{"Organize the accounts"}</h3>
            </div>
            <p>
              {
                "Prepare the documents, keep monthly accounts and reports, and handle registration and closure."
              }
            </p>
          </article>
          <article className="abx-card">
            <div>
              <span className="abx-ic">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8.5l3.2 3.2L13 4.8" />
                </svg>
              </span>
              <h3>{"File with confidence"}</h3>
            </div>
            <p>
              {
                "Coordinate tax and other filings, and help your appointed auditor with reports and schedules."
              }
            </p>
          </article>
          <article className="abx-card">
            <div>
              <span className="abx-ic">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" />
                </svg>
              </span>
              <h3>{"Know your next step"}</h3>
            </div>
            <p>
              {
                "Understand cash, costs and margins, spot what needs attention and agree practical next steps."
              }
            </p>
          </article>
        </div>
      </div>

      <div className="abx-wall" aria-label="Clients">
        <p>{"Trusted by over 10 companies"}</p>
        <div className="abx-logos">
          <div className="abx-logo">{"Trumark Agency"}</div>
          <div className="abx-logo">{"Eruchi"}</div>
          <div className="abx-logo">{"Himalayan Java"}</div>
          <div className="abx-logo">{"Sisha Trading Concern"}</div>
        </div>
      </div>
    </section>
  );
}