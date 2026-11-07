import type { Id } from './contracts';
// All focus hooks are stable and never depend on array index or visible sort order.
export const FOCUS = {
  detailHeading: 'g-detail-heading', // C: OpportunityDetail <h2 id=... tabIndex={-1}>
  results: 'g-results-list',         // C: Discover list container tabIndex={-1}
  profileEditor: 'g-profile-editor', // A: shell <section ... tabIndex={-1}>
  opportunityRow: (id:Id) => `g-opportunity-row-${id}`, // C: row's View details control
  planOpen: (id:Id) => `g-plan-open-${id}` // D: View current terms control
} as const;
export function focusId(id:string): void {
  // React commit timing: schedule AFTER render, never on simple profile changes.
  window.requestAnimationFrame(() => { document.getElementById(id)?.focus({preventScroll:false}); });
}
