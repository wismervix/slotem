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
            origin: 'https://routing-footage-acquire-expanded.trycloudflare.com', //docker
        },
        origin: 'https://continued-games-yields-proposition.trycloudflare.com', //npm
        hmr: {
            protocol: 'wss',
            host: 'continued-games-yields-proposition.trycloudflare.com',
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
                id: '/',

                name: 'Slotem',
                short_name: 'Slotem',

                description: 'A booking platform for service-based businesses.',

                theme_color: '#7C3AED',
                background_color: '#111318',

                display: 'standalone',

                start_url: '/',
                scope: '/',

                icons: [
                    {
                        src: '/icons/icon-192-light.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/icons/icon-512-light.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/icons/icon-192-dark.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/icons/icon-512-dark.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                ],
                screenshots: [
                    {
                        src: '/screenshots/slotem_screenshot_mobile.png',
                        sizes: '853x1844',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: 'Slotem mobile screenshot',
                    },
                    {
                        src: '/screenshots/slotem_screenshot_desktop.png',
                        sizes: '1536x1024',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Slotem desktop screenshot',
                    },
                ],
            },
        }),
    ],
});
