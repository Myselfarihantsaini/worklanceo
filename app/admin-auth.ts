import { env } from 'cloudflare:workers';
import { getChatGPTUser, type ChatGPTUser } from './chatgpt-auth';
export function isAdmin(user: ChatGPTUser | null) {
  const allowed = env.ADMIN_EMAIL?.trim().toLowerCase();
  return !!(allowed && user && user.email.toLowerCase() === allowed);
}
export async function adminIdentity() { return isAdmin(await getChatGPTUser()); }
