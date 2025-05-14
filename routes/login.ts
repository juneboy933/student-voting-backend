import { corsHeaders, readJSON } from "../utils/fileHelper.ts";

// Validate students with their IDs
export async function loginHandler(req: Request) {
    try {
        const { studentID } = await req.json();
        if(!studentID) {
            return new Response(JSON.stringify({error: "Student ID is required"}), {
                status: 401,
                headers: {
                    ...corsHeaders(),
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"},
            });
        }
        if(studentID === 'admin'){
            return new Response(JSON.stringify({success: true, role: "admin"}), 
            {
                status: 200,
                headers: {"content-type": "application/json"}
            })
        }
        const students = await readJSON('data/students.json');
        // deno-lint-ignore no-explicit-any
        const student = students.find((s: any) => s["studentID"] === studentID);
        if(!student){
            return new Response(JSON.stringify({error: "Not eligible to vote"}), {
                status: 403,
                headers: {"content-type": "application/json", "Access-Control-Allow-Origin": "*"},
            });
        }
        return new Response(JSON.stringify({
            message: "Login successfully",
            studentID,
        }),{
            status: 200,
            headers:{
                ...corsHeaders(),
                "content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
        },
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({error: "Invalid request"}), {
            status: 500,
            headers: {...corsHeaders(), 
                "content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"},
        })
    }
}