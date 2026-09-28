import Site from '../site';
import {notFound,redirect} from 'next/navigation';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(section==='jobs')redirect('/hire');if(!['candidates','solutions','tools','resources','workspace','hire','privacy','terms','about'].includes(section))notFound();return <Site page={section}/>}
