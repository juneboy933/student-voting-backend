import { allAspirantsHandler, aspirantPositionHandler } from "./routes/aspirants.ts";
import { loginHandler } from "./routes/login.ts";
import { votesHandler, voteTallyPerAspirantHandler } from "./routes/voteTally.ts";
import { voteHandler } from "./routes/vote.ts";
import { isWithinVotingPeriod, serveStaticImage } from "./utils/fileHelper.ts";
import { serve } from "./deps.ts";

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

  // Serve static images
  if (url.pathname.startsWith("/images")) {
    return serveStaticImage(req, url.pathname);
  }

  // Login
  if (url.pathname === "/login" && req.method === "POST") {
    const response = await loginHandler(req);
    return new Response(response.body, {
      status: response.status,
      headers: cors,
    });
  }

  // Get aspirants by position
  if (url.pathname.startsWith("/aspirants/") && req.method === "GET") {
    return await aspirantPositionHandler(req);
  }

  // Get all aspirants
  if (url.pathname === "/aspirants" && req.method === "GET") {
    return await allAspirantsHandler(req);
  }

  // Vote submission
  if (url.pathname === "/vote" && req.method === "POST") {
    if (!isWithinVotingPeriod()) {
      return new Response(
        JSON.stringify({ message: "Voting is closed." }),
        {
          status: 403,
          headers: { "content-type": "application/json" },
        }
      );
    }
    return await voteHandler(req);
  }

  // Tally per aspirant
  if (url.pathname.startsWith("/tally/") && req.method === "GET") {
    return await voteTallyPerAspirantHandler(req);
  }

  // Tally for all
  if (url.pathname === "/tally" && req.method === "GET") {
    return await votesHandler(req);
  }

  // Not found
  return new Response(
    JSON.stringify({ message: "Not Found" }),
    {
      status: 404,
      headers: { "content-type": "application/json" },
    }
  );
}

serve(handler);
