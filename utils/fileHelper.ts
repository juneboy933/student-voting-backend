import { extname, join} from "https://deno.land/std@0.224.0/path/mod.ts"
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts"

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