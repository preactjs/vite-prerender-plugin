export interface HeadElement {
    type: string;
    props: Record<string, string>;
    children?: string;
}

export interface Head {
    lang: string;
    title: string;
    elements: Set<HeadElement>;
    base: string;
}

export interface PrerenderedRoute {
    url: string;
    _discoveredBy?: PrerenderedRoute;
}
