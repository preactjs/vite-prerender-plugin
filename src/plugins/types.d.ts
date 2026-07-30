export interface HeadElement {
    type: string;
    props: Record<string, string>;
    children?: string;
    /** CSS selector to find and remove existing elements before inserting this one */
    replace?: string;
}

export interface Head {
    lang: string;
    title: string;
    elements: Set<HeadElement>;
}

export interface PrerenderedRoute {
    url: string;
    _discoveredBy?: PrerenderedRoute;
}

export interface PrerenderArguments {
    ssr: true;
    url: string;
    route: PrerenderedRoute;
}

export type PrerenderResult = {
    html: string;
    links?: Set<string>;
    data?: any;
    head?: Partial<Head>;
} | string
