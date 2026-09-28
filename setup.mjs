import { cp, access, mkdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const kit = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2] && resolve(process.argv[2]);
if (!target) throw new Error('Usage: node setup.mjs /path/to/a/new/northstar-demo');
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Install Node.js 22 or later first.');
let exists = false;
try { await access(target); exists = true; } catch {}
if (exists) throw new Error('Destination exists. Choose a NEW directory so your work is preserved.');
const starter = resolve(kit, 'starter');
const workshopResources = ['prompts', 'reference'];
const assignmentSource = await readFile(resolve(starter, 'src/tickets.mjs'), 'utf8');
const preparedAssignment = 'return tickets.map(ticket => ids.includes(ticket.id) ? { ...ticket, owner } : ticket);';
if (assignmentSource.includes('DELIBERATE DEMO REGRESSION') || assignmentSource.split(preparedAssignment).length !== 2) {
  throw new Error('Starter assignment differs from the working demo. Run npm run bug:off in starter, or review its source. No workspace created.');
}
await mkdir(dirname(target), { recursive: true });
const excluded = new Set(['node_modules', 'test-results', 'playwright-report', '.git', '.agents', '.DS_Store']);
await cp(starter, target, {
  recursive: true,
  filter: source => {
    const parts = relative(starter, source).split(sep);
    return !parts.some(part => excluded.has(part) || part === '.env' || part.startsWith('.env.')) &&
      parts.join('/') !== 'tests/bulk-assign.spec.ts';
  },
});
for (const resource of workshopResources) {
  const sourceRoot = resolve(kit, resource);
  await cp(sourceRoot, resolve(target, resource), {
    recursive: true,
    filter: source => {
      const parts = relative(sourceRoot, source).split(sep);
      return !parts.some(part => excluded.has(part) || part === '.env' || part.startsWith('.env.'));
    },
  });
}
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
function run(command, args) {
  const result = spawnSync(command, args, { cwd: target, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error || result.status !== 0) throw new Error(`Setup stopped at ${command}. Files remain at ${target}. Fix the prerequisite and continue there.`);
}
run(npm, ['ci']);
run(process.execPath, ['node_modules/@playwright/test/cli.js', 'install', 'chromium']);
run('git', ['init']);
run('git', ['add', '.']);
run('git', ['-c', 'user.name=Northstar Demo', '-c', 'user.email=demo@example.invalid', 'commit', '-m', 'Prepared synthetic support queue and existing smoke test']);
run(npm, ['test']);
console.log(`\nREADY: ${target}\nOpen this folder in Codex and follow the workshop guide in README.md.\nStart with prompts/slide-03-setup.txt; slide 5 creates the skill and slide 7 creates the test.\nCompleted examples are available for comparison under reference/.\nThe active custom skill and bulk-assignment test are intentionally absent from this fresh workspace.\nRun npm start to explore the app at http://127.0.0.1:4310.\n`);
