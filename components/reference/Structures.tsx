const labels = [
  "Owners",
  "Responsibility",
  "Administration",
  "Future ownership",
  "Tax approach",
];
const structures: {
  name: string;
  say: string;
  values: string[];
  stat: [string, string];
}[] = [
  {
    name: "Sole proprietorship",
    say: "One person owns and runs the business. You and the business are legally the same.",
    values: [
      "One person",
      "You are personally responsible for the business's debts",
      "Simplest to run; renewals and tax filings still apply",
      "No shares to give to co-owners",
      "Fixed or turnover tax if you qualify; otherwise the individual business slabs",
    ],
    stat: ["1", "Owner, personally responsible"],
  },
  {
    name: "Partnership",
    say: "Two or more people own the business together under one agreement.",
    values: [
      "Two or more partners",
      "Partners are generally personally responsible for debts",
      "Partnership agreement, renewals and tax filings",
      "Adding or changing partners means changing the arrangements",
      "Depends on the entity rules and concessions that apply",
    ],
    stat: ["2+", "Partners, one agreement"],
  },
  {
    name: "Private limited",
    say: "A separate company owned by shareholders. It has its own records and legal identity.",
    values: [
      "One or more shareholders",
      "A separate company; shareholders generally have limited liability",
      "Company records, audit and annual filings",
      "Ownership is split into shares, so investors can join",
      "Generally 25% of taxable profit; exceptions apply",
    ],
    stat: ["25%", "General company rate on profit"],
  },
];

export function Structures() {
  return (
    <div
      className="rb-cmp"
      role="table"
      aria-label="Business structures comparison"
    >
      {structures.map((s) => (
        <article className="rb-col" role="rowgroup" key={s.name}>
          <div className="rb-band">
            <span className="rb-lab">{s.name}</span>
          </div>
          <h3 className="rb-say">{s.say}</h3>
          {labels.map((label, i) => (
            <dl className="rb-attr" role="row" key={label}>
              <dt>{label}</dt>
              <dd>{s.values[i]}</dd>
            </dl>
          ))}
          <div className="rb-stat">
            <b>{s.stat[0]}</b>
            <span className="rb-lab">{s.stat[1]}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
