import { ReferenceLayout } from "@/components/reference/Page";
import { Hero } from "@/components/reference/Hero";
import { Trust } from "@/components/reference/Trust";
import { ServiceShowcase } from "@/components/reference/ServiceShowcase";
import { Calculator } from "@/components/reference/Calculator";
import { Faq } from "@/components/reference/Faq";
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
