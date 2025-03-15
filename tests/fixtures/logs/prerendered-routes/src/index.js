export async function prerender({ url }) {
    let links;
    if (url == '/') {
        links = new Set(['/foo']);
    } else if (url == '/foo') {
        links = new Set(['/bar']);
    }

    return {
        html: `<h1>Simple Test Result</h1>`,
        links,
    };
}
