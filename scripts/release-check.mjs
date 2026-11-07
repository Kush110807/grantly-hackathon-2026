/** A-owned correction-presence gate. This is NOT an integrated browser acceptance test. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const get=(file)=>readFileSync(join(root,file),'utf8');
const plan=get('src/plan/index.tsx'),app=get('src/App.tsx'),live=get('src/integration/live.tsx');
const checks=[
  ['D storage-neutral plan heading',plan.includes('YOUR DECISIONS / YOUR PLAN')],
  ['D obsolete heading absent',!plan.includes('SAVED ON THIS DEVICE')],
  ['A unconditional browser storage claim absent',!app.includes('Stored in this browser.')],
  ['A neutral study-context intro',app.includes('Change any field to update the listed assessment below.')],
  ['A live region retained',app.includes('id="g-live-assessment"')&&app.includes('aria-live="polite"')],
  ['A result-specific live announcement',app.includes('const outcome=assess(selectedRow.opportunity,next.profile)')&&app.includes('outcome.holding.outcome')],
  ['Production adapter stays real',live.includes("from '../domain'")&&live.includes("from '../discovery'")&&live.includes("from '../plan'")],
  ['Production React entry excludes fixtures',!get('src/main.tsx').includes('fixtures')],
  ['A App excludes preview fixtures',!app.includes("from './integration/fixtures'")],
];
for(const [name,condition] of checks){assert.ok(condition,name);console.log('PASS:',name)}
console.log(`Static correction assertions PASS: ${checks.length}/${checks.length}. Browser retest still required.`);
