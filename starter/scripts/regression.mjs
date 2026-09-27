import { readFile, writeFile } from 'node:fs/promises';

// Training-only source mutation. No reset/checkout or unrelated edits.
const path = new URL('../src/tickets.mjs', import.meta.url);
const good = 'return tickets.map(ticket => ids.includes(ticket.id) ? { ...ticket, owner } : ticket);';
const bad = 'return tickets.map(ticket => ({ ...ticket, owner })); // DELIBERATE DEMO REGRESSION';
const mode = process.argv[2];
if (!['on', 'off'].includes(mode)) throw new Error('Use on or off.');
const source = await readFile(path, 'utf8');
const [from, to] = mode === 'on' ? [good, bad] : [bad, good];
if (source.includes(to)) { console.log(`Regression already ${mode}.`); }
else if (source.split(from).length === 2) {
  await writeFile(path, source.replace(from, to));
  console.log(mode === 'on' ? 'DELIBERATE REGRESSION: all tickets will change owner. Run the test again.' : 'Working behavior restored. Run the same test again.');
} else { throw new Error('Source differs from the prepared demo. No changes made. Review the diff manually.'); }
