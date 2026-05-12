import { ShieldCheck } from 'lucide-react';

export function HostCard() {
    return (
        <div
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/20"
            id="host-card"
        >
            <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcoL2H5gDRAKM-VFoZ_1jBa671vOUgkdnUJ44gZoYV0IwSF32r3y6yU0FVeF4xe75LnhshANNuYeDUVsdN2hgbnKyw3D2F04QXs0ponoEgGejwJZIHC-QqZDsIK8Cah0XcUpuDW-Q6ETRaHYpCo0aRUaMljdwsdzR6WO8A8IBzHkEdD_LuE_LQzD11wguJ3jJ7CB1VOlE6ntOlE2f70PMFTlgc06ASe2soyKrbPVtmzYnOnjkpfZTrPDL3tdlK6ZYQoRlyUrJAEcI"
                alt="Sarah Jenkins"
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full border-2 border-purple-100 object-cover dark:border-purple-900/40"
                id="host-image"
            />
            <div className="flex-grow">
                <h4
                    className="text-sm font-bold text-gray-900 dark:text-gray-100"
                    id="host-name"
                >
                    Host: Sarah Jenkins
                </h4>
                <p
                    className="text-xs font-medium text-gray-500 dark:text-gray-400"
                    id="host-title"
                >
                    Expert Strategic Consultant
                </p>
            </div>
            <ShieldCheck
                className="text-purple-600 dark:text-purple-400"
                size={20}
                id="verified-icon"
            />
        </div>
    );
}
