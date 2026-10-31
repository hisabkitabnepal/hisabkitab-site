"use client";
import { useRef, useState, type FormEvent } from "react";
import { whatsapp } from "@/lib/business";
import { services } from "@/lib/services";
import { plans } from "@/lib/plans";
import { resolveReferenceBookingQuery } from "@/lib/reference/booking";

type Fields = {
  name: string;
  phone: string;
  email: string;
  businessType: string;
  owners: string;
  business: string;
  location: string;
  message: string;
  consent: boolean;
};

/** Compiles every filled-in field into one readable WhatsApp message. */
function buildWhatsappMessage(
  f: Fields,
  selection: ReturnType<typeof resolveReferenceBookingQuery>,
) {
  const service = services.find((s) => s.id === selection.service)?.title;
  const plan =
    selection.service === "accounting"
      ? plans.find((p) => p.id === selection.plan)?.name
      : undefined;
  const line = (label: string, value?: string) =>
    value && value.trim() ? label + ": " + value.trim() : null;
  const msg = f.message.trim();
  const lines: (string | null)[] = [
    "Hello Hisab Kitab, I would like to book a free consultation call.",
    "",
    line("Name", f.name),
    line("Phone/WhatsApp", f.phone),
    line("Email", f.email),
    line("Service", service),
    line("Plan", plan),
    line("Business type", f.businessType),
    line("Number of owners", f.owners),
    line("Proposed business name", f.business),
    line("Business location", f.location),
    msg ? "" : null,
    msg ? "Message: " + msg : null,
    "",
    "I agree to be contacted about this inquiry.",
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

export function Booking({
  selection = resolveReferenceBookingQuery(),
}: {
  selection?: ReturnType<typeof resolveReferenceBookingQuery>;
}) {
  const [fields, setFields] = useState<Fields>({
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
  const [link, setLink] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function clearError(e: FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (name) setErrors((current) => ({ ...current, [name]: "" }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setLink("");
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
    if (!fields.consent) {
      setMessage({
        text: "Please agree to be contacted about your inquiry.",
        bad: true,
      });
      return;
    }
    const form = formRef.current;
    const pick = (n: string) =>
      (form?.elements.namedItem(n) as HTMLSelectElement | null)?.value ?? "";
    const url = whatsapp(
      buildWhatsappMessage(
        {
          ...fields,
          businessType: pick("businessType"),
          owners: pick("owners"),
        },
        selection,
      ),
    );
    setLink(url);
    // Opened synchronously inside the click handler so mobile browsers don't block it.
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    setMessage({
      text: opened
        ? "WhatsApp is opening with your details filled in. Review the message and tap Send."
        : "Your message is ready.",
      bad: false,
    });
  }

  const set =
    (key: keyof Fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const value = e.target.value;
      setFields((current) => ({ ...current, [key]: value }));
    };

  return (
    <section className="pg" id="pg-book">
      <div className="bk-grid">
        <div className="bk-intro">
          <h1>{"Get in touch with us"}</h1>
          <p>
            {
              "Tell us what you are planning. We will suggest the right structure and come back with a clear next step. Your details are sent to us on WhatsApp. You can also email us at "
            }
            <a className="u" href="mailto:hisabkitabnepal@outlook.com">
              {"hisabkitabnepal@outlook.com"}
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
                onChange={set("name")}
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
                onChange={set("phone")}
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
              onChange={set("email")}
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
                defaultValue=""
              >
                <option value="">{"Select"}</option>
                {[
                  "Sole proprietorship",
                  "Partnership",
                  "Private limited company",
                  "Organization or nonprofit",
                  "Joint venture / foreign participation",
                  "Not sure yet",
                ].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="bOwners">{"Number of owners"}</label>
              <select
                id="bOwners"
                name="owners"
                defaultValue=""
              >
                <option value="">{"Select"}</option>
                {["Just me", "Two or more"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
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
                onChange={set("business")}
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
                onChange={set("location")}
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
              maxLength={1500}
              id="bMsg"
              name="message"
              value={fields.message}
              onChange={set("message")}
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
              <a href="/terms-and-privacy#privacy">Privacy policy</a>
            </span>
          </label>
          <button className="bk-btn" type="submit">
            {"Book a Call"}
          </button>
          <div
            className={"form-msg" + (message.bad ? " bad" : "")}
            id="bkMsg"
            role="status"
          >
            {message.text}
            {link && (
              <>
                {" "}
                <a
                  className="u"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Didn’t open? Tap here to continue on WhatsApp."}
                </a>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}