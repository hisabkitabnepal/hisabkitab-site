import { ReferenceLayout } from "@/components/reference/Page";
import { Calculator } from "@/components/reference/Calculator";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Tax calculator",
  "Explore an illustrative income-tax estimate with the working shown step by step.",
  "/tools",
);
export default function Page() {
  return (
    <ReferenceLayout page="calculator">
      <Calculator standalone />
    </ReferenceLayout>
  );
}
