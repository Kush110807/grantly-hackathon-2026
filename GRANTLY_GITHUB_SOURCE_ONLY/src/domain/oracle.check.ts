/**
 * Domain-only rule oracle: compile to temporary CommonJS and run with Node.
 * Never imported by the production index or other lanes.
 * From repo root (Node 20.19+, TypeScript 5.9+ installed):
 *   npx tsc --target ES2022 --module commonjs --strict --noUncheckedIndexedAccess --skipLibCheck --outDir .domain-oracle src/domain/oracle.check.ts
 *   node -e "require('fs').writeFileSync('.domain-oracle/package.json',JSON.stringify({type:'commonjs'}))"
 *   node .domain-oracle/domain/oracle.check.js
 * Remove .domain-oracle after running; it is local test output, not a deliverable.
 */
import type { Assessment, Aid, Opportunity, Profile } from '../shared/contracts';
import { assess, catalogue, presets, DEMO_DAY } from './index';

let checks = 0;
const failures: string[] = [];
function eq<T>(label: string, actual: T, expected: T): void {
  checks += 1;
  if (actual !== expected) failures.push(`${label}: expected ${String(expected)}, actual ${String(actual)}`);
}
function truth(label: string, value: unknown): void {
  checks += 1;
  if (!value) failures.push(`${label}: expected truthy, actual ${String(value)}`);
}
function has(label: string, value: string, needle: string): void {
  checks += 1;
  if (!value.includes(needle)) failures.push(`${label}: expected to contain ${JSON.stringify(needle)}, actual ${JSON.stringify(value)}`);
}
function get(id: Opportunity['id']): Opportunity {
  const item = catalogue.find(o => o.id === id);
  if (!item) throw new Error(`Required opportunity ${id} missing`);
  return item;
}
function result(id: Opportunity['id'], year: Profile['year'], aid: Aid,
  field: Profile['field'] = null, day?: string): Assessment {
  return assess(get(id), {year, field, aid}, day);
}
function rowCase(label: string, id: Opportunity['id'], year: Profile['year'], aid: Aid,
  field: Profile['field'], fit: Assessment['fit'], window: Assessment['window'],
  applying: Assessment['application']['outcome'], holding: Assessment['holding']['outcome'],
  primary: Assessment['primary']): void {
  const actual = result(id,year,aid,field);
  eq(`${label} fit`, actual.fit, fit);
  eq(`${label} window`, actual.window, window);
  eq(`${label} application`, actual.application.outcome, applying);
  eq(`${label} holding`, actual.holding.outcome, holding);
  eq(`${label} primary`, actual.primary, primary);
}

// All eleven mandatory oracle rows in 04_DATASET_AND_RULES.md.
rowCase('M y1 none', 'M', 1, 'none', null, 'met', 'open', 'notApplicable', 'notApplicable', 'pursue');
rowCase('M y1 CW', 'M', 1, 'CW', null, 'met', 'open', 'permitted', 'prohibited', 'alternative');
rowCase('F y1 CW', 'F', 1, 'CW', null, 'met', 'open', 'permitted', 'permitted', 'pursue');
rowCase('F y1 FT', 'F', 1, 'FT', null, 'met', 'open', 'permitted', 'prohibited', 'alternative');
rowCase('C y2 CW', 'C', 2, 'CW', null, 'met', 'open', 'restricted', 'prohibited', 'explore');
rowCase('B y1 CW', 'B', 1, 'CW', null, 'met', 'open', 'permitted', 'unresolved', 'clarify');
rowCase('B y1 FT', 'B', 1, 'FT', null, 'met', 'open', 'permitted', 'prohibited', 'alternative');
rowCase('L y1 field null none', 'L', 1, 'none', null, 'missing', 'open', 'notApplicable', 'notApplicable', 'complete');
rowCase('L y4 field null CW', 'L', 4, 'CW', null, 'unmet', 'open', 'permitted', 'permitted', 'explore');
rowCase('D y1 CW', 'D', 1, 'CW', null, 'met', 'closed', 'permitted', 'permitted', 'explore');
rowCase('M unanswered CW', 'M', null, 'CW', null, 'missing', 'open', 'permitted', 'prohibited', 'complete');

