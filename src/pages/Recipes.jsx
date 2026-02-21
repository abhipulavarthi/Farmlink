import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Users, ArrowLeft, Leaf, ChevronRight, Sparkles, UtensilsCrossed, X, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { plantData } from '../data/plantData';

export default function Recipes() {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    const productsList = [
        'Tomatoes', 'Potatoes', 'Spinach', 'Mangoes', 'Carrots',
        'Onions', 'Garlic', 'Brinjal', 'Ladyfinger', 'Cabbage',
        'Cauliflower', 'Beans', 'Peas', 'Corn', 'Apples', 'Bananas',
        'Grapes', 'Oranges', 'Strawberries', 'Watermelon', 'Pineapple',
        'Blueberries', 'Raspberries', 'Pomegranate', 'Kiwi', 'Papaya',
        'Guava', 'Pear', 'Peach', 'Cherry', 'Avocado', 'Lemons'
    ];

    // Generate 200 mock recipes
    const recipes = useMemo(() => {
        const ingredients = productsList;
        const types = [
            'Curry', 'Salad', 'Stew', 'Pasta', 'Roast', 'Stir-fry',
            'Soup', 'Sauté', 'Bake', 'Grill', 'Smoothie', 'Tart',
            'Sorbet', 'Parfait', 'Chutney', 'Glazed'
        ];
        const methods = [
            'Slow cooked', 'Zesty', 'Spicy', 'Garlic butter', 'Creamy',
            'Fresh', 'Traditional', 'Quick', 'Oven-baked', 'Pan-seared',
            'Honey-infused', 'Cinnamon-spiced', 'Chilled', 'Caramelized'
        ];
        const origins = ['Mediterranean', 'Indian', 'Italian', 'French', 'Mexican', 'Asian Fusion', 'Country Style'];

        return Array.from({ length: 200 }).map((_, i) => {
            const mainIng = ingredients[i % ingredients.length];
            const type = types[Math.floor(Math.random() * types.length)];
            const method = methods[Math.floor(Math.random() * methods.length)];
            const origin = origins[Math.floor(Math.random() * origins.length)];

            const plantInfo = plantData.find(p => mainIng.toLowerCase().includes(p.name.toLowerCase()));
            const category = plantInfo ? plantInfo.category : 'Other';

            return {
                id: i + 1,
                name: `${method} ${mainIng} ${type}`,
                officialType: `${type} / ${origin}`,
                category: category,
                alsoKnownAs: `${method} Style ${mainIng}`,
                origin: origin,
                difficultyRating: (i % 5) + 1,
                description: `A sophisticated ${method.toLowerCase()} dish featuring farm-fresh ${mainIng.toLowerCase()}. Perfect for those seeking a balance of ${origin.toLowerCase()} flavors and local ingredients.`,
                mainIngredient: mainIng,
                prepTime: `${15 + (i * 3) % 45} mins`,
                serves: `${2 + (i % 4)} people`,
                difficulty: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
                image: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600`, // Generic food image
                instructions: [
                    `Carefully wash and prepare your fresh ${mainIng.toLowerCase()}.`,
                    `Heat a heavy - bottomed pan with a blend of olive oil and butter.`,
                    `Sauté aromatics until they release their natural oils and turn golden.`,
                    `Incorporate the ${mainIng.toLowerCase()} and toss gently to coat.`,
                    `Simmer for ${10 + (i % 20)} minutes, allowing flavors to meld.`,
                    'Season with sea salt, cracked pepper, and fresh garden herbs.'
                ],
                ingredients: [
                    `500g Fresh ${mainIng} `,
                    'High-quality cold-pressed oil',
                    'Aromatics (Onion, Garlic, Ginger)',
                    'Seasonal spice blend',
                    'Filtered water or vegetable stock',
                    'Freshly harvested herbs for garnish'
                ],
                chefTip: "The secret to this dish lies in the temperature of the pan. Let the ingredients sear before stirring to lock in the field-fresh sweetness."
            };
        });
    }, []);

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.mainIngredient.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesTab = true;
            if (activeTab === 'Vegetables') matchesTab = recipe.category === 'Vegetable';
            else if (activeTab === 'Fruits') matchesTab = recipe.category === 'Fruit';

            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab]);

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#660033]">
            {/* Minimalist Top Navbar */}
            <header className="sticky top-0 z-50 bg-[#fdfbf7] border-b border-[#660033]/5 px-8 pt-[32px] pb-6">
                <div className="w-full flex flex-row items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>

                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
                        {['All', 'Vegetables', 'Fruits'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative group min-w-[140px]"
                            >
                                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${activeTab === tab ? 'bg-[#660033]' : 'bg-black/10 group-hover:bg-black/20'
                                    }`} />
                                <div className={`relative px-8 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${activeTab === tab ? 'bg-white border-[#660033]' : 'bg-white border-black/10 group-hover:border-black/30'
                                    }`}>
                                    <span className={`text-xl font-serif italic ${activeTab === tab ? 'text-[#660033]' : 'text-black/40 group-hover:text-black'
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
                            placeholder="Find a recipe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-[#660033] focus:border-[#660033] transition-all py-2 px-2 outline-none italic font-serif text-lg text-[#660033]"
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100" size={20} />
                    </div>
                </div>
            </header>

            <main className="w-full px-12 py-20">
                {/* Section Title */}
                <div className="mb-20 text-center">
                    <h1 className="text-8xl font-serif italic tracking-tighter opacity-10 leading-none">Recipe Book</h1>
                    <div className="h-px bg-[#660033]/10 w-40 mx-auto mt-4" />
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
                    {filteredRecipes.slice(0, 50).map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index % 5) * 0.05 }}
                            onClick={() => setSelectedRecipe(recipe)}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            {/* Card Body */}
                            <div className="aspect-[4/5] bg-white border border-[#660033]/10 relative overflow-hidden flex flex-col items-center justify-center transition-all group-hover:bg-[#66003308] group-hover:border-[#660033]">
                                <img
                                    src={recipe.image}
                                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                                    alt={recipe.name}
                                />

                                {/* Difficulty Dots */}
                                <div className="absolute bottom-6 left-6 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full border border-[#660033]/20 ${i <= recipe.difficultyRating ? 'bg-[#660033]' : 'bg-transparent'}`} />
                                    ))}
                                </div>

                                <div className="absolute top-6 right-6">
                                    <UtensilsCrossed size={16} className="text-[#660033] opacity-20 group-hover:opacity-100" />
                                </div>
                            </div>

                            {/* Name Bar */}
                            <div className="pt-4 text-center">
                                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#660033]/40 group-hover:text-[#660033] transition-colors line-clamp-1 px-2">
                                    {recipe.name}
                                </h3>
                                <p className="text-[10px] italic font-serif opacity-30 mt-1">{recipe.officialType}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredRecipes.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-[#660033]/5">
                        <p className="text-2xl italic font-serif opacity-20 text-[#660033]">The kitchen is quiet. Try another ingredient.</p>
                    </div>
                )}
            </main>

            {/* Modal - The 'howmanyplants' Detailed View Adapted for Recipes */}
            <AnimatePresence>
                {selectedRecipe && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRecipe(null)}
                            className="absolute inset-0 bg-[#fdfbf7]/95 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                            className="relative w-full max-w-6xl h-[90vh] bg-white border border-[#660033] shadow-[30px_30px_0px_rgba(102,0,51,0.05)] overflow-hidden flex flex-col"
                        >
                            {/* Recipe Title Box */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
                                <div className="bg-white border-2 border-[#660033] px-12 py-4 shadow-[8px_8px_0px_#66003322] relative">
                                    <h2 className="text-3xl md:text-4xl font-serif italic tracking-tighter text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[400px]">
                                        {selectedRecipe.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-[#66003311] hover:border-[#660033] hover:bg-[#660033] hover:text-white transition-all z-[60]"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex-1 flex flex-col md:flex-row h-full">
                                {/* Left Side: Image */}
                                <div className="md:w-[45%] bg-[#66003305] border-r border-[#66003308] flex flex-col items-center justify-center relative p-12 min-h-[400px]">
                                    <div className="relative w-full h-full p-8">
                                        <img
                                            src={selectedRecipe.image}
                                            className="w-full h-full object-cover shadow-2xl grayscale brightness-110"
                                            alt={selectedRecipe.name}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Details (Typewriter Aesthetic) */}
                                <div className="md:w-[55%] p-12 lg:p-20 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                                    <div className="mt-20 space-y-12 font-mono text-[13px] tracking-tight text-[#660033cc]">

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-[#660033]">Official Type</span>
                                            <span className="italic font-serif text-lg text-[#660033]">{selectedRecipe.officialType}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-[#660033]">Description</span>
                                            <span>{selectedRecipe.alsoKnownAs}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-[#660033]">Origin & Prep</span>
                                            <span>{selectedRecipe.origin} | {selectedRecipe.prepTime}</span>
                                        </div>

                                        <div className="grid grid-cols-[150px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-widest text-[#660033]">About the Dish</span>
                                            <span className="leading-relaxed">{selectedRecipe.description}</span>
                                        </div>

                                        {/* Ingredients */}
                                        <div className="pt-8 border-t border-[#66003311]">
                                            <h4 className="font-bold uppercase tracking-[0.3em] text-[#660033] mb-6">Ingredients</h4>
                                            <ul className="space-y-2 list-disc list-inside italic font-serif text-base text-[#660033]">
                                                {selectedRecipe.ingredients.map((ing, i) => (
                                                    <li key={i}>{ing}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Steps */}
                                        <div className="pt-8 border-t border-[#66003311]">
                                            <h4 className="font-bold uppercase tracking-[0.3em] text-[#660033] mb-6">Instructions</h4>
                                            <div className="space-y-4">
                                                {selectedRecipe.instructions.map((step, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <span className="font-bold text-[#66003344]">{i + 1}.</span>
                                                        <p className="leading-relaxed">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chef's Tip */}
                                        <div className="pt-8 border-t border-[#66003311]">
                                            <h4 className="font-bold uppercase tracking-[0.3em] text-[#660033] mb-4 text-[10px]">Expert Chef's Tip</h4>
                                            <p className="leading-relaxed italic text-sm p-4 bg-[#66003308] border-l-2 border-[#660033]">
                                                "{selectedRecipe.chefTip}"
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="pt-8 flex items-center justify-between border-t border-[#66003311]">
                                            <div className="flex flex-col">
                                                <span className="font-bold uppercase tracking-widest text-[#660033] text-[10px]">Serves</span>
                                                <span className="font-serif italic text-lg leading-none">{selectedRecipe.serves}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold uppercase tracking-widest text-[#660033] text-[10px]">Complexity</span>
                                                <div className="flex gap-2 mt-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <ThumbsUp
                                                            key={i}
                                                            size={16}
                                                            className={`transition-colors ${i <= selectedRecipe.difficultyRating ? 'text-[#660033] fill-[#660033]' : 'text-[#66003311]'}`}
                                                        />
                                                    ))}
                                                </div>
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
                    background: rgba(102, 0, 51, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(102, 0, 51, 0.2);
                }
            `}</style>
        </div>
    );
}
