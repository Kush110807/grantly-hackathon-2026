/**
 * GRANTLY / Decision Desk · Chat C UX-X02
 * UI-only presentation of the exact supplied B assessment and D entry.
 * A owns navigation, live announcements, study profile, commands and persistence.
 */
import type { ChangeEvent, ReactNode } from 'react';
import type {
  Assessment, Clause, DetailProps, DiscoverProps, Evidence, Fit,
  Intention, ListState, Row, Stage
} from '../shared/contracts';
import './discovery.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;
const aidNames = {none:'No existing aid',CW:'Campus Tuition Waiver',FT:'Founders Tuition Award'} as const;
const intentionNames:Record<Intention,string> = {pursue:'Pursue',alternative:'Alternative',clarify:'Clarification'};
const fitNames:Record<Fit,string> = {met:'Listed criteria met',unmet:'Listed criteria not met',missing:'Information missing'};
const outcomeNames = {permitted:'Permitted',restricted:'Restricted',prohibited:'Prohibited',unresolved:'Unresolved',notApplicable:'Not applicable'} as const;
type GateResult = Assessment['application'] | Assessment['holding'];

/** No evaluator, date inference, persistence, or mutation occurs in this function. */
export function visibleRows(rows:Row[],state:ListState):Row[] {
  const q=state.query.trim().toLocaleLowerCase('en');
  return rows.filter(({opportunity,assessment})=>(!state.openOnly || assessment.window==='open') &&
    (!q || `${opportunity.name} ${opportunity.purpose}`.toLocaleLowerCase('en').includes(q)))
    .sort((a,b)=>a.opportunity.deadline.localeCompare(b.opportunity.deadline)||
      a.opportunity.id.localeCompare(b.opportunity.id));
}
function dateText(iso:string,short=false):string {
  const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(iso);
  if(!m)return iso;
  const month=MONTHS[Number(m[2])-1];
  return month?`${Number(m[3])} ${month}${short?'':` ${m[1]}`}`:iso;
}
function stageClass(outcome:string):string {
  return outcome==='permitted'||outcome==='met'?'gc-status-ok':outcome==='restricted'||outcome==='prohibited'||outcome==='unmet'?'gc-status-stop':
    outcome==='unresolved'||outcome==='missing'?'gc-status-wait':'gc-status-neutral';
}
function Action({children,onClick,secondary=false,disabled=false}: {
  children:ReactNode;onClick:()=>void;secondary?:boolean;disabled?:boolean
}) {
  return <button className={secondary?'g-secondary gc-alt-action':'g-primary gc-main-action'}
    type="button" disabled={disabled} onClick={onClick}>{children}</button>;
}

export function Discover({rows,list,onList,onOpen}:DiscoverProps) {
  const shown=visibleRows(rows,list);
  const reset=()=>onList({query:'',openOnly:false,selected:null});
  const search=(e:ChangeEvent<HTMLInputElement>)=>onList({...list,query:e.target.value});
  const changeFilter=(e:ChangeEvent<HTMLInputElement>)=>onList({...list,openOnly:e.target.checked});
  const filtered=list.query.trim()!==''||list.openOnly;
  return <section className="gc-index gc-x02" aria-label="Discover scholarships">
    <div className="gc-index-heading">
      <p className="gc-index-kicker">02 / THE OPPORTUNITIES</p>
      <h2>Explore the grants</h2>
      <label htmlFor="gc-search" className="gc-search-label">Search name or purpose</label>
      <div className="gc-search-wrap"><span aria-hidden="true">⌕</span>
        <input id="gc-search" type="search" name="grant-search" value={list.query} onChange={search}
          aria-controls="g-results-list" autoComplete="off" placeholder="Search name or purpose" />
      </div>
      <div className="gc-index-toolbar">
        <label htmlFor="gc-open-only" className="gc-checkbox-label"><input id="gc-open-only" type="checkbox"
          checked={list.openOnly} onChange={changeFilter}/>Open only</label>
        <span className="gc-counter" role="status">{shown.length} of {rows.length} grants</span>
      </div>
    </div>
    <div id="g-results-list" className="gc-results g-focus-target" role="region" aria-label="Scholarship results" tabIndex={-1}>
      {shown.length===0 ? <div className="gc-empty"><h3>No scholarships match these filters.</h3>
        <p>Try another name or purpose, or include closed intakes.</p>
        <button type="button" className="gc-index-reset" onClick={reset}>Clear search and filters</button>
      </div> : shown.map(({opportunity:o,assessment:a})=>{
        const selected=list.selected===o.id;
        return <button id={`g-opportunity-row-${o.id}`} key={o.id} type="button"
          className={`g-row gc-result${selected?' g-selected':''}`} aria-current={selected?'true':undefined}
          data-opportunity-id={o.id} onClick={()=>onOpen(o.id)}
          aria-label={`${o.name}. ${o.benefit}, ${o.frequency}. Apply by ${dateText(o.deadline)}. View details.`}>
          <span className="gc-result-top"><span className="gc-file">FILE / {o.id}</span>
            <span className="gc-apply-date">APPLY BY {dateText(o.deadline,true)}</span></span>
          <span className="gc-result-title">{o.name}</span>
          <span className="gc-result-purpose">{o.purpose}</span>
          <span className="gc-result-bottom"><span className="gc-result-money g-money">{o.benefit}</span>
            <span className={`gc-intake ${a.window==='closed'?'gc-closed':''}`}>{a.window==='closed'?'CLOSED':'OPEN'}
              <span className="gc-mobile-view"> · View details ↗</span></span></span>
          {selected&&<span className="gc-selected-sr">Selected for reading</span>}
        </button>;
      })}
    </div>
    {filtered&&shown.length>0&&<button className="gc-reset-link" type="button" onClick={reset}>Show all opportunities</button>}
    <p className="gc-index-foot">Fictional providers · Earliest deadline first · Dates inclusive. Listed criteria are not award decisions.</p>
  </section>;
}