// Full six-row completeness, verbatim terms, owner-qualified references.
eq('catalogue size', catalogue.length, 6);
eq('preset size', presets.length, 2);
eq('DEMO_DAY', DEMO_DAY, '2026-11-07');
eq('unique IDs', new Set(catalogue.map(x => x.id)).size, 6);
for (const o of catalogue) {
  truth(`${o.id} purpose`, o.purpose.length > 0);
  truth(`${o.id} documents`, o.documents.length > 0);
  truth(`${o.id} terms application`, o.terms.application);
  eq(`${o.id} application owner`, o.terms.application?.owner, o.name);
  eq(`${o.id} application id`, o.terms.application?.id, `${o.id}:${o.id === 'C' ? 'A2' : 'A1'}`);
  if (o.terms.holding) eq(`${o.id} holding owner`, o.terms.holding.owner, o.name);
  if (o.id !== 'B') truth(`${o.id} holding present`, o.terms.holding);
  eq(`${o.id} exact YYYY-MM-DD`, /^2026-\d\d-\d\d$/.test(o.deadline), true);
}
eq('Bridge has no holding term', get('B').terms.holding, null);
eq('Continuing explicit application veto', get('C').terms.application?.effect, 'veto');
eq('Meridian published holding veto', get('M').terms.holding?.effect, 'veto');
eq('Fieldwork published holding permit', get('F').terms.holding?.effect, 'permit');
eq('CW conditional holding permit', presets[0]?.terms.holding?.effect, 'permit');
eq('FT explicit holding veto', presets[1]?.terms.holding?.effect, 'veto');
eq('CW-H wording', presets[0]?.terms.holding?.text, 'Waiver holders may retain this waiver alongside tuition or non-tuition awards if the other provider also permits the combination.');
eq('FT-H wording', presets[1]?.terms.holding?.text, 'Award holders may not retain this award alongside any other educational award.');
eq('A1 exact', get('M').terms.application?.text, 'Students receiving existing tuition support may apply for this award.');
eq('A2 exact', get('C').terms.application?.text, 'Students receiving tuition support when they apply may not enter this intake.');
eq('H1 exact', get('F').terms.holding?.text, 'Recipients may hold this award alongside existing tuition support.');
eq('H2 exact', get('M').terms.holding?.text, 'Recipients may not hold this award at the same time as another tuition award or tuition waiver.');

// Both providers are considered at BOTH stages; unknown is not implicit permission.
for (const id of ['M','F','B','C','L','D'] as const) {
  for (const aid of ['CW','FT'] as const) {
    const a = result(id,1,aid);
    eq(`${id}/${aid} application evidence count`, a.application.evidence.length, 2);
    eq(`${id}/${aid} holding evidence count`, a.holding.evidence.length, 2);
    eq(`${id}/${aid} application owner first`, a.application.evidence[0]?.owner, get(id).name);
    eq(`${id}/${aid} holding owner first`, a.holding.evidence[0]?.owner, get(id).name);
    eq(`${id}/${aid} provider second`, a.holding.evidence[1]?.owner, presets.find(p=>p.id===aid)?.name);
  }
}
const noAid = result('M',1,'none');
eq('no-aid empty application evidence', noAid.application.evidence.length, 0);
eq('no-aid empty holding evidence', noAid.holding.evidence.length, 0);
eq('no-aid no question', noAid.question, null);
const bridgeCW = result('B',1,'CW');
eq('Bridge/CW oracle question', bridgeCW.question, 'May I keep my Campus Tuition Waiver if I accept the Bridge Travel Bursary?');
eq('Bridge/CW missing clause null', bridgeCW.holding.evidence[0]?.clause, null);
eq('Bridge/CW editorial notice', bridgeCW.holding.evidence[0]?.note, 'Bridge Travel Bursary has no holding term in this demo record.');
has('Bridge/CW unresolved reason missing owner', bridgeCW.holding.reason, 'Bridge Travel Bursary');
has('Bridge/CW unresolved reason existing owner', bridgeCW.holding.reason, 'Campus Tuition Waiver');
has('Bridge/CW unresolved reason stage', bridgeCW.holding.reason, 'holding');
const bridgeFT = result('B',1,'FT');
eq('Bridge/FT missing H0 but veto wins', bridgeFT.holding.outcome, 'prohibited');
eq('Bridge/FT still reports missing Bridge source', bridgeFT.holding.evidence[0]?.clause, null);
eq('Bridge/FT no unresolved question', bridgeFT.question, null);
has('Bridge/FT reason identifies FT', bridgeFT.holding.reason, 'Founders Tuition Award');
has('Bridge/FT veto is clear despite missing', bridgeFT.holding.reason, 'Missing holding terms');
const meridianCW = result('M',1,'CW');
eq('M/CW A vs H distinct', meridianCW.application.outcome === meridianCW.holding.outcome, false);
eq('M/CW holding evidence authored award', meridianCW.holding.evidence[0]?.clause?.id, 'M:H2');
eq('M/CW application evidence provider', meridianCW.application.evidence[1]?.clause?.id, 'CW-A');

