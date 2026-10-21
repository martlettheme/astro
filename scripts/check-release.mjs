import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
assert.match(pkg.version,/^\d+\.\d+\.\d+$/,'Only stable versions are published by this workflow');
assert.equal(process.env.RELEASE_TAG,'v'+pkg.version,'Release tag must match package.json');
const repository=pkg.repository.url.replace(/^git\+/,'').replace(/\.git$/,'');
assert.equal(repository,'https://github.com/'+process.env.GITHUB_REPOSITORY,'Package repository must match this publisher');
console.log('Release identity verified for '+pkg.name+'@'+pkg.version);
