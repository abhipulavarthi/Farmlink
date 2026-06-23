import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Users, ArrowLeft, Leaf, ChevronRight, Sparkles, UtensilsCrossed, X, ThumbsUp, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';


export default function Recipes() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [filterByHarvest, setFilterByHarvest] = useState(false);
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [selectedMixture, setSelectedMixture] = useState([]);
    const [bowlSearchInput, setBowlSearchInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isMixingBowlOpen, setIsMixingBowlOpen] = useState(false);
    const [plantDataList, setPlantDataList] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        fetch(`${apiUrl}/api/plants`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlantDataList(data);
                }
            })
            .catch(err => {
                console.error("Error fetching plants in Recipes.jsx:", err);
            });
    }, []);

    const productsList = [
        'Tomatoes', 'Potatoes', 'Spinach', 'Mangoes', 'Carrots',
        'Onions', 'Garlic', 'Brinjal', 'Ladyfinger', 'Cabbage',
        'Cauliflower', 'Beans', 'Peas', 'Corn', 'Apples', 'Bananas',
        'Grapes', 'Oranges', 'Strawberries', 'Watermelon', 'Pineapple',
        'Blueberries', 'Raspberries', 'Pomegranate', 'Kiwi', 'Papaya',
        'Guava', 'Pear', 'Peach', 'Cherry', 'Avocado', 'Lemons'
    ];

    // Determine category of each product based on plantDataList
    const ingredientsWithCategories = useMemo(() => {
        return productsList.map(name => {
            const singular = name.replace(/s$/, '').toLowerCase();
            const plant = plantDataList.find(p => p.name.toLowerCase().includes(singular) || singular.includes(p.name.toLowerCase()));
            return {
                name,
                category: plant ? plant.category : 'Vegetable'
            };
        });
    }, [productsList, plantDataList]);

    // Autocomplete suggestions based on search input (filtering out already selected ones)
    const suggestions = useMemo(() => {
        if (!bowlSearchInput.trim()) return [];
        return productsList.filter(name => {
            const matchesSearch = name.toLowerCase().includes(bowlSearchInput.toLowerCase());
            const alreadySelected = selectedMixture.includes(name);
            return matchesSearch && !alreadySelected;
        });
    }, [bowlSearchInput, productsList, selectedMixture]);

    // Generate custom recipe dynamically based on selection mixture
    const customRecipe = useMemo(() => {
        if (selectedMixture.length === 0) return null;

        const fruitsSelected = selectedMixture.filter(name => {
            const item = ingredientsWithCategories.find(i => i.name === name);
            return item?.category === 'Fruit';
        });
        const veggiesSelected = selectedMixture.filter(name => {
            const item = ingredientsWithCategories.find(i => i.name === name);
            return item?.category === 'Vegetable';
        });

        let dishType = 'Fusion';
        let category = 'Mixed';
        let method = 'Garden Harvest';
        let image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';

        if (veggiesSelected.length > 0 && fruitsSelected.length === 0) {
            category = 'Vegetable';
            const types = ['Sauté', 'Stir-Fry', 'Slow-Cooked Curry', 'Garden Roast', 'Warm Salad', 'Herb Stew'];
            dishType = types[selectedMixture.length % types.length];
            const methods = ['Garlic Butter', 'Zesty Herb', 'Traditional Spiced', 'Oven-Baked', 'Pan-Seared'];
            method = methods[selectedMixture.length % methods.length];
            image = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600';
        } else if (fruitsSelected.length > 0 && veggiesSelected.length === 0) {
            category = 'Fruit';
            const types = ['Medley', 'Fruit Bowl', 'Chilled Sorbet', 'Summer Smoothie', 'Glazed Compote', 'Parfait'];
            dishType = types[selectedMixture.length % types.length];
            const methods = ['Honey-Infused', 'Cinnamon-Spiced', 'Fresh & Zesty', 'Chilled Mint', 'Maple-Drizzled'];
            method = methods[selectedMixture.length % methods.length];
            image = 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=600';
        } else {
            const types = ['Harvest Salad', 'Orchard & Garden Roast', 'Glazed Fusion', 'Sweet & Savory Bake'];
            dishType = types[selectedMixture.length % types.length];
            const methods = ['Balsamic-Glazed', 'Sweet Chili', 'Spiced Honey', 'Rustic Style'];
            method = methods[selectedMixture.length % methods.length];
            image = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600';
        }

        let name = '';
        if (selectedMixture.length === 1) {
            name = `${method} ${selectedMixture[0]} ${dishType}`;
        } else if (selectedMixture.length === 2) {
            name = `${method} ${selectedMixture[0]} & ${selectedMixture[1]} ${dishType}`;
        } else {
            name = `${method} ${selectedMixture[0]}, ${selectedMixture[1]} & ${selectedMixture[2]} ${dishType}`;
        }

        const recipeIngredients = [
            ...selectedMixture.map(ing => `300g Fresh ${ing}`),
            '2 tbsp Cold-pressed olive oil or butter',
            '2 cloves Garlic, crushed',
            '1 small Onion, finely diced',
            category === 'Fruit' ? '1 tbsp Raw organic honey or maple syrup' : 'Pinch of sea salt and cracked black pepper',
            category === 'Fruit' ? 'Fresh mint leaves for garnish' : 'A handful of fresh garden herbs (basil, thyme, or parsley)'
        ];

        const instructions = [];
        if (category === 'Fruit') {
            instructions.push(`Gently wash all selected fruits: ${selectedMixture.join(', ')}.`);
            instructions.push(`Slice them into bite-sized pieces and place in a large wooden mixing bowl.`);
            instructions.push(`Drizzle with the honey/maple syrup and gently toss to coat.`);
            instructions.push(`Tear fresh mint leaves and scatter them over the mixture.`);
            instructions.push(`Chill in the refrigerator for 10-15 minutes to let the natural sweetness and flavors meld.`);
            instructions.push(`Serve cold, optionally topped with a scoop of yogurt or granola.`);
        } else {
            instructions.push(`Carefully wash, peel, and chop the fresh ${selectedMixture.join(', ')}.`);
            instructions.push(`Heat the olive oil or butter in a heavy-bottomed skillet over medium heat.`);
            instructions.push(`Sauté the finely diced onion and crushed garlic until fragrant and translucent (about 3 minutes).`);
            instructions.push(`Add the denser vegetables first, then fold in the remaining items: ${selectedMixture.join(', ')}.`);
            instructions.push(`Cook for 8-12 minutes, tossing frequently, until tender yet still crisp.`);
            instructions.push(`Season with sea salt, cracked black pepper, and garnish with freshly chopped garden herbs before serving warm.`);
        }

        return {
            id: 'custom-recipe-id',
            name,
            officialType: `${dishType} / Custom Creation`,
            category: category,
            alsoKnownAs: `Your Custom ${category} Dish`,
            origin: 'Your Kitchen Garden',
            difficultyRating: Math.min(5, Math.max(1, selectedMixture.length)),
            description: `A custom-blended dish designed specifically from your selection of ${selectedMixture.join(', ')}. Freshly harvested and tailored to highlight the natural flavors of the season.`,
            mainIngredient: selectedMixture[0],
            prepTime: `${10 + selectedMixture.length * 3} mins`,
            serves: '2-4 people',
            difficulty: selectedMixture.length <= 2 ? 'Easy' : selectedMixture.length <= 4 ? 'Medium' : 'Hard',
            image,
            instructions,
            ingredients: recipeIngredients,
            chefTip: category === 'Fruit'
                ? "Add a squeeze of fresh lime or lemon juice right before serving to elevate the brightness of the fruit flavor profile."
                : "Ensure the skillet is nice and hot before adding the vegetables. A quick sear caramelizes their natural sugars, keeping them sweet and crunchy."
        };
    }, [selectedMixture, ingredientsWithCategories]);

    // Load pantry ingredients from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('pantry_ingredients');
        if (saved) {
            try {
                setPantryIngredients(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse pantry ingredients", e);
            }
        }
    }, [location]); // reload when location changes (e.g. redirected from garden)

    // Handle incoming URL search queries (e.g., /recipes?ingredient=tomato)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ingredientParam = params.get('ingredient');
        if (ingredientParam) {
            setSearchQuery(ingredientParam);
        }
    }, [location]);

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        fetch(`${apiUrl}/api/recipes`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecipes(data);
                }
            })
            .catch(err => {
                console.error("Error fetching recipes:", err);
            });
    }, []);

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.mainIngredient.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesTab = true;
            if (activeTab === 'Vegetables') matchesTab = recipe.category === 'Vegetable';
            else if (activeTab === 'Fruits') matchesTab = recipe.category === 'Fruit';

            let matchesHarvest = true;
            if (filterByHarvest && pantryIngredients.length > 0) {
                matchesHarvest = pantryIngredients.some(item => {
                    const normalizedItem = item.name.toLowerCase().replace(/s$/, ''); // e.g. tomatoes -> tomato
                    const normalizedMain = recipe.mainIngredient.toLowerCase().replace(/s$/, '');
                    return normalizedMain.includes(normalizedItem) || normalizedItem.includes(normalizedMain);
                });
            }

            let matchesMixture = true;
            if (selectedMixture.length > 0) {
                matchesMixture = selectedMixture.some(mixIng => {
                    const normalizedItem = mixIng.toLowerCase().replace(/s$/, '');
                    const normalizedMain = recipe.mainIngredient.toLowerCase().replace(/s$/, '');
                    return normalizedMain.includes(normalizedItem) || normalizedItem.includes(normalizedMain);
                });
            }

            return matchesSearch && matchesTab && matchesHarvest && matchesMixture;
        });
    }, [searchQuery, activeTab, filterByHarvest, pantryIngredients, recipes, selectedMixture]);

    const displayRecipes = useMemo(() => {
        if (customRecipe) {
            return [customRecipe, ...filteredRecipes];
        }
        return filteredRecipes;
    }, [customRecipe, filteredRecipes]);

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#660033]">
            {/* Minimalist Top Navbar */}
            <header className="sticky top-0 z-50 bg-[#fdfbf7] border-b border-[#660033]/5 px-8 py-6">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
                        {/* Home Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="relative group min-w-[120px] shrink-0"
                        >
                            <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            <div className="relative px-8 py-2 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                <span className="text-2xl font-serif italic text-black">Home</span>
                            </div>
                        </button>
                        {['All', 'Vegetables', 'Fruits'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative group min-w-[140px]"
                            >
                                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${activeTab === tab ? 'bg-[#660033]' : 'bg-black/10 group-hover:bg-black/20'
                                    }`} />
                                <div className={`relative px-6 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${activeTab === tab ? 'bg-white border-[#660033]' : 'bg-white border-black/10 group-hover:border-black/30'
                                    }`}>
                                    <span className={`text-xl font-serif italic ${activeTab === tab ? 'text-[#660033]' : 'text-black/40 group-hover:text-black'
                                        }`}>
                                        {tab}
                                    </span>
                                </div>
                            </button>
                        ))}

                        {/* Mixing Bowl Trigger Button */}
                        <button
                            onClick={() => setIsMixingBowlOpen(true)}
                            className="relative group min-w-[140px]"
                        >
                            <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${isMixingBowlOpen ? 'bg-[#660033]' : 'bg-black/10 group-hover:bg-black/20'
                                }`} />
                            <div className={`relative px-6 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${isMixingBowlOpen ? 'bg-white border-[#660033]' : 'bg-white border-black/10 group-hover:border-black/30'
                                }`}>
                                <span className={`text-xl font-serif italic whitespace-nowrap ${isMixingBowlOpen ? 'text-[#660033]' : 'text-black/40 group-hover:text-black'
                                    }`}>
                                    Mixing Bowl {selectedMixture.length > 0 && `(${selectedMixture.length})`}
                                </span>
                            </div>
                        </button>

                        {/* Harvest Filter Button */}
                        {pantryIngredients.length > 0 && (
                            <button
                                onClick={() => setFilterByHarvest(!filterByHarvest)}
                                className="relative group min-w-[140px]"
                            >
                                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${filterByHarvest ? 'bg-[#660033]' : 'bg-black/10 group-hover:bg-black/20'
                                    }`} />
                                <div className={`relative px-6 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${filterByHarvest ? 'bg-white border-[#660033]' : 'bg-white border-black/10 group-hover:border-black/30'
                                    }`}>
                                    <span className={`text-xl font-serif italic whitespace-nowrap ${filterByHarvest ? 'text-[#660033]' : 'text-black/40 group-hover:text-black'
                                        }`}>
                                        Harvest Pantry {filterByHarvest ? '(On)' : '(Off)'}
                                    </span>
                                </div>
                            </button>
                        )}
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
                    <h1 className="text-8xl font-serif italic tracking-tighter opacity-25 leading-none">Recipe Book</h1>
                    <div className="h-px bg-[#660033]/20 w-40 mx-auto mt-4" />
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
                    {displayRecipes.slice(0, 50).map((recipe, index) => {
                        const isCustom = recipe.id === 'custom-recipe-id';
                        return (
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
                                <div className={`aspect-[4/5] relative overflow-hidden flex flex-col items-center justify-center transition-all border ${
                                    isCustom 
                                    ? 'bg-[#660033] border-[#660033] shadow-[8px_8px_0px_rgba(102,0,51,0.25)] group-hover:shadow-[12px_12px_0px_rgba(102,0,51,0.35)]' 
                                    : 'bg-white border-[#660033]/10 group-hover:bg-[#66003308] group-hover:border-[#660033]'
                                }`}>
                                    {isCustom ? (
                                        <div className="w-full h-full flex flex-col justify-between p-6 text-[#fdfbf7] relative">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 backdrop-blur-sm">
                                                    ✨ Custom Creation
                                                </span>
                                                <Sparkles size={18} className="animate-pulse" />
                                            </div>
                                            
                                            <div className="my-auto flex flex-col items-center text-center">
                                                <UtensilsCrossed size={32} className="mb-4 opacity-80" />
                                                <p className="text-xs font-serif italic opacity-85 leading-relaxed line-clamp-4">
                                                    {recipe.description}
                                                </p>
                                            </div>

                                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex justify-between border-t border-white/20 pt-4">
                                                <span>{recipe.prepTime}</span>
                                                <span>{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>

                                {/* Name Bar */}
                                <div className="pt-4 text-center">
                                    <h3 className={`text-sm font-bold uppercase tracking-[0.3em] transition-colors line-clamp-1 px-2 ${
                                        isCustom ? 'text-[#660033]' : 'text-[#660033]/40 group-hover:text-[#660033]'
                                    }`}>
                                        {recipe.name}
                                    </h3>
                                    <p className="text-[10px] italic font-serif opacity-30 mt-1">{recipe.officialType}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {displayRecipes.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-[#660033]/5">
                        <p className="text-2xl italic font-serif opacity-20 text-[#660033]">No matching recipes found.</p>
                    </div>
                )}
            </main>

            {/* Modal - Detailed View */}
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
                            className="relative w-full max-w-7xl w-[95%] h-[95vh] bg-white border border-[#660033] shadow-[30px_30px_0px_rgba(102,0,51,0.05)] overflow-hidden flex flex-col"
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

                                {/* Right Side: Details */}
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

            {/* Modal - Mixing Bowl View */}
            <AnimatePresence>
                {isMixingBowlOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMixingBowlOpen(false)}
                            className="absolute inset-0 bg-[#fdfbf7]/90 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -15 }}
                            className="relative w-full max-w-7xl w-[95%] max-h-[95vh] bg-white border-2 border-[#660033] shadow-[12px_12px_0px_#660033] overflow-y-auto custom-scrollbar p-8 md:p-12 z-50 flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMixingBowlOpen(false)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-[#66003311] hover:border-[#660033] hover:bg-[#660033] hover:text-white transition-all z-[60]"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row gap-12">
                                {/* Left Side: Ingredient Picker (Search & Selection Display) */}
                                <div className="md:w-3/5 flex flex-col min-h-[350px]">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-serif italic tracking-tight text-[#660033]">Mixing Bowl</h2>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#660033]/60 mt-1">Search and add items to view your custom mixture</p>
                                    </div>

                                    {/* Search Bar & Button */}
                                    <div className="relative flex gap-3 mb-8">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Type ingredient... (e.g. Tomatoes, Spinach, Mangoes)"
                                                value={bowlSearchInput}
                                                onChange={(e) => {
                                                    setBowlSearchInput(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const trimmed = bowlSearchInput.trim();
                                                        if (trimmed) {
                                                            const match = productsList.find(p => p.toLowerCase() === trimmed.toLowerCase()) || suggestions[0];
                                                            if (match && !selectedMixture.includes(match)) {
                                                                setSelectedMixture([...selectedMixture, match]);
                                                                setBowlSearchInput('');
                                                                setShowSuggestions(false);
                                                            }
                                                        }
                                                    }
                                                }}
                                                className="w-full bg-[#fdfbf7] border-2 border-[#660033]/20 focus:border-[#660033] transition-all py-3 px-4 outline-none font-serif italic text-base text-[#660033] shadow-inner"
                                            />
                                            
                                            {/* Autocomplete Suggestions Dropdown */}
                                            <AnimatePresence>
                                                {showSuggestions && suggestions.length > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-[#660033] z-50 max-h-[160px] overflow-y-auto custom-scrollbar shadow-lg"
                                                    >
                                                        {suggestions.map(name => {
                                                            const item = ingredientsWithCategories.find(i => i.name === name);
                                                            return (
                                                                <button
                                                                    key={name}
                                                                    onClick={() => {
                                                                        setSelectedMixture([...selectedMixture, name]);
                                                                        setBowlSearchInput('');
                                                                        setShowSuggestions(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 hover:bg-[#6600330a] text-xs font-bold uppercase tracking-wider text-[#660033] flex items-center justify-between border-b border-[#660033]/5 last:border-b-0 transition-colors"
                                                                >
                                                                    <span>{name}</span>
                                                                    <span className="text-[9px] opacity-40 lowercase">
                                                                        ({item?.category === 'Vegetable' ? 'veg' : 'frt'})
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const trimmed = bowlSearchInput.trim();
                                                if (trimmed) {
                                                    const match = productsList.find(p => p.toLowerCase() === trimmed.toLowerCase()) || suggestions[0];
                                                    if (match && !selectedMixture.includes(match)) {
                                                        setSelectedMixture([...selectedMixture, match]);
                                                        setBowlSearchInput('');
                                                        setShowSuggestions(false);
                                                    }
                                                }
                                            }}
                                            className="relative group px-6 py-3 border-2 border-[#660033] bg-[#660033] text-[#fdfbf7] flex items-center justify-center transition-all group-active:translate-x-0.5 group-active:translate-y-0.5"
                                        >
                                            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black/10 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-all" />
                                            <span className="relative text-xs font-bold uppercase tracking-wider">Search & Add</span>
                                        </button>
                                    </div>

                                    {/* Click outside listener helper to close suggestions */}
                                    {showSuggestions && (
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setShowSuggestions(false)} 
                                        />
                                    )}

                                    {/* Selected Items view */}
                                    <div className="flex-1 min-h-[160px] border-2 border-dashed border-[#660033]/10 p-6 bg-[#fdfbf7]/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#660033] opacity-60">Items in your Mixing Bowl ({selectedMixture.length})</h3>
                                                {selectedMixture.length > 0 && (
                                                    <button
                                                        onClick={() => setSelectedMixture([])}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-[#660033]/60 hover:text-red-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Clear Bowl
                                                    </button>
                                                )}
                                            </div>

                                            {selectedMixture.length === 0 ? (
                                                <div className="py-8 flex flex-col items-center justify-center text-center opacity-30">
                                                    <UtensilsCrossed size={36} className="mb-4" />
                                                    <p className="text-sm italic font-serif">Add fresh ingredients to combine into a custom recipe</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-3">
                                                    <AnimatePresence>
                                                        {selectedMixture.map(name => {
                                                            const item = ingredientsWithCategories.find(i => i.name === name);
                                                            return (
                                                                <motion.span
                                                                    key={name}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    className="px-4 py-2 bg-white text-[#660033] border-2 border-[#660033] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_#66003322]"
                                                                >
                                                                    {name}
                                                                    <span className="text-[9px] opacity-40 lowercase font-normal">
                                                                        ({item?.category === 'Vegetable' ? 'veg' : 'frt'})
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => setSelectedMixture(selectedMixture.filter(n => n !== name))}
                                                                        className="hover:text-red-600 transition-colors ml-1"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </motion.span>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Pantry Integration */}
                                <div className="md:w-2/5 border-t md:border-t-0 md:border-l border-[#660033]/10 pt-8 md:pt-0 md:pl-12 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#660033] mb-6">Your Garden Pantry</h3>
                                        
                                        {pantryIngredients.length === 0 ? (
                                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-30">
                                                <Leaf size={36} className="mb-4" />
                                                <p className="text-xs italic font-serif leading-relaxed">No harvested items in your pantry. Harvest fruits and vegetables in Gardening to see them here.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#660033]/40 mb-2">Click to add harvested items:</p>
                                                {pantryIngredients.map(item => {
                                                    const matchName = productsList.find(p => p.toLowerCase().includes(item.name.toLowerCase().replace(/s$/, ''))) || item.name;
                                                    const isAlreadySelected = selectedMixture.includes(matchName);
                                                    return (
                                                        <button
                                                            key={item.name}
                                                            disabled={isAlreadySelected}
                                                            onClick={() => {
                                                                setSelectedMixture([...selectedMixture, matchName]);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 border text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                                                                isAlreadySelected
                                                                ? 'bg-[#660033]/5 text-[#660033]/40 border-[#660033]/10 cursor-not-allowed'
                                                                : 'bg-white text-[#660033] border-[#660033]/20 hover:border-[#660033] hover:bg-[#660033]/5'
                                                            }`}
                                                        >
                                                            <span>{item.name}</span>
                                                            <span className="text-[10px] opacity-60">
                                                                {isAlreadySelected ? 'Added' : `Qty: ${item.quantity}`}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pantry Harvest Integration Button */}
                                    {pantryIngredients.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-[#660033]/10">
                                            <button
                                                onClick={() => {
                                                    const pantryNames = pantryIngredients.map(item => {
                                                        const match = productsList.find(p => p.toLowerCase().includes(item.name.toLowerCase().replace(/s$/, '')));
                                                        return match || item.name;
                                                    });
                                                    const merged = Array.from(new Set([...selectedMixture, ...pantryNames]));
                                                    setSelectedMixture(merged);
                                                }}
                                                className="w-full relative group"
                                            >
                                                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#660033]/10 group-hover:bg-[#660033]/20 transition-all" />
                                                <div className="relative px-4 py-2.5 border-2 border-[#660033] bg-white flex items-center justify-center gap-2 group-active:translate-x-0.5 group-active:translate-y-0.5 transition-transform">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#660033]">
                                                        Add All Pantry Harvest
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* View Recipes Close Button */}
                            <div className="mt-8 pt-6 border-t border-[#660033]/10 flex justify-end">
                                <button
                                    onClick={() => setIsMixingBowlOpen(false)}
                                    className="relative group px-8 py-3.5 border-2 border-[#660033] bg-[#660033] text-[#fdfbf7] flex items-center justify-center transition-all group-active:translate-x-0.5 group-active:translate-y-0.5"
                                >
                                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black/10 group-hover:translate-x-2 group-hover:translate-y-2 transition-all" />
                                    <span className="relative text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        View Recipe Creations <ChevronRight size={14} />
                                    </span>
                                </button>
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
