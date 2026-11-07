# To Chat E — Independent QA retest against G2-r3

You are evaluating a **new, revision-bound candidate**: `GRANTLY-A-G2-r3`, from `GRANTLY_G2_r3.zip`. You previously tested `GRANTLY-A-G2-r1` and returned FAIL due to two source-confirmed P2 copy defects, with browser checks blocked. Prior findings and 69/69 independent module assertions remain historically relevant but are not release acceptance for this revision.

**Required:** use the frozen GRANTLY handoff and your original acceptance plan, verify `G2_INTEGRATION_MANIFEST.json` against the extracted files, and retest the NEW source independently. The returned report must cite r3 file hashes and actual executed results, with PASS/FAIL/UNRUN/BLOCKED separation.

Retest the following specifically:

1. **E-G2-01:** D-r2 neutral `YOUR DECISIONS / YOUR PLAN` heading when localStorage fails; verify in the running UI.
2. **E-G2-02:** A study-context intro does not assert successful browser storage; check failed/unreadable and successful states.
3. **E-G2-03:** with Fieldwork and CW selected, keyboard change aid to FT: the polite announcement must state current *holding prohibited* separately from *application permitted*, without moving focus. Check with screen reader if available.
4. Domain/oracle 11 named cases; discovery; selection and Back/focus restoration; saved intentions and progress; read/write/reset fault conditions; question context preservation; 1440x900/390x844/360px/200% zoom; production built asset isolation.
5. Only mark browser, build, repository or deployment checks PASS if directly observed; do not inherit results from r1 or isolated C screenshots.

E retains independence and final release disposition; A cannot self-certify.
