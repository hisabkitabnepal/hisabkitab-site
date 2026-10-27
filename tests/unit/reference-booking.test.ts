import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReferenceInquiry,
  sendReferenceInquiry,
  resolveReferenceBookingQuery,
} from "../../lib/reference/booking.ts";
import { inquirySchema } from "../../lib/inquiry-validation.ts";
const fields = {
  name: "Test Person",
  phone: "9800000000",
  email: "",
  businessType: "Private limited company",
  owners: "Two or more",
  business: "Example",
  location: "Kathmandu",
  message: "Please explain registration.",
  consent: true,
};
const id = "12345678-1234-4234-9234-123456789012";
test("booking maps preview fields to existing API without losing details", () => {
  const payload = buildReferenceInquiry(fields, id);
  assert.ok(inquirySchema.safeParse(payload).success);
  assert.match(payload.message, /Private limited company/);
  assert.match(payload.message, /Two or more/);
  assert.match(payload.message, /Kathmandu/);
});
test("booking never infers consent", () => {
  assert.throws(
    () => buildReferenceInquiry({ ...fields, consent: false }, id),
    /agree/,
  );
});
test("booking preserves legacy plan, service and editable context selections", () => {
  for (const plan of ["essentials", "growth"]) {
    const selection = resolveReferenceBookingQuery({ plan, context: "Please review my accounts." });
    const payload = buildReferenceInquiry({ ...fields, message: selection.context }, id, selection);
    assert.equal(payload.service, "accounting");
    assert.equal(payload.stage, "running");
    assert.equal(payload.plan, plan);
    assert.match(payload.message, /Please review my accounts\./);
    assert.ok(inquirySchema.safeParse(payload).success);
  }
  for (const [service, stage] of [["registration", "starting"], ["closure", "closing"], ["audit", "reviewing"], ["tax", "running"], ["reporting", "running"]]) {
    const payload = buildReferenceInquiry(fields, id, { service, plan: "growth" });
    assert.equal(payload.service, service);
    assert.equal(payload.stage, stage);
    assert.equal(payload.plan, "not-sure");
  }
  assert.equal(buildReferenceInquiry(fields, id, { service: "accounting", plan: "custom" }).plan, "custom");
});
test("booking rejects unknown query selections and never defaults to registration", () => {
  for (const service of [undefined, "constructor", "__proto__", "toString", ["tax", "audit"]]) {
    const payload = buildReferenceInquiry(fields, id, { service, plan: "constructor" });
    assert.equal(payload.service, "not-sure");
    assert.equal(payload.stage, "running");
    assert.equal(payload.plan, "not-sure");
  }
  assert.equal(resolveReferenceBookingQuery({ context: ["one", "two"] }).context, "");
  assert.equal(resolveReferenceBookingQuery({ context: "a".repeat(4000) }).context.length, 3000);
  assert.throws(() => buildReferenceInquiry({ ...fields, consent: false }, id, { service: "tax", consent: "true" }), /agree/);
});
test("unconfigured delivery cannot POST or fabricate success", async () => {
  const calls: string[] = [];
  const fetcher: typeof fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify({ enabled: false }), { status: 200 });
  };
  await assert.rejects(
    () => sendReferenceInquiry(buildReferenceInquiry(fields, id), fetcher),
    /unavailable/,
  );
  assert.deepEqual(calls, ["/api/inquiries/config"]);
});
test("HTTP success without delivery reference is not presented as success", async () => {
  const fetcher: typeof fetch = async (url) =>
    new Response(
      JSON.stringify(String(url).endsWith("config") ? { enabled: true } : {}),
      { status: 200 },
    );
  await assert.rejects(
    () => sendReferenceInquiry(buildReferenceInquiry(fields, id), fetcher),
    /could not be sent/,
  );
});
