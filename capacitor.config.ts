import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.slotem.app',
    appName: 'Slotem',
    // webDir: 'public/build',

    server: {
        url: 'https://feelings-wrote-tee-stable.trycloudflare.com',
        cleartext: false,
    },
};

export default config;
