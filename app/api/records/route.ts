import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {database} from '../../../db/raw';
import {z} from 'zod';
import { sendEmail } from '../../email';

const schema=z.object({kind:z.enum(['requirement','application','checklist']),title:z.string().trim().min(2).max(160),data:z.record(z.string(),z.union([z.string().max(4000),z.number(),z.boolean(),z.array(z.boolean())]))});
export async function GET(){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to view your workspace.'},{status:401});try{const r=await database().prepare('SELECT id,kind,title,status,data,created FROM records WHERE owner = ? ORDER BY created DESC LIMIT 200').bind(user.userId).all();return Response.json({records:r.results.map((x:any)=>({...x,data:JSON.parse(x.data)}))},{headers:{'Cache-Control':'no-store'}})}catch(e){console.error('Record read failed',e);return Response.json({error:'Your workspace is temporarily unavailable. Please try again.'},{status:503})}}

async function handleNotification(email: string, name: string, kind: string, title: string) {
  const adminEmail = env.ADMIN_EMAIL;
  const apiKey = env.RESEND_API_KEY as string;
  if (!apiKey || !adminEmail) return;
  
  // 1. Email to User
  await sendEmail(apiKey, email, `Confirmation: Your ${kind} was received`, `
    <h3>Hello ${name},</h3>
    <p>We have successfully received your submission for: <b>${title}</b>.</p>
    <p>Our team at Worklanceo will review it and get back to you shortly.</p>
    <br/>
    <p>Best regards,<br/>The Worklanceo Team</p>
  `);
  
  // 2. Email to Admin
  await sendEmail(apiKey, adminEmail, `New ${kind} submitted: ${title}`, `
    <h3>New Submission Alert</h3>
    <p>A new ${kind} was just submitted by <b>${name}</b> (${email}).</p>
    <p>Title: ${title}</p>
    <p>Log into the <a href="https://worklanceo.com/admin">Admin Dashboard</a> to view the full details.</p>
  `);
}

export async function POST(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to save your details.'},{status:401});if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});try{const raw=await request.text();if(raw.length>22000)return Response.json({error:'Please shorten your details.'},{status:413});let payload:unknown;try{payload=JSON.parse(raw)}catch{return Response.json({error:'Invalid JSON request.'},{status:400})}const parsed=schema.safeParse(payload);if(!parsed.success)return Response.json({error:'Check the required fields and try again.'},{status:400});const {kind,title,data}=parsed.data;for(const key of Object.keys(data)){if(typeof data[key]==='string')data[key]=(data[key] as string).trim()}
const required=(keys:string[])=>keys.every(k=>typeof data[k]==='string'&&(data[k] as string).length>0);
const numeric=(value:unknown)=>((typeof value==='string'&&value.trim()!=='')||typeof value==='number')&&Number.isFinite(Number(value));
if(kind!=='checklist'&&(data.consent!==true||!required(['name','phone','city'])))return Response.json({error:'Name, phone, location and consent are required.'},{status:400});
if(kind!=='checklist'&&!/^[6-9]\d{9}$/.test(String(data.phone)))return Response.json({error:'Enter a valid 10-digit Indian mobile number.'},{status:400});
if(kind==='requirement'&&!required(['company','email','role','service','joiningDate','shifts']))return Response.json({error:'Complete all required hiring fields.'},{status:400});
if(kind!=='checklist'&&data.email&&!z.string().email().safeParse(data.email).success)return Response.json({error:'Enter a valid email address.'},{status:400});
if(kind==='requirement'&&(!numeric(data.headcount)||!Number.isInteger(Number(data.headcount))||Number(data.headcount)<1||Number(data.headcount)>100000))return Response.json({error:'Headcount must be a whole number from 1 to 100,000.'},{status:400});
if(kind==='requirement'&&(!numeric(data.salaryMin)||!numeric(data.salaryMax)||Number(data.salaryMin)<=0||Number(data.salaryMax)<Number(data.salaryMin)))return Response.json({error:'Enter a valid salary range.'},{status:400});
if(kind==='requirement'){const date=String(data.joiningDate);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)return Response.json({error:'Enter a valid joining date.'},{status:400})}
if(kind==='application'&&(!required(['skills'])||(data.expectedSalary!==undefined&&data.expectedSalary!==''&&(!numeric(data.expectedSalary)||Number(data.expectedSalary)<0))))return Response.json({error:'Check your skills and expected salary.'},{status:400});
if(kind==='checklist'&&(!Array.isArray(data.checks)||data.checks.length!==9))return Response.json({error:'Invalid onboarding checklist.'},{status:400});
if(data.resumeKey&&(typeof data.resumeKey!=='string'||!data.resumeKey.startsWith(user.userId+'/')))return Response.json({error:'Invalid résumé reference.'},{status:400});if(kind!=='checklist'&&data.sharedWithTeam===true){data.submittedAt=Date.now()}else{delete data.sharedWithTeam;delete data.submittedAt}const id=crypto.randomUUID();await database().prepare('INSERT INTO records (id,owner,kind,title,status,data,created) VALUES (?,?,?,?,?,?,?)').bind(id,user.userId,kind,title,data.sharedWithTeam===true?'New':'Saved',JSON.stringify(data),Date.now()).run();

// SEND NOTIFICATION
if (data.sharedWithTeam === true && data.email && data.name) {
  // Fire and forget so we don't block response
  handleNotification(data.email as string, data.name as string, kind, title).catch(console.error);
}

return Response.json({id},{status:201})}catch(e){console.error('Record save failed',e);return Response.json({error:'We could not save your details. Your form is still here; please try again.'},{status:503})}}
export async function DELETE(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403});try{const {id}=await request.json() as {id?:unknown};if(typeof id!=='string')return Response.json({error:'Invalid record.'},{status:400});const row=await database().prepare('SELECT data FROM records WHERE id = ? AND owner = ?').bind(id,user.userId).first<{data:string}>();if(row){const key=JSON.parse(row.data).resumeKey;if(typeof key==='string'&&key.startsWith(user.userId+'/')){if(!env.BUCKET)throw Error('Storage unavailable');await env.BUCKET.delete(key)}}await database().prepare('DELETE FROM records WHERE id = ? AND owner = ?').bind(id,user.userId).run();return Response.json({ok:true})}catch{return Response.json({error:'Could not remove the record.'},{status:503})}}

export async function PATCH(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403});
 try{const payload=await request.json() as {id?:string,consent?:boolean};if(typeof payload.id!=='string'||payload.consent!==true)return Response.json({error:'Consent is required to submit this record to the recruitment team.'},{status:400});
 const r=await database().prepare("UPDATE records SET data=json_set(data,'$.sharedWithTeam',json('true'),'$.submittedAt',?),status='New' WHERE id=? AND owner=? AND kind IN ('requirement','application') AND COALESCE(json_extract(data,'$.sharedWithTeam'),0)=0").bind(Date.now(),payload.id,user.userId).run();
 if(!r.meta.changes)return Response.json({error:'Record already submitted or unavailable.'},{status:409});
 
 // Need to fetch the record to send email since we just patched it
 const row = await database().prepare("SELECT data, kind, title FROM records WHERE id=? AND owner=?").bind(payload.id, user.userId).first<{data: string, kind: string, title: string}>();
 if (row) {
   const data = JSON.parse(row.data);
   if (data.email && data.name) {
     handleNotification(data.email, data.name, row.kind, row.title).catch(console.error);
   }
 }

 return Response.json({ok:true});
 }catch{return Response.json({error:'Could not submit this record. Please try again.'},{status:503})}
}
