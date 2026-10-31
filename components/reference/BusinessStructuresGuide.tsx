import { Structures } from "./Structures";
import { TaxSlabs } from "./TaxSlabs";
import { Faq } from "./Faq";
import { faqs, reviewed, sources, taxYear } from "@/lib/reference/business-structures.ts";

export function BusinessStructuresGuide() {
  return (
    <article className="pg ab-page rb-page" id="pg-register">
      <div className="abx-hero">
        <div className="abx-dots" aria-hidden="true" />
        <div className="abx-hero-row">
          <h1 className="ab-h1 abx-h1">{"How to register a business in Nepal"}</h1>
          <div className="abx-side">
            <p>
              {
                "Compare sole proprietorship, partnership and private limited company, check the " +
                  taxYear +
                  " tax slabs, and register with Hisab Kitab in Kathmandu."
              }
            </p>
            <div className="abx-cta">
              <a
                className="pill light magnet"
                href="/free-consultation?service=registration"
              >
                {"Book Free Consultation"}
              </a>
              <span className="abx-trust">{"Free first consultation"}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="rb-sec" id="compare">
        <div className="rb-sech">
          <h2>{"Business structures in Nepal, compared."}</h2>
          <p className="rb-lab">
            {
              "Owners, liability, administration, future ownership and tax, side by side."
            }
          </p>
        </div>
        <Structures />
      </section>

      <section className="rb-sec rb-band-sec" id="tax-difference">
        <div className="rb-sech">
          <h2>{"Sole proprietor tax in Nepal, " + taxYear + "."}</h2>
          <div className="rb-zero" aria-hidden="true">
            <b>0%</b>
            <span className="rb-lab">
              {"on the first NPR 10 lakh of profit for a sole proprietor, meaning one person running a business"}
            </span>
          </div>
        </div>
        <TaxSlabs />
        <div className="rb-actions">
          <a className="pill dark" href="/tools">
            Open the tax calculator <span className="arr">›</span>
          </a>
          <a
            className="pill outline"
            href="/free-consultation?service=registration"
          >
            Book a free consultation
          </a>
        </div>
      </section>

      <Faq
        items={faqs}
        heading="Registering a business in Nepal: your questions answered."
        intro={
          "Choosing between a sole proprietorship, partnership and private limited company, and how the " +
          taxYear +
          " tax slabs apply."
        }
      />
      <section className="rb-end">
        <div className="rb-foot" id="sources">
          <div className="rb-note">
            <h3>Official guidance and scope</h3>
            <p>
              {"Reviewed " +
                reviewed +
                ". This guide helps prepare for a consultation; it is not a final legal or tax determination. Requirements and rates can change."}
            </p>
          </div>
          <div className="rb-src">
            <ul>
              {sources.map(([label, url]) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}
