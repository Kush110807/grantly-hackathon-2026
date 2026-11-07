/** A-owned integrated static + pure logic gate. Does not claim React/browser QA. */
import { readFileSync, existsSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let n=0;
function ok(condition,label){assert.ok(condition,label);n++;}
const paths = [
  'src/domain/index.ts','src/domain/oracle.check.ts',
  'src/discovery/index.tsx','src/discovery/discovery.css',
  'src/plan/index.tsx','src/plan/model.ts','src/plan/storage.ts','src/plan/plan.css',
  'src/integration/live.tsx','src/App.tsx','src/shared/contracts.ts','src/styles/global.css'
];
for(const p of paths) ok(existsSync(join(root,p)), `Required integrated file ${p}`);
const live = readFileSync(join(root,'src/integration/live.tsx'),'utf8');
for(const name of ["from '../domain'", "from '../discovery'", "from '../plan'", "from '../plan/model'", "from '../plan/storage'"])
  ok(live.includes(name), `Production adapter must include ${name}`);
for(const p of ['src/main.tsx','src/App.tsx','src/integration/live.tsx']) {
  const text=readFileSync(join(root,p),'utf8');
  ok(!/from\s*['"][^'"]*(fixtures|preview-main)/.test(text), `No fixture import into ${p}`);
}
for(const p of ['src/discovery/index.tsx','src/plan/index.tsx']) {
  const text=readFileSync(join(root,p),'utf8');
  ok(!/from\s*['"][^'"]*\/integration\/fixtures/.test(text), `No fixture import in ${p}`);
}
for(const [name,p] of Object.entries({detail:'src/discovery/index.tsx',rows:'src/discovery/index.tsx',list:'src/discovery/index.tsx',profile:'src/App.tsx',plan:'src/plan/index.tsx'})) {
  const content=readFileSync(join(root,p),'utf8');
  const snippet={detail:'g-detail-heading',rows:'g-opportunity-row-',list:'g-results-list',profile:'FOCUS.profileEditor',plan:'g-plan-open-'}[name];
  ok(content.includes(snippet), `Focus target ${name}`);
}
const temp = mkdtempSync(join(tmpdir(),'grantly-check-'));
try {
  writeFileSync(join(temp,'package.json'),'{"type":"commonjs"}\n');
  mkdirSync(join(temp,'types'));
  let tsc=join(root,'node_modules/typescript/bin/tsc');
  let cmd=process.execPath, base=[tsc];
  if(!existsSync(tsc)) {cmd='tsc';base=[];}
  const args=[...base,'--module','commonjs','--moduleResolution','node','--target','ES2022',
    '--strict','--skipLibCheck','--typeRoots',join(temp,'types'),'--rootDir','src','--outDir',temp,
    'src/shared/contracts.ts','src/domain/index.ts','src/domain/oracle.check.ts','src/plan/model.ts','src/plan/storage.ts'];
  const build=spawnSync(cmd,args,{cwd:root,encoding:'utf8'});
  if(build.status!==0) throw new Error('Pure TypeScript compile FAILED:\n'+build.stdout+'\n'+build.stderr);
  const req=createRequire(join(temp,'package.json'));
  const domain=req(join(temp,'domain/index.js'));
  const plan=req(join(temp,'plan/model.js'));
  const profile=(aid='none',year=1,field=null)=>({year,field,aid});
  const row=(id,p,entry=null)=>{const opportunity=domain.catalogue.find(o=>o.id===id);assert.ok(opportunity);return {opportunity,assessment:domain.assess(opportunity,p),entry,needsReview:Boolean(entry&&entry.acknowledgedKey!==plan.contextKey(opportunity,p))};};
  let model={version:1,profile:profile('CW'),entries:[]};
  const f=row('F',model.profile);
  ok(f.assessment.application.outcome==='permitted'&&f.assessment.holding.outcome==='permitted','CW Fieldwork permits both stages');
  model=plan.applyCommand(model,{kind:'save',id:'F',intention:'pursue'},f);
  ok(model.entries.length===1 && model.entries[0].acknowledgedKey===plan.contextKey(f.opportunity,model.profile),'Saved Fieldwork context');
  model=plan.applyCommand(model,{kind:'progress',id:'F',value:'preparing'},row('F',model.profile,model.entries[0]));
  model={...model,profile:profile('FT')};
  const changed=row('F',model.profile,model.entries[0]);
  ok(changed.needsReview && changed.assessment.holding.outcome==='prohibited' && changed.assessment.application.outcome==='permitted','Aid switch triggers review and FT holding veto');
  ok(model.entries[0].progress==='preparing'&&model.entries[0].intention==='pursue','Saved intention/progress survive aid change');
  const acknowledged=plan.applyCommand(model,{kind:'acknowledge',id:'F'},changed);
  ok(acknowledged.entries[0].acknowledgedKey===plan.contextKey(changed.opportunity,model.profile),'Explicit acknowledgement updates key');
  const bridge=row('B',profile('CW'));
  ok(bridge.assessment.holding.outcome==='unresolved'&&bridge.assessment.question==='May I keep my Campus Tuition Waiver if I accept the Bridge Travel Bursary?','CW Bridge question exact');
  const bridgeModel={version:1,profile:profile('CW'),entries:[]};
  const clarified=plan.applyCommand(bridgeModel,{kind:'save',id:'B',intention:'clarify'},bridge);
  const switched={...clarified,profile:profile('FT')};
  ok(switched.entries[0].question.aid==='CW' && domain.assess(bridge.opportunity,switched.profile).holding.outcome==='prohibited','Bridge original question survives FT veto');
  const digital=row('D',profile('CW'));
  ok(digital.assessment.window==='closed','Digital closed on demo day');
  // Run the complete B oracle from the same compiled files.
  const oracle=spawnSync(process.execPath,[join(temp,'domain/oracle.check.js')],{encoding:'utf8'});
  if(oracle.status!==0) throw new Error('Domain oracle FAILED:\n'+oracle.stdout+'\n'+oracle.stderr);
  console.log(oracle.stdout.trim());
  console.log(`Integrated static and B/D cross-lane assertions PASS: ${n}/${n}`);
} finally { rmSync(temp,{recursive:true,force:true}); }