// Academic criteria are independent; year mismatch outranks unanswered field.
const labUnanswered = result('L',4,'CW');
eq('Lab both academic reasons', labUnanswered.reasons.length, 2);
eq('Lab year failure retained', labUnanswered.reasons[0]?.outcome, 'unmet');
eq('Lab field unknown retained', labUnanswered.reasons[1]?.outcome, 'missing');
eq('Lab field STEM meets', result('L',1,'none','stem').fit, 'met');
eq('Lab nonSTEM fails', result('L',1,'none','other').fit, 'unmet');
eq('non-L field ignored', result('M',1,'none','other').reasons.length, 1);
eq('M y2 fails', result('M',2,'none').fit, 'unmet');
eq('C y1 fails', result('C',1,'none').fit, 'unmet');
eq('C y4 meets', result('C',4,'none').fit, 'met');

// Inclusion of 2026-11-07 today and day-of-deadline, no timezone dependence.
for (const o of catalogue) {
  eq(`${o.id} open through due day`, result(o.id,1,'none',null,o.deadline).window, 'open');
  const nextDay = new Date(`${o.deadline}T00:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate()+1);
  eq(`${o.id} closed next calendar day`, result(o.id,1,'none',null,nextDay.toISOString().slice(0,10)).window, 'closed');
}
eq('Digital closed on demo day', result('D',1,'none').window, 'closed');

// Test-only synthetic changes. No mutated fixtures are exported or used by the UI.
const base = get('F');
const missingApplication: Opportunity = {
  ...base, terms: {...base.terms, application: null}
};
const missing = assess(missingApplication,{year:1,field:null,aid:'CW'});
eq('missing application no veto = unresolved',missing.application.outcome,'unresolved');
eq('missing application holding remains permitted',missing.holding.outcome,'permitted');
eq('missing application action clarify',missing.primary,'clarify');
has('missing application owner in reason',missing.application.reason,'Fieldwork Materials Grant');
has('missing application provider in reason',missing.application.reason,'Campus Tuition Waiver');
has('missing application reason stage',missing.application.reason,'application');
truth('missing application generates a relevant question',missing.question?.includes('apply'));
eq('missing application editorial note',missing.application.evidence[0]?.note,'Fieldwork Materials Grant has no application term in this demo record.');
eq('missing application clause is not fabricated',missing.application.evidence[0]?.clause,null);
const bothMissing: Opportunity = {...get('B'),terms:{application:null,holding:null}};
const both = assess(bothMissing,{year:1,field:null,aid:'CW'});
eq('both absent stages are independent',both.application.outcome,'unresolved');
eq('both absent holding unresolved',both.holding.outcome,'unresolved');
truth('one combined question includes both stages',both.question?.includes('apply') && both.question?.includes('keep'));
const vetoPlusMissing: Opportunity={...get('C'),terms:{...get('C').terms,holding:null}};
const veto = assess(vetoPlusMissing,{year:2,field:null,aid:'FT'});
eq('application explicit veto persists',veto.application.outcome,'restricted');
eq('FT holding veto wins against missing',veto.holding.outcome,'prohibited');
eq('application veto primary explore',veto.primary,'explore');
const blockedWithClarification = assess(bothMissing,{year:4,field:null,aid:'CW'});
eq('unmet year or closed still explore',blockedWithClarification.primary,'clarify');
// Re-test an actual academic mismatch with a missing clause and preserve question.
const constrained: Opportunity={...bothMissing,years:[1]};
const constrainedResult = assess(constrained,{year:2,field:null,aid:'CW'});
eq('academic veto primary explore',constrainedResult.primary,'explore');
truth('clarification retained even when blocked',constrainedResult.question);
const dueToday: Opportunity={...base,deadline:DEMO_DAY};
eq('synthetic due today inclusive',assess(dueToday,{year:1,field:null,aid:'none'}).window,'open');
eq('synthetic due yesterday closed',assess({...base,deadline:'2026-11-06'},{year:1,field:null,aid:'none'}).window,'closed');

if (failures.length) {
  for (const fail of failures) console.error(`FAIL ${fail}`);
  throw new Error(`GRANTLY domain oracle FAIL: ${failures.length} of ${checks} assertions`);
}
console.log(`GRANTLY domain oracle PASS: ${checks}/${checks} assertions · six records · both aids · both stages · 11 mandatory rows · missing terms · inclusive dates`);
