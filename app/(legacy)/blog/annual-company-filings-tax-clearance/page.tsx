import Article, {
  generateMetadata as articleMetadata,
} from "@/components/legacy-article";
const params = Promise.resolve({
  slug: "annual-company-filings-tax-clearance",
});
export function generateMetadata() {
  return articleMetadata({ params });
}
export default function Page() {
  return <Article params={params} />;
}
