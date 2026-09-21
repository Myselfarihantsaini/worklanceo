import { getChatGPTUser } from '../../chatgpt-auth';
import { isAdmin } from '../../admin-auth';
export async function GET(){const user=await getChatGPTUser();return Response.json({user:user?{name:user.displayName,isAdmin:isAdmin(user)}:null},{headers:{'Cache-Control':'no-store'}})}
