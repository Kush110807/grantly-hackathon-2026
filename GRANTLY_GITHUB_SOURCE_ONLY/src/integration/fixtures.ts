/**
 * PREVIEW ONLY. Authored specimen props, not B's catalogue or D's storage.
 * Forbidden imports: src/App.tsx, src/integration/live.tsx, src/main.tsx, production modules.
 * Exact shape: 03_SHARED_CONTRACTS.md; selected rules: 04_DATASET_AND_RULES.md.
 */
import type { Clause, DiscoverProps, DetailProps, PlanProps, Profile, Row, ListState, Opportunity, Entry, Assessment } from '../shared/contracts';
export const specimenProfiles={
  meridianCW: {year:1,field:null,aid:'CW'},
  fieldworkFT: {year:1,field:null,aid:'FT'},
  bridgeCW: {year:1,field:null,aid:'CW'},
  noAid: {year:1,field:null,aid:'none'}
} as const satisfies Record<string,Profile>;
const award = (owner:string,code:string,stage:'application'|'holding',effect:'permit'|'veto',text:string):Clause =>
  ({id:`${owner}:${code}`,owner,stage,effect,text});
const A1='Students receiving existing tuition support may apply for this award.';
const H1='Recipients may hold this award alongside existing tuition support.';
const H2='Recipients may not hold this award at the same time as another tuition award or tuition waiver.';
const CW_A=award('Campus Tuition Waiver','CW-A','application','permit','Waiver holders may apply for other educational awards.');
const CW_H=award('Campus Tuition Waiver','CW-H','holding','permit','Waiver holders may retain this waiver alongside tuition or non-tuition awards if the other provider also permits the combination.');
const FT_A=award('Founders Tuition Award','FT-A','application','permit','Award holders may apply for outside educational support.');
const FT_H=award('Founders Tuition Award','FT-H','holding','veto','Award holders may not retain this award alongside any other educational award.');
const OPPS:Opportunity[]=[
  {id:'M',name:'Meridian Study Grant',purpose:'Tuition support',benefit:'₹30,000',frequency:'for one academic year',conditions:'Paid once to the college if awarded. No automatic renewal.',audience:'Undergraduates in year 1, any field',deadline:'2026-11-15',years:[1],requiredField:null,documents:['Class XII final marksheet','Current fee statement'],terms:{application:award('Meridian Study Grant','A1','application','permit',A1),holding:award('Meridian Study Grant','H2','holding','veto',H2)}},
  {id:'F',name:'Fieldwork Materials Grant',purpose:'Fieldwork materials reimbursement',benefit:'Up to ₹8,000',frequency:'one time',conditions:'Actual eligible fieldwork materials against receipts after selection.',audience:'Undergraduates in years 1–2, any field',deadline:'2026-11-18',years:[1,2],requiredField:null,documents:['Enrolment letter','Itemised materials estimate'],terms:{application:award('Fieldwork Materials Grant','A1','application','permit',A1),holding:award('Fieldwork Materials Grant','H1','holding','permit',H1)}},
  {id:'B',name:'Bridge Travel Bursary',purpose:'College placement travel',benefit:'₹5,000',frequency:'one-time travel allowance',conditions:'For a college placement visit if selected.',audience:'Undergraduates in years 1–4, any field',deadline:'2026-11-12',years:[1,2,3,4],requiredField:null,documents:['Placement invitation','Travel estimate'],terms:{application:award('Bridge Travel Bursary','A1','application','permit',A1),holding:null}}
];
const evidence=(owner:string,clause:Clause|null,note='')=>({owner,clause,note});
const info=(primary:Assessment['primary'],application:Assessment['application'],holding:Assessment['holding'],question:string|null=null):Assessment=>({
  fit:'met',reasons:[{criterion:'year',outcome:'met',text:'Year 1 is included in the listed criteria.'}],window:'open',application,holding,primary,question
});
const meridian=info('alternative',
  {outcome:'permitted',reason:'Both published application terms permit this step.',evidence:[evidence('Meridian Study Grant',OPPS[0]!.terms.application),evidence('Campus Tuition Waiver',CW_A)]},
  {outcome:'prohibited',reason:'Meridian excludes concurrent tuition support.',evidence:[evidence('Meridian Study Grant',OPPS[0]!.terms.holding),evidence('Campus Tuition Waiver',CW_H)]});
