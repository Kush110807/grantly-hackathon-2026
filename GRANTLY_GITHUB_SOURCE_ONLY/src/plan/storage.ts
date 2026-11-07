/**
 * Chat D · guarded, synchronous, device-only persistence.
 * No browser data is overwritten when read data is invalid/unavailable.
 * A owns Model memory, notices and the confirmation flow for reset().
 */
import type { Aid, Entry, Field, Id, IOResult, Model, Progress, ReadResult, Year } from '../shared/contracts';

const STORAGE_KEY = 'grantly.v1';
const ids: ReadonlySet<string> = new Set<Id>(['M', 'F', 'B', 'C', 'L', 'D']);
const aids: ReadonlySet<string> = new Set<Aid>(['none', 'CW', 'FT']);
const fields: ReadonlySet<string> = new Set<Field>(['stem', 'other']);
const progressStates: ReadonlySet<string> = new Set<Progress>(['notStarted', 'preparing', 'submittedExternally']);
const intentions: ReadonlySet<string> = new Set(['pursue', 'alternative', 'clarify']);

// I/O admission latch, NOT a second app store. A also carries the lock in its shell.
// Once unknown bytes are seen, only explicit successful reset() can enable writes.
let writeBlockedUntilReset = false;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function exactly(value: Record<string, unknown>, names: readonly string[]): boolean {
  return Object.keys(value).length === names.length && names.every(name => Object.prototype.hasOwnProperty.call(value, name));
}
function validYear(value: unknown): value is Year | null {
  return value === null || value === 1 || value === 2 || value === 3 || value === 4;
}
function validField(value: unknown): value is Field | null {
  return value === null || (typeof value === 'string' && fields.has(value));
}
function validAid(value: unknown): value is Aid {
  return typeof value === 'string' && aids.has(value);
}
function validQuestion(value: unknown): boolean {
  return value === null || (record(value) && exactly(value, ['text', 'aid']) &&
    typeof value.text === 'string' && value.text.trim().length > 0 && validAid(value.aid));
}
function validKey(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const tuple: unknown = JSON.parse(value);
    return Array.isArray(tuple) && tuple.length === 3 && validYear(tuple[0]) &&
      validField(tuple[1]) && validAid(tuple[2]) &&
      JSON.stringify(tuple) === value;
  } catch { return false; }
}
function validEntry(value: unknown): value is Entry {
  if (!record(value) || !exactly(value, ['id', 'intention', 'progress', 'question', 'acknowledgedKey'])) return false;
  if (typeof value.id !== 'string' || !ids.has(value.id) ||
      typeof value.intention !== 'string' || !intentions.has(value.intention) ||
      typeof value.progress !== 'string' || !progressStates.has(value.progress) ||
      !validQuestion(value.question) || !validKey(value.acknowledgedKey)) return false;
  return value.intention !== 'clarify' || value.question !== null;
}
function validModel(value: unknown): value is Model {
  if (!record(value) || !exactly(value, ['version', 'profile', 'entries']) || value.version !== 1 ||
      !record(value.profile) || !exactly(value.profile, ['year', 'field', 'aid']) ||
      !validYear(value.profile.year) || !validField(value.profile.field) || !validAid(value.profile.aid) ||
      !Array.isArray(value.entries) || value.entries.length > ids.size || !value.entries.every(validEntry)) return false;
  const savedIds = value.entries.map((entry: Entry) => entry.id);
  return new Set(savedIds).size === savedIds.length;
}
function storage(): Storage {
  // Reading window.localStorage can itself throw SecurityError in browsers.
  if (typeof window === 'undefined') throw new Error('No browser window');
  const result = window.localStorage;
  if (!result || typeof result.getItem !== 'function' ||
      typeof result.setItem !== 'function' || typeof result.removeItem !== 'function') {
    throw new Error('Device storage is not accessible');
  }
  return result;
}

export function read(): ReadResult {
  try {
    const bytes = storage().getItem(STORAGE_KEY);
    if (bytes === null) return { kind: 'empty' };
    let parsed: unknown;
    try { parsed = JSON.parse(bytes); }
    catch { writeBlockedUntilReset = true; return { kind: 'invalid' }; }
    if (!validModel(parsed)) {
      writeBlockedUntilReset = true;
      return { kind: 'invalid' };
    }
    return { kind: 'ok', model: parsed };
  } catch {
    writeBlockedUntilReset = true;
    return { kind: 'unavailable' };
  }
}

export function write(model: Model): IOResult {
  if (writeBlockedUntilReset) {
    return { ok: false, message: 'Device storage writes are blocked until confirmed Reset demo.' };
  }
  if (!validModel(model)) return { ok: false, message: 'The plan snapshot is invalid and was not saved.' };
  try {
    const bytes = JSON.stringify(model);
    const store = storage();
    store.setItem(STORAGE_KEY, bytes);
    // Check the persisted value before allowing A to claim success.
    if (store.getItem(STORAGE_KEY) !== bytes) {
      return { ok: false, message: 'This browser did not retain the saved plan. Changes remain in this tab.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Changes are available in this tab. This browser couldn’t save them.' };
  }
}

/** A must confirm with the user before calling. No other origin keys are touched. */
export function reset(): IOResult {
  try {
    const store = storage();
    store.removeItem(STORAGE_KEY);
    if (store.getItem(STORAGE_KEY) !== null) {
      return { ok: false, message: 'Couldn’t clear this device’s saved plan.' };
    }
    writeBlockedUntilReset = false;
    return { ok: true };
  } catch {
    return { ok: false, message: 'Couldn’t clear this device’s saved plan.' };
  }
}
