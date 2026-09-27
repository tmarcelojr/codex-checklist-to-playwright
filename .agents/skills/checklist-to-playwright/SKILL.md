---
name: checklist-to-playwright
description: Turn a manual browser checklist into a Playwright test by reusing the project's existing test setup, then run and report the test for human review. Use when the user asks to automate a browser checklist; do not use it to change application behavior.
---

# Checklist to Playwright

Convert the user's manual browser checklist into a focused Playwright test while preserving application behavior.

Before writing the test, inspect the repository's existing Playwright configuration, test organization, fixtures, helpers, scripts, data conventions, and nearby tests. Reuse those facilities and the project's normal tools instead of introducing a parallel setup or assuming fixed tickets, people, ports, routes, selectors, credentials, or filesystem paths.

Translate each checklist action into an interaction and each stated outcome into an observable assertion. Derive expected results from the checklist and established project behavior. If an important expected result is missing or ambiguous enough to change what the test should prove, ask the user before authoring that part rather than inventing product behavior.

When the workflow changes a record or collection, verify the intended change and, where relevant, verify that representative unaffected records remain unchanged. Keep assertions focused on user-visible behavior or stable interfaces, and follow the project's existing approach to selectors, setup, isolation, cleanup, and test data.

For test-authoring requests, change only test code or test-specific support files needed by the existing setup. Do not modify application behavior, production code, or unrelated configuration to make the test pass unless the user separately asks for that work.

Run the new test using the repository's established command and environment. Diagnose failures far enough to distinguish a test defect, an application failure, and a setup or environment problem. Do not claim success when the test did not run or pass; report blockers and setup problems plainly.

Finish by showing the test changes for human review and reporting the exact command run and its actual result, including relevant pass, failure, skip, or blocker details. Call out any assumptions, coverage gaps, or behavior that still needs confirmation.
