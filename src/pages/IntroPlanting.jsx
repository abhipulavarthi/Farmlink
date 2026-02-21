import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import plantingBotanical from '../assets/planting_botanical.gif';

export default function IntroPlanting() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-full bg-[#fdfbf7] overflow-hidden flex flex-col">
            {/* Back to Portal */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Portal</span>
            </button>

            {/* Botanical Background Image */}
            <div className="absolute inset-0 opacity-100 pointer-events-none">
                <img src={plantingBotanical} alt="Botanical Background" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 flex items-center justify-center px-12 md:px-24 relative z-10">
                <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-full z-20">
                    <span className="text-7xl md:text-9xl font-serif tracking-tighter leading-none mb-4 text-white">
                        Plant
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-12 md:px-24 relative z-10">
                <div className="max-w-4xl text-white/90 italic font-serif leading-relaxed text-lg md:text-2xl text-center mb-16">
                    <p>
                        Press your palms against the earth, feel the pulse of a sleeping forest.<br />
                        With a small shovel and a pocket of seeds, you are the author of a green story.
                        Dig a shallow grave for the tiny, hard hearts, tuck them in with soil as dark as midnight.
                    </p>
                </div>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/planting')}
                    className="relative group pointer-events-auto"
                >
                    <div className="absolute inset-0 bg-[#372528] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 shadow-lg" />
                    <div className="relative px-14 py-5 bg-white border-2 border-black flex items-center justify-center gap-6 transition-transform group-active:translate-x-1 group-active:translate-y-1">
                        <span className="text-3xl font-serif italic text-black">Explore Guide</span>
                    </div>
                </motion.button>
            </div>

            <div className="h-32 relative z-10" />
        </div>
    );
}
