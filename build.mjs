import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/ui.tsx'],bundle:true,format:'esm',outdir:'dist',target:'chrome114',minify:true,jsx:'automatic'});
await build({entryPoints:['src/content.ts'],bundle:true,format:'iife',outfile:'dist/content.js',target:'chrome114',minify:true});
await build({entryPoints:['src/background.ts'],bundle:true,format:'esm',outfile:'dist/background.js',target:'chrome114',minify:true});
await copyFile('manifest.json','dist/manifest.json');
for(const name of ['popup','sidepanel'])await writeFile(`dist/${name}.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AbleVerse AI</title><link rel="stylesheet" href="ui.css"></head><body><div id="root"></div><script type="module" src="ui.js"></script></body></html>`);
console.log('Load unpacked: dist/');
