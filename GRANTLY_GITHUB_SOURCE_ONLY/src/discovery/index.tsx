/**
 * GRANTLY discovery lane · GRANTLY-A-G1.0 contracts.
 * Displays supplied assessments only. Catalogue truth and eligibility belong to B;
 * navigation, selection, profile, commands and persistence belong to A/D.
 */
import type { ChangeEvent, ReactNode } from 'react';
import type {
  Assessment, Clause, DetailProps, DiscoverProps, Evidence, Fit,
  Intention, ListState, Row, Stage
} from '../shared/contracts';
import './discovery.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** Pure helper: no mutation, no evaluation of eligibility or rule meaning. */
export function visibleRows(rows: Row[], state: ListState): Row[] {
  const query = state.query.trim().toLocaleLowerCase('en');
  return rows
    .filter(({ opportunity, assessment }) =>
      (!state.openOnly || assessment.window === 'open') &&
      (!query || `${opportunity.name} ${opportunity.purpose}`.toLocaleLowerCase('en').includes(query)))
    .sort((a, b) => a.opportunity.deadline.localeCompare(b.opportunity.deadline) ||
      a.opportunity.id.localeCompare(b.opportunity.id));
}

function dateText(iso: string): string {
  const match = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso);
  if (!match) return iso; // Never guess on unrecognised fixture dates.
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : iso;
}

const fitText: Record<Fit, string> = {
  met: 'Listed criteria met',
  missing: 'Listed criteria · Information missing',
  unmet: 'Listed criteria · Not met'
};
const aidNames = {
  none: 'No existing aid',
  CW: 'Campus Tuition Waiver',
  FT: 'Founders Tuition Award'
} as const;
const intentionNames: Record<Intention, string> = {
  pursue: 'Pursue', alternative: 'Alternative', clarify: 'Clarification'
};

function statusText(stage: 'application' | 'holding', outcome: string): string {
  if (outcome === 'permitted') return 'Permitted by the listed terms';
  if (outcome === 'restricted') return 'Restricted by the listed terms';
  if (outcome === 'prohibited') return 'Prohibited';
  if (outcome === 'unresolved') return 'Unresolved';
  if (outcome === 'notApplicable') return 'Not applicable';
  // Unknown values remain explicit rather than being interpreted as permission.
  return `${stage === 'application' ? 'Application' : 'Holding'} outcome unavailable`;
}
function statusClass(outcome: string): string {
  if (outcome === 'restricted' || outcome === 'prohibited' || outcome === 'unmet') return 'gc-is-conflict';
  if (outcome === 'unresolved' || outcome === 'missing') return 'gc-is-unknown';
  return outcome === 'met' || outcome === 'permitted' ? 'gc-is-permitted' : '';
}

