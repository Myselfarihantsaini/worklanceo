import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--config','github-pages/vite.config.ts'],{stdio:'inherit'});
const template=await readFile('work/pages-build/index.html','utf8');
const pages={
 home:['Frontline Recruitment & Bulk Hiring | WorkLanceo','Plan permanent recruitment and bulk frontline hiring across logistics, warehousing, retail and manufacturing. Submit requirements and explore workforce planning tools.'],
 solutions:['Recruitment Services | WorkLanceo','Explore permanent recruitment, bulk hiring and workforce service models. Discuss scope and commercial terms for your hiring requirements.'],
 resources:['Hiring Resources & Onboarding Guides | WorkLanceo','Prepare a hiring brief, review recruitment models and organise joining readiness with practical hiring resources.'],
 tools:['Hiring Cost & Workforce Planning Tools | WorkLanceo','Compare recruitment costs, estimate workforce budgets, plan shift coverage and prepare an onboarding checklist.'],
 about:['About WorkLanceo | Recruitment & Workforce Planning','Learn about WorkLanceo’s approach to frontline recruitment, clear hiring requirements and workforce planning.'],
 privacy:['Privacy Notice | WorkLanceo','Read how WorkLanceo handles hiring requirements, contact details, saved records and access to your workspace.'],
 terms:['Terms of Use | WorkLanceo','Review the terms for WorkLanceo enquiries, workforce planning tools and recruitment service discussions.'],
 hire:['Submit a Hiring Requirement | WorkLanceo','Plan your next hire with WorkLanceo. Review the details needed for your brief and continue to our secure service to submit and track it.']
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const server=await createServer({configFile:'github-pages/vite.config.ts',server:{middlewareMode:true},appType:'custom'});
try{
 const {render}=await server.ssrLoadModule('/render.tsx');
 for(const [page,[title,description]] of Object.entries(pages)){
  const url='https://shambhavaa.com/worklanceo/'+(page==='home'?'':page+'/');
  const head=`<link rel="canonical" href="${url}"/><meta property="og:type" content="website"/><meta property="og:site_name" content="WorkLanceo"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${url}"/>`;
  const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*"\/>/,`<meta name="description" content="${escape(description)}"/>`).replace('</head>',head+'</head>').replace('<div id="root"></div>',()=>`<div id="root">${render(page)}</div><noscript><p style="padding:1rem">You can read our services and follow links without JavaScript. Enable JavaScript to use calculators, checklists and interactive controls.</p></noscript>`);
  const dir='work/pages-build'+(page==='home'?'':'/'+page);await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);
 }
 for(const page of ['workspace','admin','jobs']){
  const target=page==='jobs'?'hire':page;
  const url='https://kaamsetu-workforce.diprish.chatgpt.site/'+target;
  const body=`<main><h1>WorkLanceo secure service</h1><p>Continue to our secure service to sign in. It opens on kaamsetu-workforce.diprish.chatgpt.site.</p><a href="${url}">Continue securely</a><p><a href="/worklanceo/">Back to WorkLanceo</a></p></main>`;
  await mkdir(`work/pages-build/${page}`,{recursive:true});await writeFile(`work/pages-build/${page}/index.html`,template.replace('</head>','<meta name="robots" content="noindex, nofollow"/></head>').replace('<div id="root"></div>',`<div id="root">${body}</div>`));
 }
 await writeFile('work/pages-build/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(p=>'<url><loc>https://shambhavaa.com/worklanceo/'+(p==='home'?'':p+'/')+'</loc></url>').join('')+'</urlset>');
 await writeFile('work/pages-build/.nojekyll','');
}finally{await server.close()}
