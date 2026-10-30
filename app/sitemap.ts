export const dynamic="force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { referenceArticles } from "@/lib/reference/articles";
import { posts } from "@/lib/posts";
export default function sitemap():MetadataRoute.Sitemap{return ["","/register-business","/services","/monthly-plan","/about","/free-consultation","/blog","/tools","/privacy","/terms-and-privacy","/sample-work",...Object.keys(referenceArticles).map(slug=>"/blog/"+slug),...posts.map(p=>"/blog/"+p.slug)].map(path=>({url:siteUrl+path}));}