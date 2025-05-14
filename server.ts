import { allAspirantsHandler, aspirantPositionHandler } from "./routes/aspirants.ts";
import { loginHandler } from "./routes/login.ts";
import { votesHandler, voteTallyPerAspirantHandler } from "./routes/voteTally.ts";
import { voteHandler } from "./routes/vote.ts";
import { isWithinVotingPeriod, serveStaticImage } from "./utils/fileHelper.ts";
import { serve } from "./deps.ts";

import { withCors } from "./utils/fileHelper.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (url.pathname.startsWith("/images")) {
    return withCors(await serveStaticImage(req, url.pathname));
  }

  if (url.pathname === "/login" && req.method === "POST") {
    const response = await loginHandler(req);
    return withCors(new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    }));
  }

  if (url.pathname.startsWith("/aspirants/") && req.method === "GET") {
    return withCors(await aspirantPositionHandler(req));
  }

  if (url.pathname === "/aspirants" && req.method === "GET") {
    return withCors(await allAspirantsHandler(req));
  }

  if (url.pathname === "/vote" && req.method === "POST") {
    if (!isWithinVotingPeriod()) {
      return withCors(new Response(JSON.stringify({ message: "Voting is closed." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }));
    }
    return withCors(await voteHandler(req));
  }

  if (url.pathname.startsWith("/tally/") && req.method === "GET") {
    return withCors(await voteTallyPerAspirantHandler(req));
  }

  if (url.pathname === "/tally" && req.method === "GET") {
    return withCors(await votesHandler(req));
  }

  return withCors(new Response(JSON.stringify({ message: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  }));
}

serve(handler);
