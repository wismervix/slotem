import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.slotem.app',
    appName: 'Slotem',
    // webDir: 'public/build',

    server: {
        url: 'https://fighting-sensitivity-dated-nokia.trycloudflare.com',
        cleartext: false,
    },
};

export default config;
