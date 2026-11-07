/** Node 22.16+ built-in test runner; no third-party test package or production fixture imports. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { contextKey, applyCommand } from '../model.ts';
import { read, write, reset } from '../storage.ts';

function model(profile = { year: 1, field: null, aid: 'CW' }) {
  return { version: 1, profile, entries: [] };
}
const opportunity = (id='F', requiredField=null) => ({id, requiredField});
function row({ id='F', requiredField=null, unresolved=false, question=null, entry=null, fit='met' }={}) {
  return {
    opportunity: opportunity(id,requiredField), entry, needsReview:false,
    assessment: {
      fit, window:'open', reasons: [],
      application:{outcome:'permitted', reason:'Application terms permit.', evidence:[]},
      holding:{outcome:unresolved?'unresolved':'permitted',reason:unresolved?'Missing holding term.':'Holding terms permit.',evidence:[]},
      question,
    },
  };
}
function storageStub() {
  const values = new Map();
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    clear() { values.clear(); },
  };
}
let store=storageStub();
globalThis.window={localStorage:store};
function prep() {
  store=storageStub();
  globalThis.window={localStorage:store};
  // Explicit reset also releases any prior invalid-data I/O admission latch.
  assert.deepEqual(reset(),{ok:true});
}

test('exact context key: year + aid, field only for field-restricted grant',()=>{
  const p={year:1,field:null,aid:'CW'};
  assert.equal(contextKey(opportunity('F',null),p),'[1,null,"CW"]');
  assert.equal(contextKey(opportunity('F',null),{...p,field:'stem'}),'[1,null,"CW"]');
  assert.equal(contextKey(opportunity('L','stem'),p),'[1,null,"CW"]');
  assert.equal(contextKey(opportunity('L','stem'),{...p,field:'stem'}),'[1,"stem","CW"]');
  assert.equal(contextKey(opportunity('L','stem'),{...p,year:null,field:'stem'}),'[null,"stem","CW"]');
});

test('new save, duplicate save, independent progress and intention changes',()=>{
  let m=model();const r=row();
  const initial=applyCommand(m,{kind:'save',id:'F',intention:'pursue'},r);
  assert.deepEqual(initial.entries,[{id:'F',intention:'pursue',progress:'notStarted',question:null,acknowledgedKey:'[1,null,"CW"]'}]);
  assert.strictEqual(applyCommand(initial,{kind:'save',id:'F',intention:'pursue'},r),initial,'duplicate save must be same reference');
  m=applyCommand(initial,{kind:'progress',id:'F',value:'preparing'},r);
  assert.equal(m.entries[0].progress,'preparing');
  assert.equal(m.entries[0].intention,'pursue');
  assert.equal(m.entries[0].acknowledgedKey,'[1,null,"CW"]');
  m=applyCommand(m,{kind:'save',id:'F',intention:'alternative'},r);
  assert.equal(m.entries[0].intention,'alternative');
  assert.equal(m.entries[0].progress,'preparing');
  assert.equal(m.entries[0].acknowledgedKey,'[1,null,"CW"]');
  m=applyCommand(m,{kind:'progress',id:'F',value:'submittedExternally'},r);
  assert.equal(m.entries[0].progress,'submittedExternally');
  assert.equal(m.entries[0].intention,'alternative');
  assert.equal(initial.entries[0].progress,'notStarted','old snapshots immutable');
});

test('aid change raises review without changing intention or progress; acknowledgement edits only key',()=>{
  let m=applyCommand(model(),{kind:'save',id:'F',intention:'pursue'},row());
  m=applyCommand(m,{kind:'progress',id:'F',value:'preparing'},row());
  const changed={...m,profile:{...m.profile,aid:'FT'}};
  assert.notEqual(changed.entries[0].acknowledgedKey,contextKey(opportunity('F'),changed.profile));
  const before=changed.entries[0];
  const after=applyCommand(changed,{kind:'acknowledge',id:'F'},row({entry:before}));
  assert.deepEqual(after.entries[0],{...before,acknowledgedKey:'[1,null,"FT"]'});
  assert.equal(after.entries[0].progress,'preparing');
  assert.equal(after.entries[0].intention,'pursue');
  assert.equal(after.entries[0].acknowledgedKey,contextKey(opportunity('F'),after.profile));
  assert.strictEqual(applyCommand(after,{kind:'acknowledge',id:'F'},row()),after);
  assert.notEqual(after.entries[0].acknowledgedKey,contextKey(opportunity('F'),{...after.profile,aid:'CW'}));
});

test('unrelated field edit is ignored for F but causes L review; input reversion clears flag',()=>{
  const p={year:1,field:null,aid:'none'};
  const oldF=contextKey(opportunity('F'),p);
  const oldL=contextKey(opportunity('L','stem'),p);
  assert.equal(oldF,contextKey(opportunity('F'),{...p,field:'stem'}));
  assert.notEqual(oldL,contextKey(opportunity('L','stem'),{...p,field:'stem'}));
  assert.equal(oldL,contextKey(opportunity('L','stem'),{...p,field:null}));
});

test('question holds original aid context through aid change and acknowledgement; update is explicit',()=>{
  const qCW='May I keep my Campus Tuition Waiver with Bridge?';
  const qFT='Could I keep Founders Tuition Award with Bridge?';
  let m=applyCommand(model(),{kind:'save',id:'B',intention:'clarify'},row({id:'B',unresolved:true,question:qCW}));
  assert.deepEqual(m.entries[0].question,{text:qCW,aid:'CW'});
  const withFT={...m,profile:{...m.profile,aid:'FT'}};
  m=applyCommand(withFT,{kind:'acknowledge',id:'B'},row({id:'B',unresolved:true,question:qFT}));
  assert.deepEqual(m.entries[0].question,{text:qCW,aid:'CW'});
  m=applyCommand(m,{kind:'progress',id:'B',value:'preparing'},row({id:'B'}));
  assert.deepEqual(m.entries[0].question,{text:qCW,aid:'CW'});
  m=applyCommand(m,{kind:'updateQuestion',id:'B'},row({id:'B',unresolved:true,question:qFT}));
  assert.deepEqual(m.entries[0].question,{text:qFT,aid:'FT'});
  assert.equal(m.entries[0].progress,'preparing');
  assert.equal(m.entries[0].acknowledgedKey,'[1,null,"FT"]');
});

test('question changes require currently unresolved evaluation; reject invalid clarify and wrong row',()=>{
  const m=model();
  assert.strictEqual(applyCommand(m,{kind:'save',id:'B',intention:'clarify'},row({id:'B',unresolved:false,question:'Some text'})),m);
  assert.strictEqual(applyCommand(m,{kind:'save',id:'B',intention:'clarify'},row({id:'B',unresolved:true,question:null})),m);
  assert.strictEqual(applyCommand(m,{kind:'save',id:'F',intention:'pursue'},row({id:'B'})),m);
  const saved=applyCommand(m,{kind:'save',id:'F',intention:'pursue'},row());
  assert.strictEqual(applyCommand(saved,{kind:'updateQuestion',id:'F'},row({question:'No unresolved stage.'})),saved);
  assert.strictEqual(applyCommand(saved,{kind:'save',id:'F',intention:'clarify'},row()),saved);
  const changed=applyCommand(saved,{kind:'save',id:'F',intention:'clarify'},row({unresolved:true,question:'Could I apply?'}));
  assert.deepEqual(changed.entries[0].question,{text:'Could I apply?',aid:'CW'});
  assert.equal(changed.entries[0].intention,'clarify');
  const alternative=applyCommand(changed,{kind:'save',id:'F',intention:'alternative'},row());
  assert.deepEqual(alternative.entries[0].question,changed.entries[0].question);
  assert.equal(applyCommand(alternative,{kind:'remove',id:'F'},row()).entries.length,0);
});

test('storage starts empty, roundtrips saved plan and preserves another origin key through reset',()=>{
  prep();store.setItem('another.feature','KEEP');
  assert.deepEqual(read(),{kind:'empty'});
  const saved=applyCommand(model(),{kind:'save',id:'F',intention:'pursue'},row());
  assert.deepEqual(write(saved),{ok:true});
  assert.deepEqual(read(),{kind:'ok',model:saved});
  assert.deepEqual(reset(),{ok:true});
  assert.deepEqual(read(),{kind:'empty'});
  assert.equal(store.getItem('another.feature'),'KEEP');
});

test('validation denies duplicate IDs, malformed keys and wrong version without writing',()=>{
  prep();const good=applyCommand(model(),{kind:'save',id:'F',intention:'pursue'},row());
  assert.equal(write({...good,entries:[good.entries[0],good.entries[0]]}).ok,false);
  assert.equal(write({...good,version:2}).ok,false);
  assert.equal(write({...good,entries:[{...good.entries[0],acknowledgedKey:'[1,"invalid","CW"]'}]}).ok,false);
  assert.equal(write({...good,entries:[{...good.entries[0],additionalSnapshot:'historical'}]}).ok,false);
  assert.equal(store.getItem('grantly.v1'),null);
});

test('malformed JSON and wrong version remain untouched, block write until explicit reset',()=>{
  prep();const good=model();
  store.setItem('grantly.v1','{BROKEN JSON');
  assert.deepEqual(read(),{kind:'invalid'});
  assert.equal(write(good).ok,false);
  assert.equal(store.getItem('grantly.v1'),'{BROKEN JSON');
  assert.deepEqual(reset(),{ok:true});
  store.setItem('grantly.v1',JSON.stringify({...good,version:4}));
  assert.deepEqual(read(),{kind:'invalid'});
  assert.equal(write(good).ok,false);
  assert.equal(JSON.parse(store.getItem('grantly.v1')).version,4);
  assert.deepEqual(reset(),{ok:true});
  assert.deepEqual(write(good),{ok:true});
});

test('localStorage getter refusal returns unavailable, blocks writes; reset failure is truthful',()=>{
  prep();
  globalThis.window=Object.defineProperty({},'localStorage',{get(){throw new Error('SecurityError');}});
  assert.deepEqual(read(),{kind:'unavailable'});
  assert.equal(write(model()).ok,false);
  assert.deepEqual(reset(),{ok:false,message:'Couldn’t clear this device’s saved plan.'});
  globalThis.window={localStorage:store};
  assert.deepEqual(reset(),{ok:true});
  assert.deepEqual(write(model()),{ok:true});
});

test('getItem refusal is unavailable; setItem throws and leaves saved memory snapshot unaffected',()=>{
  prep();
  const brokenRead={...store,getItem(){throw new Error('get denied');}};
  globalThis.window={localStorage:brokenRead};
  assert.deepEqual(read(),{kind:'unavailable'});
  globalThis.window={localStorage:store};assert.deepEqual(reset(),{ok:true});
  globalThis.window={localStorage:{...store,setItem(){throw new Error('quota');}}};
  const snapshot=model();
  assert.equal(write(snapshot).ok,false);
  assert.deepEqual(snapshot,model());
  assert.equal(store.getItem('grantly.v1'),null);
  globalThis.window={localStorage:store};assert.deepEqual(reset(),{ok:true});
});

test('failed and no-op removeItem cannot pretend reset succeeded; previous bytes remain',()=>{
  prep();
  store.setItem('grantly.v1',JSON.stringify(model()));
  globalThis.window={localStorage:{...store,removeItem(){throw new Error('blocked');}}};
  assert.equal(reset().ok,false);
  assert.notEqual(store.getItem('grantly.v1'),null);
  globalThis.window={localStorage:{...store,removeItem(){ /* malicious no-op */ }}};
  assert.equal(reset().ok,false);
  assert.notEqual(store.getItem('grantly.v1'),null);
  globalThis.window={localStorage:store};assert.deepEqual(reset(),{ok:true});
});

test('silent no-op setItem must not be reported as saved',()=>{
  prep();
  globalThis.window={localStorage:{...store,setItem(){ /* refuses without throwing */ }}};
  assert.equal(write(model()).ok,false);
  assert.equal(store.getItem('grantly.v1'),null);
  globalThis.window={localStorage:store};assert.deepEqual(reset(),{ok:true});
});
