export function isSameOrigin(request:Request){
 const origin=request.headers.get("origin");if(!origin)return false;
 try {
  const url=new URL(origin), requestUrl=new URL(request.url);
  const host=request.headers.get("host") ?? requestUrl.host;
  const protocol=request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  return url.origin===`${protocol}://${host}`;
 } catch {return false;}
}