const fieldwork=info('alternative',
  {outcome:'permitted',reason:'Both published application terms permit this step.',evidence:[evidence('Fieldwork Materials Grant',OPPS[1]!.terms.application),evidence('Founders Tuition Award',FT_A)]},
  {outcome:'prohibited',reason:'The Founders Tuition Award prohibits retaining other educational awards.',evidence:[evidence('Fieldwork Materials Grant',OPPS[1]!.terms.holding),evidence('Founders Tuition Award',FT_H)]});
const bridge=info('clarify',
  {outcome:'permitted',reason:'Both published application terms permit this step.',evidence:[evidence('Bridge Travel Bursary',OPPS[2]!.terms.application),evidence('Campus Tuition Waiver',CW_A)]},
  {outcome:'unresolved',reason:'Bridge has not published a holding term in this demo.',evidence:[evidence('Bridge Travel Bursary',null,'Bridge Travel Bursary has no holding term in this demo record.'),evidence('Campus Tuition Waiver',CW_H)]},
  'May I keep my Campus Tuition Waiver if I accept the Bridge Travel Bursary?');
const noAid=info('pursue',
  {outcome:'notApplicable',reason:'No existing aid selected.',evidence:[]},
  {outcome:'notApplicable',reason:'No existing aid selected.',evidence:[]});
export const sampleRows:{meridianCW:Row;fieldworkFT:Row;bridgeCW:Row;meridianNoAid:Row}={
  meridianCW:{opportunity:OPPS[0]!,assessment:meridian,entry:null,needsReview:false},
  fieldworkFT:{opportunity:OPPS[1]!,assessment:fieldwork,entry:null,needsReview:false},
  bridgeCW:{opportunity:OPPS[2]!,assessment:bridge,entry:null,needsReview:false},
  meridianNoAid:{opportunity:OPPS[0]!,assessment:noAid,entry:null,needsReview:false}
};
export const savedReviewEntry:Entry={id:'F',intention:'pursue',progress:'preparing',question:null,acknowledgedKey:'[1,null,"CW"]'};
export const savedReviewRow:Row={...sampleRows.fieldworkFT,entry:savedReviewEntry,needsReview:true};
export const specimenIndex:Row[]=[sampleRows.bridgeCW,sampleRows.meridianCW,sampleRows.fieldworkFT];
export const specimenEmptyIndex:Row[]=[];
export const specimenList:ListState={query:'',openOnly:true,selected:'B'};
export function specimenDiscover(onList:DiscoverProps['onList']=()=>{},onOpen:DiscoverProps['onOpen']=()=>{}):DiscoverProps {
  return {rows:specimenIndex,list:specimenList,onList,onOpen};
}
export function specimenDetail(key:keyof typeof sampleRows='meridianCW',actions:Partial<DetailProps>={}):DetailProps {
  return {row:sampleRows[key],profile:key==='fieldworkFT'?specimenProfiles.fieldworkFT:key==='meridianNoAid'?specimenProfiles.noAid:specimenProfiles.meridianCW,
    onCommand:()=>{},onProfile:()=>{},onCompare:()=>{},onExplore:()=>{},onPlan:()=>{},onBack:()=>{},...actions};
}
export function specimenPlan(actions:Partial<PlanProps>={}):PlanProps {
  return {rows:[savedReviewRow],profile:specimenProfiles.fieldworkFT,onCommand:()=>{},onOpen:()=>{},onDiscover:()=>{},onReset:()=>{},...actions};
}
