import Link from "next/link";
import { PageFrame,PageIntro,ConsultationCTA } from "@/components/site-sections";
import { posts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata("Business & Accounting Blog","Practical notes on monthly accounting, profit, cash flow and preparing for an accounting consultation in Nepal.","/blog");
export default function Blog(){return <PageFrame><PageIntro eyebrow="The business notebook" title={<>A little knowledge.<br/><span>A clearer decision.</span></>} description="Practical notes on keeping your records organized, understanding your numbers and asking the right questions."/><section className="section"><div className="container"><div className="blog-list">{posts.map(p=><Link className="blog-row" key={p.slug} href={`/blog/${p.slug}`}><div className="blog-meta"><span>{p.category}</span><span>{p.readTime}</span></div><div><h2>{p.title}</h2><p>{p.description}</p><span className="read-label">Read the article</span></div></Link>)}</div></div></section><ConsultationCTA/></PageFrame>;}
