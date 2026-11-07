/**
 * Chat D · pure plan transitions. The root keeps the only Model instance.
 * These functions never read storage, evaluate aid rules or mutate their inputs.
 */
import type { Command, Entry, Id, Intention, Model, Opportunity, Profile, Row } from '../shared/contracts';

const IDs: ReadonlySet<Id> = new Set<Id>(['M', 'F', 'B', 'C', 'L', 'D']);
const intentions: ReadonlySet<Intention> = new Set<Intention>(['pursue', 'alternative', 'clarify']);

/** Relevant profile inputs only. Year is always relevant; field only if this grant tests field. */
export function contextKey(opportunity: Opportunity, profile: Profile): string {
  return JSON.stringify([profile.year, opportunity.requiredField === null ? null : profile.field, profile.aid]);
}

function currentQuestion(row: Row): string | null {
  // B owns whether the result is unresolved and produces the concrete question.
  const unresolved = row.assessment.application.outcome === 'unresolved' ||
    row.assessment.holding.outcome === 'unresolved';
  const candidate = row.assessment.question;
  return unresolved && typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : null;
}

function replaceEntry(model: Model, before: Entry, after: Entry): Model {
  return { ...model, entries: model.entries.map(entry => entry === before ? after : entry) };
}

/** Invalid commands, duplicate saves and no-op changes return the ORIGINAL model reference. */
export function applyCommand(model: Model, command: Command, row: Row): Model {
  if (!IDs.has(command.id) || command.id !== row.opportunity.id) return model;
  const existing = model.entries.find(entry => entry.id === command.id);

  switch (command.kind) {
    case 'save': {
      if (!intentions.has(command.intention)) return model;
      const question = currentQuestion(row);
      if (command.intention === 'clarify' && question === null && existing?.intention !== 'clarify') return model;
      if (existing) {
        if (existing.intention === command.intention) return model;
        // Changing intention deliberately retains earlier progress, question and review state.
        const savedQuestion = existing.question ?? (command.intention === 'clarify' && question !== null
          ? { text: question, aid: model.profile.aid } : null);
        return replaceEntry(model, existing, { ...existing, intention: command.intention, question: savedQuestion });
      }
      const created: Entry = {
        id: command.id,
        intention: command.intention,
        progress: 'notStarted',
        question: command.intention === 'clarify' && question !== null
          ? { text: question, aid: model.profile.aid } : null,
        acknowledgedKey: contextKey(row.opportunity, model.profile),
      };
      return { ...model, entries: [...model.entries, created] };
    }
    case 'progress': {
      if (!existing || !['notStarted', 'preparing', 'submittedExternally'].includes(command.value) ||
          existing.progress === command.value) return model;
      return replaceEntry(model, existing, { ...existing, progress: command.value });
    }
    case 'acknowledge': {
      if (!existing) return model;
      const nextKey = contextKey(row.opportunity, model.profile);
      if (existing.acknowledgedKey === nextKey) return model;
      // Explicit acknowledgement never changes intention, progress or saved question.
      return replaceEntry(model, existing, { ...existing, acknowledgedKey: nextKey });
    }
    case 'updateQuestion': {
      if (!existing) return model;
      const question = currentQuestion(row);
      if (question === null) return model;
      if (existing.question?.text === question && existing.question.aid === model.profile.aid) return model;
      return replaceEntry(model, existing, {
        ...existing, question: { text: question, aid: model.profile.aid },
      });
    }
    case 'remove': {
      if (!existing) return model;
      return { ...model, entries: model.entries.filter(entry => entry.id !== command.id) };
    }
    default:
      return model;
  }
}
