import { PageFrame } from "@/components/site-sections";
import { TaxCalculator } from "@/components/tax-calculator";
import { pageMetadata } from "@/lib/seo";
export const metadata=pageMetadata("Free Nepal Business Tax Calculator 2083/84","Choose sole proprietorship or company, enter annual figures and estimate income tax with a clear breakdown. Based on official IRD schedules.","/tools");
export default function TaxPage(){return <PageFrame><section className="calculator-page"><div className="container"><div className="calculator-intro"><span className="eyebrow">Free business tax calculator · FY 2083/84</span><h1>Your tax.<br/><span>A little clearer.</span></h1><p>Choose your business structure and enter your annual figures. This is a planning estimate, not your final tax liability.</p></div><TaxCalculator/></div></section></PageFrame>;}
