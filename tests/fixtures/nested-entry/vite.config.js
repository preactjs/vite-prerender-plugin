import { defineConfig } from 'vite';
import path from 'node:path';
import url from 'node:url';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                dashboard: path.resolve(__dirname, 'src/dashboard/index.html'),
            },
        },
    },
    plugins: [vitePrerenderPlugin()],
});
