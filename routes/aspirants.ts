import { corsHeaders, readJSON } from "../utils/fileHelper.ts";

// GET Aspirant per position
export async function aspirantPositionHandler(req: Request){
    const url = new URL(req.url);
    const position = url.pathname.split('/')[2];
    if(!position){
        return new Response(JSON.stringify({error: "Position is required"}), {
            status: 400,
            headers: corsHeaders(),
        });
    }
    try {
        const candidates = await readJSON('data/Aspirants.json');
        // deno-lint-ignore no-explicit-any
        const filteredCandidate = candidates.filter((c: any) => c.position === position);
        if(filteredCandidate.length === 0){
            return new Response(JSON.stringify({error: `No aspirant found for ${position}`}), {
                status: 400,
                headers: corsHeaders(),
            });
        }
        return new Response(JSON.stringify(filteredCandidate), {
            status: 200,
            headers: corsHeaders(),
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({error: "Internal server error"}),{
            status: 500,
            headers: corsHeaders(),
        });
    }
}

// GET all Aspirant
export async function allAspirantsHandler(_req: Request) {
    const aspirants = await readJSON('data/Aspirants.json');
    return new Response(JSON.stringify(aspirants), {
        status: 200,
        headers: {
            ...corsHeaders(),
            "content-type": "application/json"},
    });
}