export function Discover({ rows, list, onList, onOpen }: DiscoverProps) {
  const shown = visibleRows(rows, list);
  const allCount = rows.length;
  const hasActiveFilters = list.query.trim().length > 0 || list.openOnly;
  const reset = () => onList({ query: '', openOnly: false, selected: null });
  const queryChange = (event: ChangeEvent<HTMLInputElement>) => onList({ ...list, query: event.target.value });
  const filterChange = (event: ChangeEvent<HTMLInputElement>) => onList({ ...list, openOnly: event.target.checked });

  return <section className="gc-index" aria-label="Discover scholarships">
    <div className="gc-index-heading">
      <div>
        <p className="gc-eyebrow">OPPORTUNITY INDEX</p>
        <h2>Find your next step</h2>
      </div>
      <span className="gc-counter" aria-live="polite">{shown.length} of {allCount}</span>
    </div>
    <div className="gc-filters" role="search" aria-label="Search scholarship opportunities">
      <label className="gc-search-label" htmlFor="gc-search">Search name or purpose</label>
      <input id="gc-search" name="grant-search" type="search" autoComplete="off"
        placeholder="e.g. tuition, travel, materials" value={list.query} onChange={queryChange}/>
      <label className="gc-checkbox-label" htmlFor="gc-open-only">
        <input id="gc-open-only" type="checkbox" checked={list.openOnly} onChange={filterChange}/>
        <span>Open only</span>
        <span className="gc-filter-note">Exclude closed intakes</span>
      </label>
    </div>
    <section id="g-results-list" tabIndex={-1} role="region" aria-label="Scholarship results" className="gc-results g-focus-target">
      <div className="gc-results-heading">
        <span>{shown.length} {shown.length === 1 ? 'opportunity' : 'opportunities'}</span>
        <span>By deadline</span>
      </div>
      {shown.length === 0 ? <div className="gc-empty">
        <h3>No scholarships match these filters.</h3>
        <p>Clear search and filters.</p>
        <button className="g-secondary" type="button" onClick={reset}>Clear search and filters</button>
      </div> : <div className="gc-rows">
        {shown.map(({opportunity, assessment}) => {
          const isSelected = list.selected === opportunity.id;
          return <button type="button" key={opportunity.id} id={`g-opportunity-row-${opportunity.id}`}
              data-opportunity-id={opportunity.id} className={`g-row gc-result ${isSelected ? 'g-selected' : ''}`}
              onClick={() => onOpen(opportunity.id)} aria-current={isSelected ? 'true' : undefined}
              aria-label={`${opportunity.name}. ${opportunity.benefit} ${opportunity.frequency}. Apply by ${dateText(opportunity.deadline)}. View details.`}>
            <span className="gc-result-top"><span className="gc-purpose">{opportunity.purpose}</span>
              <span className={`gc-window ${assessment.window === 'closed' ? 'gc-closed' : ''}`}>{assessment.window === 'closed' ? 'Closed' : 'Open'}</span>
            </span>
            <span className="gc-result-title">{opportunity.name}</span>
            <span className="gc-result-money g-money">{opportunity.benefit} <span>{opportunity.frequency}</span></span>
            <span className="gc-result-bottom"><span>Apply by <strong className="g-date">{dateText(opportunity.deadline)}</strong></span>
              <span className="gc-view">View details <span aria-hidden="true">›</span></span></span>
            <span className="gc-result-audience">{opportunity.audience}</span>
            {isSelected && <span className="gc-selected-text">Selected for reading</span>}
          </button>;
        })}
      </div>}
      {hasActiveFilters && shown.length > 0 && <button type="button" className="gc-reset-link" onClick={reset}>Show all opportunities</button>}
    </section>
    <p className="gc-index-foot">Fictional opportunities. Listed criteria are not award decisions.</p>
  </section>;
}

type EvidenceGroupProps = { label:string; stage:Stage; items:Evidence[] };
function EvidenceGroup({label,stage,items}:EvidenceGroupProps) {
  return <section className="gc-term-group" aria-label={`${label} evidence`}>
    <h4>{label}</h4>
    {items.length === 0 ? <p className="g-muted">No comparison evidence applies to this stage.</p> : items.map((item,index) =>
      <EvidenceLine key={`${stage}-${item.owner}-${item.clause?.id ?? index}`} evidence={item}/>)}
  </section>;
}
function EvidenceLine({evidence}: {evidence:Evidence}) {
  const clause = evidence.clause;
  return <div className="gc-clause">
    <div className="gc-clause-head"><strong>{evidence.owner}</strong>
      {clause && <span className={`gc-clause-effect ${clause.effect === 'veto' ? 'gc-is-conflict' : 'gc-is-permitted'}`}>
        {clause.effect === 'veto' ? 'Veto' : 'Permits'} · {clause.id}
      </span>}
    </div>
    {clause ? <p>“{clause.text}”</p> : <p className="gc-missing-term">{evidence.note || 'No published term in this demo record.'} <span className="gc-editorial">(Editorial notice, not a provider clause.)</span></p>}
    {clause && evidence.note && <p className="gc-clause-note">{evidence.note}</p>}
  </div>;
}
function SoloTerm({clause,owner,stage}: {clause:Clause|null;owner:string;stage:Stage}) {
  return <EvidenceLine evidence={{owner,clause,note:clause ? '' : stage === 'holding' && owner === 'Bridge Travel Bursary' ?
    'Bridge Travel Bursary has no holding term in this demo record.' : `No published ${stage} term in this demo record.`}}/>;
}
function InfoRow({label, result}: {label: string; result: Assessment['application'] | Assessment['holding']}) {
  return <div className="gc-stage-row">
    <h4>{label} <span className={`gc-stage-outcome ${statusClass(result.outcome)}`}>{statusText(label.startsWith('Applying') ? 'application' : 'holding', result.outcome)}</span></h4>
    <p>{result.reason}</p>
  </div>;
}
function ActionButton({children,onClick,variant='primary',disabled=false}: {children:ReactNode;onClick:()=>void;variant?:'primary'|'secondary';disabled?:boolean}) {
  return <button type="button" className={variant === 'primary' ? 'g-primary' : 'g-secondary'} disabled={disabled} onClick={onClick}>{children}</button>;
}

