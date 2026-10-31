export function Trust() {
  return (
    <section className="trust" aria-label="Clients">
      <div className="trust-label">{"Trusted by over 10 companies"}</div>
      <div className="marquee">
        <div className="track" id="track">
          <img src="/logos/ambassador-designs.webp" alt="Ambassador Designs" width={316} height={120} />
          <img src="/logos/german-recruiting.webp" alt="GermanRecruiting" width={216} height={120} />
          <img src="/logos/mellow-bakeshop.webp" alt="Mellow Bakeshop" width={170} height={120} />
          <img src="/logos/stc.webp" alt="STC" width={113} height={120} />
        </div>
      </div>
    </section>
  );
}
