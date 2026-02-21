import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Store, UserCircle, ShoppingBasket, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('login') === 'true') {
            setIsLoginOpen(true);
        }
    }, [location]);

    const isHome = location.pathname === '/';
    const isRegister = location.pathname === '/register';
    const isMarketplace = location.pathname === '/buyer/dashboard';
    const isSeller = user?.role === 'seller';

    const handleLogout = async () => {
        await logout();
        setShowLogout(false);
        navigate('/');
    };

    return (
        <>
            {/* Global UI Elements Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[60]">
                {/* Top Left: Navigation Links */}
                {!isHome && !isRegister && (
                    <div className="pointer-events-auto absolute top-8 left-8 flex items-center gap-4">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="relative group pointer-events-auto"
                        >
                            <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            <div className="relative px-8 py-2 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                <span className="text-2xl font-serif italic text-black">Home</span>
                            </div>
                        </motion.button>
                    </div>
                )}

                {/* Top Right Corner UI */}
                <div className="absolute top-8 right-8 flex flex-col items-end gap-2 pointer-events-auto">
                    <AnimatePresence mode="wait">
                        {user ? (
                            <div className="flex flex-col items-end gap-0">
                                <motion.button
                                    key="user-badge"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => setShowLogout(!showLogout)}
                                    className="relative group pointer-events-auto"
                                >
                                    <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                    <div className="relative px-8 py-2 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 min-w-[120px]">
                                        <span className="text-2xl font-serif italic text-black">
                                            {user.name}
                                        </span>
                                    </div>
                                </motion.button>

                                <AnimatePresence>
                                    {showLogout && (
                                        <motion.button
                                            key="logout-btn"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onClick={handleLogout}
                                            className="relative group mt-4 pointer-events-auto"
                                        >
                                            <div className="absolute inset-0 bg-red-500 translate-x-1 translate-y-1" />
                                            <div className="relative px-6 py-1.5 bg-white border border-black flex items-center justify-center text-red-600 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest">
                                                <LogOut size={14} className="mr-2" />
                                                <span>Sign Out</span>
                                            </div>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            !isLoginOpen && location.pathname !== '/register' && location.pathname !== '/recipes' && location.pathname !== '/planting' && (
                                <motion.button
                                    key="login-btn"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={() => setIsLoginOpen(true)}
                                    className="relative group pointer-events-auto"
                                >
                                    <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                    <div className="relative px-8 py-2 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                        <span className="text-2xl font-serif italic text-black">Login</span>
                                    </div>
                                </motion.button>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
