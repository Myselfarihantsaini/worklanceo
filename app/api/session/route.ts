import { getChatGPTUser } from '../../chatgpt-auth';
export async function GET(){const user=await getChatGPTUser();return Response.json({user:user?{name:user.displayName}:null},{headers:{'Cache-Control':'no-store'}})}
