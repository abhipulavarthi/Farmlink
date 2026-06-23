import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isFullWindow = isHome ||
        location.pathname === '/recipes' ||
        location.pathname === '/planting' ||
        location.pathname === '/buyer/dashboard' ||
        location.pathname.startsWith('/seller/') ||
        location.pathname.startsWith('/intro-');

    return (
        <div className="h-screen w-screen bg-[#fdfbf7] overflow-hidden flex flex-col">
            {!isHome && <Navbar />}
            <main className={`flex-1 overflow-y-auto no-scrollbar ${isFullWindow ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full'}`}>
                <Outlet />
            </main>
            <Toaster position="bottom-right" />
        </div>
    );
}
