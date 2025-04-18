import { test } from 'uvu';
import * as assert from 'uvu/assert';
import path from 'node:path';
import { promises as fs } from 'node:fs';

import { setupTest, teardownTest, loadFixture, viteBuild } from './lib/lifecycle.js';
import { getOutputFile, writeFixtureFile } from './lib/utils.js';

const writeConfig = async (dir, content) => writeFixtureFile(dir, 'vite.config.js', content);

let env;
test.before.each(async () => {
    env = await setupTest();
});

test.after.each(async () => {
    await teardownTest(env);
});

test('Should prerender and output correct file structure', async () => {
    await loadFixture('simple', env);
    await viteBuild(env.tmp.path);

    const prerenderedHtml = await getOutputFile(env.tmp.path, 'index.html');
    assert.match(prerenderedHtml, '<h1>Simple Test Result</h1>');
});

test('Should merge preload and entry chunks', async () => {
    await loadFixture('simple', env);
    await viteBuild(env.tmp.path);

    const outDir = path.join(env.tmp.path, 'dist');
    const outDirAssets = path.join(outDir, 'assets');

    assert.equal((await fs.readdir(outDir)).length, 2);
    // Would be 2 if not merged
    assert.equal((await fs.readdir(outDirAssets)).length, 1);
});

test('Should bail on merging preload & entry chunks if user configures `manualChunks`', async () => {
    await loadFixture('simple', env);
    await writeConfig(env.tmp.path, `
        import { defineConfig } from 'vite';
        import { vitePrerenderPlugin } from 'vite-prerender-plugin';

        export default defineConfig({
            build: {
                rollupOptions: {
                    output: {
                        manualChunks: {}
                    }
                }
            },
            plugins: [vitePrerenderPlugin()],
        });
    `);

    await viteBuild(env.tmp.path);

    const outDir = path.join(env.tmp.path, 'dist');
    const outDirAssets = path.join(outDir, 'assets');

    assert.equal((await fs.readdir(outDir)).length, 2);
    assert.equal((await fs.readdir(outDirAssets)).length, 2);
});

test('Should support comment nodes in returned HTML', async () => {
    await loadFixture('comments', env);
    await viteBuild(env.tmp.path);

    const prerenderedHtml = await getOutputFile(env.tmp.path, 'index.html');
    assert.match(prerenderedHtml, '<h1>Simple Test Result <!-- With Output HTML Comment --></h1>');
    assert.match(prerenderedHtml, '<!-- With Input HTML Comment -->');
});

test('Should support custom output filenames', async () => {
    await loadFixture('named-chunks', env);
    await writeConfig(env.tmp.path, `
        import { defineConfig } from 'vite';
        import { vitePrerenderPlugin } from 'vite-prerender-plugin';

        export default defineConfig({
            build: {
                rollupOptions: {
                    output: {
                        chunkFileNames: 'chunks/[name].[hash].js',
                    }
                }
            },
            plugins: [vitePrerenderPlugin()],
        });
    `);

    let message = '';
    try {
        await viteBuild(env.tmp.path);
    } catch (error) {
        message = error.message;
    }

    assert.match(message, '');
});

test.run();
