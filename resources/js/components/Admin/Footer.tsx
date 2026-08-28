import { Link } from '@inertiajs/react';
import logoImageDark from '@/images/logo_dark.png';
import logoImageLight from '@/images/logo_light.png';

export default function Footer() {
    return (
        <footer className="dark:border-zinc-850 mt-16 flex w-full shrink-0 flex-col items-center justify-between gap-4 border-t border-purple-100 pt-8 pb-4 md:flex-row">
            <Link href={route('home')} className="mb-6 md:mb-0">
                <div className="h-12 w-40">
                    <img
                        className="block h-auto w-full dark:hidden"
                        src={logoImageLight}
                        alt="Slotem Logo"
                    />
                    <img
                        className="hidden h-auto w-full dark:block"
                        src={logoImageDark}
                        alt="Slotem Logo"
                    />
                </div>

                <p className="mt-1 text-[11px] font-medium tracking-tight text-zinc-400 dark:text-zinc-500">
                    © {new Date().getFullYear()} Slotem Booking Systems. All
                    rights reserved.
                </p>
            </Link>

            <div className="flex gap-8">
                {[
                    { label: 'Privacy Policy', href: 'privacy-policy' },
                    { label: 'Terms of Service', href: 'terms-of-service' },
                    { label: 'Help Center', href: 'help-center' },
                    { label: 'Contact Sales', href: 'contact-sales' },
                ].map(({ label, href }) => (
                    <Link
                        key={label}
                        href={route(href)}
                        className="text-[11px] font-semibold text-on-surface-variant transition-colors hover:text-primary dark:text-on-surface-variant-dark"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </footer>
    );
}
