# GRANTLY · Chat D · Finite G2 plan refinement

**Base:** `GRANTLY_G2_VISUAL_r2.zip` is A's visual foundation; patch **only** `src/plan/**` without touching shared files.

P1 correction: replace unconditional `YOUR DECISIONS / SAVED ON THIS DEVICE` with neutral text such as `YOUR PLAN / RECORDED INTENTIONS`. The browser may fail to save; A-owned global storage notice is the only truthful signal of actual persistence.

P2 visual correction: format each saved record as a readable decision chronology: scholarship name + inclusive applicant deadline, clear intention, self-reported progress, review-required changes and saved clarification in their original aid context. Make action prominence clear without adding a second store or altering `applyCommand`, `contextKey`, `read/write/reset` or any exports. Retain the `g-plan-open-${id}` focus target.

Keep all P1 semantic safeguards: an external submission is self-reported and not sent by GRANTLY; review acknowledgement does not change saved intention or archived question; missing terms remain unresolved; failed writes remain unsaved. Test 390×844, 375×812 and 1440×900, keyboard focus and 200% zoom. Return changed D-owned files, tests and any remaining UNRUN findings.
