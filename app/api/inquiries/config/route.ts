export function GET() {
  return Response.json({ enabled: Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_FROM_EMAIL) }, { headers: { "Cache-Control": "no-store" } });
}
