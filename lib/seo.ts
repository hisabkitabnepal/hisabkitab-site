import type { Metadata } from "next";
export const siteUrl="https://hisabkitabnepal.com.np";
export function pageMetadata(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:siteUrl+path},openGraph:{title:`${title} | Hisab Kitab`,description,url:siteUrl+path,type:"website"}};}
