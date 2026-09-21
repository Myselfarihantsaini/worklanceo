import { getChatGPTUser,chatGPTSignInPath } from '../chatgpt-auth';
import { isAdmin } from '../admin-auth';
import Dashboard from './dashboard';
export const dynamic = 'force-dynamic';
export const metadata = { title:'Admin dashboard | KaamSetu', robots:{index:false,follow:false} };
export default async function AdminPage(){
 const user=await getChatGPTUser();
 if(!user || !isAdmin(user)) return <main className="wrap section"><p className="eyebrow">KAAMSETU · ADMINISTRATION</p><h1>{user?'Access restricted':'Your recruitment desk.'}</h1><p className="lead">{user?'This account does not have admin access. Sign in with the site owner’s account.':'Sign in with the site owner’s ChatGPT account to manage enquiries and candidate submissions.'}</p><div className="actions"><a className="button dark" href={user?'/signout-with-chatgpt?return_to=/admin':chatGPTSignInPath('/admin')} target="_top">{user?'Switch account':'Sign in to admin'}</a><a className="button white" href="/">Back to website</a></div></main>;
 return <Dashboard name={user.displayName}/>;
}
