import Link from "next/link";
import { PageFrame } from "@/components/site-sections";
export default function NotFound(){return <PageFrame><div className="container not-found"><span className="eyebrow">Page not found</span><h1>Let’s get you<br/>back on track.</h1><p>The page may have moved. You can return home or get in touch.</p><Link className="button primary" href="/">Return home</Link></div></PageFrame>;}
