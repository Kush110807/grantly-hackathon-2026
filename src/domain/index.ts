/**
 * GRANTLY fictional catalogue and independent cross-provider domain assessment.
 * Source: approved 04_DATASET_AND_RULES.md, frozen G1 contracts.
 * No browser state, network, clock, UI, or other lane dependencies.
 */
import type {
  Assessment, Clause, Evidence, Fit, Opportunity, Preset,
  Profile, Reason, Stage, StageResult, Terms
} from '../shared/contracts';

/** Constant demo date. Inclusive deadlines use YYYY-MM-DD comparisons only. */
export const DEMO_DAY = '2026-11-07';

const A1 = 'Students receiving existing tuition support may apply for this award.';
const A2 = 'Students receiving tuition support when they apply may not enter this intake.';
const H1 = 'Recipients may hold this award alongside existing tuition support.';
const H2 = 'Recipients may not hold this award at the same time as another tuition award or tuition waiver.';

function opportunityClause(
  id: Opportunity['id'], owner: string, code: 'A1'|'A2'|'H1'|'H2',
  stage: Stage, effect: Clause['effect'], text: string
): Clause {
  return { id: `${id}:${code}`, owner, stage, effect, text };
}

function opportunityTerms(
  id: Opportunity['id'], owner: string, applicationCode: 'A1'|'A2',
  holdingCode: 'H1'|'H2'|null
): Terms {
  return {
    application: opportunityClause(
      id, owner, applicationCode, 'application', applicationCode === 'A1' ? 'permit' : 'veto',
      applicationCode === 'A1' ? A1 : A2
    ),
    holding: holdingCode === null ? null : opportunityClause(
      id, owner, holdingCode, 'holding', holdingCode === 'H1' ? 'permit' : 'veto',
      holdingCode === 'H1' ? H1 : H2
    )
  };
}

export const catalogue: Opportunity[] = [
  {
    id: 'M', name: 'Meridian Study Grant', purpose: 'Tuition support for undergraduate study',
    benefit: '₹30,000', frequency: 'One academic year',
    conditions: 'Paid once to the college if awarded. No automatic renewal.',
    audience: 'UG year 1 · any field', deadline: '2026-11-15', years: [1],
    requiredField: null, documents: ['Class XII final marksheet', 'Current fee statement'],
    terms: opportunityTerms('M', 'Meridian Study Grant', 'A1', 'H2')
  },
  {
    id: 'F', name: 'Fieldwork Materials Grant', purpose: 'Fieldwork materials reimbursement',
    benefit: 'Up to ₹8,000', frequency: 'One-time reimbursement',
    conditions: 'Reimburses actual eligible fieldwork materials against receipts after selection.',
    audience: 'UG years 1–2 · any field', deadline: '2026-11-18', years: [1, 2],
    requiredField: null, documents: ['Enrolment letter', 'Itemised materials estimate'],
    terms: opportunityTerms('F', 'Fieldwork Materials Grant', 'A1', 'H1')
  },
  {
    id: 'B', name: 'Bridge Travel Bursary', purpose: 'Travel support for a college placement visit',
    benefit: '₹5,000', frequency: 'One-time travel allowance',
    conditions: 'For a college placement visit if selected.',
    audience: 'UG years 1–4 · any field', deadline: '2026-11-12', years: [1, 2, 3, 4],
    requiredField: null, documents: ['Placement invitation', 'Travel estimate'],
    terms: opportunityTerms('B', 'Bridge Travel Bursary', 'A1', null)
  },
  {
    id: 'C', name: 'Continuing Scholars Award', purpose: 'Tuition support for continuing undergraduates',
    benefit: '₹20,000', frequency: 'Annual tuition award; this intake covers one academic year',
    conditions: 'Future years require a fresh decision.',
    audience: 'UG years 2–4 · any field', deadline: '2026-11-22', years: [2, 3, 4],
    requiredField: null, documents: ['Previous-year marksheet', 'Fee statement'],
    terms: opportunityTerms('C', 'Continuing Scholars Award', 'A2', 'H2')
  },
  {
    id: 'L', name: 'Lab Access Fee Waiver', purpose: 'Laboratory fee support for STEM study',
    benefit: '50% of the college laboratory fee, capped at ₹6,000', frequency: 'One semester',
    conditions: 'Fee waiver only; no cash payout.',
    audience: 'UG years 1–3 · STEM only', deadline: '2026-11-28', years: [1, 2, 3],
    requiredField: 'stem', documents: ['Enrolment letter naming course', 'Lab fee statement'],
    terms: opportunityTerms('L', 'Lab Access Fee Waiver', 'A1', 'H1')
  },
  {
    id: 'D', name: 'Digital Access Grant', purpose: 'Device reimbursement for undergraduate study',
    benefit: 'Up to ₹12,000', frequency: 'One-time reimbursement',
    conditions: 'Reimburses an eligible device invoice if selected.',
    audience: 'UG years 1–4 · any field', deadline: '2026-11-04', years: [1, 2, 3, 4],
    requiredField: null, documents: ['Enrolment letter', 'Device quotation'],
    terms: opportunityTerms('D', 'Digital Access Grant', 'A1', 'H1')
  }
];

