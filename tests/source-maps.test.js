import { test } from 'uvu';
import * as assert from 'uvu/assert';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import dedent from 'dedent';

import { setupTest, teardownTest, loadFixture, viteBuild } from './lib/lifecycle.js';
import { writeFixtureFile } from './lib/utils.js';

const writeConfig = async (dir, content) => writeFixtureFile(dir, 'vite.config.js', content);

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should strip sourcemaps by default', async () => {
    await loadFixture('source-maps', env);
    await viteBuild(env.tmp.path);

    const outDir = path.join(env.tmp.path, 'dist', 'assets');
    const outDirAssets = await fs.readdir(outDir);

    assert.not.ok(outDirAssets.find((f) => f.endsWith('.map')));

    const outputChunk = path.join(
        outDir,
        outDirAssets.find((f) => /^index-.*\.js$/.test(f)),
    );
    const outputChunkCode = await fs.readFile(outputChunk, 'utf-8');
    // Ensure arbitrary strings don't get stripped
    assert.ok(outputChunkCode.match(/\/\/#\ssourceMappingURL=/));
    // Ensure the sourcemap comment has been removed
    assert.is(outputChunkCode.match(/^\/\/#\ssourceMappingURL=.*\.map$/m), null);

    const outputAsset = path.join(
        outDir,
        outDirAssets.find((f) => /^worker-.*\.js$/.test(f)),
    );
    const outputAssetSource = await fs.readFile(outputAsset, 'utf-8');
    assert.is(outputAssetSource.match(/^\/\/#\ssourceMappingURL=.*\.map$/m), null);
});

test('Should preserve sourcemaps if user has enabled them', async () => {
    await loadFixture('simple', env);
    await writeConfig(env.tmp.path, `
        import { defineConfig } from 'vite';
        import { vitePrerenderPlugin } from 'vite-prerender-plugin';

        export default defineConfig({
            build: { sourcemap: true },
            plugins: [vitePrerenderPlugin()],
        });
    `);

    await viteBuild(env.tmp.path);

    const outDir = path.join(env.tmp.path, 'dist', 'assets');
    const outDirAssets = await fs.readdir(outDir);

    const outputJsFileName = outDirAssets.find((f) => f.endsWith('.js'));
    assert.ok(outputJsFileName);
    const outputJs = await fs.readFile(path.join(outDir, outputJsFileName), 'utf-8');
    assert.match(outputJs, '//# sourceMappingURL=');

    const outputMap = outputJs.match(/^\/\/#\ssourceMappingURL=(.*)\.map$/m)[1];
    assert.ok(outDirAssets.includes(outputMap));
});

test('Should use sourcemaps to display error positioning for top-level throws', async () => {
    await loadFixture('simple', env);
    await writeFixtureFile(env.tmp.path, 'src/index.js', dedent`
        document.createElement('div');
        export async function prerender() {
            return '<h1>Simple Test Result</h1>';
        }`,
    );

    let message = '';
    try {
        await viteBuild(env.tmp.path);
    } catch (error) {
        message = error.message;
    }

    assert.match(message, 'ReferenceError: document is not defined');
    assert.match(message, 'src/index.js:1:1');
});

test('Should use sourcemaps to display error positioning for throws during prerender', async () => {
    await loadFixture('simple', env);
    await writeFixtureFile(env.tmp.path, 'src/index.js', dedent`
        export async function prerender() {
            document.createElement('div');
            return '<h1>Simple Test Result</h1>';
        }`,
    );

    let message = '';
    try {
        await viteBuild(env.tmp.path);
    } catch (error) {
        message = error.message;
    }

    assert.match(message, 'ReferenceError: document is not defined');
    assert.match(message, 'src/index.js:2:5');
});

test.run();
