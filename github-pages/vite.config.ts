import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({root:path.resolve('github-pages'),base:'/',publicDir:path.resolve('public'),plugins:[react()],resolve:{alias:{'@':path.resolve('.')}},build:{outDir:path.resolve('work/pages-build'),emptyOutDir:true},server:{host:'127.0.0.1'}});
