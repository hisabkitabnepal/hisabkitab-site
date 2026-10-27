"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Phone, Mail } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { whatsapp, businessPhone, phoneHref, businessEmail, emailHref } from "@/lib/business";
const links = [["Register a business", "/register-business"], ["Services", "/services"], ["Monthly plan", "/monthly-plan"], ["Tax calculator", "/tools"], ["About us", "/about"], ["Blog", "/blog"]];
export function Brand() {
 return <Link className="brand" href="/" aria-label="Hisab Kitab home"><span className="brand-emblem"><img src="/logo-full.webp" alt="" width={392} height={520}/></span><span><strong>Hisab Kitab</strong><small>Financial & Tax Consultants</small></span></Link>;
}
export function SiteHeader() {
 const [open,setOpen] = useState(false); const pathname=usePathname();
 return <><a className="skip-link" href="#main">Skip to content</a><Sheet open={open} onOpenChange={setOpen}><header id="top" className="site-header"><div className="container header-inner"><Brand/><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,url])=><Link aria-current={pathname===url?"page":undefined} key={url} href={url}>{label}</Link>)}</nav><Link className="button primary header-cta" href="/free-consultation#contact">Book a free consultation</Link><SheetTrigger asChild><button className="menu-button" aria-label="Open navigation" aria-expanded={open}><Menu size={24}/></button></SheetTrigger></div></header><SheetContent className="mobile-sheet"><SheetTitle>Hisab Kitab</SheetTitle><SheetDescription>Financial & Tax Consultants</SheetDescription><nav aria-label="Mobile navigation">{[["Home","/"],...links,["Free consultation","/free-consultation"]].map(([label,url])=><Link aria-current={pathname===url?"page":undefined} key={url} href={url} onClick={()=>setOpen(false)}>{label}</Link>)}</nav><a className="button primary" href={whatsapp()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></SheetContent></Sheet></>;
}
export function SiteFooter() {
 return <footer className="site-footer"><div className="container footer-main"><div><Brand/><p>Registration, accounts, tax and business closure.<br className="desktop-only"/> Clear guidance for your next step.</p><span className="footer-address">Samakhusi, Kathmandu, Nepal</span></div><nav aria-label="Explore"><span className="footer-label">Explore</span>{links.slice(0,3).map(([label,url])=><Link key={url} href={url}>{label}</Link>)}<Link href="/blog">Business notebook</Link></nav><nav aria-label="Contact and information"><span className="footer-label">Let’s talk</span><a href={phoneHref}><Phone size={15}/>{businessPhone}</a><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/>WhatsApp</a><a href={emailHref}><Mail size={15}/>{businessEmail}</a><Link href="/free-consultation#contact">Free first consultation</Link><Link href="/privacy">Privacy & information</Link></nav></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Hisab Kitab</span><span>Financial & Tax Consultants</span></div></footer>;
}
