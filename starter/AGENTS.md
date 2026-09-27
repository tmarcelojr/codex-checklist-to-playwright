# Northstar demo conventions

This is a synthetic support queue, not a production service. Node 22+.

- Use existing scripts and Playwright. Do not add dependencies without explaining why.
- Test behavior visible to a user. Prefer role/label locators and awaited assertions.
- Each browser context receives its own seeded workspace. Do not share browser state.
- Do not stub the app's assignment endpoint or modify app behavior to make a test pass.
- Avoid arbitrary sleeps and retries that hide failures.
- For a test-only task, keep application files unchanged.
- Run `npm test`, inspect the diff, and report actual results plus any limitations.
- A person reviews and approves changes. Never commit, push, or deploy unless asked.
