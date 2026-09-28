# Prepared references

The fresh workspace created by `setup.mjs` contains neither an active custom skill
nor an active bulk-assignment test. Completed examples remain under `reference/`.
Create the skill with `prompts/slide-05-create-skill.txt`, inspect its actual file,
then invoke it with `prompts/slide-07-create-test.txt`. Wording and implementation can differ
from these prepared references; review their behavior and scope.

`checklist-to-playwright/SKILL.md` is the instruction-only reference. Its intended
location in a target repo is `.agents/skills/checklist-to-playwright/SKILL.md`.
Its format is validated. The package does not claim that this reference was
created or discovered live in a recorded desktop session.

`bulk-assign.spec.ts` is the locally executed browser-test reference. Pass/fail/pass
evidence predates the skill revision and establishes the test's behavior, not
causal evidence that the new skill improves generation. Revalidate the actual
test produced during recording.

If either reference is needed, say so before copying it into the demo repo.
Do not present copying a reference as generating it from scratch.

`ci-example.yml` remains an optional inactive follow-up example. It has not run
on GitHub. Platform owners should adapt it to runner and artifact policies.
This local demo needs no GitHub connector.

Sources: https://learn.chatgpt.com/docs/build-skills and https://playwright.dev/docs/ci-intro
