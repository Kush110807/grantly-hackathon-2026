/** Opt-in demonstration context. Nothing is changed until the user activates the example. */
import type { ListState, Model } from '../shared/contracts';

export const WORKED_EXAMPLE = {
  opportunityId: 'M',
  year: 1,
  aid: 'CW'
} as const;

/** Keep existing plan entries/questions/progress intact; apply only the stated study context. */
export function withWorkedExample(model: Model): Model {
  return {
    ...model,
    profile: { ...model.profile, year: WORKED_EXAMPLE.year, aid: WORKED_EXAMPLE.aid }
  };
}

/** Show the selected open grant even if an earlier search/filter excluded it. */
export function workedExampleList(): ListState {
  return { query: '', openOnly: true, selected: WORKED_EXAMPLE.opportunityId };
}
