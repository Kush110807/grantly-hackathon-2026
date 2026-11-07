/** Chat D · controlled My plan. Root owns navigation, model, notices and confirmation. */
import type { Intention, PlanProps, Progress, Row } from '../shared/contracts';
import './plan.css';

const aidNames = {
  none: 'No existing aid',
  CW: 'Campus Tuition Waiver',
  FT: 'Founders Tuition Award',
} as const;
const intentionNames: Record<Intention, string> = {
  pursue: 'Pursue', alternative: 'Alternative', clarify: 'Clarify',
};
const progressNames: Record<Progress, string> = {
  notStarted: 'Not started', preparing: 'Preparing',
  submittedExternally: 'Submitted externally — self-reported',
};
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function displayDeadline(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day || !monthNames[month-1]) return date;
  return `${day} ${monthNames[month-1]} ${year}`;
}
function fitText(row: Row): string {
  switch (row.assessment.fit) {
    case 'met': return 'Listed criteria met';
    case 'unmet': return 'Listed criteria not met';
    case 'missing': return 'Listed criteria · Information missing';
  }
}
function outcomeText(value: string): string {
  switch (value) {
    case 'permitted': return 'Permitted by listed terms';
    case 'restricted': return 'Restricted by listed terms';
    case 'prohibited': return 'Prohibited by listed terms';
    case 'unresolved': return 'Unresolved';
    case 'notApplicable': return 'Not applicable';
    default: return value;
  }
}
function CurrentEvidence({ row }: { row: Row }) {
  const stages = [
    { label: 'Applying with this aid', stage: row.assessment.application },
    { label: 'Holding both awards', stage: row.assessment.holding },
  ];
  return <details className="gd-evidence">
    <summary>Inspect current evidence from both providers</summary>
    <p className="gd-evidence-note">This is the live assessment for your current study details, not a saved historical decision.</p>
    {stages.map(({ label, stage }) => <div className="gd-evidence-stage" key={label}>
      <strong>{label} · {outcomeText(stage.outcome)}</strong>
      <p>{stage.reason}</p>
      {stage.evidence.length === 0 ? <p>No existing aid selected; no comparison terms apply.</p> :
        <ul>{stage.evidence.map((item, index) => <li key={`${item.owner}-${item.clause?.id ?? 'missing'}-${index}`}>
          <span className="gd-evidence-owner">{item.owner}</span>
          <span>{item.clause ? `Listed ${item.clause.stage} term (${item.clause.effect}): “${item.clause.text}”` :
            (item.note || 'No term is published in this demo record for this stage.')}</span>
        </li>)}</ul>}
    </div>)}
  </details>;
}