function EvidenceLine({evidence}:{evidence:Evidence}) {
  const clause=evidence.clause;
  return <div className="gc-clause"><div className="gc-clause-head"><strong>{evidence.owner}</strong>
    {clause?<span className={`gc-effect ${clause.effect==='veto'?'gc-status-stop':'gc-status-ok'}`}>
      {clause.effect==='veto'?'Veto':'Permits'} · {clause.id}</span>:
      <span className="gc-absent">TERM NOT PROVIDED</span>}
    </div>
    {clause?<p>“{clause.text}”</p>:<p className="gc-missing-term">{evidence.note||'No published term in this demo record.'}
      <span className="gc-editorial"> Editorial notice, not a provider quotation.</span></p>}
    {clause&&evidence.note&&<p className="gc-clause-note">{evidence.note}</p>}
  </div>;
}
function EvidenceGroup({label,stage,items}:{label:string;stage:Stage;items:Evidence[]}) {
  return <section className="gc-term-group" aria-label={`${label} evidence`}><h4>{label}</h4>
    {items.length?items.map((item,index)=><EvidenceLine key={`${stage}-${item.owner}-${item.clause?.id??index}`} evidence={item}/>):
      <p>No comparison evidence applies to this stage.</p>}
  </section>;
}
function SoloTerm({clause,owner,stage}:{clause:Clause|null;owner:string;stage:Stage}) {
  return <EvidenceLine evidence={{owner,clause,note:clause?'':stage==='holding'&&owner==='Bridge Travel Bursary'
    ?'Bridge Travel Bursary has no holding term in this demo record.':`No published ${stage} term in this demo record.`}}/>;
}

/** Short copy only from B's supplied outcome and attributed evidence; never a replacement evaluator.
 * The full B reason is displayed in the inspectable source disclosure below. */
function gateSummary(result:GateResult,stage:Stage):string {
  if(result.outcome==='permitted')return 'Both providers explicitly permit this stage under their listed terms.';
  if(result.outcome==='unresolved'){
    const missing=result.evidence.filter(e=>!e.clause).map(e=>e.owner);
    return `${missing.join(' and ')||'A provider'}: missing ${stage} term. Permission cannot be inferred.`;
  }
  if(result.outcome==='restricted'||result.outcome==='prohibited'){
    const veto=result.evidence.filter(e=>e.clause?.effect==='veto').map(e=>e.owner);
    return `${veto.join(' and ')||'A provider'} explicitly ${stage==='application'?'restricts applying with this aid':'prohibits holding both awards'}. See source terms.`;
  }
  return result.reason;
}
/** The gates use B's independent verdicts and evidence; visual numbering is not an eligibility engine. */
function DecisionGate({index,title,stage,result}:{index:'01'|'02';title:string;stage:Stage;result:GateResult}) {
  const status=result.outcome;
  const symbol=status==='permitted'?'✓':status==='restricted'||status==='prohibited'?'×':status==='unresolved'?'?':'—';
  return <section className={`gc-gate ${stageClass(status)}`} aria-label={`${stage==='application'?'Applying with this aid':'Holding both awards'}: ${outcomeNames[status]}`}>
    <div className="gc-gate-header"><span className="gc-gate-index">{index}</span>
      <span className="gc-gate-heading">{title}</span><span className="gc-gate-symbol" aria-hidden="true">{symbol}</span></div>
    <h4 className="gc-gate-outcome">{outcomeNames[status]}</h4>
    <p className="gc-gate-reason">{gateSummary(result,stage)}</p>
  </section>;
}

