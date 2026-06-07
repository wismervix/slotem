import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';
import type { route as ZiggyRouteType } from 'ziggy-js';
import { BookingModalProvider } from './contexts/BookingModalContext';
import { ComponentType } from 'react';

declare global {
    var route: typeof ZiggyRouteType;
}

globalThis.route = ziggyRoute;

const appName = import.meta.env.VITE_APP_NAME || 'Slotem';

const pages = import.meta.glob<{ default: ComponentType<any> }>(
    './pages/**/*.tsx',
    { eager: false },
);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;

        const importer = pages[path];

        if (!importer) {
            throw new Error(`Unknown page: ${path}`);
        }

        const module = await importer();

        return module.default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <BookingModalProvider>
                <App {...props} />
            </BookingModalProvider>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});
