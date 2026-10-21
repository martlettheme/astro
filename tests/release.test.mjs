import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const pkg=JSON.parse(readFileSync(new URL('package.json',root),'utf8'));
const repository=pkg.repository.url.replace(/^git\+https:\/\/github.com\//,'').replace(/\.git$/,'');
const run=env=>spawnSync(process.execPath,['scripts/check-release.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,RELEASE_TAG:'v'+pkg.version,GITHUB_REPOSITORY:repository,...env},timeout:5000});
test('release guard accepts matching metadata and rejects mismatched tags or publishers',()=>{
 assert.equal(run({}).status,0);
 assert.notEqual(run({RELEASE_TAG:'v0.0.0-invalid'}).status,0);
 assert.notEqual(run({GITHUB_REPOSITORY:'different/repository'}).status,0);
});
