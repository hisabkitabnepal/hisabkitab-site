import type { ReactNode } from "react";
import { preload } from "react-dom";
import { ReferenceFrame } from "./ReferenceFrame";
import { Topbar } from "./Topbar";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
export function ReferenceShell({ children }: { children: ReactNode }) {
  preload("/fonts/manrope-latin-variable.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  return (
    <ReferenceFrame>
      <div className="dots-layer" aria-hidden="true" /> 
      <Topbar />
      <Navigation />
      {children}
      <Footer />
    </ReferenceFrame>
  );
}
