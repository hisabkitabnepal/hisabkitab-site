import type { ReactNode } from "react";
import {
  ReferenceFrame,
  CalculatorBanner,
  type ReferencePage,
} from "./ReferenceFrame";
import { Topbar } from "./Topbar";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Contact } from "./Contact";
export function ReferenceLayout({
  page,
  children,
}: {
  page: ReferencePage;
  children: ReactNode;
}) {
  return (
    <ReferenceFrame page={page}>
      <Topbar />
      <Navigation page={page} />
      {page === "calculator" ? <CalculatorBanner /> : null}
      <main id="top">
        {children}
        <Contact />
      </main>
      <Footer />
    </ReferenceFrame>
  );
}
