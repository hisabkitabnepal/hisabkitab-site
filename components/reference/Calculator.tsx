"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  estimateReferenceTax,
  formatReferenceNumber as fmt,
  parseReferenceNumber,
  type EstimateInput,
} from "@/lib/reference/calculator";
const initial: EstimateInput = {
  turnover: 4500000,
  profit: 1800000,
  structure: "company",
  period: 1,
  adjustment: 0,
};
function Highlight({
  selector,
  className,
}: {
  selector: string;
  className: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!,
      parent = el.parentElement!;
    function paint() {
      const active =
        parent.querySelector<HTMLInputElement>(selector)?.parentElement;
      if (active)
        Object.assign(el.style, {
          left: active.offsetLeft + "px",
          top: active.offsetTop + "px",
          width: active.offsetWidth + "px",
          height: active.offsetHeight + "px",
        });
    }
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(parent);
    parent.addEventListener("change", paint);
    return () => {
      observer.disconnect();
      parent.removeEventListener("change", paint);
    };
  }, [selector]);
  return <span className={className} ref={ref} />;
}
export function Calculator({ standalone = false }: { standalone?: boolean }) {
  const [turnover, setTurnover] = useState("45,00,000"),
    [profit, setProfit] = useState("18,00,000");
  const [structure, setStructure] =
      useState<EstimateInput["structure"]>("company"),
    [period, setPeriod] = useState<EstimateInput["period"]>(1),
    [adjustment, setAdjustment] = useState(0);
  const [errors, setErrors] = useState({ turnover: false, profit: "" });
  const [result, setResult] = useState(() => estimateReferenceTax(initial));
  const [countRequest, setCountRequest] = useState(0);
  const big = useRef<HTMLDivElement>(null),
    rows = useRef<HTMLDivElement>(null),
    section = useRef<HTMLElement>(null);
  const countTimeline = useRef<gsap.core.Timeline | null>(null);
  const resultRef = useRef(result);
  resultRef.current = result;
  const countUp = useRef(() => {});
  countUp.current = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    countTimeline.current?.kill();
    const count = { v: 0 },
      total = resultRef.current.total;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    countTimeline.current = tl;
    tl.to(
      count,
      {
        v: total,
        duration: 2.2,
        onUpdate: () => {
          if (big.current) big.current.textContent = "NPR " + fmt(count.v);
        },
        onComplete: () => {
          if (big.current) big.current.textContent = "NPR " + fmt(total);
        },
      },
      0,
    );
    resultRef.current.rows.forEach((row, i) => {
      const match = /^NPR ([\d,]+)$/.exec(row[1]);
      const el = rows.current?.children[i]?.children[1];
      if (!match || !el) return;
      const item = { v: 0 },
        to = Number(match[1].replace(/,/g, ""));
      el.textContent = "NPR 0";
      tl.to(
        item,
        {
          v: to,
          duration: 1.8,
          onUpdate: () => {
            el.textContent = "NPR " + fmt(item.v);
          },
          onComplete: () => {
            el.textContent = "NPR " + fmt(to);
          },
        },
        0.1 + i * 0.07,
      );
    });
  };
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: "top 62%",
      end: "bottom 25%",
      onEnter: () => countUp.current(),
      onEnterBack: () => countUp.current(),
    });
    return () => {
      trigger.kill();
      countTimeline.current?.kill();
    };
  }, []);
  useLayoutEffect(() => {
    // React may leave unchanged strings alone after GSAP has overwritten them.
    // Restore every amount after the new rows have committed, before restarting.
    if (big.current) big.current.textContent = "NPR " + fmt(result.total);
    result.rows.forEach(([, value], i) => {
      const el = rows.current?.children[i]?.children[1];
      if (el) el.textContent = value;
    });
  }, [result]);
  useLayoutEffect(() => {
    if (countRequest) countUp.current();
  }, [countRequest]);
  function calculate(overrides: Partial<EstimateInput> = {}, animate = true) {
    const t = parseReferenceNumber(turnover),
      p = parseReferenceNumber(profit);
    const invalidT = Number.isNaN(t),
      invalidP = Number.isNaN(p)
        ? "Enter your taxable profit as a number (0 if none)."
        : !invalidT && p > t
          ? "Profit cannot be higher than turnover."
          : "";
    setErrors({ turnover: invalidT, profit: invalidP });
    if (invalidT || invalidP) return;
    countTimeline.current?.kill();
    const next = estimateReferenceTax({
      turnover: t,
      profit: p,
      structure,
      period,
      adjustment,
      ...overrides,
    });
    setResult(next);
    if (animate) setCountRequest((n) => n + 1);
  }
  const input = (value: string) => {
    const raw = value.replace(/[^\d]/g, "");
    return raw ? fmt(parseInt(raw, 10)) : "";
  };
  const adjText =
    (adjustment > 0 ? "+" : adjustment < 0 ? "−" : "") +
    Math.abs(adjustment) +
    "%";
  return (
    <section
      className="calc-sec"
      id="calculator"
      aria-labelledby="calcTitle"
      ref={section}
    >
      <div className="sp-top cx-hero">
        <div className="sp-hero">
          <div className="sp-dots" aria-hidden="true" />
          <div className="sp-head">
            <h1>Know your tax before you file.</h1>
            <p className="sp-lead">
              Enter your annual figures and see an estimate with every step of
              the working, right on this page.
            </p>
            <div className="sp-cta">
              <a className="pill dark" href="/free-consultation">
                Book Free Consultation <span className="arr">›</span>
              </a>
              <a className="pill outline" href="/services">
                Our Services
              </a>
            </div>
          </div>
        </div>
        <div className="sp-stats">
          <div>
            <b>25%</b>
            <small>General company tax rate</small>
          </div>
          <div>
            <b>1–39%</b>
            <small>Sole proprietor slab rates</small>
          </div>
          <div>
            <b>2</b>
            <small>Business structures covered</small>
          </div>
          <div>
            <b>Free</b>
            <small>No sign-up needed</small>
          </div>
        </div>
      </div>
      <div className="services-head">
        <h2>Know your tax before you file</h2>
        <p>
          Enter your annual figures and see an estimate with every step of the
          working, right on this page.
        </p>
        <a
          className="link-maroon"
          id="calcMore"
          href="/tools"
          hidden={standalone}
        >
          Learn more <span className="arr">›</span>
        </a>
      </div>
      <form
        className="calc"
        id="calcForm"
        noValidate
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          calculate();
        }}
      >
        <div className="calc-grid" id="calcCard">
          <div className="panel result" id="result" aria-live="polite">
            <div className="lbl" id="resLbl">
              {result.label}
            </div>
            <div
              className="per-seg"
              role="radiogroup"
              aria-label="Show tax per"
            >
              <Highlight selector="input:checked" className="per-hl" />
              {([1, 4, 12] as const).map((p, i) => (
                <label className="per-opt" key={p}>
                  <input
                    type="radio"
                    name="period"
                    value={p}
                    checked={period === p}
                    onChange={() => {
                      setPeriod(p);
                      calculate({ period: p });
                    }}
                  />
                  <span>{["Per Year", "Per Quarter", "Per Month"][i]}</span>
                </label>
              ))}
            </div>
            <div className="figure">
              <div className="formula" id="resFormula">
                {result.formula}
              </div>
              <div className="big" id="resBig" ref={big}>
                NPR {fmt(result.total)}
              </div>
            </div>
            <div className="rows" id="resRows" ref={rows}>
              {result.rows.map(([label, value], i) => (
                <div key={label + "-" + i}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <p className="note">
              An estimate only. Concessions, credits, prior payments,
              carried-forward losses and special-sector rules are excluded. Not
              a final tax liability or a filing calculation.
            </p>
          </div>
          <div className="inputs">
            <h2 id="calcTitle" data-split="">
              Tax calculator
            </h2>
            <div className="seg-row">
              <div
                className="opts"
                role="radiogroup"
                aria-label="Business structure"
              >
                <Highlight selector="input:checked" className="opt-hl" />
                {(["sole", "company"] as const).map((s) => (
                  <label className="opt" key={s}>
                    <input
                      type="radio"
                      name="structure"
                      value={s}
                      checked={structure === s}
                      onChange={() => {
                        setStructure(s);
                        calculate({ structure: s });
                      }}
                    />
                    <span className="card">
                      {s === "sole" ? "Sole proprietorship" : "Company"}
                    </span>
                  </label>
                ))}
              </div>
              <p className="seg-hint" id="segHint">
                {structure === "sole"
                  ? "Registered business owned by an individual"
                  : "General company income-tax rate"}
              </p>
            </div>
            <div className={"field" + (errors.turnover ? " bad" : "")} id="f1">
              <label htmlFor="turnover">Annual turnover · NPR</label>
              <p className="help">Total business sales for the year.</p>
              <input
                id="turnover"
                inputMode="numeric"
                autoComplete="off"
                value={turnover}
                placeholder="45,00,000"
                aria-invalid={errors.turnover}
                aria-describedby={errors.turnover ? "turnoverErr" : undefined}
                onChange={(e) => {
                  setTurnover(input(e.target.value));
                  setErrors((v) => ({ ...v, turnover: false }));
                }}
              />
              <div className="err" id="turnoverErr">
                Enter your annual turnover as a number.
              </div>
            </div>
            <div className={"field" + (errors.profit ? " bad" : "")} id="f2">
              <label htmlFor="profit">
                Annual taxable business profit · NPR
              </label>
              <p className="help">
                Profit after tax adjustments, before income tax. Enter 0 if
                there is no taxable profit.
              </p>
              <input
                id="profit"
                inputMode="numeric"
                autoComplete="off"
                value={profit}
                placeholder="18,00,000"
                aria-invalid={!!errors.profit}
                aria-describedby={errors.profit ? "profitErr" : undefined}
                onChange={(e) => {
                  setProfit(input(e.target.value));
                  setErrors((v) => ({ ...v, profit: "" }));
                }}
              />
              <div className="err" id="profitErr">
                {errors.profit ||
                  "Enter your taxable profit as a number (0 if none)."}
              </div>
            </div>
            <div className="adj" id="adjBox">
              <div className="adj-top">
                <label htmlFor="adj">If turnover and profit change</label>
                <span
                  className={"adj-val" + (adjustment ? " on" : "")}
                  id="adjVal"
                >
                  {adjText}
                </span>
              </div>
              <input
                id="adj"
                type="range"
                min="-20"
                max="20"
                step="1"
                value={adjustment}
                aria-valuetext={adjText}
                style={
                  {
                    "--a": Math.min(50, ((adjustment + 20) / 40) * 100) + "%",
                    "--b": Math.max(50, ((adjustment + 20) / 40) * 100) + "%",
                  } as CSSProperties
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setAdjustment(value);
                  calculate({ adjustment: value }, false);
                }}
              />
              <div className="adj-ticks" aria-hidden="true">
                <span>−20%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>
            <button className="pill dark" type="submit">
              Calculate estimate
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
