/** Compatibility for links from the original single-document preview. */
export function referenceHashTarget(hash: string): string | null {
  const key = hash.replace(/^#/, "");
  const routes: Record<string, string> = {
    top: "/",
    services: "/services",
    about: "/about",
    blog: "/blog",
    book: "/free-consultation",
    calculator: "/tools",
  };
  if (Object.prototype.hasOwnProperty.call(routes, key)) return routes[key];
  if (/^blog\/[\w-]+$/.test(key)) return "/" + key;
  return null;
}
