import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--config','github-pages/vite.config.ts'],{stdio:'inherit'});
const html=await readFile('work/pages-build/index.html','utf8');
for(const route of ['solutions','resources','tools','about','privacy','terms','hire','workspace','admin','jobs']){
 await mkdir(`work/pages-build/${route}`,{recursive:true});
 const pageHtml=route==='admin'?html.replace('</head>','<meta name="robots" content="noindex, nofollow"/></head>'):html;
 await writeFile(`work/pages-build/${route}/index.html`,pageHtml);
}
await writeFile('work/pages-build/.nojekyll','');
