import Article, {
  generateMetadata as articleMetadata,
} from "@/components/legacy-article";
const params = Promise.resolve({ slug: "prepare-for-accounting-consultation" });
export function generateMetadata() {
  return articleMetadata({ params });
}
export default function Page() {
  return <Article params={params} />;
}
