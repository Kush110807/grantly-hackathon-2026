import test from 'node:test';
import assert from 'node:assert/strict';
import { WORKED_EXAMPLE, withWorkedExample, workedExampleList } from './tryExample.ts';

test('worked example is explicitly selected, not an implicit initial default', () => {
  assert.deepEqual(WORKED_EXAMPLE, { opportunityId: 'M', year: 1, aid: 'CW' });
  assert.deepEqual(workedExampleList(), { query: '', openOnly: true, selected: 'M' });
});

test('worked example changes only stated context and preserves existing saved decisions', () => {
  const question = { text: 'Can I hold both?', aid: 'FT' };
  const entries = [{ id: 'B', question, progress: 'preparing', intention: 'clarify', acknowledgedKey: 'old' }];
  const old = { version: 1, profile: { year: 3, field: 'other', aid: 'FT' }, entries };
  const next = withWorkedExample(old);
  assert.deepEqual(next.profile, { year: 1, field: 'other', aid: 'CW' });
  assert.strictEqual(next.entries, entries);
  assert.strictEqual(next.entries[0].question, question);
  assert.deepEqual(old.profile, { year: 3, field: 'other', aid: 'FT' });
});

test('worked example does not fabricate an application, award or new plan entry', () => {
  const model = { version: 1, profile: { year: null, field: null, aid: 'none' }, entries: [] };
  const next = withWorkedExample(model);
  assert.deepEqual(next.profile, { year: 1, field: null, aid: 'CW' });
  assert.equal(next.entries.length, 0);
});
