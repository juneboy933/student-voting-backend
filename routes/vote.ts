import { corsHeaders, readJSON, writeJSON, isWithinVotingPeriod } from "../utils/fileHelper.ts";
export async function voteHandler(req: Request): Promise<Response> {
    try {
      const { studentID, position, aspirantID } = await req.json();
  
      // Validate required fields
      if (!studentID || !position || !aspirantID) {
        return new Response(JSON.stringify({ message: "All fields are required" }), {
          status: 400,
          headers: corsHeaders(),
        });
      }
  
      // OPTIONAL: Enforce voting period
      if (!isWithinVotingPeriod()) {
        return new Response(JSON.stringify({ message: "Voting is currently closed." }), {
          status: 403,
          headers: corsHeaders(),
        });
      }
  
      // Load student data
      const students = await readJSON("data/Students.json");
      // deno-lint-ignore no-explicit-any
      const student = students.find((s: any) => s.studentID === studentID);
  
      if (!student) {
        return new Response(JSON.stringify({ message: "Student not found." }), {
          status: 404,
          headers: corsHeaders(),
        });
      }
  
      // Check if student has already voted for this position
      if (student.has_voted?.[position]) {
        return new Response(JSON.stringify({
          message: `You have already voted for the position of ${position}.`,
        }), {
          status: 409,
          headers: corsHeaders(),
        });
      }
  
      // Load votes
      const votes = await readJSON("data/Votes.json");
  
      // Find the matching aspirant for the position
      const aspirant = votes.find(
        (v: any) => v.Position === position && v.ID === aspirantID
      );
  
      if (!aspirant) {
        return new Response(JSON.stringify({ message: "Aspirant not found for this position." }), {
          status: 404,
          headers: corsHeaders(),
        });
      }
  
      // Increment vote count
      aspirant.votes = (aspirant.votes || 0) + 1;
  
      // Update student record
      if (!student.has_voted) student.has_voted = {};
      student.has_voted[position] = true;
  
      // Write changes back to files
      await writeJSON("data/Students.json", students);
      await writeJSON("data/Votes.json", votes);
  
      return new Response(JSON.stringify({ message: "Vote cast successfully." }), {
        status: 200,
        headers: corsHeaders(),
      });
  
    } catch (error) {
      console.error("voteHandler error:", error);
      return new Response(JSON.stringify({ message: "Internal server error." }), {
        status: 500,
        headers: corsHeaders(),
      });
    }
  }
  