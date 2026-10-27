import { ReferenceLayout } from "@/components/reference/Page";
import { Blog } from "@/components/reference/Blog";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Business notebook",
  "Notes on registration, accounting, compliance and running a business in Nepal.",
  "/blog",
);
export default function Page() {
  return (
    <ReferenceLayout page="blog">
      <Blog />
    </ReferenceLayout>
  );
}
