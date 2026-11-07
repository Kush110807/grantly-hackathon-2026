// G1 interface freeze · EXACT declarations from 03_SHARED_CONTRACTS.md.
// Shared types are owned by A. B/C/D import type from this module only.
export type Id = 'M'|'F'|'B'|'C'|'L'|'D';
export type Aid = 'none'|'CW'|'FT';
export type Year = 1|2|3|4;
export type Field = 'stem'|'other';
export type Profile = { year: Year|null; field: Field|null; aid: Aid };
export type Stage = 'application'|'holding';
export type Clause = { id:string; owner:string; stage:Stage; effect:'permit'|'veto'; text:string };
export type Terms = Record<Stage,Clause|null>;
export type Opportunity = {
  id:Id; name:string; purpose:string; benefit:string; frequency:string;
  conditions:string; audience:string; deadline:string; years:Year[];
  requiredField:Field|null; documents:string[]; terms:Terms
};
export type Preset = { id:Exclude<Aid,'none'>; name:string; terms:Terms };
export type Fit = 'met'|'unmet'|'missing';
export type Reason = { criterion:'year'|'field'; outcome:Fit; text:string };
export type Evidence = { owner:string; clause:Clause|null; note:string };
export type StageResult<S extends string> = { outcome:S; reason:string; evidence:Evidence[] };
export type Assessment = {
  fit:Fit; reasons:Reason[]; window:'open'|'closed';
  application:StageResult<'permitted'|'restricted'|'unresolved'|'notApplicable'>;
  holding:StageResult<'permitted'|'prohibited'|'unresolved'|'notApplicable'>;
  primary:'pursue'|'alternative'|'clarify'|'complete'|'explore'; question:string|null
};
export type Intention = 'pursue'|'alternative'|'clarify';
export type Progress = 'notStarted'|'preparing'|'submittedExternally';
export type Question = { text:string; aid:Aid };
export type Entry = { id:Id; intention:Intention; progress:Progress;
  question:Question|null; acknowledgedKey:string };
export type Model = { version:1; profile:Profile; entries:Entry[] };
export type Row = { opportunity:Opportunity; assessment:Assessment; entry:Entry|null; needsReview:boolean };
export type ListState = { query:string; openOnly:boolean; selected:Id|null };
export type Page = 'discover'|'detail'|'plan';
export type Command =
  | { kind:'save'; id:Id; intention:Intention }
  | { kind:'progress'; id:Id; value:Progress }
  | { kind:'acknowledge'|'updateQuestion'|'remove'; id:Id };
export type DiscoverProps = {
  rows:Row[]; list:ListState; onList:(next:ListState)=>void;
  onOpen:(id:Id)=>void
};
export type DetailProps = {
  row:Row; profile:Profile; onCommand:(c:Command)=>void;
  onProfile:()=>void; onCompare:()=>void; onExplore:()=>void;
  onPlan:()=>void; onBack:()=>void
};
export type PlanProps = {
  rows:Row[]; profile:Profile; onCommand:(c:Command)=>void;
  onOpen:(id:Id)=>void; onDiscover:()=>void; onReset:()=>void
};
export type ReadResult = {kind:'ok'; model:Model}|{kind:'empty'|'invalid'|'unavailable'};
export type IOResult = {ok:true}|{ok:false; message:string};
