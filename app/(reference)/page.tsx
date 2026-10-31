import { ReferenceLayout } from "@/components/reference/Page";
import { Hero } from "@/components/reference/Hero";
import { Trust } from "@/components/reference/Trust";
import { ServiceShowcase } from "@/components/reference/ServiceShowcase";
import { Calculator } from "@/components/reference/Calculator";
import { Faq } from "@/components/reference/Faq";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Accounting, Tax & Company Registration in Nepal",
  "Company registration, monthly accounting, tax filing and audit support for businesses in Kathmandu and across Nepal. Book a free consultation.",
  "",
);
export default function Home() {
  return (
    <ReferenceLayout page="home">
      <Hero />
      <Trust />
      <ServiceShowcase />
      <Calculator />
      <Faq />
    </ReferenceLayout>
  );
}
