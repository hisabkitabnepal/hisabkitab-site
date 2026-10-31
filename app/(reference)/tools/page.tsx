import { ReferenceLayout } from "@/components/reference/Page";
import { Calculator } from "@/components/reference/Calculator";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Nepal Income Tax Calculator FY 2083/84",
  "Estimate income tax for a sole proprietor or a private limited company in Nepal for FY 2083/84, with every step of the calculation shown. Free to use.",
  "/tools",
);
export default function Page() {
  return (
    <ReferenceLayout page="calculator">
      <Calculator standalone />
    </ReferenceLayout>
  );
}
