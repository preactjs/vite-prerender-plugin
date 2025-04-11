import paintWorkletURL from './paint-worklet.js?url';

if (typeof window !== 'undefined') {
    const worker = new Worker(new URL('./worker.js', import.meta.url));

    worker.postMessage({ type: 'init' });

    CSS.paintWorklet.addModule(paintWorkletURL);
}

export async function prerender() {
    return `<h1>Simple Test Result</h1>`;
}

// Basically mirror preact-www's repl worker
const PREPEND = `(function (module, exports) {\n`;
const APPEND = `\n});`;
export async function process() {
    const code = `console.log('Hello World');`;
    let transpiled = `${PREPEND}${code}${APPEND}`;

    transpiled += '\n//# sourceMappingURL=' + 'some-url.js.map';

    return transpiled;
}
