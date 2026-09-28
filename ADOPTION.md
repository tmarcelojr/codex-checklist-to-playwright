# Adopt the workflow in your project

The demo teaches a repeatable workflow: state expected behavior, ask Codex to author a test using repository conventions, execute it, and review the code and observed results. Playwright provides browser automation; the skill provides reusable instructions for Codex.

## Install the skill

1. Start in a project with a working Playwright setup. Run its existing tests first and resolve setup failures.
2. Copy `reference/checklist-to-playwright/SKILL.md` from this kit to `.agents/skills/checklist-to-playwright/SKILL.md` in your project. If a skill already exists there, compare and review it instead of overwriting it.
3. Ask Codex to use `checklist-to-playwright` and supply the workflow and its expected outcomes. Do not copy the demo's app, ticket data, ports, or configuration into your application.

Example request:

> Use checklist-to-playwright to automate this workflow: [actions]. Verify [expected results], relevant unaffected records, and [persistence behavior, if required]. Reuse this repository's test setup. Keep application behavior unchanged. Run the test and show the diff, actual results, and limitations for review.

If expected behavior is unclear, agree on it before generating assertions. Use isolated test data and approved test environments, not production records or credentials.

## Review and reuse

- Check that assertions reflect the agreed behavior and that setup isolates the data.
- Review locator choices, unaffected-record checks, and refresh or persistence assertions where relevant.
- Confirm application behavior and expected results were not changed simply to make the test pass.
- Run the new test and the relevant existing suite. Review failures, screenshots, and traces when useful; report setup blockers honestly.
- Keep reviewed tests in the repository. They can run normally without Codex after later changes; you do not need to rewrite the checklist for each rerun.

Create another test when a materially different workflow needs coverage. Update existing tests when intended behavior changes, with human review.

## Next practice exercises

- **Filtering:** verify the expected matching records, clearing the filter, and unchanged underlying data.
- **Form validation:** verify specified invalid-input errors, no unintended save, and a valid submission using isolated data.
- **Permissions:** verify agreed allowed and denied actions using approved test accounts. Browser checks alone do not establish server-side authorization correctness.

Choose one meaningful workflow first, then a second with QA. Assign a maintainer for the skill and tests; review usefulness, maintenance effort, and coverage before expanding. These exercises are for your own application, not additional features implemented by this demo.

## Continuous integration

The optional `reference/ci-example.yml` is intended for a setup-generated application repository, where `package.json` and `package-lock.json` are at the root. It is not a drop-in workflow for this kit's root and has not been validated on GitHub. Review runner, dependency, artifact, and access policies before enabling it.

Passing browser tests establish only the behavior asserted in the tested environment. They do not guarantee visual correctness, accessibility, security, or production readiness.
