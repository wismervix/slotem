export default function Footer() {
    return (
        <footer className="border-outline-variant/50 mt-12 flex w-full flex-col items-center justify-between border-t py-12 md:flex-row">
            <div className="mb-6 md:mb-0">
                <span className="text-primary text-xl font-bold">Slotem</span>

                <p className="text-on-surface-variant mt-1 text-[11px] font-medium tracking-tight">
                    © 2024 Slotem Booking Systems. All rights reserved.
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
                        className="text-on-surface-variant hover:text-primary text-[11px] font-semibold transition-colors"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </footer>
    );
}
