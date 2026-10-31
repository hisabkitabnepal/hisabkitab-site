import { ReferenceLayout } from "@/components/reference/Page";
import { Blog } from "@/components/reference/Blog";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Nepal Business, Tax & Accounting Blog",
  "Practical articles on business registration, accounting, tax and annual filings for businesses in Nepal, from Hisab Kitab in Kathmandu.",
  "/blog",
);
export default function Page() {
  return (
    <ReferenceLayout page="blog">
      <Blog />
    </ReferenceLayout>
  );
}
