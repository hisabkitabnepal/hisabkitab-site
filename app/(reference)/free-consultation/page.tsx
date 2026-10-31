import { resolveReferenceBookingQuery } from "@/lib/reference/booking";
import { ReferenceLayout } from "@/components/reference/Page";
import { Booking } from "@/components/reference/Booking";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Free Accounting & Registration Consultation",
  "Book a free first consultation. Tell us your plans and get a clear next step on registration, accounting or tax. Call, WhatsApp or use the form.",
  "/free-consultation",
);
type QueryProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
async function QueryBooking({ searchParams }: QueryProps) {
  const selection = resolveReferenceBookingQuery(await searchParams);
  return (
    <ReferenceLayout page="book">
      <Booking key={JSON.stringify(selection)} selection={selection} />
    </ReferenceLayout>
  );
}
export default function Page({ searchParams }: QueryProps) {
  return <QueryBooking searchParams={searchParams} />;
}
