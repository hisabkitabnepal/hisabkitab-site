"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { questions } from "@/lib/reference/faq";
function Item({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null),
    previousOpen = useRef<boolean | null>(null);
  const context = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, ref);
    context.current = ctx;
    return () => {
      ctx.revert();
      context.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    const body = ref.current!;
    const instant =
      previousOpen.current === null || previousOpen.current === open;
    previousOpen.current = open;
    const tweens: gsap.core.Tween[] = [];
    context.current!.add(() => {
      if (instant) {
        gsap.set(body, { height: open ? "auto" : 0 });
        return;
      }
      tweens.push(
        gsap.to(body, {
          height: open ? "auto" : 0,
          duration: 0.55,
          ease: "power3.inOut",
          overwrite: true,
        }),
      );
      if (open)
        tweens.push(
          gsap.fromTo(
            body.firstElementChild,
            { y: -10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.out" },
          ),
        );
    });
    // Toggle replacement keeps the current height; only unmount reverts styles.
    return () => tweens.forEach((tween) => tween.kill());
  }, [open]);
  return (
    <div className={"acc" + (open ? " open" : "")}>
      <button
        className="acc-head"
        aria-expanded={open}
        aria-controls={"faq-answer-" + index}
        onClick={onToggle}
      >
        <span className="acc-title">{question}</span>
        <span className="acc-state" aria-hidden="true" />
      </button>
      <div className="acc-body" id={"faq-answer-" + index} ref={ref}>
        <div className="acc-inner">{answer}</div>
      </div>
    </div>
  );
}
type QA = { question: string; answer: string };

export function Faq({
  items = questions,
  heading = "Questions we hear the most",
  intro = "From the first registration to the final clearance, we handle the paperwork and tell you what matters.",
  className,
}: {
  items?: QA[];
  heading?: string;
  intro?: string;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section className={"faq" + (className ? " " + className : "")} id="faq">
      <div className="l">
        <h2 data-split="">{heading}</h2>
        <p data-reveal="">{intro}</p>
        <p data-reveal="">
          Not here? Call <a href="tel:+9779747857130">+977 974 785 7130</a>.
        </p>
      </div>
      <div className="r acc-group" data-single="">
        {items.map((q, i) => (
          <Item
            key={q.question}
            {...q}
            index={i}
            open={active === i}
            onToggle={() => setActive(active === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