export const presets: Preset[] = [
  {
    id: 'CW', name: 'Campus Tuition Waiver',
    terms: {
      application: {
        id: 'CW-A', owner: 'Campus Tuition Waiver', stage: 'application', effect: 'permit',
        text: 'Waiver holders may apply for other educational awards.'
      },
      holding: {
        id: 'CW-H', owner: 'Campus Tuition Waiver', stage: 'holding', effect: 'permit',
        text: 'Waiver holders may retain this waiver alongside tuition or non-tuition awards if the other provider also permits the combination.'
      }
    }
  },
  {
    id: 'FT', name: 'Founders Tuition Award',
    terms: {
      application: {
        id: 'FT-A', owner: 'Founders Tuition Award', stage: 'application', effect: 'permit',
        text: 'Award holders may apply for outside educational support.'
      },
      holding: {
        id: 'FT-H', owner: 'Founders Tuition Award', stage: 'holding', effect: 'veto',
        text: 'Award holders may not retain this award alongside any other educational award.'
      }
    }
  }
];

const NO_AID_REASON = 'No existing aid selected; a cross-award comparison does not apply.';

function academicReasons(o: Opportunity, p: Profile): Reason[] {
  const reasons: Reason[] = [];
  if (p.year === null) {
    reasons.push({criterion: 'year', outcome: 'missing',
      text: `Choose your current undergraduate year to check the listed years for ${o.name}.`});
  } else if (o.years.includes(p.year)) {
    reasons.push({criterion: 'year', outcome: 'met',
      text: `Year ${p.year} is included in ${o.name}'s listed undergraduate years.`});
  } else {
    reasons.push({criterion: 'year', outcome: 'unmet',
      text: `Year ${p.year} is not among ${o.name}'s listed undergraduate years (${o.years.join(', ')}).`});
  }

  // No record other than L checks field; do not ask for or judge unused field input.
  if (o.requiredField !== null) {
    if (p.field === null) {
      reasons.push({criterion: 'field', outcome: 'missing',
        text: `${o.name} requires STEM; choose a field to check that condition.`});
    } else if (p.field === o.requiredField) {
      reasons.push({criterion: 'field', outcome: 'met',
        text: `Your selected STEM field meets ${o.name}'s listed field condition.`});
    } else {
      reasons.push({criterion: 'field', outcome: 'unmet',
        text: `Your selected field does not meet ${o.name}'s STEM-only condition.`});
    }
  }
  return reasons;
}

function combineFit(reasons: Reason[]): Fit {
  // A known failure outranks any unanswered criteria, but retain EVERY reason.
  if (reasons.some(r => r.outcome === 'unmet')) return 'unmet';
  if (reasons.some(r => r.outcome === 'missing')) return 'missing';
  return 'met';
}

/** Missing-clause notices are editorial, never fabricated provider quotations. */
function evidenceFor(owner: string, clause: Clause | null, stage: Stage): Evidence {
  return {
    owner, clause,
    note: clause !== null ? '' : `${owner} has no ${stage} term in this demo record.`
  };
}

function evidenceForOpportunity(o: Opportunity, stage: Stage): Evidence {
  if (o.id === 'B' && stage === 'holding' && o.terms.holding === null) {
    return { owner: o.name, clause: null,
      note: 'Bridge Travel Bursary has no holding term in this demo record.' };
  }
  return evidenceFor(o.name, o.terms[stage], stage);
}

