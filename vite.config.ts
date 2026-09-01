import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    // server: {
    //     host: '127.0.0.1',
    //     cors: {
    //         origin: 'https://emission-plans-studying-demonstrated.trycloudflare.com', //docker
    //     },
    //     origin: 'https://practical-terrorist-scientific-elimination.trycloudflare.com', //npm
    //     hmr: {
    //         protocol: 'wss',
    //         host: 'practical-terrorist-scientific-elimination.trycloudflare.com',
    //         clientPort: 443,
    //     },
    // },
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
    ],
});