export function OpportunityDetail({row,profile,onCommand,onProfile,onCompare,onExplore,onPlan,onBack}:DetailProps) {
  const {opportunity:o,assessment:a,entry,needsReview}=row;
  const hasAid=profile.aid!=='none';
  const unresolved=a.application.outcome==='unresolved'||a.holding.outcome==='unresolved';
  const canClarify=unresolved&&Boolean(a.question);
  const onSave=(intention:Intention)=>onCommand({kind:'save',id:o.id,intention});
  const mainAction=():ReactNode=>{
    if(entry)return <Action onClick={onPlan}>View in My plan</Action>;
    switch(a.primary){
      case 'pursue':return <Action onClick={()=>onSave('pursue')}>Save to pursue</Action>;
      case 'alternative':return <Action onClick={()=>onSave('alternative')}>Save as an alternative</Action>;
      case 'clarify':return <Action disabled={!canClarify} onClick={()=>onSave('clarify')}>Save clarification question</Action>;
      case 'complete':return <Action onClick={onProfile}>Add study details</Action>;
      case 'explore':return <Action onClick={onExplore}>Explore open opportunities</Action>;
    }
  };
  const nextExplanation=entry?'Your saved intention and self-reported progress remain yours to manage.':
    a.primary==='alternative'?'A holding veto makes this an alternative, not a compatible concurrent award.':
    a.primary==='clarify'?'A holding term is missing. Ask before assuming you may hold both awards.':
    a.primary==='complete'?'Complete your study context to assess the listed criteria.':
    a.primary==='explore'?'The current criteria or intake prevent a straightforward pursue action.':
    'Save a next-step intention. This is not an application or award.';
  return <article className="gc-detail gc-x02" aria-label={`${o.name} details`}>
    <button type="button" className="gc-back" onClick={onBack}>‹ Back to previous view</button>
    <div className="gc-detail-topline"><span className="gc-file-label">FILE {o.id} / SCHOLARSHIP DETAILS</span>
      <span className={`gc-window${a.window==='closed'?' gc-closed':''}`}>{a.window==='closed'?'Closed intake':'Open intake'}</span></div>
    <h2 id="g-detail-heading" className="gc-grant-heading g-focus-target" tabIndex={-1}>{o.name}</h2>
    <p className="gc-purpose-detail">{o.purpose}</p>
    <section className="gc-offer" aria-label="Listed financial benefit and deadline">
      <div className="gc-benefit"><span className="gc-eyebrow">LISTED BENEFIT</span>
        <p className="gc-benefit-amount g-money">{o.benefit}</p>
        <p className="gc-benefit-frequency">{o.frequency}</p>
        <p className="gc-condition">{o.conditions}</p></div>
      <div className="gc-deadline-block"><span className="gc-eyebrow">APPLY BY</span>
        <p className="gc-deadline g-date">{dateText(o.deadline)}</p>
        <p className={`gc-deadline-status${a.window==='closed'?' gc-status-stop':''}`}>
          {a.window==='closed'?'This demo intake is closed.':'Applicant deadline · inclusive'}</p>
        <span className="gc-eyebrow gc-audience-label">WHO THIS IS FOR</span>
        <p className="gc-audience">{o.audience}</p></div>
    </section>
    <section className="gc-academic" aria-label="Academic criteria">
      <div><h3>Academic criteria</h3>
        <div className="gc-reasons">{a.reasons.length?a.reasons.map(r=><p key={r.criterion} className="gc-reason">
          <span aria-hidden="true">{r.outcome==='met'?'✓':r.outcome==='unmet'?'×':'?'}</span>{r.text}</p>):
          <p className="gc-reason">No listed academic reasons were provided by the assessment.</p>}</div>
        {a.fit!=='met'&&<button className="gc-text-action" type="button" onClick={onProfile}>Edit study details</button>}
      </div>
      <span className={`gc-fit-badge ${stageClass(a.fit)}`}>{fitNames[a.fit]}{a.fit==='met'&&profile.year!==null?` · Year ${profile.year}`:''}</span>
    </section>
    <section className="gc-decision" aria-label="Independent application and holding assessments">
      <div className="gc-decision-heading"><h3>Two decisions. Not one.</h3><span>03 / THE RULE CHECK</span></div>
      {hasAid ? <>
        <p className="gc-decision-context">Comparing with <strong>{aidNames[profile.aid]}</strong>. Each stage is assessed independently against the listed terms.</p>
        <div className="gc-gate-pair" role="group" aria-label="Application and holding are independent decisions">
          <DecisionGate index="01" title="CAN YOU APPLY?" stage="application" result={a.application}/>
          <DecisionGate index="02" title="CAN YOU HOLD BOTH?" stage="holding" result={a.holding}/>
        </div>
      </> : <div className="gc-no-aid"><p><strong>No existing aid selected.</strong> Add aid to compare applying while holding it with keeping both awards.</p>
        <button type="button" className="gc-text-action" onClick={onProfile}>Add existing aid</button></div>}
    </section>
    <section className="gc-action-block" aria-label="Your next action">
      <div className="gc-action-copy"><span className="gc-action-index">04 / YOUR NEXT MOVE</span>
        <p>{nextExplanation}</p>{entry&&<p className="gc-saved-status">Saved intention: <strong>{intentionNames[entry.intention]}</strong> · Progress self-reported</p>}</div>
      <div className="gc-actions">{mainAction()}</div>
    </section>
    <div className="gc-secondary-actions">
      {!entry&&(a.primary==='complete'||a.primary==='explore')&&<Action secondary onClick={()=>onSave('alternative')}>Save as an alternative</Action>}
      {!entry&&canClarify&&a.primary!=='clarify'&&<Action secondary onClick={()=>onSave('clarify')}>Save clarification question</Action>}
      {hasAid&&<Action secondary onClick={onCompare}>Compare opportunities</Action>}
      <a className="gc-docs-jump" href="#g-required-documents">Required documents ↓</a>
    </div>
    {!entry&&a.primary==='clarify'&&!canClarify&&<p className="gc-action-warning" role="status">No clarification question was supplied. It cannot be saved.</p>}
    {needsReview&&entry&&<section className="gc-review" aria-label="Saved plan needs review">
      <h3>Review change</h3><p>Your current study context differs from the context last acknowledged. Current assessments appear above. Saved intention, progress and original question remain unchanged.</p>
      <Action secondary onClick={()=>onCommand({kind:'acknowledge',id:o.id})}>Acknowledge review</Action>
      <p className="gc-small-note">Acknowledging does not approve, submit or alter your saved choices.</p>
    </section>}
    {canClarify&&(!entry?.question||entry.question.text!==a.question||entry.question.aid!==profile.aid)&&
      <div className="gc-question"><h3>{entry?.question?'Current suggested question':'Question to ask the providers'}</h3><p>{a.question}</p>
        <p className="gc-small-note">Saved for follow-up only. GRANTLY does not contact providers.</p></div>}
    {entry?.question&&<div className="gc-question gc-existing-question"><h3>Saved clarification question</h3>
      <p>{entry.question.text}</p><p className="gc-small-note">Original context: {aidNames[entry.question.aid]}. Changing aid never automatically rewrites this question.</p>
      {canClarify&&(entry.question.text!==a.question||entry.question.aid!==profile.aid)&&
        <Action secondary onClick={()=>onCommand({kind:'updateQuestion',id:o.id})}>Update question to current context</Action>}
    </div>}
    <section id="g-required-documents" className="gc-documents" aria-labelledby="gc-documents-heading">
      <div className="gc-section-heading"><span className="gc-eyebrow">PREPARE</span><h3 id="gc-documents-heading">Required documents</h3></div>
      <ul>{o.documents.map(document=><li key={document}>{document}</li>)}</ul>
      <p className="gc-small-note">Listed demo requirements only. GRANTLY does not upload documents.</p>
    </section>
    <details className="gc-terms" id="gc-terms"><summary>{hasAid?'Inspect both providers’ source terms':'Inspect this award’s demo source terms'}
      <span aria-hidden="true" className="gc-disclosure-cue">＋</span></summary>
      <div className="gc-terms-body"><p className="gc-small-note">Attributed fictional clauses, not official guidance. Absence is editorial evidence of a missing term, never permission.</p>
        {hasAid?<>
          <p className="gc-full-reason"><strong>Applying:</strong> {a.application.reason}</p>
          <EvidenceGroup label="Application-stage evidence" stage="application" items={a.application.evidence}/>
          <p className="gc-full-reason"><strong>Holding both:</strong> {a.holding.reason}</p>
          <EvidenceGroup label="Holding-stage evidence" stage="holding" items={a.holding.evidence}/>
        </>:<>
          <section className="gc-term-group"><h4>Application term</h4><SoloTerm owner={o.name} stage="application" clause={o.terms.application}/></section>
          <section className="gc-term-group"><h4>Holding term</h4><SoloTerm owner={o.name} stage="holding" clause={o.terms.holding}/></section>
        </>}
      </div>
    </details>
    <p className="gc-disclaimer">Fictional demo · as of 7 Nov 2026. Listed criteria do not guarantee selection, payment, permission outside these terms or application submission.</p>
  </article>;
}
