# From checklist to test with Codex

An engineer-facing kit for adopting a reusable Codex skill and running the demo yourself. Codex reads the repository, applies the skill, generates a test, and presents execution evidence for human review. Playwright runs the browser checks. The Northstar support queue and its data are fictional.

Choose either path:

- **Demo it yourself:** follow the setup and prompt sequence below. Slides are not required; the filenames retain slide numbers for workshop participants.
- **Adopt the skill in your project:** follow [ADOPTION.md](ADOPTION.md) to reuse the skill with your own test setup and expected behavior.

[Workshop slides](https://docs.google.com/presentation/d/1UUp2UwPkLKWIOMMck3g0QDAORZINSU0ah_zPcdLjJqU/edit) are optional and may require separate access.

## Start a fresh workshop

Prerequisites: Node.js 22+, npm, Git, and access to Codex.

After cloning this repository, run from its root:

```sh
node setup.mjs ../northstar-workshop
```

Choose a destination that does not exist. Setup copies the app, installs the locked npm dependencies and Chromium, initializes a local Git baseline, and runs the existing tests. It excludes the completed bulk-assignment test, custom skill, dependencies, and generated reports from the copy. On Linux, Chromium may also require system packages via `npx playwright install --with-deps chromium`.

Setup excludes `.env` and `.env.*` files at every depth and refuses a starter with the deliberate regression or an unfamiliar assignment implementation. Restore the prepared starter with `npm run bug:off` in `starter/` before retrying. No destination is created when that source check fails.

Open the new `northstar-workshop` folder in Codex. Paste the prompts from this cloned repository into that task in the table's order. Run application commands in the new workspace, where `package.json` lives. Setup has already installed dependencies; the setup prompt checks and reuses them.

## Slide-to-prompt guide

| Slide | Prompt file | Action |
|---|---|---|
| 2 | [slide-02-setup.txt](prompts/slide-02-setup.txt) | Verify setup and start the manual preview |
| 4 | [slide-04-create-skill.txt](prompts/slide-04-create-skill.txt) | Create the skill only |
| 5 | No prompt | Inspect the generated skill |
| 6 | [slide-06-create-test.txt](prompts/slide-06-create-test.txt) | Generate and run the bulk-assignment test |
| 7–8 | [slides-07-08-review-and-run.txt](prompts/slides-07-08-review-and-run.txt) | Review, run visibly, and inspect the report |
| 9 | [slide-09-final-review.txt](prompts/slide-09-final-review.txt) | Review the complete diff, suite results, and limitations |
| 12, optional failure | [slide-12a-prove-regression.txt](prompts/slide-12a-prove-regression.txt) | Ask Codex to explain the unchanged test's failure |
| 12, optional restore | [slide-12b-restore-and-review.txt](prompts/slide-12b-restore-and-review.txt) | Restore behavior, rerun, and review the final diff |

Slides 1, 3, 10, and 11 provide context, the manual workflow, and follow-up discussion. They do not require a Codex prompt.

The visible run uses two seconds between browser actions so you can follow along. Set `DEMO_SLOW_MS=0` for normal-speed evidence. Inspect the actual assertions, report, and diff after the run; browser playback alone does not prove correctness.

## Included files

- `starter/`: working app and completed example test from the rehearsal. Setup omits that test for the fresh exercise.
- `reference/`: prepared examples for comparison, including the inactive skill reference and CI example. Create the active skill in the fresh workspace on slide 4.
- `prompts/`: copy-and-paste instructions named for their slides.
- `ADOPTION.md`: how to reuse the skill for meaningful workflows in your project.

To inspect the completed example directly, run `npm ci`, `npx playwright install chromium`, and `npm test` in `starter/`. Use a fresh setup-generated workspace for the from-scratch exercise.

## Repository boundary

Publish this `kit/` directory as the repository root, not its parent directory. The repository is for engineers running and adopting the workflow. Presenter talk tracks, slide decks, rehearsal notes, internal rollout plans, recordings, screenshots, traces, generated reports, installed dependencies, and local environment files are not part of the upload. Generate execution evidence locally when you run the tests.

Before the first push, review the exact staged file list and diff, including hidden files. Ignore rules are a guardrail, not a substitute for that review; they do not remove files that are already tracked.

## Scope and safety

Maintainers can verify the setup safeguards with `node --test tests/setup.test.mjs` from the kit root. This integration check uses temporary workspaces and installs dependencies and Chromium, so it requires network access or cached downloads.

`npm run bug:on` deliberately changes one application line. Leave the test unchanged while observing the failure, then restore with `npm run bug:off`. The final review prompt does not commit, push, or approve a PR.

The tests cover local Chromium and an in-memory service. Refresh preserves data, but restarting the server resets it. This workshop does not establish production readiness or comprehensive visual regression coverage. Reports and browser downloads are not committed.
