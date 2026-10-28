import "@/components/reference/reference.css";
import RootLayout, { metadata } from "@/components/root-document";
import { ReferenceShell } from "@/components/reference/Shell";
export { metadata };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout>
      <ReferenceShell>{children}</ReferenceShell>
    </RootLayout>
  );
}
