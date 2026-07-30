import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="mt-12 flex w-full flex-col items-center justify-between border-t border-outline-variant/50 py-12 md:flex-row">
            <Link href={route('home')} className="mb-6 md:mb-0">
                <span className="text-xl font-bold text-primary">Slotem</span>

                <p className="mt-1 text-[11px] font-medium tracking-tight text-on-surface-variant">
                    © 2024 Slotem Booking Systems. All rights reserved.
                </p>
            </Link>

            <div className="flex gap-8">
                {[
                    { label: 'Privacy Policy', href: '/privacy-policy' },
                    { label: 'Terms of Service', href: '/terms-of-service' },
                    { label: 'Help Center', href: '/help-center' },
                    { label: 'Contact Sales', href: '/contact-sales' },
                ].map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="text-[11px] font-semibold text-on-surface-variant transition-colors hover:text-primary"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </footer>
    );
}