export function MyPlan({ rows, profile, onCommand, onOpen, onDiscover, onReset }: PlanProps) {
  const savedRows = rows.filter(row => row.entry !== null);
  return <section className="gd-plan" aria-label="Saved scholarship plan">
    <div className="gd-heading">
      <div>
        <div className="g-kicker">YOUR DECISIONS / YOUR PLAN</div>
        <h2 id="g-plan-heading" tabIndex={-1} className="g-focus-target">Your saved steps</h2>
        <p className="g-muted">{savedRows.length === 0 ? 'Keep a practical record of what you want to do.' :
          `${savedRows.length} ${savedRows.length === 1 ? 'opportunity' : 'opportunities'} in your plan. These are intentions, not submitted applications.`}</p>
      </div>
      <div className="gd-context" aria-label={`Current aid comparison: ${aidNames[profile.aid]}`}>
        <span className="gd-small-label">CURRENT COMPARISON</span>
        <strong>{aidNames[profile.aid]}</strong>
        <span>Changing study details does not alter saved intentions.</span>
      </div>
    </div>

    {savedRows.length === 0 ? <div className="gd-empty">
      <h3>Your plan is empty.</h3>
      <p>Find a scholarship and save your next step.</p>
      <button type="button" className="g-primary" onClick={onDiscover}>Find scholarships</button>
    </div> : <ol className="gd-records">
      {savedRows.map((row) => {
        const entry = row.entry;
        if (!entry) return null;
        const id = row.opportunity.id;
        const questionIsCurrent = (row.assessment.application.outcome === 'unresolved' ||
          row.assessment.holding.outcome === 'unresolved') &&
          typeof row.assessment.question === 'string' && row.assessment.question.trim().length > 0;
        const questionChanged = questionIsCurrent &&
          (entry.question?.text !== row.assessment.question || entry.question?.aid !== profile.aid);
        return <li className="gd-record" key={id}>
          <article aria-labelledby={`gd-title-${id}`}>
            <div className="gd-record-top">
              <div className="gd-record-title-group">
                <span className="gd-index">SAVED OPPORTUNITY / {id}</span>
                <h3 id={`gd-title-${id}`}>{row.opportunity.name}</h3>
                <p className="gd-purpose">{row.opportunity.purpose}</p>
              </div>
              <div className="gd-deadline">
                <span>APPLY BY</span>
                <time dateTime={row.opportunity.deadline}>{displayDeadline(row.opportunity.deadline)}</time>
                <span className="gd-deadline-status">{row.assessment.window === 'closed' ? 'Intake closed' : 'Intake open in demo'}</span>
              </div>
            </div>

            <div className="gd-benefit"><strong>{row.opportunity.benefit}</strong> <span>{row.opportunity.frequency}</span></div>
            <div className="gd-controls">
              <div className="gd-field">
                <label htmlFor={`gd-intent-${id}`}>Saved intention</label>
                <select id={`gd-intent-${id}`} value={entry.intention}
                  onChange={event => onCommand({ kind: 'save', id, intention: event.target.value as Intention })}>
                  {(['pursue', 'alternative', 'clarify'] as const).map(intention => <option key={intention}
                    value={intention} disabled={intention === 'clarify' && !questionIsCurrent && entry.intention !== 'clarify'}>
                    {intentionNames[intention]}
                  </option>)}
                </select>
              </div>
              <div className="gd-field">
                <label htmlFor={`gd-progress-${id}`}>Progress · recorded by you</label>
                <select id={`gd-progress-${id}`} value={entry.progress}
                  onChange={event => onCommand({ kind: 'progress', id, value: event.target.value as Progress })}>
                  {(['notStarted', 'preparing', 'submittedExternally'] as const).map(progress =>
                    <option key={progress} value={progress}>{progressNames[progress]}</option>)}
                </select>
              </div>
            </div>
            {entry.progress === 'submittedExternally' && <p className="gd-submission-note">Recorded by you. No submission was sent through GRANTLY.</p>}
            {entry.question && <div className="gd-question">
              <span className="gd-small-label">SAVED CLARIFICATION QUESTION</span>
              <p>{entry.question.text}</p>
              <p className="gd-original-context">Original aid context: {aidNames[entry.question.aid]}. This question has not been automatically replaced.</p>
            </div>}
            {row.needsReview && <div className="gd-review">
              <div className="gd-review-heading"><strong>Review change</strong><span>Study context differs from your last acknowledgement.</span></div>
              <p><strong>{fitText(row)}</strong>{row.assessment.reasons.length > 0 ?
                ` · ${row.assessment.reasons.map(reason => reason.text).join(' ')}` : ''}</p>
              {profile.aid !== 'none' ? <div className="gd-stage-summary">
                <p><b>Applying with this aid · {outcomeText(row.assessment.application.outcome)}</b><span>{row.assessment.application.reason}</span></p>
                <p><b>Holding both awards · {outcomeText(row.assessment.holding.outcome)}</b><span>{row.assessment.holding.reason}</span></p>
              </div> : <p>No existing aid selected. Add aid to compare terms.</p>}
              <CurrentEvidence row={row}/>
              <button type="button" className="g-secondary" onClick={() => onCommand({kind:'acknowledge',id})}>
                Acknowledge review
              </button>
              <p className="gd-ack-note">Acknowledging records that you have seen the current terms. It does not change your intention or progress.</p>
            </div>}
            {questionChanged && <div className="gd-question-update">
              <p>A new clarification question is available for the current aid context. Your original wording remains saved until you choose to replace it.</p>
              <button type="button" className="g-secondary" onClick={() => onCommand({kind:'updateQuestion',id})}>
                Update saved question for {aidNames[profile.aid]}
              </button>
            </div>}
            <div className="gd-actions">
              <button type="button" id={`g-plan-open-${id}`} className="g-primary" onClick={() => onOpen(id)}>
                View current terms
              </button>
              <button type="button" className="gd-remove" onClick={() => onCommand({kind:'remove',id})}
                aria-label={`Remove ${row.opportunity.name} from your plan`}>Remove from plan</button>
            </div>
          </article>
        </li>;
      })}
    </ol>}
    <div className="gd-footer-actions">
      {savedRows.length > 0 && <button type="button" className="g-secondary" onClick={onDiscover}>Find more scholarships</button>}
      <button type="button" className="gd-reset" onClick={onReset}>Reset demo</button>
      <span>Reset asks for confirmation and clears only GRANTLY browser data.</span>
    </div>
  </section>;
}
