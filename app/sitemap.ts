export const dynamic="force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { posts } from "@/lib/posts";
export default function sitemap():MetadataRoute.Sitemap{return ["","/register-business","/services","/monthly-plan","/about","/free-consultation","/blog","/tools","/privacy",...posts.map(p=>"/blog/"+p.slug)].map(path=>({url:siteUrl+path}));}
