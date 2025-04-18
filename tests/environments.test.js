import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { setupTest, teardownTest, loadFixture, viteBuild, viteBuildCli } from './lib/lifecycle.js';

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should skip plugin during SSR build', async () => {
    await loadFixture('environments/ssr', env);

    let message = '';
    try {
        await viteBuild(env.tmp.path);
    } catch (error) {
        message = error.message;
    }

    assert.match(message, '');
});

test('Should skip plugin during SSR build (CLI)', async () => {
    await loadFixture('simple', env);
    const output = await viteBuildCli(env.tmp.path, ['--ssr', 'src/index.js']);
    await output.done;

    assert.equal(output.stderr, []);
});

test('Should skip plugin during non-client environment build (Cloudflare plugin)', async () => {
    await loadFixture('environments/cloudflare', env);
    const output = await viteBuildCli(env.tmp.path);
    await output.done;

    assert.equal(output.stderr, []);
});

test.run();
