import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isSeller = user?.role === 'seller';

    return (
        <div className="w-full h-full bg-[#fdfbf7] overflow-hidden flex items-center justify-center p-12">
            {/* Digilab-style Topo Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <path d="M0,100 C200,80 400,120 600,100 S1000,80 1000,100" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,200 C300,180 500,240 700,200 S1000,180 1000,200" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,300 C200,280 400,320 600,300 S1000,280 1000,300" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,450 C300,430 500,470 700,450 S1000,430 1000,450" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,600 C200,580 400,620 600,600 S1000,580 1000,600" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,750 C300,730 500,770 700,750 S1000,730 1000,750" fill="none" stroke="black" strokeWidth="0.5" />
                    <path d="M0,900 C200,880 400,920 600,900 S1000,880 1000,900" fill="none" stroke="black" strokeWidth="0.5" />

                    {/* Scattered Animated Data Points */}
                    {[...Array(40)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={Math.random() * 1000}
                            cy={Math.random() * 1000}
                            r={Math.random() * 2 + 1}
                            fill={i % 3 === 0 ? '#4d7c0f' : i % 3 === 1 ? '#660033' : '#d97706'}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-center mb-24"
                >
                    <h1 className="text-4xl md:text-[80px] font-sans font-black text-black tracking-[-0.04em] leading-[0.95] mb-12">
                        Cultivating the <br />
                        <span className="italic font-serif font-light text-[#4d7c0f]">digital soil</span> of <br />
                        community resilience.
                    </h1>
                    <div className="flex items-center justify-center gap-12">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40">Marketplace</span>
                        <div className="w-12 h-px bg-black/10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40">Recipes</span>
                        <div className="w-12 h-px bg-black/10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40">Garden</span>
                    </div>
                </motion.div>

                {/* Navigation Portal Buttons */}
                <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
                    {/* Farm Connect Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/intro-farm')}
                        className="relative group w-72 h-44"
                    >
                        <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                        <div className="relative w-full h-full bg-white border border-black p-8 flex flex-col justify-between items-start text-left transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4d7c0f]">01 Market</span>
                                <h3 className="text-3xl font-serif italic text-black mt-2">Farm Connect</h3>
                            </div>
                            <div className="w-full flex justify-end">
                                <ArrowLeft className="rotate-180 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.button>

                    {/* Recipes Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/intro-recipes')}
                        className="relative group w-72 h-44"
                    >
                        <div className="absolute inset-0 bg-[#660033] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                        <div className="relative w-full h-full bg-white border border-black p-8 flex flex-col justify-between items-start text-left transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#660033]">02 Kitchen</span>
                                <h3 className="text-3xl font-serif italic text-black mt-2">Recipes</h3>
                            </div>
                            <div className="w-full flex justify-end">
                                <ArrowLeft className="rotate-180 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.button>

                    {/* Planting Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/intro-planting')}
                        className="relative group w-72 h-44"
                    >
                        <div className="absolute inset-0 bg-[#d97706] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                        <div className="relative w-full h-full bg-white border border-black p-8 flex flex-col justify-between items-start text-left transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d97706]">03 Garden</span>
                                <h3 className="text-3xl font-serif italic text-black mt-2">Planting</h3>
                            </div>
                            <div className="w-full flex justify-end">
                                <ArrowLeft className="rotate-180 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Secondary Store Access for Sellers */}
                {isSeller && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={() => navigate('/seller/dashboard')}
                        className="mt-16 text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 hover:text-black transition-colors"
                    >
                        Manage My Store →
                    </motion.button>
                )}
            </div>

        </div>
    );
}
