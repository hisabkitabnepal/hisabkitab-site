import Article, {
  generateMetadata as articleMetadata,
} from "@/components/legacy-article";
const params = Promise.resolve({ slug: "profit-is-not-cash" });
export function generateMetadata() {
  return articleMetadata({ params });
}
export default function Page() {
  return <Article params={params} />;
}
