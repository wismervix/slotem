import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        cors: {
            origin: 'https://bare-updated-pulling-enhancing.trycloudflare.com', //docker
        },
        origin: 'https://participated-egg-tourist-controlling.trycloudflare.com', //npm
        hmr: {
            protocol: 'wss',
            host: 'participated-egg-tourist-controlling.trycloudflare.com',
            clientPort: 443,
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'script',
            manifest: {
                name: 'Slotem',
                short_name: 'Slotem',
                description: 'A booking platform for service-based businesses.',
                theme_color: '#7C3AED',
                background_color: '#111318',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/app_icon_dark.png',
                        sizes: '339x327',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
