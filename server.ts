import { allAspirantsHandler, aspirantPositionHandler } from "./routes/aspirants.ts";
import { loginHandler } from "./routes/login.ts";
import { votesHandler } from "./routes/voteTally.ts";
import { voteTallyPerAspirantHandler } from "./routes/voteTally.ts";
import { voteHandler } from "./routes/vote.ts";
import { isWithinVotingPeriod, serveStaticImage } from "./utils/fileHelper.ts";
import { serve } from "./deps.ts";

// import { voteResultHandler } from "./routes/voteTally.ts";


async function server(req: Request){
    const url = new URL(req.url);
    const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
    }
    
   
    // CORS Preflight Request Handling
    if(req.method === 'OPTIONS'){
        return new Response(null, {
            status: 204,
            headers: cors,
        });
    }

    if(url.pathname.startsWith("/images")) {
       return serveStaticImage(req, url.pathname);
    } 

    if(url.pathname === '/login' && req.method === 'POST'){
        const response = await loginHandler(req);
        return new Response(response.body, {
            status: response.status,
            headers: cors,
        });
    }
    // Get aspirants based on position
    if(url.pathname.startsWith('/aspirants/') && req.method === 'GET') {
        return await aspirantPositionHandler(req);
    }

    // GET all aspirants
    if(url.pathname === '/aspirants' && req.method === 'GET'){
        return await allAspirantsHandler(req);
    }
    
    // Voting and checking the voting  if its successful
    if(url.pathname === '/vote' && req.method === 'POST'){
        if(!isWithinVotingPeriod()) {
            return new Response(JSON.stringify({ message: "Voting is closed."}), {
                status: 403,
                headers: {"content-type": "application/json"},
            });
        }
        return await voteHandler(req);
    }

    // GET votes per candidate
    if(url.pathname.startsWith('/tally/') && req.method === 'GET'){
        return await voteTallyPerAspirantHandler(req);
    }

    // GET votes for all candidates
    if(url.pathname === '/tally' && req.method === 'GET') {
        return await votesHandler(req);
    }

    return new Response(null, {
        status: 404,
        headers: {"content-type": "application/json"}
    })
}
// Deno.serve(server);
serve(server);
