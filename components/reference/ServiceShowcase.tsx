import { referenceServices } from "@/lib/reference/services";
import { ShowcaseCard } from "./ServiceRow";
export function ServiceShowcase() {
  return (
    <section className="services" id="services">
      <div className="services-head">
        <h2 data-split="">
          {"Everything you need to simplify business accounting"}
        </h2>
        <p data-reveal="">
          {
            "From the first registration to the final clearance, we handle the paperwork and tell you what matters."
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
