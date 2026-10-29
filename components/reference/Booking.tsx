"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { inquirySchema } from "@/lib/inquiry-validation";
import {
  buildReferenceInquiry,
  sendReferenceInquiry,
  deliveryUnavailable,
  resolveReferenceBookingQuery,
  type ReferenceBookingFields,
} from "@/lib/reference/booking";
export function Booking({
  selection = resolveReferenceBookingQuery(),
}: {
  selection?: ReturnType<typeof resolveReferenceBookingQuery>;
}) {
  const [fields, setFields] = useState<ReferenceBookingFields>({
    name: "",
    phone: "",
    email: "",
    businessType: "",
    owners: "",
    business: "",
    location: "",
    message: selection.context,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState({ text: "", bad: false });
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null),
    id = useRef<string | null>(null),
    pending = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/inquiries/config", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((config) => {
        if (!config.enabled)
          setMessage({ text: deliveryUnavailable, bad: true });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setMessage({ text: deliveryUnavailable, bad: true });
      });
    return () => controller.abort();
  }, []);
  function clearError(e: FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (name) setErrors((current) => ({ ...current, [name]: "" }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pending.current) return;
    const invalid: Record<string, string> = {};
    if (fields.name.trim().length < 2)
      invalid.name = "Please provide your full name.";
    if (!/^\+?[\d\s-]{7,16}$/.test(fields.phone.trim()))
      invalid.phone = "Enter a valid phone number.";
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      invalid.email = "Enter a valid email address.";
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      setMessage({ text: "Please check the highlighted fields.", bad: true });
      formRef.current
        ?.querySelector<HTMLInputElement>(
          '[name="' + Object.keys(invalid)[0] + '"]',
        )
        ?.focus();
      return;
    }
    try {
      if (!id.current) id.current = crypto.randomUUID();
      const payload = buildReferenceInquiry(fields, id.current, selection),
        parsed = inquirySchema.safeParse(payload);
      if (!parsed.success) {
        setMessage({ text: parsed.error.issues[0].message, bad: true });
        return;
      }
      pending.current = true;
      setSending(true);
      const reference = await sendReferenceInquiry(payload);
      setMessage({
        text:
          "Thank you. Your inquiry has been sent. Reference: " +
          reference +
          ".",
        bad: false,
      });
      id.current = null;
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : deliveryUnavailable,
        bad: true,
      });
    } finally {
      pending.current = false;
      setSending(false);
    }
  }
  return (
    <section className="pg" id="pg-book">
      <div className="bk-grid">
        <div className="bk-intro">
          <h1>{"Get in touch with us"}</h1>
          <p>
            {
              "Tell us what you are planning. We will suggest the right structure and come back with a clear next step. You can also email us at "
            }
            <a className="u" href="mailto:hisabkitabnepal@outlook.com">
              {"hisabkitabnepal@outlook.com"}
            </a>
            {" or message us on "}
            <a
              className="u"
              href="https://wa.me/9779747857130"
              target="_blank"
              rel="noopener"
            >
              {"WhatsApp"}
            </a>
            {"."}
          </p>
        </div>
        <form
          id="bkForm"
          noValidate
          onSubmit={submit}
          onInput={clearError}
          ref={formRef}
        >
          <div className="two">
            <div className={"field" + (errors.name ? " bad" : "")} id="f-bName">
              <label htmlFor="bName">
                {"Full name "}
                <span className="req">{"*"}</span>
              </label>
              <input
                maxLength={100}
                id="bName"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
                name="name"
                value={fields.name}
                onChange={(e) =>
                  setFields((current) => ({ ...current, name: e.target.value }))
                }
                autoComplete="name"
                placeholder="Your full name"
              />
              <div className="err" id="error-name">
                {errors.name || "Enter your name."}
              </div>
            </div>
            <div
              className={"field" + (errors.phone ? " bad" : "")}
              id="f-bPhone"
            >
              <label htmlFor="bPhone">
                {"Phone or WhatsApp "}
                <span className="req">{"*"}</span>
              </label>
              <input
                maxLength={30}
                id="bPhone"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                name="phone"
                value={fields.phone}
                onChange={(e) =>
                  setFields((current) => ({
                    ...current,
                    phone: e.target.value,
                  }))
                }
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98XXXXXXXX"
              />
              <div className="err" id="error-phone">
                {errors.phone || "Enter a valid phone number."}
              </div>
            </div>
          </div>
          <div className={"field" + (errors.email ? " bad" : "")} id="f-bEmail">
            <label htmlFor="bEmail">
              {"Email "}
              <span className="opt-t">{"· optional"}</span>
            </label>
            <input
              maxLength={254}
              id="bEmail"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              name="email"
              value={fields.email}
              onChange={(e) =>
                setFields((current) => ({ ...current, email: e.target.value }))
              }
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
            <div className="err" id="error-email">
              {errors.email || "Enter a valid email address."}
            </div>
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="bType">{"Business type"}</label>
              <select
                id="bType"
                name="businessType"
                value={fields.businessType}
                onChange={(e) =>
                  setFields((current) => ({
                    ...current,
                    businessType: e.target.value,
                  }))
                }
                required
              >
                <option value="" disabled hidden>
                  {"Select"}
                </option>
                <option>{"Sole proprietorship"}</option>
                <option>{"Partnership"}</option>
                <option>{"Private limited company"}</option>
                <option>{"Organization or nonprofit"}</option>
                <option>{"Joint venture / foreign participation"}</option>
                <option>{"Not sure yet"}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="bOwners">{"Number of owners"}</label>
              <select
                id="bOwners"
                name="owners"
                value={fields.owners}
                onChange={(e) =>
                  setFields((current) => ({
                    ...current,
                    owners: e.target.value,
                  }))
                }
                required
              >
                <option value="" disabled hidden>
                  {"Select"}
                </option>
                <option>{"Just me"}</option>
                <option>{"Two or more"}</option>
              </select>
            </div>
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="bBiz">
                {"Proposed business name "}
                <span className="opt-t">{"· optional"}</span>
              </label>
              <input
                maxLength={160}
                id="bBiz"
                name="business"
                value={fields.business}
                onChange={(e) =>
                  setFields((current) => ({
                    ...current,
                    business: e.target.value,
                  }))
                }
                placeholder="If you have one in mind"
              />
            </div>
            <div className="field">
              <label htmlFor="bLoc">
                {"Business location "}
                <span className="opt-t">{"· optional"}</span>
              </label>
              <input
                maxLength={200}
                id="bLoc"
                name="location"
                value={fields.location}
                onChange={(e) =>
                  setFields((current) => ({
                    ...current,
                    location: e.target.value,
                  }))
                }
                placeholder="Municipality, district"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="bMsg">
              {"Message "}
              <span className="opt-t">{"· optional"}</span>
            </label>
            <textarea
              maxLength={3000}
              id="bMsg"
              name="message"
              value={fields.message}
              onChange={(e) =>
                setFields((current) => ({
                  ...current,
                  message: e.target.value,
                }))
              }
              placeholder="What the business will do, timelines, anything else"
            ></textarea>
          </div>
          <label className="bk-consent">
            <input
              type="checkbox"
              name="consent"
              checked={fields.consent}
              onChange={(e) =>
                setFields((current) => ({
                  ...current,
                  consent: e.target.checked,
                }))
              }
              required
              aria-describedby="bkMsg"
            />{" "}
            <span>
              I agree to be contacted about my inquiry.{" "}
              <a href="/privacy">Privacy policy</a>
            </span>
          </label>
          <button className="bk-btn" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Book a Call"}
          </button>
          <div
            className={"form-msg" + (message.bad ? " bad" : "")}
            id="bkMsg"
            role="status"
          >
            {message.text}
          </div>
        </form>
      </div>
    </section>
  );
}
