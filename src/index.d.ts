import { Plugin } from 'vite';
import { ComplexRoute } from './plugins/types.d.ts';

export interface PrerenderOptions {
    prerenderScript?: string;
    renderTarget?: string;
    additionalPrerenderRoutes?: string[];
    resolveRoute?: (route: ComplexRoute) => string;
}

export interface PreviewMiddlewareOptions {
    previewMiddlewareFallback?: string;
}

export type Options = PrerenderOptions & PreviewMiddlewareOptions;

export function vitePrerenderPlugin(options?: Options): Plugin[];

export type { PrerenderArguments, PrerenderResult } from './plugins/types.d.ts';
