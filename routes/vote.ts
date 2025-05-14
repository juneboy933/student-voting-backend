import { corsHeaders, readJSON, writeJSON } from "../utils/fileHelper.ts";

export async function voteHandler(req: Request){
    const { studentID, position, aspirantID } = await req.json();
    // console.log('Incoming vote request body', {studentID, position, aspirantID });

    // Check if we have the inputs needed
    if(!studentID || !position || !aspirantID){
        return new Response(JSON.stringify({
            message: "All fields are required"
        }),{
            status:400,
            headers: corsHeaders(),
        });
    }
    
    // Load data
    const students = await readJSON('data/Students.json');

    // Check if student exist in the data base
    // deno-lint-ignore no-explicit-any
    const student = students.find((s: any) => s.studentID === studentID);
    if(!student) {
        return new Response(JSON.stringify({message: "Student not found"}), {status: 400});
    }

    // Check if student has voted
    if(student.has_voted[position]){
        return new Response(JSON.stringify({
            message: `Already voted for the ${position}` }),
        {
            status: 400,
            headers:corsHeaders(),
        });
    }

    // Voting
    const votes = await readJSON('data/Votes.json');
    if(!aspirantID) {
        return new Response(JSON.stringify({message: "Missing Aspirant ID"}), {
            status: 400,
            headers:corsHeaders(),
        });
    }  

    // console.log(votes);
    for(let i = 0; i < votes.length; i++) {
        // console.log(votes[i]);
        const aspirantToVoteFor = votes[i].Position;
        const aspirantToVoteForID = votes[i].ID;
        // console.log("Position:",aspirantToVoteFor);
        // console.log("ID: ",aspirantToVoteForID);
        if(aspirantToVoteFor === position && aspirantToVoteForID === aspirantID ){
           votes[i].votes = (votes[i].votes || 0) + 1;
            break;
        }
    }

    
    // Upload student record
    student.has_voted[position] = true;
//    console.log("Modified votes array: ", votes);
    // Write back the updated files
    await writeJSON('data/Students.json', students);
    await writeJSON('data/Votes.json', votes);

    // console.log("Updated Votes", votes);
    
    return new Response(JSON.stringify({
        message: "Voted successfully"
    }), {
        status: 200,
        headers: corsHeaders(),
    });
}