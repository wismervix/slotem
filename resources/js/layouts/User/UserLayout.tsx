import type { ReactNode } from 'react';
import Footer from '@/components/User/Footer';
import Sidebar from '@/components/User/Sidebar';

interface Props {
    children: ReactNode;
}

export default function UserLayout({ children }: Props) {
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
