import type { ReactNode } from "react";
import { CalculatorBanner, type ReferencePage } from "./ReferenceFrame";
import { Contact } from "./Contact";
export function ReferenceLayout({
  page,
  children,
}: {
  page: ReferencePage;
  children: ReactNode;
}) {
  return (
    <>
      {page === "calculator" ? <CalculatorBanner /> : null}
      <main id="top">
        {children}
        <Contact />
      </main>
    </>
  );
}
