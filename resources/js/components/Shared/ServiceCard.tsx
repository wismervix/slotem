import { Link } from '@inertiajs/react';
import { Clock3 } from 'lucide-react';
import type { ServiceBadge } from '@/types';

function ServiceBadges({ badges }: { badges?: ServiceBadge[] }) {
    if (!badges?.length) {
        return null;
    }

    const styles = {
        popular:
            'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
        recommended:
            'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
        'best-value':
            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    };

    const labels = {
        popular: 'Popular',
        recommended: 'Recommended',
        'best-value': 'Best Value',
    };

    const [first, ...rest] = badges;

    return (
        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
            {/* Always visible badge */}
            <span
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    styles[first]
                }`}
            >
                {labels[first]}
            </span>

            {/* Hidden badges (shown on hover) */}
            {rest.length > 0 && (
                <div className="pointer-events-none flex translate-y-1 flex-col items-end gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    {rest.map((badge) => (
                        <span
                            key={badge}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                styles[badge]
                            }`}
                        >
                            {labels[badge]}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ServiceCard({ service, Icon }: any) {
    if (service.variant === 'featured') {
        return (
            <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 transition hover:border-purple-500 md:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-full flex-col md:flex-row">
                    <div className="md:w-1/3">
                        <img
                            src={service.image}
                            className="h-64 w-full object-cover md:h-full"
                        />
                    </div>

                    <div className="relative flex flex-1 flex-col p-8">
                        <ServiceBadges badges={service.badges} />

                        <h3 className="mb-3 text-3xl font-black">
                            {service.name}
                        </h3>

                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            {service.description}
                        </p>

                        <div className="mb-8 flex flex-wrap gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4" />

                                <span>{service.duration} min</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />

                                <span>Master Barber</span>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-wrap sm:flex-nowrap gap-4 items-center justify-between">
                            <div>
                                <span className="text-4xl font-black text-purple-600">
                                    ${service.price}
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    All inclusive
                                </span>
                            </div>

                            <Link
                                href={route('booking.date-time', {
                                    service: service.id,
                                })}
                                className="rounded-2xl cursor-pointer bg-purple-600 px-8 py-3 font-semibold text-white transition transition-all hover:bg-purple-500 active:scale-95"
                            >
                                Book Package
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:border-purple-500 dark:border-slate-700 dark:bg-slate-900">
            <ServiceBadges badges={service.badges} />

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                <Icon className="h-7 w-7" />
            </div>

            <h3 className="mb-2 text-2xl font-bold">{service.name}</h3>

            <p className="mb-8 flex-grow text-slate-600 dark:text-slate-400">
                {service.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
                <div>
                    <span className="text-3xl font-black text-purple-600">
                        ${service.price}
                    </span>

                    <span className="ml-2 text-sm text-slate-500">
                        / {service.duration} min
                    </span>
                </div>

                <Link
                    href={route('booking.date-time', {
                        service: service.id,
                    })}
                    className="rounded-xl cursor-pointer bg-purple-600 px-6 py-2 font-semibold text-white transition transition-all hover:bg-purple-500 active:scale-95"
                >
                    Select
                </Link>
            </div>
        </div>
    );
}