export function OpportunityDetail({row,profile,onCommand,onProfile,onCompare,onExplore,onPlan,onBack}:DetailProps) {
  const {opportunity:o,assessment:a,entry,needsReview} = row;
  const hasAid = profile.aid !== 'none';
  const isUnresolved = a.application.outcome === 'unresolved' || a.holding.outcome === 'unresolved';
  const canClarify = isUnresolved && Boolean(a.question);
  const onSave = (intention:Intention) => onCommand({kind:'save',id:o.id,intention});
  const showPrimary = ():ReactNode => {
    if (entry) return <ActionButton onClick={onPlan}>View in My plan</ActionButton>;
    switch(a.primary) {
      case 'pursue': return <ActionButton onClick={()=>onSave('pursue')}>Save to pursue</ActionButton>;
      case 'alternative': return <ActionButton onClick={()=>onSave('alternative')}>Save as an alternative</ActionButton>;
      case 'clarify': return <ActionButton disabled={!canClarify} onClick={()=>onSave('clarify')}>Save clarification question</ActionButton>;
      case 'complete': return <ActionButton onClick={onProfile}>Add study details</ActionButton>;
      case 'explore': return <ActionButton onClick={onExplore}>Explore other scholarships</ActionButton>;
    }
  };
  return <article className="gc-detail" aria-label={`${o.name} details`}>
    <div className="gc-detail-top">
      <button type="button" className="gc-back" onClick={onBack}>‹ Back to previous view</button>
      <div className="gc-detail-topline"><span className="gc-eyebrow">SCHOLARSHIP / {o.id}</span>
        <span className={`gc-window ${a.window === 'closed' ? 'gc-closed' : ''}`}>{a.window === 'closed' ? 'Closed intake' : 'Open for applications'}</span></div>
      <h2 id="g-detail-heading" tabIndex={-1} className="gc-grant-heading g-focus-target">{o.name}</h2>
      <p className="gc-purpose-detail">{o.purpose}</p>
    </div>
    <div className="gc-offer">
      <div className="gc-benefit"><span className="gc-eyebrow">THE LISTED BENEFIT</span>
        <p className="gc-benefit-amount g-money">{o.benefit}</p>
        <p className="gc-benefit-frequency">{o.frequency}</p>
        <p className="gc-condition">{o.conditions}</p>
      </div>
      <div className="gc-deadline-block"><span className="gc-eyebrow">APPLY BY</span>
        <p className="gc-deadline g-date">{dateText(o.deadline)}</p>
        <p className={`gc-deadline-status ${a.window === 'closed' ? 'gc-is-conflict' : ''}`}>{a.window === 'closed' ? 'This demo intake is closed.' : 'Applicant deadline · inclusive'}</p>
        <span className="gc-eyebrow gc-audience-label">INTENDED AUDIENCE</span>
        <p className="gc-audience">{o.audience}</p>
      </div>
    </div>
    <section className="gc-assessment" aria-label="Current assessment">
      <div className="gc-assessment-head"><span className="gc-eyebrow">CURRENT ASSESSMENT</span><span>Based on your study details</span></div>
      <h3 className={`gc-fit-heading ${statusClass(a.fit)}`}>{fitText[a.fit]}{a.fit === 'met' && profile.year !== null ? ` · Year ${profile.year}` : ''}</h3>
      <div className="gc-reasons">
        {a.reasons.length === 0 ? <p className="g-muted">No listed academic reasons were provided by the assessment.</p> :
          a.reasons.map(reason => <p key={reason.criterion} className="gc-reason">
            <span className={`gc-reason-mark ${statusClass(reason.outcome)}`} aria-hidden="true">{reason.outcome === 'met' ? '✓' : reason.outcome === 'unmet' ? '×' : '?'}</span>
            <span>{reason.text}</span>
          </p>)}
      </div>
      {a.fit !== 'met' && <button type="button" className="gc-text-action" onClick={onProfile}>Edit study details</button>}
      {hasAid ? <div className="gc-stages">
        <div className="gc-aid-intro">Compared with <strong>{aidNames[profile.aid]}</strong>. Each stage is assessed separately using the listed terms.</div>
        <InfoRow label="Applying with this aid" result={a.application}/>
        <InfoRow label="Holding both awards" result={a.holding}/>
      </div> : <div className="gc-no-aid">
        <p>No existing aid selected. Add aid to compare terms.</p>
        <button type="button" className="gc-text-action" onClick={onProfile}>Add existing aid</button>
      </div>}
    </section>
    {needsReview && entry && <section className="gc-review" aria-label="Saved plan needs review">
      <p className="gc-review-label">Review change</p>
      <p>Your current study context differs from the context last acknowledged for this saved plan. The current conclusions and attributed terms appear above and below. Your saved intention and progress have not been changed.</p>
      <ActionButton variant="secondary" onClick={()=>onCommand({kind:'acknowledge',id:o.id})}>Acknowledge review</ActionButton>
    </section>}
    <div className="gc-action-block">
      <p className="gc-eyebrow">YOUR NEXT STEP</p>
      {entry && <p className="gc-saved-status">Saved as <strong>{intentionNames[entry.intention]}</strong> · Progress remains yours to update.</p>}
      <div className="gc-actions">
        {showPrimary()}
        {!entry && (a.primary === 'complete' || a.primary === 'explore') && <ActionButton variant="secondary" onClick={()=>onSave('alternative')}>Save as an alternative</ActionButton>}
        {!entry && canClarify && a.primary !== 'clarify' && <ActionButton variant="secondary" onClick={()=>onSave('clarify')}>Save clarification question</ActionButton>}
        {hasAid && <ActionButton variant="secondary" onClick={onCompare}>Compare opportunities</ActionButton>}
      </div>
      {!entry && a.primary === 'clarify' && !canClarify && <p className="gc-action-warning" role="status">No clarification question was supplied. The question cannot be saved.</p>}
      {canClarify && (!entry?.question || entry.question.text !== a.question || entry.question.aid !== profile.aid) && <div className="gc-question"><h4>{entry?.question ? 'Current suggested question' : 'Question to ask the providers'}</h4><p>{a.question}</p><p className="gc-small-note">Saved here for your follow-up. GRANTLY does not contact a provider.</p></div>}
      {entry?.question && <div className="gc-question gc-existing-question">
        <h4>Saved clarification question</h4>
        <p>{entry.question.text}</p>
        <p className="gc-small-note">Original context: {aidNames[entry.question.aid]}. This text is not automatically replaced when your aid changes.</p>
        {canClarify && (entry.question.text !== a.question || entry.question.aid !== profile.aid) &&
          <ActionButton variant="secondary" onClick={()=>onCommand({kind:'updateQuestion',id:o.id})}>Update question to current context</ActionButton>}
      </div>}
      <a className="gc-docs-jump" href="#g-required-documents">See required documents <span aria-hidden="true">↓</span></a>
    </div>
    <section id="g-required-documents" className="gc-documents" aria-labelledby="gc-documents-heading">
      <div className="gc-section-heading"><span className="gc-eyebrow">PREPARE</span><h3 id="gc-documents-heading">Required documents</h3></div>
      <ul>{o.documents.map(document => <li key={document}>{document}</li>)}</ul>
      <p className="gc-small-note">Listed demo requirements. Documents are not uploaded through GRANTLY.</p>
    </section>
    <details className="gc-terms" id="gc-terms">
      <summary>{hasAid ? 'Read both providers’ terms' : 'Read the scholarship’s demo terms'}<span className="gc-disclosure-cue" aria-hidden="true">＋</span></summary>
      <div className="gc-terms-body">
        <p className="gc-small-note">Attributed, authored demo clauses — not official provider guidance. A missing term remains unresolved, not permission.</p>
        {hasAid ? <>
          <EvidenceGroup label="Application-stage evidence" stage="application" items={a.application.evidence}/>
          <EvidenceGroup label="Holding-stage evidence" stage="holding" items={a.holding.evidence}/>
        </> : <>
          <section className="gc-term-group"><h4>Application term</h4><SoloTerm owner={o.name} stage="application" clause={o.terms.application}/></section>
          <section className="gc-term-group"><h4>Holding term</h4><SoloTerm owner={o.name} stage="holding" clause={o.terms.holding}/></section>
        </>}
      </div>
    </details>
    <p className="gc-disclaimer">Fictional demo · as of 7 Nov 2026. Meeting listed criteria is not provider confirmation, selection or payment.</p>
  </article>;
}
