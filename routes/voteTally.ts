import { corsHeaders, readJSON } from "../utils/fileHelper.ts";

// GET vote tally count per aspirant
export async function voteTallyPerAspirantHandler(req: Request) {
    const url = new URL(req.url);
    const position = url.pathname.split('/')[2];
    // get all votes 
    const votes = await readJSON('data/Votes.json');
    // console.log(votes);
    for(let i = 0; i < votes.length; i++){
        // console.log(votes[i].Position);
        // deno-lint-ignore no-explicit-any
        const filterVotes = votes.filter((vote: any) => vote.Position === position);
        if(filterVotes.length === 0){
            return new Response(JSON.stringify({message: "Candidate not found"}),
        {status: 400, headers: corsHeaders()})
        }
        return new Response(JSON.stringify(filterVotes), {
            status:200,
            headers: corsHeaders(),
        });
    }
 
}

// GET all votes 
export async function votesHandler(_req: Request){
    const votes = await readJSON('data/Votes.json');
    return new Response(JSON.stringify(votes), {
        status: 200,
        headers: corsHeaders(),
    });   
}