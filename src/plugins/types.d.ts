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

export type Route = ComplexRoute | ComplexRoute["url"];

export interface ComplexRoute {
    url: string;
    data?: any;
}

export interface PrerenderedRoute extends ComplexRoute {
    _discoveredBy?: PrerenderedRoute;
}

export interface PrerenderArguments {
    ssr: true;
    url: string;
    route: PrerenderedRoute;
}

export type PrerenderResult = {
    html: string;
    links?: Set<Route>;
    data?: any;
    head?: Partial<Head>;
} | string
