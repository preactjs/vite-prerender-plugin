import path from 'node:path';
import url from 'node:url';
import { promises as fs } from 'node:fs';
import tmp from 'tmp-promise';
import { build } from 'vite';

import { copyDependencies } from './utils.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @returns {Promise<TestEnv>}
 */
export async function setupTest() {
    const cwd = await tmp.dir({ unsafeCleanup: true });
    return { tmp: cwd };
}

/**
 * @param {TestEnv} env
 */
export async function teardownTest(env) {
    await env.tmp.cleanup();
}

/**
 * @param {string} name
 * @param {TestEnv} env
 */
export async function loadFixture(name, env) {
    const fixture = path.join(__dirname, '..', 'fixtures', name);

    await fs.cp(fixture, env.tmp.path, { recursive: true });
    await fs.writeFile(path.join(env.tmp.path, 'package.json'), JSON.stringify({ type: 'module' }));

    await copyDependencies(env.tmp.path);
}

export async function viteBuild(cwd) {
    await build({
        logLevel: 'silent',
        root: cwd,
        configFile: path.join(cwd, 'vite.config.js'),
    });
}
