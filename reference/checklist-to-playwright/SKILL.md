---
name: checklist-to-playwright
description: Turn a manual browser checklist and its expected behavior into a Playwright test using the current repository's test setup. Use when adding missing workflow coverage, not for changing application behavior.
---

# Checklist to Playwright

Use the supplied checklist as the source of expected behavior. Ask for clarification
when a material expected result is missing rather than inferring a business rule
from the implementation under test.

1. Inspect the repository instructions, existing tests, Playwright configuration,
   package scripts, and available fixtures. Reuse the established setup and report
   blocked prerequisites or the smallest necessary setup change without claiming
   success.
2. Add a focused test for the requested workflow. Prefer user-visible behavior,
   accessible role or label locators, isolated data, and awaited assertions. When
   an operation has a selection boundary, verify both affected and unaffected
   records. Check persistence after reload when the checklist requires it.
3. Exercise the real behavior being tested. Do not stub away the operation, change
   application behavior or expected results to make the test pass, share browser
   state, or use arbitrary waits and retries that conceal failures.
4. Run the focused test and relevant existing checks. Investigate failures before
   changing assertions, and distinguish product defects, test defects, and setup
   problems. Stop and report evidence when a fix is outside the requested scope.
5. Show the test change, commands actually run, observed results, and remaining
   coverage gaps for human review. Do not commit, push, deploy, or imply approval
   unless the user explicitly requests it.

Adapt these instructions to the user's checklist and the repository's conventions.
