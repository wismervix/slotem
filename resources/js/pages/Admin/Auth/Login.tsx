import { Link, useForm } from '@inertiajs/react';
import {
    Mail,
    Lock,
    ArrowRight,
    ExternalLink,
    ShieldAlert,
    BadgeCheck,
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import GuestLayout from '@/layouts/Guest/GuestLayout';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.login.store'), {
            preserveScroll: true,

            onSuccess: () => {
                console.log('Login successful!');
            },
        });
    };

    return (
        <GuestLayout>
            <main className="flex flex-1 items-center justify-center px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex w-full max-w-[440px] flex-col gap-8"
                >
                    {/* Branding/Identity */}
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 200,
                            }}
                            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-container shadow-lg shadow-primary/20"
                        >
                            <ShieldAlert className="h-8 w-8 text-on-primary-container" />
                        </motion.div>
                        <h1 className="mb-2 text-3xl font-bold text-on-surface dark:text-on-surface-dark">
                            Admin Portal
                        </h1>
                        <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
                            Secure access for Slotem business managers
                        </p>
                    </div>

                    {/* Login Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl border border-outline-variant bg-surface-container-low p-8 shadow-xl shadow-black/3 dark:border-outline-variant-dark dark:bg-surface-container-high"
                    >
                        <form
                            className="flex flex-col gap-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-medium text-on-surface-variant"
                                    htmlFor="email"
                                >
                                    Administrative Email
                                </label>
                                <div className="group relative">
                                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary" />
                                    <input
                                        className={`font-body-md w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-on-surface transition-all placeholder:text-neutral-400 focus:outline-none dark:border-outline-variant-dark dark:text-gray-400 ${
                                            errors.email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary'
                                        }`}
                                        id="email"
                                        name="email"
                                        placeholder="name@company.com"
                                        required
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-sm font-medium text-on-surface-variant"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <a
                                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                                        href="#"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="group relative">
                                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary" />
                                    <input
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        className={`font-body-md w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-on-surface transition-all placeholder:text-neutral-400 focus:outline-none dark:border-outline-variant-dark dark:text-gray-400 ${
                                            errors.password
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary'
                                        }`}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    className="h-4 w-4 cursor-pointer rounded border-outline-variant text-primary focus:ring-primary"
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <label
                                    className="cursor-pointer text-sm text-on-surface-variant select-none"
                                    htmlFor="remember"
                                >
                                    Remember this workstation
                                </label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="hover:bg-primary-hover group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                type="submit"
                                disabled={processing}
                            >
                                <span>
                                    {processing
                                        ? 'Signing In to Dashboard...'
                                        : 'Sign In to Dashboard'}
                                </span>

                                {!processing && (
                                    <ArrowRight className="h-5 w-5" />
                                )}
                                <span></span>
                            </motion.button>
                        </form>

                        {/* Request Access Divider */}
                        <div className="mt-8 border-t border-outline-variant pt-8 text-center">
                            <p className="mb-2 text-on-surface-variant">
                                New staff member?
                            </p>
                            <a
                                className="inline-flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline"
                                href="#"
                            >
                                Request Access
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-8 grayscale transition-all duration-500 hover:grayscale-0"
                    >
                        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 backdrop-blur-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <ShieldCheck className="h-4 w-4" />
                            Secure Encryption
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
                            <LockKeyhole className="h-4 w-4" />
                            2-Factor Ready
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-700 backdrop-blur-sm dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                            <BadgeCheck className="h-4 w-4" />
                            Trusted Platform
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </GuestLayout>
    );
}
