import { ReferenceLayout } from "@/components/reference/Page";
import { Services } from "@/components/reference/Services";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Our services",
  "Registration, monthly accounting, tax and annual filings, audit assistance, financial reporting and business closure.",
  "/services",
);
export default function Page() {
  return (
    <ReferenceLayout page="services">
      <Services />
    </ReferenceLayout>
  );
}
