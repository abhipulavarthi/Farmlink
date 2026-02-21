import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { MapPin, Navigation, Package, Sprout, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const sellerData = await api.getSellerById(id);
            if (sellerData) {
                setSeller(sellerData);
                const productsData = await api.getProducts(sellerData.id);
                setProducts(productsData);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#f4f1e6] flex items-center justify-center font-serif italic text-2xl">Loading profile...</div>;
    if (!seller) return <div className="min-h-screen bg-[#f4f1e6] flex items-center justify-center font-serif italic text-2xl">Seller not found</div>;

    return (
        <div className="min-h-screen bg-[#f4f1e6] font-sans text-[#372528] overflow-x-hidden">
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Section Title */}
                <div className="mb-20 text-center relative pt-4">
                    <h1 className="text-8xl font-serif italic tracking-tighter opacity-10 leading-none select-none uppercase">Marketplace</h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h2 className="text-6xl font-serif italic text-black">{seller.storeName || seller.name}</h2>
                        <p className="text-black/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">
                            {seller.address || "Farm Fresh & Direct"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left Info Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white border-2 border-black p-8 relative">
                            <div className="absolute -top-4 -left-4 bg-[#aeb16d] text-white px-6 py-1 font-serif italic text-lg z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                About Shop
                            </div>
                            <p className="text-black/60 font-serif italic leading-relaxed text-lg mb-8 pt-4">
                                "{seller.description || 'Welcome to our farm shop. We provide the freshest local produce grown with care and respect for nature.'}"
                            </p>

                            <div className="space-y-4 border-t border-black/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                                        <MapPin size={14} className="text-[#aeb16d]" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                                        Location Verified
                                    </span>
                                </div>
                                {seller.location && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${seller.location.lat},${seller.location.lng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="relative group w-full block mt-8"
                                    >
                                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                                        <div className="relative w-full py-3 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                            <span className="text-sm font-serif italic text-black flex items-center gap-2">
                                                <Navigation size={16} /> Get Directions
                                            </span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Products Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border-2 border-black p-10 relative">
                            <div className="absolute -top-5 -right-5 bg-black text-white px-8 py-2 font-serif italic text-xl shadow-[4px_4px_0px_0px_rgba(174,177,109,1)]">
                                Available Fresh Produce
                            </div>

                            {products.length === 0 ? (
                                <div className="text-center py-24 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border border-dashed border-black/20 flex items-center justify-center">
                                        <Package className="text-black/20" size={32} />
                                    </div>
                                    <p className="font-serif italic text-black/40">Nothing harvested yet. Check back soon!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative"
                                        >
                                            <div className="absolute inset-0 bg-black/5 translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                            <div className="relative bg-[#fdfbf7] border border-black p-4 flex flex-col transition-all group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                                                <div className="aspect-[4/3] w-full overflow-hidden border border-black/5 mb-4">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-2xl font-serif italic text-black leading-tight">{product.name}</h3>
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 border border-black/10 px-2 py-0.5 rounded">
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 opacity-40">
                                                        {product.category === 'vegetable' ? <Leaf size={12} /> : <Sprout size={12} />}
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Farm Fresh</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-3xl font-serif italic text-black">
                                                            ₹{product.price}<span className="text-xs font-sans not-italic text-black/40">/{product.unit}</span>
                                                        </p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${parseInt(product.stock) > 0 ? 'text-[#aeb16d]' : 'text-red-400'}`}>
                                                            {parseInt(product.stock) > 0 ? `Stock: ${product.stock} ${product.unit}` : 'Out of Harvest'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
