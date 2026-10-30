import { referenceServices } from "@/lib/reference/services";
import { ShowcaseCard } from "./ServiceRow";
export function ServiceShowcase() {
  return (
    <section className="services" id="services">
      <div className="services-head">
        <h2 data-split="">
          {"Your Complete Financial Partner in Business."}
        </h2>
        <p data-reveal="">
          {
            "Understand Your Numbers. Make Better Business Decisions. Your financial numbers tell a story about your business. We help you understand that story through financial analysis, accounting, taxation and practical business advice."
          }
        </p>
        <a className="link-maroon" href="/free-consultation" data-reveal="">
          {"Learn more "}
          <span className="arr">{"›"}</span>
        </a>
      </div>
      <div className="sx">
        <div className="sx-l">
          <div className="sx-eb">
            <i></i>
            {"OUR SERVICES"}
          </div>
          <div className="sx-list">
            {referenceServices.map((service) => (
              <button className="sx-t" type="button" key={service.title}>
                {service.title}
              </button>
            ))}
          </div>
        </div>
        <div className="sx-r">
          {referenceServices.map((service, index) => (
            <ShowcaseCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
