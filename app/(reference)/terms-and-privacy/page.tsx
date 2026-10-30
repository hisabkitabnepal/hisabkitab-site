import { Legal } from "@/components/reference/Legal";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Terms and Conditions and Privacy Policy",
  "Website Terms and Conditions and Privacy Policy for hisabkitabnepal.com.np.",
  "/terms-and-privacy",
);
export default function Page() {
  return (
    <main id="top">
      <Legal />
    </main>
  );
}