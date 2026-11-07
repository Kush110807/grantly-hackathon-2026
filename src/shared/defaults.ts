import type { Model, ListState } from './contracts';
// Construct fresh defaults; no G1 data is written on hydration.
export function freshModel(): Model { return { version: 1, profile: {year:null, field:null, aid:'none'}, entries: [] }; }
export function freshList(): ListState { return { query:'', openOnly:true, selected:null }; }
export const DEMO_LABEL = 'Fictional demo · as of 7 Nov 2026';
