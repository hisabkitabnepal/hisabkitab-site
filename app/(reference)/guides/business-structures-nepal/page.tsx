import { ReferenceLayout } from "@/components/reference/Page";
import { BusinessStructuresGuide } from "@/components/reference/BusinessStructuresGuide";
import { faqs } from "@/lib/reference/business-structures";
import { pageMetadata, siteUrl } from "@/lib/seo";

const path = "/guides/business-structures-nepal";
const title = "Register a Business in Nepal: Structures & Tax FY 2083/84";
const description =
  "Compare sole proprietorship, partnership and private limited company in Nepal, see FY 2083/84 tax slabs and register with Hisab Kitab in Kathmandu.";

export const metadata = {
  ...pageMetadata(title, description, path),
  keywords: [
    "register a business in Nepal",
    "business structures Nepal",
    "sole proprietorship vs private limited Nepal",
    "company registration Nepal",
    "Nepal income tax slabs FY 2083/84",
    "sole proprietor tax Nepal",
    "private limited company tax rate Nepal",
  ],
};

export default function Page() {
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      inLanguage: "en-NP",
      dateModified: "2026-10-07",
      author: { "@type": "Organization", name: "Hisab Kitab" },
      publisher: { "@type": "Organization", name: "Hisab Kitab", url: siteUrl },
      mainEntityOfPage: siteUrl + path,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
        { "@type": "ListItem", position: 2, name: "Services", item: siteUrl + "/services" },
        { "@type": "ListItem", position: 3, name: "Register a business in Nepal", item: siteUrl + path },
      ],
    },
  ];
  return (
    <ReferenceLayout page="article">
      {structured.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <BusinessStructuresGuide />
    </ReferenceLayout>
  );
}
