import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import SellerMap from '../components/SellerMap';
import { useAuth } from '../context/AuthContext';
import { MapPin, Search, ArrowLeft, ChevronRight, Star, ShoppingBag, Sprout, Leaf, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function BuyerDashboard() {
    const navigate = useNavigate();
    const { user, updateUserLocation } = useAuth();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [focusLocation, setFocusLocation] = useState(null);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const data = await api.getSellers(user?.location?.lat, user?.location?.lng);
                setSellers(data);
            } catch (error) {
                console.error("Failed to fetch sellers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSellers();
    }, [user?.location]);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            toast.loading("Detecting your location...", { id: 'locating' });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updateUserLocation(latitude, longitude);
                    setFocusLocation({ lat: latitude, lng: longitude });
                    toast.success("Location found!", { id: 'locating' });
                },
                (error) => {
                    console.error("Error detecting location", error);
                    toast.error("Could not detect your location.", { id: 'locating' });
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };

    const filteredSellers = useMemo(() => {
        return sellers.filter(seller => {
            const matchesSearch = (seller.storeName || seller.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                (seller.description && seller.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesTab = activeTab === 'All' ||
                (activeTab === 'Vegetables' && (seller.description?.toLowerCase().includes('vegetable') || seller.storeName?.toLowerCase().includes('organics'))) ||
                (activeTab === 'Fruits' && (seller.description?.toLowerCase().includes('fruit') || seller.storeName?.toLowerCase().includes('greens')));
            return matchesSearch && matchesTab;
        });
    }, [sellers, searchQuery, activeTab]);

    return (
        <div className="h-full flex flex-col bg-[#fdfbf7] font-sans text-black overflow-hidden relative">


            {/* Main Content Area - Moved back to the top */}
            <div className="flex-1 flex overflow-hidden pt-14">
                {/* Left Side: Map Container */}
                <div className="w-1/2 h-full bg-[#ebe8de] border-r border-black/5 relative overflow-hidden hidden lg:block">
                    <SellerMap
                        sellers={filteredSellers}
                        userLocation={user?.location}
                        focusLocation={focusLocation}
                    />

                    {/* Actionable Map Badge - Pin Icon Style */}
                    <div className="absolute top-8 right-8 z-10">
                        <button
                            onClick={handleLocateMe}
                            className="relative group"
                            title="Locate Me"
                        >
                            <div className="absolute inset-0 bg-[#aeb16d] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            <div className="relative p-3 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                <MapPin size={24} className="text-black transition-transform group-hover:scale-110" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Side: Sellers List (Scrollable) */}
                <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-white">
                    <div className="p-8 lg:p-10 w-full">
                        <div className="mb-20">
                            <h1 className="text-6xl font-serif italic tracking-tighter opacity-10 leading-none">Marketplace</h1>
                            <div className="flex items-center gap-4 mt-16">
                                <MapPin size={16} className="text-black/30" />
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Nearby Sellers</h2>
                                <div className="h-px flex-1 bg-black/5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-black/5 animate-pulse rounded-sm border border-black/5" />
                                ))
                            ) : filteredSellers.length > 0 ? (
                                filteredSellers.map((seller, index) => (
                                    <motion.div
                                        key={seller.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link to={`/seller/${seller.id}`} className="group flex flex-col h-full">
                                            {/* Seller Card UI like Recipes/Planting */}
                                            <div className="aspect-square bg-[#fdfbf7] border border-black/30 relative overflow-hidden flex flex-col items-center justify-center transition-all group-hover:bg-black/5 group-hover:border-black">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/10 group-hover:scale-110 transition-transform duration-500">
                                                        <span className="text-2xl">🚜</span>
                                                    </div>

                                                    {/* Category Indicators */}
                                                    <div className="flex gap-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <Sprout size={18} className="text-black" />
                                                        <Leaf size={18} className="text-black" />
                                                    </div>
                                                </div>

                                                {/* Distance Badge */}
                                                {seller.distance !== undefined && (
                                                    <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{seller.distance.toFixed(1)} km away</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-6 right-6">
                                                    <ChevronRight size={18} className="text-black opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            </div>

                                            {/* Details Bar */}
                                            <div className="pt-6 text-center">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 group-hover:text-black transition-colors px-2">
                                                    {seller.storeName || seller.name}
                                                </h3>
                                                <p className="text-[10px] italic font-serif opacity-30 mt-2 line-clamp-1 h-4 px-4 text-center">
                                                    {seller.description || "Local farm-to-table provider"}
                                                </p>

                                                <div className="mt-4 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/60 border border-black/10 px-2 py-1">Verified</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">View Shop</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-40 border-2 border-dashed border-black/5 flex flex-col items-center justify-center text-center px-8">
                                    <ShoppingBag size={48} className="text-black/10 mb-6" />
                                    <p className="text-2xl italic font-serif opacity-20 text-black">No matching sellers found in this region.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700;900&family=Special+Elite&display=swap');
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                .font-sans {
                    font-family: 'Inter', sans-serif;
                }
                .font-mono {
                    font-family: 'Special Elite', 'Courier New', monospace;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
}
