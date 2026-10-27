import { referenceServices } from "@/lib/reference/services";
import { ServiceMock } from "./ServiceMock";
type Props = { service: (typeof referenceServices)[number]; index: number };
export function ShowcaseCard({ service, index }: Props) {
  return (
    <article className="sx-p" id={`services-${index + 1}`}>
      <div className="sx-v">
        <ServiceMock index={index} />
      </div>
      <span className="ti">{service.title}</span>
      <h4>{service.headline}</h4>
      <p>{service.summary}</p>
      <div className="act">
        <a className="pill dark" href="/free-consultation">
          Book this service
        </a>
      </div>
    </article>
  );
}
export function ServiceRow({ service, index }: Props) {
  return (
    <article className="sp-row" id={`svp-${index + 1}`}>
      <div className="sx-v">
        <ServiceMock index={index} />
      </div>
      <div className="sp-c">
        <h3 className="sp-t">{service.title}</h3>
        <p className="sp-s">{service.subtitle}</p>
        <p className="sp-d">{service.description}</p>
        <p className="sp-f">{service.fee}</p>
        <div className="sp-a">
          <a className="pill dark" href="/free-consultation">
            Book this service
          </a>
        </div>
      </div>
    </article>
  );
}
