import { adminIdentity } from "../../../admin-auth";
import { database } from "../../../../db/raw";

function blobBytes(value: unknown) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value))
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (Array.isArray(value)) return new Uint8Array(value);
  throw new Error("Invalid résumé data");
}

export async function GET(request: Request) {
  if (!(await adminIdentity()))
    return Response.json({ error: "Admin access required." }, { status: 403 });
  try {
    const id = new URL(request.url).searchParams.get("id");
    const db = database();
    const row = await db
      .prepare(
        "SELECT data,owner FROM records WHERE id=? AND kind='application' AND json_extract(data,'$.sharedWithTeam')=1",
      )
      .bind(id)
      .first<{ data: string; owner: string }>();
    const key = row ? JSON.parse(row.data).resumeKey : null;
    if (!row || typeof key !== "string" || !key.startsWith(row.owner + "/"))
      return new Response("Not found", { status: 404 });

    const result = await db
      .prepare(
        "SELECT data FROM resume_chunks WHERE resume_key=? AND owner=? ORDER BY chunk_index",
      )
      .bind(key, row.owner)
      .all<{ data: unknown }>();
    if (!result.results.length)
      return new Response("Not found", { status: 404 });
    const chunks = result.results.map((item) => blobBytes(item.data));
    const total = chunks.reduce((size, chunk) => size + chunk.byteLength, 0);
    const file = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      file.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="candidate-resume.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Admin resume download failed", error);
    return Response.json(
      { error: "The résumé could not be downloaded. Please try again." },
      { status: 503 },
    );
  }
}
