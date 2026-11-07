import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const read = p => readFileSync(p,'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
assert.equal(lock.lockfileVersion,3);
assert.equal(lock.name,pkg.name);
assert.deepEqual(lock.packages[''].dependencies,pkg.dependencies);
assert.deepEqual(lock.packages[''].devDependencies,pkg.devDependencies);
for(const [name,version] of Object.entries({...pkg.dependencies,...pkg.devDependencies})) {
  assert.equal(lock.packages[`node_modules/${name}`]?.version,version,`Locked root ${name}`);
}
for(const [path,rec] of Object.entries(lock.packages)) {
  for(const dep of Object.keys(rec.dependencies||{})) {
    assert.ok(lock.packages[`node_modules/${dep}`],`${path} has missing node ${dep}`);
  }
}
const contracts=read('src/shared/contracts.ts');
for(const name of ['Id','Aid','Year','Field','Profile','Stage','Clause','Terms','Opportunity','Preset','Fit','Reason','Evidence','StageResult','Assessment','Intention','Progress','Question','Entry','Model','Row','ListState','Page','Command','DiscoverProps','DetailProps','PlanProps','ReadResult','IOResult']){
  assert.match(contracts,new RegExp(`export type ${name}\\b`),`G1 declaration ${name}`);
}
for(const path of ['src/App.tsx','src/main.tsx','src/integration/live.tsx','src/shared/defaults.ts']) {
  assert.ok(!/from\s*['"][^'"]*fixtures/.test(read(path)),`${path} imports fixtures`);
}
assert.match(read('vite.config.ts'),/input:\s*'index\.html'/);
for(const missingOwner of ['src/domain','src/discovery','src/plan']){
  assert.ok(!existsSync(missingOwner),`A did not claim B/C/D path ${missingOwner}`);
}
const fixture=read('src/integration/fixtures.ts');
for(const name of ['meridianCW','fieldworkFT','bridgeCW','meridianNoAid','savedReviewRow','specimenEmptyIndex','specimenDetail','specimenDiscover','specimenPlan']) assert.ok(fixture.includes(name),`Missing specimen ${name}`);
const focus=read('src/integration/FOCUS_AND_TRANSFER.md');
for(const name of ['g-detail-heading','g-opportunity-row-','g-results-list','g-profile-editor','g-plan-open-','g-live-assessment']) assert.ok(focus.includes(name),`Missing focus target ${name}`);
console.log(`G1 VERIFY PASS · ${Object.keys(lock.packages).length} lock nodes · 29 exported declarations · preview isolated · B/C/D paths untouched`);
