import type { ReactNode } from 'react';
import Sidebar from '@/components/Admin/Sidebar';
import Footer from '@/components/Admin/Footer';

interface Props {
    children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
    return (
        <div className="min-h-screen">
            <Sidebar />

            <main className="motion-safe:animate-in motion-safe:fade-in ml-64 max-w-[1240px] p-8 duration-500">
            {children}
                
            <Footer />
            </main>

        </div>
    );
}
