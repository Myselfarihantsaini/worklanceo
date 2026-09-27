import {adminIdentity} from '../../../admin-auth';
import {database} from '../../../../db/raw';
import {z} from 'zod';
export const dynamic='force-dynamic';
const visible="kind IN ('requirement','application') AND json_extract(data,'$.sharedWithTeam') = 1";
const headers={'Cache-Control':'private, no-store'};
export async function GET(request:Request){
 if(!await adminIdentity())return Response.json({error:'Admin access required.'},{status:403,headers});
 try{
 const p=new URL(request.url).searchParams; const page=Math.max(1,Math.min(100000,Number(p.get('page'))||1));
 const q=(p.get('q')??'').trim().slice(0,150); const kind=p.get('kind'); const status=p.get('status');
 const where=[visible];const bindings:any[]=[];
 if(q){where.push("(title LIKE ? OR json_extract(data,'$.company') LIKE ? OR json_extract(data,'$.name') LIKE ? OR json_extract(data,'$.city') LIKE ? OR json_extract(data,'$.email') LIKE ? OR json_extract(data,'$.phone') LIKE ?)");for(let i=0;i<6;i++)bindings.push('%'+q+'%')}
 if(kind&&['requirement','application'].includes(kind)){where.push('kind = ?');bindings.push(kind)}
 if(status&&['New','Contacted','In progress','Closed'].includes(status)){where.push('status = ?');bindings.push(status)}
 if(p.get('due')==='true'){where.push("follow_up != '' AND follow_up <= ? AND status != 'Closed'");bindings.push(new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}))}
 const db=database();
 const rows=await db.prepare(`SELECT id,kind,title,status,data,created,admin_notes AS notes,follow_up AS followUp,review_version AS version,reviewed_at AS reviewedAt FROM records WHERE ${where.join(' AND ')} ORDER BY created DESC,id DESC LIMIT 25 OFFSET ?`).bind(...bindings,(page-1)*25).all();
 const count=await db.prepare(`SELECT COUNT(*) AS n FROM records WHERE ${where.join(' AND ')}`).bind(...bindings).first<{n:number}>();
 const summary=await db.prepare(`SELECT COUNT(*) AS total,SUM(kind='requirement') AS requirements,SUM(kind='application') AS candidates,SUM(status='New') AS fresh,SUM(follow_up != '' AND follow_up <= ? AND status != 'Closed') AS due FROM records WHERE ${visible}`).bind(new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'})).first();
 return Response.json({records:rows.results.map((r:any)=>({...r,data:JSON.parse(r.data)})),total:count?.n??0,page,summary}, {headers});
 }catch(e){console.error('Admin read failed',e);return Response.json({error:'Enquiries could not be loaded. Please try again.'},{status:503,headers})}
}
const update=z.object({id:z.string().uuid(),version:z.number().int().min(0),status:z.enum(['New','Contacted','In progress','Closed']),notes:z.string().max(5000),followUp:z.string().refine(s=>s===''||(/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s))});
export async function PATCH(request:Request){
 if(!await adminIdentity())return Response.json({error:'Admin access required.'},{status:403,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403,headers});
 let value;try{const raw=await request.text();if(raw.length>7000)return Response.json({error:'Notes are too long.'},{status:413,headers});value=update.safeParse(JSON.parse(raw))}catch{return Response.json({error:'Invalid update.'},{status:400,headers})}
 if(!value.success)return Response.json({error:'Check the status, notes and follow-up date.'},{status:400,headers});
 const d=value.data;
 try{const result=await database().prepare(`UPDATE records SET status=?,admin_notes=?,follow_up=?,review_version=review_version+1,reviewed_at=? WHERE id=? AND review_version=? AND ${visible}`).bind(d.status,d.notes,d.followUp,Date.now(),d.id,d.version).run();
 if(!result.meta.changes)return Response.json({error:'This enquiry changed or was removed. Refresh the list and reopen it before saving.'},{status:409,headers});
 return Response.json({ok:true,version:d.version+1},{headers});
 }catch(e){console.error('Admin update failed',e);return Response.json({error:'Changes were not saved. Please try again.'},{status:503,headers})}
}
