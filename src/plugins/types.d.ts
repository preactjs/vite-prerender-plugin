export interface HeadElement {
    type: string;
    props: Record<string, string>;
    children?: string;
}

export interface Head {
    lang: string;
    title: string;
    /**
     * Which elements should be injected in the **start** of <head>
     */
    startElements: Set<HeadElement>;
    /**
     * Which elements should be injected in the **end** of <head>
     */
    elements: Set<HeadElement>;
}

export interface PrerenderedRoute {
    url: string;
    _discoveredBy?: PrerenderedRoute;
}
