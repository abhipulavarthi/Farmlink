import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cookGif from '../assets/cook.gif';

export default function IntroRecipes() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-full bg-[#fdfbf7] overflow-hidden flex items-center justify-center">
            {/* Back to Portal */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Portal</span>
            </button>

            {/* Background GIF */}
            <div className="absolute inset-0 opacity-100 pointer-events-none">
                <img src={cookGif} alt="Cooking" className="w-full h-full object-cover grayscale brightness-50 contrast-125" />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-full z-20">
                    <h2 className="text-7xl md:text-9xl font-serif tracking-tighter leading-none mb-4 text-white">
                        Recipes
                    </h2>
                </div>

                <div className="w-full max-w-7xl mx-auto px-12 flex flex-col items-center justify-center pt-24">
                    <div className="max-w-xl space-y-6 text-white/90 italic font-serif leading-relaxed text-sm md:text-base text-center mb-16">
                        <p>
                            Take a handful of hunger, washed clean by hope,<br />
                            add sunlight from the morning kitchen and a heart ready to stir.<br />
                            Mix flour with patience, salt with stories of the land,<br />
                            let spices fall like whispered secrets—turmeric gold, chili fire, cumin calm.
                        </p>
                        <p>
                            Pour oil that remembers home, heat it until it sings,<br />
                            drop onions that cry softly for all meals yet to come.<br />
                            Simmer slowly—because good food, like love, refuses to be rushed.
                        </p>
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/recipes')}
                        className="relative group pointer-events-auto"
                    >
                        <div className="absolute inset-0 bg-[#660033] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 shadow-lg shadow-[#660033]/10" />
                        <div className="relative px-14 py-5 bg-white border-2 border-black flex items-center justify-center gap-6 transition-transform group-active:translate-x-1 group-active:translate-y-1">
                            <span className="text-3xl font-serif italic text-black">Find Recipes</span>
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
