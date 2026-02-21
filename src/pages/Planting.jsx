import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sprout, ArrowLeft, Info, Thermometer, ShieldCheck, HeartPulse, X, ThumbsUp, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { plantData } from '../data/plantData';

export default function Planting() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [selectedPlant, setSelectedPlant] = useState(null);

    const filteredPlants = useMemo(() => {
        return plantData.filter(plant => {
            const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (plant.info && plant.info.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesTab = activeTab === 'All' || plant.category === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab]);

    return (
        <div className="min-h-screen bg-[#f4f1e6] font-sans text-[#372528]">
            {/* Minimalist Top Navbar */}
            <header className="sticky top-0 z-50 bg-[#f4f1e6] border-b border-black/5 px-8 pt-[32px] pb-6">
                <div className="w-full flex flex-row items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>

                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
                        {['All', 'Vegetable', 'Fruit'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative group min-w-[130px]"
                            >
                                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${activeTab === tab ? 'bg-black' : 'bg-black/10 group-hover:bg-black/20'
                                    }`} />
                                <div className={`relative px-8 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${activeTab === tab ? 'bg-white border-black' : 'bg-white border-black/10 group-hover:border-black/30'
                                    }`}>
                                    <span className={`text-xl font-serif italic ${activeTab === tab ? 'text-black' : 'text-black/40 group-hover:text-black'
                                        }`}>
                                        {tab}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="relative group min-w-[300px] flex items-center">
                        <input
                            type="text"
                            placeholder="Search garden..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-black focus:border-[#4d7c0f] transition-all py-2 px-2 outline-none italic font-serif text-lg"
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100" size={20} />
                    </div>
                </div>
            </header>

            <main className="w-full px-12 py-20">
                {/* Section Title */}
                <div className="mb-20 text-center">
                    <h1 className="text-8xl font-serif italic tracking-tighter opacity-10 leading-none">Care Guide</h1>
                    <div className="h-px bg-black/10 w-40 mx-auto mt-4" />
                </div>

                {/* Plant Grid - Minimalist HMP Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-12 gap-y-16">
                    {filteredPlants.map((plant, index) => (
                        <motion.div
                            key={plant.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index % 6) * 0.05 }}
                            onClick={() => setSelectedPlant(plant)}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            {/* Card Body */}
                            <div className="aspect-[4/5] bg-white border border-black/10 relative overflow-hidden flex flex-col items-center justify-center p-8 transition-all group-hover:bg-[#ebe8de] group-hover:border-black">
                                {/* Minimalist Illustration/Icon */}
                                <div className="w-full flex justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                                    {plant.category === 'Vegetable' ? (
                                        <Sprout size={100} strokeWidth={0.5} className="text-black" />
                                    ) : (
                                        <Leaf size={100} strokeWidth={0.5} className="text-black" />
                                    )}
                                </div>

                                {/* Difficulty Dots */}
                                <div className="absolute bottom-6 left-6 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full border border-black/20 ${i <= (plant.difficulty || 2) ? 'bg-black' : 'bg-transparent'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Name Bar */}
                            <div className="pt-4 text-center">
                                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black/40 group-hover:text-black transition-colors">
                                    {plant.name}
                                </h3>
                                <p className="text-[10px] italic font-serif opacity-30 mt-1">{plant.officialName || 'Solanum plantae'}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredPlants.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-black/5">
                        <p className="text-2xl italic font-serif opacity-20 text-[#372528]">Our garden is quiet. Try another search.</p>
                    </div>
                )}
            </main>

            {/* Modal - The 'howmanyplants' Detailed View */}
            <AnimatePresence>
                {selectedPlant && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlant(null)}
                            className="absolute inset-0 bg-[#f4f1e6]/95 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                            className="relative w-full max-w-6xl h-[90vh] bg-white border border-black shadow-[30px_30px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
                        >
                            {/* Plant Title Box - Sticky Top */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
                                <div className="bg-white border-2 border-black px-12 py-4 shadow-[8px_8px_0px_#aeb16d] relative">
                                    <h2 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-center whitespace-nowrap">
                                        {selectedPlant.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPlant(null)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all z-[60]"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex-1 flex flex-col md:flex-row h-full">
                                {/* Left Side: Illustration & Badge */}
                                <div className="md:w-[45%] bg-[#ebe8de] border-r border-black/10 flex flex-col items-center justify-center relative p-12 min-h-[400px]">
                                    <div className="relative group">
                                        {selectedPlant.category === 'Vegetable' ? (
                                            <Sprout size={320} strokeWidth={0.2} className="text-black opacity-80" />
                                        ) : (
                                            <Leaf size={320} strokeWidth={0.2} className="text-black opacity-80" />
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Details (Typewriter Aesthetic) */}
                                <div className="md:w-[55%] p-12 lg:p-20 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                                    <div className="mt-20 space-y-12 font-mono text-[13px] tracking-tight text-black/70">

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-black">Official Name</span>
                                            <span className="italic font-serif text-lg text-black">{selectedPlant.officialName || `${selectedPlant.name} plantae`}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-black">Also Known As</span>
                                            <span>{selectedPlant.alsoKnownAs || 'Local Variety'}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-black">Origins & Climate</span>
                                            <span>{selectedPlant.origin || 'Worldwide'} | {selectedPlant.climate || 'Various'}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-black">About the Plant</span>
                                            <span className="leading-relaxed">{selectedPlant.info}</span>
                                        </div>

                                        {/* Grow Guide */}
                                        <div className="pt-8 border-t border-black/5">
                                            <h4 className="font-bold uppercase tracking-[0.3em] text-black mb-6">How to Grow</h4>
                                            <p className="leading-relaxed italic font-serif text-base text-black/80">
                                                "{selectedPlant.howToPlant}"
                                            </p>
                                        </div>

                                        {/* Issues & Prevention */}
                                        <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-black/5">
                                            <div>
                                                <h4 className="font-bold uppercase tracking-[0.3em] text-[#8b0000] mb-4 text-[10px]">Common Issues</h4>
                                                <p className="leading-relaxed font-bold uppercase text-[11px] opacity-60">
                                                    {selectedPlant.diseases}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase tracking-[0.3em] text-[#2d4a3e] mb-4 text-[10px]">Prevention</h4>
                                                <p className="leading-relaxed opacity-80">
                                                    {selectedPlant.prevention}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timing */}
                                        <div className="pt-8 flex items-center justify-between border-t border-black/5">
                                            <span className="font-bold uppercase tracking-widest text-black">Growth Timing</span>
                                            <span className="font-serif italic text-lg leading-none">{selectedPlant.growthTime}</span>
                                        </div>

                                        {/* Green Thumbs Rating */}
                                        <div className="pt-12 flex flex-col items-center gap-4">
                                            <span className="font-bold uppercase tracking-widest text-black/40 text-[10px]">How many green thumbs?</span>
                                            <div className="flex gap-4">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <ThumbsUp
                                                        key={i}
                                                        size={24}
                                                        className={`transition-colors ${i <= (selectedPlant.difficulty || 2) ? 'text-[#aeb16d] fill-[#aeb16d]' : 'text-black/10'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}
