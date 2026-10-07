import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/seo";
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:"Hisab Kitab | Business Registration, Accounting & Tax",template:"%s | Hisab Kitab"},description:"Business registration, accounting, tax clearance, annual filings, audit assistance and closure. Hisab Kitab, Samakhusi, Kathmandu. Book a free consultation.",alternates:{canonical:siteUrl},openGraph:{title:"Hisab Kitab | You run the business. We handle the details.",description:"Registration, accounts, tax and business closure. Clear guidance and practical support.",url:siteUrl,siteName:"Hisab Kitab",locale:"en_NP",type:"website"},icons:{icon:"/favicon.svg"},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){
 const organization={"@context":"https://schema.org","@type":"ProfessionalService",name:"Hisab Kitab",alternateName:"Hisab Kitab, Financial & Tax Consultants",url:siteUrl,telephone:"+9779747857130",email:"hisabkitabnepal@outlook.com",address:{"@type":"PostalAddress",streetAddress:"Samakhusi",addressLocality:"Kathmandu",addressCountry:"NP"}};
 return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization).replace(/</g,"\\u003c")}}/>{children}</body></html>;
}
