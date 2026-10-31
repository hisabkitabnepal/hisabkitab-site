import { plans } from "../plans.ts";
import { services } from "../services.ts";

export function resolveReferenceBookingQuery(
  query: Record<string, unknown> = {},
) {
  const service =
    services.find((item) => item.id === query.service)?.id ??
    (query.plan === "essentials" || query.plan === "growth"
      ? "accounting"
      : "not-sure");
  const plan =
    service === "accounting"
      ? (plans.find((item) => item.id === query.plan)?.id ?? "not-sure")
      : "not-sure";
  return {
    service,
    plan,
    context:
      typeof query.context === "string" ? query.context.slice(0, 3000) : "",
  };
}

export type ReferenceBookingFields = {
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
export const deliveryUnavailable =
  "Online booking is currently unavailable. Your details are still here. Please call +977 974 785 7130 or email hisabkitabnepal@outlook.com.";
export function buildReferenceInquiry(
  fields: ReferenceBookingFields,
  id: string,
  query: Record<string, unknown> = {},
) {
  if (!fields.consent)
    throw new Error("Please agree to be contacted about your inquiry.");
  const { service, plan } = resolveReferenceBookingQuery(query);
  return {
    id,
    name: fields.name.trim(),
    phone: fields.phone.trim(),
    email: fields.email.trim(),
    business: fields.business.trim(),
    service,
    stage:
      service === "registration"
        ? "starting"
        : service === "closure"
          ? "closing"
          : service === "audit"
            ? "reviewing"
            : "running",
    plan,
    website: "",
    consent: true as const,
    message: [
      fields.message.trim(),
      fields.businessType && "Business type: " + fields.businessType,
      fields.owners && "Number of owners: " + fields.owners,
      fields.location.trim() && "Business location: " + fields.location.trim(),
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}
export async function sendReferenceInquiry(
  payload: ReturnType<typeof buildReferenceInquiry>,
  fetcher: typeof fetch = fetch,
) {
  const config = await fetcher("/api/inquiries/config", { cache: "no-store" });
  if (!config.ok || (await config.json()).enabled !== true)
    throw new Error(deliveryUnavailable);
  const response = await fetcher("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (
    !response.ok ||
    typeof data.reference !== "string" ||
    !/^HK-[A-F\d]{8}$/.test(data.reference)
  )
    throw new Error(
      data.error ||
        "Your inquiry could not be sent right now. Your details are still here. Please try again, or email hisabkitabnepal@outlook.com.",
    );
  return data.reference as string;
}
