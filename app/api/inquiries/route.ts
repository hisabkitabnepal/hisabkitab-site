import { isSameOrigin } from "@/lib/same-origin";
import { sendInquiryEmail } from "@/lib/inquiry-email";
import { inquirySchema } from "@/lib/inquiry-validation";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && !isSameOrigin(request)) return Response.json({ error: "Please submit your inquiry from this website." }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 10000) return Response.json({ error: "Please shorten your message and try again." }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return Response.json({ error: "Please check your inquiry and try again." }, { status: 400 }); }
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const v = parsed.data;
    const reference=`HK-${v.id.slice(0,8).toUpperCase()}`;
    await sendInquiryEmail(v,reference);
    return Response.json({ reference }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Inquiry email could not be submitted", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Your inquiry could not be sent right now. Your details are still here. Please try again, or email hisabkitabnepal@outlook.com." }, { status: 503 });
  }
}