type ApplicationResult = Assessment['application'];
type HoldingResult = Assessment['holding'];
type StageOutcome = ApplicationResult['outcome'] | HoldingResult['outcome'];

function stageResult(o: Opportunity, aid: Preset | null, stage: 'application'): ApplicationResult;
function stageResult(o: Opportunity, aid: Preset | null, stage: 'holding'): HoldingResult;
function stageResult(o: Opportunity, aid: Preset | null, stage: Stage): StageResult<StageOutcome> {
  if (aid === null) return {outcome: 'notApplicable', reason: NO_AID_REASON, evidence: []};

  // Evidence is always supplied from BOTH owners even when one source vetoes.
  const own = evidenceForOpportunity(o, stage);
  const existing = evidenceFor(aid.name, aid.terms[stage], stage);
  const evidence = [own, existing];
  const vetoOwners = evidence.filter(e => e.clause?.effect === 'veto').map(e => e.owner);
  const missingOwners = evidence.filter(e => e.clause === null).map(e => e.owner);
  const stageLabel = stage === 'application' ? 'application' : 'holding';

  if (vetoOwners.length > 0) {
    const outcome = stage === 'application' ? 'restricted' : 'prohibited';
    const limitation = stage === 'application' ? 'applying with existing aid' : 'holding both awards';
    return {
      outcome,
      reason: `${vetoOwners.join(' and ')} explicitly ${vetoOwners.length > 1 ? 'prohibit' : 'prohibits'} ${limitation}.` +
        (missingOwners.length ? ` Missing ${stageLabel} terms from ${missingOwners.join(' and ')} do not override this veto.` : ''),
      evidence
    };
  }
  if (missingOwners.length > 0) {
    return {
      outcome: 'unresolved',
      reason: `${stage === 'application' ? 'Applying with aid' : 'Holding both awards'} is unresolved for ${o.name} and ${aid.name}: ` +
        `${missingOwners.join(' and ')} ${missingOwners.length > 1 ? 'have' : 'has'} no published ${stageLabel} term in this demo record. ` +
        'Neither permission nor a prohibition can be inferred from missing terms.',
      evidence
    };
  }
  return {
    outcome: 'permitted',
    reason: `Both ${o.name} and ${aid.name} explicitly permit ` +
      (stage === 'application' ? 'applying with this existing aid' : 'holding the two awards together') +
      ' under their listed terms. This is not a guarantee of selection or award.',
    evidence
  };
}

function clarificationQuestion(o: Opportunity, aid: Preset | null,
  application: ApplicationResult, holding: HoldingResult): string | null {
  if (aid === null) return null;
  const questions: string[] = [];
  if (application.outcome === 'unresolved') {
    questions.push(`May I apply for the ${o.name} while receiving my ${aid.name}?`);
  }
  if (holding.outcome === 'unresolved') {
    // Deliberately preserve the exact owner-approved Bridge + CW oracle wording.
    questions.push(`May I keep my ${aid.name} if I accept the ${o.name}?`);
  }
  return questions.length ? questions.join(' ') : null;
}

/**
 * Pure rule engine. Every opportunity is an independent, fictional provider.
 * Application and concurrent holding are intentionally separate assessments.
 */
export function assess(o: Opportunity, p: Profile, day: string = DEMO_DAY): Assessment {
  const reasons = academicReasons(o, p);
  const fit = combineFit(reasons);
  // Same calendar date remains open, independent of host locale / time of day.
  const window = day <= o.deadline ? 'open' : 'closed';
  const aid = p.aid === 'none' ? null : presets.find(item => item.id === p.aid) ?? null;
  const application = stageResult(o, aid, 'application');
  const holding = stageResult(o, aid, 'holding');
  const question = clarificationQuestion(o, aid, application, holding);

  let primary: Assessment['primary'];
  if (window === 'closed' || fit === 'unmet' || application.outcome === 'restricted') {
    primary = 'explore';
  } else if (fit === 'missing') {
    primary = 'complete';
  } else if (application.outcome === 'unresolved' || holding.outcome === 'unresolved') {
    primary = 'clarify';
  } else if (holding.outcome === 'prohibited') {
    primary = 'alternative';
  } else {
    primary = 'pursue';
  }
  return {fit, reasons, window, application, holding, primary, question};
}
