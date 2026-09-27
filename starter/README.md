# Northstar support queue

A small, synthetic application for a Codex enablement demo. Northstar is fictional.
Six tickets, three owners, one bounded workflow: bulk assignment.

## Run

Prerequisites: Node.js 22+, npm, Git. Install with `npm ci` and
`npx playwright install chromium`. On Linux, browser system libraries may also
be needed (`npx playwright install --with-deps chromium`). Then:

```sh
npm start
```

Open http://127.0.0.1:4310. The page has a reset button for its synthetic data.

## Manual release checklist

1. Check the starting owners: NS-1042 Alex, NS-1043 Sam, NS-1044 Alex,
   NS-1045 Sam, NS-1046 Maya, NS-1047 Alex.
2. Select NS-1042 and NS-1043.
3. Choose Maya and assign the tickets.
4. Check that those two now belong to Maya and all four other owners are unchanged.
5. Refresh and confirm all six owners again.

## Architecture and boundaries

- `public/` is the browser interface. It calls the real local HTTP API.
- `server.mjs` binds only to 127.0.0.1. Each browser context receives a separate
  seeded workspace through an HttpOnly cookie.
- `src/tickets.mjs` owns seed data and assignment behavior.
- The server stores synthetic data in memory. A refresh preserves changes,
  but a server restart resets them. There is no real authentication, durable
  database, authorization model, third-party integration, or production access.
- `tests/smoke.spec.ts` verifies initial readiness. `validation.test.mjs` checks
  input rejection. They intentionally do not cover assignment correctness yet.
- Playwright starts its own server on 4311 for every invocation and creates a
  fresh browser context for each test. It does not reuse the presenter's app.

## Verification

`npm test` runs the unit test and all browser tests. `npm run demo` runs the
bulk-assignment test in a visible browser once that test exists. `npm run report`
opens Playwright's local HTML report. Both 4310 and 4311 must be available.

For a visible recording run you may set `DEMO_SLOW_MS=400` to slow browser
actions. This is presentation pacing, not a synchronization technique.
`RECORD_DEMO=1` retains screenshots and browser videos for evidence.

## Disclosed regression demonstration

`npm run bug:on` deliberately changes the assignment implementation to update
every ticket. The script modifies one exact line and refuses unfamiliar source.
Rerun the same test. It should report an unselected ticket's incorrect owner.
`npm run bug:off` restores that exact line. Run the suite again and review the diff.
These scripts are training aids, not application features or a production practice.

Playwright is an external open-source dependency with its own license. The
synthetic application source in this kit is provided under the included MIT license.
