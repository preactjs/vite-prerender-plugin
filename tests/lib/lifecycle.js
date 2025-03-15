import path from 'node:path';
import url from 'node:url';
import childProcess from 'node:child_process';
import { promises as fs } from 'node:fs';
import tmp from 'tmp-promise';
import { build } from 'vite';

import { copyDependencies, stripColors } from './utils.js';

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

/**
 * @param {string} cwd
 */
export async function viteBuild(cwd) {
    await build({
        logLevel: 'silent',
        root: cwd,
        configFile: path.join(cwd, 'vite.config.js'),
    });
}

/**
 * @param {string} cwd
 */
export async function viteBuildCli(cwd) {
    const child = childProcess.spawn('node', ['node_modules/vite/bin/vite.js', 'build'], {
        cwd,
    });

    const out = {
        stdout: [],
        stderr: [],
        code: 0,
    };

    child.stdout.on('data', (buffer) => {
        const lines = stripColors(buffer.toString());
        out.stdout.push(lines);
    });
    child.stderr.on('data', (buffer) => {
        const lines = stripColors(buffer.toString());
        out.stderr.push(lines);
    });

    out.done = new Promise((resolve) => {
        child.on('close', (code) => {
            resolve((out.code = code));
        });
    });

    return out;
}
