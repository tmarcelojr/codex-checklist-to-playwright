import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const kit = new URL('../', import.meta.url);

test('setup excludes environment files and rejects the prepared regression', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'checklist-setup-test-'));
  try {
    const fixture = join(scratch, 'kit');
    await mkdir(fixture);
    await cp(new URL('setup.mjs', kit), join(fixture, 'setup.mjs'));
    await cp(new URL('starter/', kit), join(fixture, 'starter'), {
      recursive: true,
      filter: source => !source.split(sep).some(part => ['node_modules', '.git', 'test-results', 'playwright-report'].includes(part)),
    });
    // Harmless existing source copied under env filenames; no credentials are used.
    for (const name of ['.env', '.env.local', 'src/.env.test']) {
      await cp(new URL('starter/.gitignore', kit), join(fixture, 'starter', name));
    }
    const run = (args, cwd = fixture) => spawnSync(process.execPath, args, { cwd, encoding: 'utf8' });
    const target = join(scratch, 'workspace');
    const setup = run(['setup.mjs', target]);
    assert.equal(setup.status, 0, setup.stdout + setup.stderr);
    assert.match(setup.stdout, /READY:/);
    for (const name of ['.env', '.env.local', 'src/.env.test', 'tests/bulk-assign.spec.ts']) {
      await assert.rejects(access(join(target, name)), { code: 'ENOENT' });
    }
    assert.match(await readFile(join(target, '.gitignore'), 'utf8'), /^\.env\.\*$/m);
    const ignored = spawnSync('git', ['check-ignore', '.env', '.env.local', 'src/.env.test'], { cwd: target, encoding: 'utf8' });
    assert.equal(ignored.status, 0);
    assert.equal(ignored.stdout.trim().split('\n').length, 3);
    const existing = run(['setup.mjs', target]);
    assert.notEqual(existing.status, 0);
    assert.match(existing.stderr, /Destination exists/);
    assert.equal(run(['starter/scripts/regression.mjs', 'on']).status, 0);
    const rejectedTarget = join(scratch, 'must-not-exist');
    const rejected = run(['setup.mjs', rejectedTarget]);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /Starter assignment differs/);
    assert.doesNotMatch(rejected.stdout, /READY:/);
    await assert.rejects(access(rejectedTarget), { code: 'ENOENT' });
  } finally {
    // Only remove the unique temporary directory created by this test.
    await rm(scratch, { recursive: true, force: true });
  }
});
