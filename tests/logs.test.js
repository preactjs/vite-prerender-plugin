import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { setupTest, teardownTest, loadFixture, viteBuildCli } from './lib/lifecycle.js';
import { writeFixtureFile } from './lib/utils.js';

const writeConfig = async (dir, content) => writeFixtureFile(dir, 'vite.config.js', content);

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should log which routes were prerendered & where they were discovered', async () => {
    await loadFixture('logs/prerendered-routes', env);
    const output = await viteBuildCli(env.tmp.path);
    await output.done;

    // The prerender info is pushed as a single log line
    const stdout = output.stdout.find((line) => line.includes('Prerendered'));

    assert.match(stdout, 'Prerendered 3 pages:\n');
    assert.match(stdout, '/\n');
    assert.match(stdout, '/foo [from /]\n');
    assert.match(stdout, '/bar [from /foo]\n');
});

test('Should strip sourcemap sizes from logs if user has not enabled sourcemaps', async () => {
    await loadFixture('logs/prerendered-routes', env);
    const output = await viteBuildCli(env.tmp.path);
    await output.done;

    const stdout = output.stdout.find((line) => /dist\/assets\/index.*\.js/.test(line));
    assert.not.match(stdout, '│ map:');
});

test('Should preserve sourcemap sizes from logs if user has enabled sourcemaps', async () => {
    await loadFixture('logs/prerendered-routes', env);
    await writeConfig(env.tmp.path, `
        import { defineConfig } from 'vite';
        import { vitePrerenderPlugin } from 'vite-prerender-plugin';

        export default defineConfig({
            build: { sourcemap: true },
            plugins: [vitePrerenderPlugin()],
        });
    `);
    const output = await viteBuildCli(env.tmp.path);
    await output.done;

    const stdout = output.stdout.find((line) => /dist\/assets\/index.*\.js/.test(line));
    assert.match(stdout, '│ map:');
});

test.run();
