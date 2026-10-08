import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

export function adminEmails() {
  return [env.ADMIN_EMAIL, env.ADMIN_EMAILS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(user: ChatGPTUser | null) {
  return !!(user && adminEmails().includes(user.email.trim().toLowerCase()));
}

export async function adminIdentity() {
  return isAdmin(await getChatGPTUser());
}
