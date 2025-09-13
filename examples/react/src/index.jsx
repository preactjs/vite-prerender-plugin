import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

// Is this really the going practice?
const Router = typeof window !== 'undefined' ? BrowserRouter : StaticRouter;

export function App({ url }) {
    return (
        <Router location={url}>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </Router>
    );
}

if (typeof window !== 'undefined') {
    const target = document.getElementById('app');
    import.meta.env.DEV ? createRoot(target).render(<App />) : hydrateRoot(target, <App />);
}

export async function prerender(data) {
    const { prerender: reactPrerender } = await import('react-dom/static');
    const { parseLinks } = await import('vite-prerender-plugin/parse');

    const { prelude } = await reactPrerender(<App {...data} />);
    const reader = prelude.getReader();
    let html = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += Buffer.from(value).toString('utf-8');
    }

    const links = parseLinks(html);

    return { html, links };
}
