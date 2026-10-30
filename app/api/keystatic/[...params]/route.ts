import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

// Until the GitHub app keys are added in Vercel, the admin API stays off
// (and the site still builds).
const enabled =
  process.env.NODE_ENV !== "production" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );
const handler = enabled ? makeRouteHandler({ config }) : null;
const off = () => new Response("Not found", { status: 404 });

export const GET = handler ? handler.GET : off;
export const POST = handler ? handler.POST : off;
