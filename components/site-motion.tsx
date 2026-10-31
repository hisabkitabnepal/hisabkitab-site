"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
export function SiteMotion(){
 const pathname=usePathname();
 // Keep route transitions from retaining the previous page's footer position.
 useLayoutEffect(()=>{if(pathname==="/free-consultation")window.scrollTo({top:0,left:0,behavior:"instant"});},[pathname]);
 useEffect(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("arrived");observer.unobserve(entry.target)}},{threshold:.15});document.querySelectorAll(".service-card,.tool-preview,.article-cover,.topic-grid>a").forEach(el=>observer.observe(el));return()=>observer.disconnect()},[pathname]);return null;
}
