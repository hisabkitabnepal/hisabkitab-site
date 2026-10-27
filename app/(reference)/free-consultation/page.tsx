import { Suspense } from "react";
import { resolveReferenceBookingQuery } from "@/lib/reference/booking";
import { ReferenceLayout } from "@/components/reference/Page";
import { Booking } from "@/components/reference/Booking";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Free consultation",
  "Tell us what you are planning. We will suggest the right structure and a clear next step.",
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
  return (
    <Suspense fallback={null}>
      <QueryBooking searchParams={searchParams} />
    </Suspense>
  );
}
