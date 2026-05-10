import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { setupTest, teardownTest, loadFixture, viteBuild } from './lib/lifecycle.js';
import { getOutputFile } from './lib/utils.js';

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should pass data to prerender script', async () => {
    await loadFixture('complex-routes', env);
    await viteBuild(env.tmp.path);

    const prerenderedIndexHtml = await getOutputFile(env.tmp.path, 'index.html');
    const prerenderedDataHtml = await getOutputFile(env.tmp.path, 'data/index.html');
    assert.match(prerenderedIndexHtml, '<h1>data: no</h1>');
    assert.match(prerenderedDataHtml, '<h1>data: yes</h1>');
});

test.run();
