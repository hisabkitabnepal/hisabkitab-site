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

export function referencePageFromPath(pathname: string) {
  if (pathname === "/") return "home" as const;
  if (pathname.startsWith("/blog/")) return "article" as const;
  const pages = {
    "/services": "services",
    "/about": "about",
    "/blog": "blog",
    "/free-consultation": "book",
    "/tools": "calculator",
  } as const;
  return pages[pathname as keyof typeof pages] ?? ("other" as const);
}
