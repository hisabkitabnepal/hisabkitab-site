import { inquiryEmail } from "@/lib/inquiry-email-template";
import { inquirySchema } from "@/lib/inquiry-validation";
import type { z } from "zod";
export async function sendInquiryEmail(v:z.infer<typeof inquirySchema>, reference:string){
 const apiKey=process.env.RESEND_API_KEY,from=process.env.INQUIRY_FROM_EMAIL;
 if(!apiKey||!from)throw new Error("Email sending is not configured.");
 const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":`inquiry/${v.id}`},body:JSON.stringify(inquiryEmail(v,reference,from)),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error(`Email service returned ${response.status}.`);
 const result=await response.json() as {id?:string};if(!result.id)throw new Error("Email service did not confirm acceptance.");
 return result.id;
}
