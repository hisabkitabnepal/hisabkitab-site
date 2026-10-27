import { ReferenceLayout } from "@/components/reference/Page";
import { About } from "@/components/reference/About";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "About us",
  "Financial and tax consultants in Samakhusi, Kathmandu. We bring the moving parts of your business into focus.",
  "/about",
);
export default function Page() {
  return (
    <ReferenceLayout page="about">
      <About />
    </ReferenceLayout>
  );
}
