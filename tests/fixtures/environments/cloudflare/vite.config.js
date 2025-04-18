import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { cloudflare } from '@cloudflare/vite-plugin';

console.log('Config is used');

export default defineConfig({
    plugins: [cloudflare(), vitePrerenderPlugin()],
});
