import { ReferenceLayout } from "@/components/reference/Page";
import { About } from "@/components/reference/About";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "About Hisab Kitab: Accountants in Kathmandu",
  "Hisab Kitab is a team of financial and tax consultants in Samakhusi, Kathmandu, helping Nepali businesses with registration, accounts, tax and annual filings.",
  "/about",
);
export default function Page() {
  return (
    <ReferenceLayout page="about">
      <About />
    </ReferenceLayout>
  );
}
