import { cp, mkdtemp, readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
if(!process.env.MARTLET_CORE_SOURCE)throw new Error('Set MARTLET_CORE_SOURCE to a built martlettheme/npm checkout.');
const core=resolve(process.env.MARTLET_CORE_SOURCE);
const temp=await mkdtemp(join(tmpdir(),'martlet-packed-'));
try {
  const pack=cwd=>JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',temp],{cwd,encoding:'utf8',stdio:['ignore','pipe','inherit']}))[0].filename;
  const coreArchive=pack(core),astroArchive=pack(root);
  const site=join(temp,'site');await cp(join(root,'starter'),site,{recursive:true});await mkdir(join(site,'vendor'));
  for(const archive of [coreArchive,astroArchive])await cp(join(temp,archive),join(site,'vendor',archive));
  const pkg=JSON.parse(await readFile(join(site,'package.json'),'utf8'));
  pkg.dependencies['@martlet/theme']='file:vendor/'+coreArchive;
  pkg.dependencies['@martlet/astro']='file:vendor/'+astroArchive;
  if(process.env.MARTLET_ASTRO_VERSION)pkg.dependencies.astro=process.env.MARTLET_ASTRO_VERSION;
  await writeFile(join(site,'package.json'),JSON.stringify(pkg,null,2)+'\n');
  execFileSync('npm',['install','--ignore-scripts','--no-audit','--no-fund'],{cwd:site,stdio:'inherit'});
  execFileSync('npm',['run','build'],{cwd:site,stdio:'inherit'});
  const html=await readFile(join(site,'dist/index.html'),'utf8');
  assert.match(html,/data-martlet="light"/);assert.match(html,/data-martlet="dark"/);
  assert.match(html,/id="main-content"/);assert.match(html,/type="button"[^>]*disabled|disabled[^>]*type="button"/);
  const assets=join(site,'dist/_astro');const files=await readdir(assets);
  const css=(await Promise.all(files.filter(x=>x.endsWith('.css')).map(x=>readFile(join(assets,x),'utf8')))).join('\n');
  for(const family of ['Cambo','Lato','Cinzel','IBM Plex Mono'])assert.ok(css.includes(family),family);
  assert.ok(files.some(x=>x.endsWith('.woff2')),'Local fonts are emitted by the consuming build');
  assert.doesNotMatch(css,/fonts\.googleapis\.com|fonts\.gstatic\.com|Space Grotesk|DM Sans/);
  for (const route of ['article','documentation','layouts']) {
    const page=await readFile(join(site,'dist',route,'index.html'),'utf8');
    assert.equal((page.match(/<main\b/g)||[]).length,1,route+' should have one main landmark');
    assert.equal((page.match(/<h1\b/g)||[]).length,1,route+' should have one page h1');
    assert.match(page,/martlet-site-header/);assert.match(page,/martlet-site-footer/);
  }
  const article=await readFile(join(site,'dist/article/index.html'),'utf8');
  assert.match(article,/name="example-head" content="forwarded"/);
  assert.match(article,/id="body-end-example"/);
  assert.ok(article.indexOf('martlet-sidebar__main')<article.indexOf('martlet-sidebar__aside'));
  const guide=await readFile(join(site,'dist/documentation/index.html'),'utf8');
  assert.ok(guide.indexOf('martlet-sidebar__aside')<guide.indexOf('martlet-sidebar__main'));
  if(process.env.MARTLET_BROWSER === '1') execFileSync(process.execPath,[join(root,'scripts/browser.mjs'),join(site,'dist')],{cwd:root,stdio:'inherit'});
  console.log('Packed starter build passed: both modes, all font roles, local font assets, and native button behavior.');
} finally { if (!process.env.MARTLET_KEEP_FIXTURE) await rm(temp,{recursive:true,force:true}); }
