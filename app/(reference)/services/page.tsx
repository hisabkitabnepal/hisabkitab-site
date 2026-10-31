import { ReferenceLayout } from "@/components/reference/Page";
import { Services } from "@/components/reference/Services";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Accounting, Tax & Audit Services in Nepal",
  "Company registration, monthly accounting, tax and annual filings, audit assistance, financial reporting and business closure for businesses in Nepal.",
  "/services",
);
export default function Page() {
  return (
    <ReferenceLayout page="services">
      <Services />
    </ReferenceLayout>
  );
}
