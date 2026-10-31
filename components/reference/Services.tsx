import { referenceServices } from "@/lib/reference/services";
import { ServiceRow } from "./ServiceRow";
export function Services() {
  return (
    <section className="pg sp-page" id="pg-services">
      <div className="sp-top">
        <div className="sp-hero">
          <div className="sp-dots" aria-hidden="true"></div>
          <div className="sp-head">
            <h1>{"Services for every stage of your business."}</h1>
            <p className="sp-lead">
              {
                "Start with a free consultation. We handle the paperwork and explain what matters, so you always know your next step."
              }
            </p>
            <div className="sp-cta">
              <a className="pill dark" href="/free-consultation">
                {"Book Free Consultation "}
                <span className="arr">{"›"}</span>
              </a>
              <a className="pill outline" href="#svp-1">
                {"Our Services"}
              </a>
            </div>
          </div>
        </div>
        <div className="sp-stats">
          <div>
            <b data-count="10" data-suffix="+">
              {"10+"}
            </b>
            <small>{"Companies supported"}</small>
          </div>
          <div>
            <b>{"Free"}</b>
            <small>{"First consultation"}</small>
          </div>
          <div>
            <b>{"6"}</b>
            <small>{"Services, one team"}</small>
          </div>
          <div>
            <b>{"NPR 6,000"}</b>
            <small>{"Monthly plans from"}</small>
          </div>
        </div>
      </div>
      <div className="sp-list">
        {referenceServices.map((service, index) => (
          <ServiceRow key={service.title} service={service} index={index} />
        ))}
      </div>
      <p className="sp-note">
        {
          "Monthly prices include VAT. Government fees, taxes, penalties and other statutory payments are separate, and any additional work is itemized in your quote."
        }
      </p>
    </section>
  );
}