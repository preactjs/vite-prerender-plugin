import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

export default defineConfig({
    build: {
        ssr: true,
        rollupOptions: {
            input: 'src/index.js'
        }
    },
    plugins: [vitePrerenderPlugin()],
});
