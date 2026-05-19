import { Menu, Bell, Settings as SettingsIcon } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-8">
            <div className="flex items-center gap-4">
                <Menu
                    className="cursor-pointer text-on-surface md:hidden"
                    size={24}
                />
                <h2 className="text-lg font-bold text-on-surface">Settings</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container">
                    <Bell size={20} />
                </button>
                <button className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container">
                    <SettingsIcon size={20} />
                </button>
                <img
                    alt="User Profile"
                    className="h-10 w-10 rounded-full border border-outline-variant object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3p0G6WDcLp1TrtXFLcAvT-_I6tgZTsNC7vjX5JOV716VuYc2WmCTt1mtLKv2QqGjhuhoMuxFAg-XVlFkxHLr0Nfe2CHuNelGWI70vPxTgZ7Whb9IMxbtK8aQaWmoAqyIB8Dyz8OH59pYb3FEs-JZhC0Jqp3Rn0uGGjLJwjlVC0Zf-0AZqp12KK38lgike__fRSipZnx8f8lFvdJZBsdd6rZesqTqlGD2tNmEpZRbuGO0JzVSaqnc60jOXs981ggS43I464sJz3ek"
                />
            </div>
        </header>
    );
}
