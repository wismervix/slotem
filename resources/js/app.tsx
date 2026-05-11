import { createInertiaApp } from '@inertiajs/react';
import { route as ziggyRoute } from 'ziggy-js';
import type { route as ZiggyRouteType } from 'ziggy-js';

declare global {
    var route: typeof ZiggyRouteType;
}

globalThis.route = ziggyRoute;

const appName = import.meta.env.VITE_APP_NAME || 'Slotem';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
});
