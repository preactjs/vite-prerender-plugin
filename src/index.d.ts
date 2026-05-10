import { Plugin } from 'vite';
import type { PrerenderedRoute } from './plugins/types.d.ts';

export interface PrerenderOptions {
    prerenderScript?: string;
    renderTarget?: string;
    additionalPrerenderRoutes?: string[];
    resolveRoute?: (route: PrerenderedRoute) => string;
}

export interface PreviewMiddlewareOptions {
    previewMiddlewareFallback?: string;
}

export type Options = PrerenderOptions & PreviewMiddlewareOptions;

export function vitePrerenderPlugin(options?: Options): Plugin[];

export type { PrerenderArguments, PrerenderResult } from './plugins/types.d.ts';
