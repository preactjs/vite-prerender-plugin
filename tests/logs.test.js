import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { setupTest, teardownTest, loadFixture, viteBuildCli } from './lib/lifecycle.js';

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should support the `prerenderScript` plugin option', async () => {
    await loadFixture('logs/prerendered-routes', env);
    const output = await viteBuildCli(env.tmp.path);
    await output.done;

    const idx = output.stdout.findIndex((line) => line.includes('Prerendered'));
    // The prerender info is pushed as a single log line
    const stdout = output.stdout.slice(idx)[0];

    assert.match(stdout, 'Prerendered 3 pages:\n');
    assert.match(stdout, '/\n');
    assert.match(stdout, '/foo [from /]\n');
    assert.match(stdout, '/bar [from /foo]\n');
});

test.run();
