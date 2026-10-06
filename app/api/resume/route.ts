import { getChatGPTUser } from "../../chatgpt-auth";
import { database } from "../../../db/raw";

const MAX_RESUME_SIZE = 2 * 1024 * 1024;
const CHUNK_SIZE = 128 * 1024;

function blobBytes(value: unknown) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value))
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (Array.isArray(value)) return new Uint8Array(value);
  throw new Error("Invalid résumé data");
}

async function readResume(key: string, owner: string) {
  const result = await database()
    .prepare(
      "SELECT data FROM resume_chunks WHERE resume_key = ? AND owner = ? ORDER BY chunk_index",
    )
    .bind(key, owner)
    .all<{ data: unknown }>();
  if (!result.results.length) return null;
  const chunks = result.results.map((row) => blobBytes(row.data));
  const total = chunks.reduce((size, chunk) => size + chunk.byteLength, 0);
  const file = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    file.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return file;
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 3 * 1024 * 1024)
    return Response.json({ error: "PDF must be under 2 MB." }, { status: 413 });

  try {
    const form = await request.formData();
    const upload = form.get("resume");
    if (
      !(upload instanceof File) ||
      upload.size === 0 ||
      upload.size > MAX_RESUME_SIZE ||
      upload.type !== "application/pdf"
    )
      return Response.json(
        { error: "Choose a PDF under 2 MB." },
        { status: 400 },
      );

    const bytes = await upload.arrayBuffer();
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
      return Response.json({ error: "Choose a valid PDF." }, { status: 400 });

    const key = `${user.userId}/${crypto.randomUUID()}.pdf`;
    const created = Date.now();
    const db = database();
    const statements = [];
    for (let offset = 0, index = 0; offset < bytes.byteLength; index++) {
      const chunk = bytes.slice(offset, offset + CHUNK_SIZE);
      statements.push(
        db
          .prepare(
            "INSERT INTO resume_chunks (resume_key,owner,chunk_index,data,created) VALUES (?,?,?,?,?)",
          )
          .bind(key, user.userId, index, chunk, created),
      );
      offset += CHUNK_SIZE;
    }
    await db.batch(statements);
    return Response.json({ key });
  } catch (error) {
    console.error("Resume save failed", error);
    return Response.json(
      { error: "Resume upload failed. Please try again." },
      { status: 503 },
    );
  }
}

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!key.startsWith(user.userId + "/"))
    return Response.json({ error: "Not found." }, { status: 404 });

  try {
    const file = await readResume(key, user.userId);
    if (!file) return Response.json({ error: "Not found." }, { status: 404 });
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Resume download failed", error);
    return Response.json(
      { error: "The résumé could not be downloaded. Please try again." },
      { status: 503 },
    );
  }
}
