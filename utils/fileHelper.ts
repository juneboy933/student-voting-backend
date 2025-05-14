import { extname, join, contentType } from "../deps.ts";


const IMAGES_DIR = "./images";
export async function serveStaticImage(_req: Request, pathname: string){
    const filePath = join(IMAGES_DIR, pathname.replace("/images/", ""));
    try {
        const file = await Deno.readFile(filePath);
        const headers = new Headers();
        headers.set("content-type", contentType(extname(filePath)) || "application/octet-stream");
        headers.set("Access-Control-Allow-Origin", "*");

        return new Response(file, {status: 200, headers});
    } catch (error) {
        console.error("Error", error);
        return new Response("file not found", {status: 404});
    }
}

export async function readJSON(path: string) {
    const data = await Deno.readTextFile(path);
    return JSON.parse(data);
};

export async function writeJSON(path: string, data: unknown) {
    const json = JSON.stringify(data, null, 2);
    await Deno.writeTextFile(path, json);
}

export function corsHeaders(){
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        "Access-Control-Allow-Allow-Headers": "Content-Type",
    }
}

export function isWithinVotingPeriod(): boolean {
    const now = new Date();

    // Get todays's date
    const year = now.getFullYear();
    const month = now.getMonth(); 
    const date = now.getDate();

    // Set start and end time for today
    const votingStart = new Date(year, month, date, 8, 0, 0); // 8.00Am
    const votingEnd = new Date(year, month, date, 16,0,0); // 4.00PM

    return now >= votingStart && now <= votingEnd;
}

// helper 
export function withCors(res: Response): Response {
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "content-type");
  
    return new Response(res.body, {
      status: res.status,
      headers,
    });
  }
  