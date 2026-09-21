import {env} from 'cloudflare:workers';
import {adminIdentity} from '../../../admin-auth';
import {database} from '../../../../db/raw';
export async function GET(request:Request){
 if(!await adminIdentity())return Response.json({error:'Admin access required.'},{status:403});
 try{const id=new URL(request.url).searchParams.get('id');
 const row=await database().prepare("SELECT data,owner FROM records WHERE id=? AND kind='application' AND json_extract(data,'$.sharedWithTeam')=1").bind(id).first<{data:string,owner:string}>();
 const key=row?JSON.parse(row.data).resumeKey:null;
 if(!row||typeof key!=='string'||!key.startsWith(row.owner+'/'))return new Response('Not found',{status:404});
 if(!env.BUCKET)throw Error('Storage unavailable');const file=await env.BUCKET.get(key);if(!file)return new Response('Not found',{status:404});
 return new Response(file.body,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="candidate-resume.pdf"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch(e){console.error('Admin resume download failed',e);return Response.json({error:'The résumé could not be downloaded. Please try again.'},{status:503})}
}
