---
name: checklist-to-playwright
description: Turn a manual browser checklist and its expected results into a Playwright test for the current repository. Use for creating missing workflow coverage, not general application changes.
---

# Checklist to Playwright

Use the supplied checklist as the source of expected behavior. Clarify material
gaps rather than infer business rules from the implementation under test.

1. Inspect the repository instructions, existing tests, configuration, and data
   fixtures. Reuse the established setup. Report missing prerequisites and the
   smallest setup change needed before adding a second framework or dependency.
2. Add a bounded test for the requested workflow. Use meaningful control labels
   or existing stable locators, isolated data, and awaited assertions. Verify
   unaffected records when the operation has a selection boundary. Check reload
   persistence when the checklist requires it.
3. Exercise the relevant application behavior. Do not stub away the operation
   being verified. Preserve application behavior and existing expectations for
   a test-authoring request. Avoid fixed sleeps and retries that hide failures.
4. Run the focused test and relevant existing checks. Inspect failures before
   changing assertions. Distinguish product defects, test defects, and blocked
   prerequisites. Stop with the evidence when a fix is outside the request.
5. Show the test diff, commands actually run, observed results, and remaining
   coverage gaps. Leave the change for human review. Tests remain ordinary
   repository code that can run independently of Codex.

Adapt these instructions to the user's explicit task and repository conventions.
