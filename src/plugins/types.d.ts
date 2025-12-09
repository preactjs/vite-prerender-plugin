export interface HeadElement {
    type: string;
    props: Record<string, string>;
    children?: string;
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

export interface PrerenderOptions {
    ssr: true;
    url: string;
    route: PrerenderedRoute;
}

export interface PrerenderResult {
    html?: string;
    head?: Partial<Head>;
    links?: Set<string>;
    /**
     * @description Caution: should be a valid JSON object
     */
    data?: any;
}
