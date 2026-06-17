export default function Footer() {
    return (
        <footer className="dark:border-zinc-850 mt-16 flex w-full shrink-0 flex-col items-center justify-between gap-4 border-t border-purple-100 pt-8 pb-4 md:flex-row">
            <div className="mb-6 md:mb-0">
                <span className="text-xl font-extrabold tracking-tight text-purple-700 dark:text-purple-400">
                    Slotem
                </span>

                <p className="mt-1 text-[11px] font-medium tracking-tight text-zinc-400 dark:text-zinc-500">
                    © {new Date().getFullYear()} Slotem Booking Systems. All
                    rights reserved.
                </p>
            </div>

            <div className="flex gap-8">
                {[
                    'Privacy Policy',
                    'Terms of Service',
                    'Help Center',
                    'Contact Sales',
                ].map((link) => (
                    <a
                        key={link}
                        href="#"
                        className="text-[11px] font-semibold text-on-surface-variant dark:text-on-surface-variant-dark transition-colors hover:text-primary"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </footer>
    );
}
