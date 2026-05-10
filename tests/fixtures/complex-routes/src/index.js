export async function prerender({ route }) {
    return {
        html: `<h1>data: ${route.data ? "yes" : "no"}</h1>`,
        links: new Set([
            {
                url: "/data",
                data: true
            }
        ])
    }
}
