export type TaxInput={entity:"sole"|"company";turnover:number;profit:number;location:"metro"|"municipality"|"rural";activity:"goods"|"services"|"professional";smallBusiness:boolean};
export type TaxRow={label:string;amount:number;rate:number|null;tax:number};
export type TaxResult={total:number;basis:string;rows:TaxRow[];notes:string[]};
export const TAX_YEAR="2083/84";
export const taxSources={natural:"https://ird.gov.np/content/13609/tax-rate-for-natural-persons-for-the/",entity:"https://ird.gov.np/content/13608/income-tax-rate-for-the-entity-for/"};
export function parseRupees(raw:string):number|null{
 const cleaned=raw.trim().replace(/,/g,"");if(!/^\d+(?:\.\d{1,2})?$/.test(cleaned))return null;
 const n=Number(cleaned);return Number.isFinite(n)&&n>=0&&n<=1e12?n:null;
}
export function estimateTax(input:TaxInput):TaxResult{
 const {entity,turnover,profit,location,activity,smallBusiness}=input;
 if(![turnover,profit].every(n=>Number.isFinite(n)&&n>=0&&n<=1e12))throw new Error("Use valid non-negative annual amounts.");
 if(entity==="company")return {total:profit*.25,basis:"General company · 25%",rows:[{label:"Taxable profit × 25%",amount:profit,rate:.25,tax:profit*.25}],notes:["General resident company rate only. Special sectors, concessions, credits and losses carried forward are not covered."]};
 const fixed={metro:7500,municipality:4000,rural:2500}[location];
 if(smallBusiness&&activity!=="professional"&&turnover>0&&turnover<=3000000&&profit<=300000)
  return {total:fixed,basis:"Presumptive tax · D-01",rows:[{label:"Location-based annual fixed tax",amount:turnover,rate:null,tax:fixed}],notes:["Assumes you qualify for D-01. Turnover is up to NPR 30 lakh and taxable profit up to NPR 3 lakh. Confirm all eligibility conditions before filing."]};
 if(smallBusiness&&activity!=="professional"&&turnover>3000000&&turnover<=10000000&&profit<=1000000){
  const lower=Math.min(turnover-3000000,2000000),upper=Math.max(0,turnover-5000000);
  const lowerRate=activity==="services"?.02:.01,upperRate=activity==="services"?.02:.008;
  const rows:TaxRow[]=[{label:"Base tax: first NPR 30 lakh",amount:3000000,rate:null,tax:fixed},{label:"Turnover: NPR 30–50 lakh",amount:lower,rate:lowerRate,tax:lower*lowerRate}];
  if(upper>0)rows.push({label:"Turnover: above NPR 50 lakh",amount:upper,rate:upperRate,tax:upper*upperRate});
  return {total:rows.reduce((sum,r)=>sum+r.tax,0),basis:"Turnover tax · D-02",rows,notes:["Assumes eligibility: resident natural person, only Nepal-source business income, taxable profit up to NPR 10 lakh and turnover above NPR 30 lakh up to NPR 1 crore.","Professional consultation and expert services are excluded. Special low-margin commission businesses are not covered."]};
 }
 const bands=[{limit:1000000,rate:0,label:"First NPR 10 lakh"},{limit:1500000,rate:.1,label:"Next NPR 5 lakh"},{limit:2500000,rate:.2,label:"Next NPR 10 lakh"},{limit:4000000,rate:.27,label:"Next NPR 15 lakh"},{limit:Infinity,rate:.29,label:"Above NPR 40 lakh"}];
 let previous=0;const rows:TaxRow[]=[];
 for(const b of bands){const amount=Math.max(0,Math.min(profit,b.limit)-previous);if(amount>0||rows.length===0)rows.push({label:b.label,amount,rate:b.rate,tax:amount*b.rate});previous=b.limit;if(profit<=b.limit)break;}
 return {total:rows.reduce((sum,r)=>sum+r.tax,0),basis:"Sole proprietor · profit-based slabs",rows,notes:["Assumes a registered resident sole proprietorship with business income only. The first NPR 10 lakh uses the sole-proprietor exemption from the 1% first-band tax.","Uses taxable business profit before any unmodelled relief or tax credits. Salary, mixed or foreign income, special sectors and other adjustments are excluded."]};
}
