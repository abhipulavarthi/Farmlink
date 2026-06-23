import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Sprout, ArrowLeft, Info, Thermometer, ShieldCheck, HeartPulse, 
    X, ThumbsUp, Leaf, CloudSun, Wind, Droplets, Sun, Moon, Calendar, 
    AlertTriangle, Image as ImageIcon, Plus, Trash2, Heart, MessageSquare, 
    PlusCircle, CheckCircle, BarChart3, CookingPot, Package, Users, 
    Sparkles, TrendingUp, Apple, User, BookOpen, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dynamic plant details decorator
const enrichPlant = (plant) => {
    const name = plant.name.toLowerCase();
    
    // Default enrichments
    const details = {
        scientificName: plant.officialName || `${plant.name} plantae`,
        description: plant.info || `A popular variety grown in home gardens. Highly productive and rich in nutrients.`,
        growingSeason: plant.growingSeason || "Spring to Summer",
        waterRequirement: plant.climate ? `Suited for ${plant.climate} climate. Moderate watering.` : "Moderate (1-1.5 inches per week)",
        sunlightRequirement: "Full Sun (6-8 hours daily)",
        soilType: "Well-drained, fertile soil, pH 6.0-7.0",
        fertilizerRecommendations: plant.prevention || "Apply balanced organic compost at planting, and nitrogen-rich fertilizer during early vegetative growth.",
        harvestPeriod: plant.growthTime || "60-80 days",
        companionPlants: "Marigolds, Basil, Garlic, Chives",
        commonPests: "Aphids, Spider Mites, Cutworms",
        commonDiseases: plant.diseases || "Root Rot, Powdery Mildew",
        growingTips: plant.howToPlant || "Water regularly at the base, avoid wetting the leaves."
    };

    // Specific enrichments for popular crops
    if (name.includes("tomato")) {
        return {
            ...plant,
            ...details,
            scientificName: "Solanum lycopersicum",
            growingSeason: "Spring to Autumn (Warm climate)",
            waterRequirement: "High (2 inches per week, keep soil evenly moist)",
            sunlightRequirement: "Full Sun (8+ hours daily)",
            soilType: "Deep, rich, well-draining loam, pH 6.2-6.8",
            fertilizerRecommendations: "Balanced fertilizer at planting, followed by high-potassium organic fertilizer after flower set.",
            harvestPeriod: "70-80 days (when fully colored and slightly soft)",
            companionPlants: "Basil, Marigolds, Carrots, Garlic, Asparagus",
            commonPests: "Tomato Hornworm, Whiteflies, Aphids, Spider Mites",
            growingTips: "Plant deep, burying up to 2/3 of the stem to grow a stronger root system. Provide a sturdy stake or cage, and water only at the base."
        };
    } else if (name.includes("carrot")) {
        return {
            ...plant,
            ...details,
            scientificName: "Daucus carota subsp. sativus",
            growingSeason: "Cool Season (Early Spring / Autumn)",
            waterRequirement: "Moderate (1 inch per week, keep moist during germination)",
            sunlightRequirement: "Full Sun to Partial Shade",
            soilType: "Loose, stone-free sandy soil, pH 6.0-6.8",
            fertilizerRecommendations: "Low nitrogen, high potassium/phosphorus. Too much nitrogen causes carrots to fork and grow excess foliage.",
            harvestPeriod: "65-75 days (when crown reaches 0.5-1 inch diameter)",
            companionPlants: "Lettuce, Radishes, Onions, Chives, Rosemary",
            commonPests: "Carrot Rust Fly, Nematodes, Wireworms",
            growingTips: "Ensure soil is dug deep and stones are removed so roots grow straight. Sow seeds directly and thin seedlings early to avoid crowding."
        };
    } else if (name.includes("potato")) {
        return {
            ...plant,
            ...details,
            scientificName: "Solanum tuberosum",
            growingSeason: "Spring to Summer",
            waterRequirement: "Moderate (Keep moist but never waterlogged)",
            sunlightRequirement: "Full Sun",
            soilType: "Loose, acidic, sandy-loam soil, pH 5.0-6.0",
            fertilizerRecommendations: "High organic compost. Side-dress with balanced organic fertilizer as plants grow.",
            harvestPeriod: "90-120 days (after vines die back for mature storage)",
            companionPlants: "Bush Beans, Corn, Cabbage, Marigolds, Horseradish",
            commonPests: "Colorado Potato Beetle, Aphids, Flea Beetles",
            growingTips: "Plant seed potatoes 4 inches deep. Hill soil up around the stems as they grow to prevent light from turning the tubers green and toxic."
        };
    } else if (name.includes("spinach")) {
        return {
            ...plant,
            ...details,
            scientificName: "Spinacia oleracea",
            growingSeason: "Autumn to Early Spring (Cold-hardy)",
            waterRequirement: "Moderate (Consistent moisture prevents bolting)",
            sunlightRequirement: "Full Sun to Light Shade",
            soilType: "Rich, moist, nitrogen-dense loam, pH 6.5-7.0",
            fertilizerRecommendations: "High nitrogen organic meal (blood meal or fish emulsion) every 3 weeks.",
            harvestPeriod: "35-45 days (harvest outer leaves individually or cut whole)",
            companionPlants: "Strawberries, Peas, Cabbage, Cauliflower, Radish",
            commonPests: "Leafminers, Slugs, Aphids",
            growingTips: "Plant in cool weather. Once temperatures exceed 25°C, spinach will bolt (go to seed) and become bitter. Provide shade if warm."
        };
    } else if (name.includes("onion")) {
        return {
            ...plant,
            ...details,
            scientificName: "Allium cepa",
            growingSeason: "Autumn (for over-wintering) or early Spring",
            waterRequirement: "Low to Moderate (1 inch per week, dry out before harvest)",
            sunlightRequirement: "Full Sun",
            soilType: "Loose, well-draining soil, pH 6.0-6.8",
            fertilizerRecommendations: "Heavy nitrogen feeder in early stages. Stop fertilizing once bulbs start to swell.",
            harvestPeriod: "100-120 days (when leaves turn yellow and fall over)",
            companionPlants: "Carrots, Beets, Lettuce, Cabbage, Chamomile",
            commonPests: "Onion Thrips, Onion Maggot",
            growingTips: "Keep beds weed-free as onions have shallow roots and compete poorly. Let bulb tops show above ground as they mature."
        };
    } else if (name.includes("strawberry")) {
        return {
            ...plant,
            ...details,
            scientificName: "Fragaria x ananassa",
            growingSeason: "Perennial (Fruits Spring to Summer)",
            waterRequirement: "High (1-2 inches per week, keep crown dry)",
            sunlightRequirement: "Full Sun (6-8 hours minimum)",
            soilType: "Sandy-loam, slightly acidic, pH 5.5-6.5",
            fertilizerRecommendations: "Balanced fertilizer in early spring, and organic compost after harvest is complete.",
            harvestPeriod: "Spring to Summer (when fully red and fragrant)",
            companionPlants: "Beans, Spinach, Borage, Thyme, Onions",
            commonPests: "Slugs, Birds, Tarnished Plant Bug",
            growingTips: "Plant so that the crown is level with the soil surface. Use straw mulch to keep berries off the wet soil, preventing rot."
        };
    }

    return { ...plant, ...details };
};

// Companion Guide Data
const companionGuideData = {
    "Tomato": {
        companions: ["Basil", "Marigolds", "Carrots", "Garlic", "Asparagus"],
        avoid: ["Potatoes", "Fennel", "Cabbage", "Broccoli", "Corn"],
        benefits: "Basil improves tomato flavor and repels flies/mosquitoes. Marigolds emit root substances that repel nematodes and insects.",
        spacing: "24 - 36 inches",
        advice: "Interplant marigolds between tomato rows, and plant basil at the base of cages to maximize space and pest defense."
    },
    "Carrot": {
        companions: ["Lettuce", "Radishes", "Chives", "Onions", "Rosemary"],
        avoid: ["Fennel", "Dill", "Parsnips"],
        benefits: "Onions and chives repel the carrot rust fly. Radishes help break up compacted soil for carrot root expansion.",
        spacing: "2 - 3 inches (after thinning)",
        advice: "Sow radish seeds alongside carrots. Radishes grow quickly and are harvested before carrots need the space."
    },
    "Potato": {
        companions: ["Beans", "Cabbage", "Corn", "Horseradish", "Marigolds"],
        avoid: ["Tomatoes", "Cucumbers", "Sunflowers", "Pumpkins", "Raspberries"],
        benefits: "Beans deter the potato beetle and add nitrogen to the soil. Horseradish increases disease resistance.",
        spacing: "12 inches",
        advice: "Avoid planting potatoes in the same soil nightshades occupied recently to prevent soil blight accumulation."
    },
    "Onion": {
        companions: ["Carrots", "Beets", "Lettuce", "Cabbage", "Chamomile"],
        avoid: ["Beans", "Peas", "Sage", "Asparagus"],
        benefits: "Deters aphids, weevils, and rabbits from eating leafy greens. Chamomile enhances growth and flavor.",
        spacing: "3 - 4 inches",
        advice: "Never plant onions near pole/bush beans as sulfur secretions from onions stunt nitrogen-fixing nodules in legumes."
    },
    "Spinach": {
        companions: ["Strawberries", "Peas", "Cabbage", "Cauliflower", "Radish"],
        avoid: ["Fennel", "Potatoes"],
        benefits: "Peas provide light shade during warm afternoons, extending the leafy greens' harvesting season.",
        spacing: "4 - 6 inches",
        advice: "Plant spinach in the shadows of taller climbing crops like peas or tomatoes to shield them from high noon heat."
    },
    "Strawberry": {
        companions: ["Bush Beans", "Borage", "Spinach", "Thyme", "Onions"],
        avoid: ["Cabbage", "Broccoli", "Cauliflower", "Potatoes", "Tomatoes"],
        benefits: "Borage attracts bees for pollination and improves soil trace minerals. Thyme suppresses weeds.",
        spacing: "12 - 18 inches",
        advice: "Mulch with clean pine needles or straw to keep the soil acidic, suppress weeds, and keep berries clean."
    }
};

// Plant Doctor Diseases Data
const plantDoctorDiseases = {
    "tomato_early_blight": {
        diseaseName: "Early Blight (Alternaria solani)",
        confidence: "94%",
        symptoms: "Target-like dark brown spots with concentric rings on older leaves first. Leaves turn yellow and drop off. Can also affect stems and fruit.",
        causes: "Fungal pathogen that overwinter in plant debris and soil. Spreads via splashing rain, overhead watering, and wind in warm, humid weather.",
        organicTreatment: "Spray organic copper-based fungicide or neem oil. Remove and destroy infected lower leaves. Apply organic compost tea to boost plant immunity.",
        chemicalTreatment: "Apply fungicides containing chlorothalonil, mancozeb, or difenoconazole according to package directions.",
        prevention: "Prune lower branches to keep them off the soil. Mulch heavily around tomato bases. Rotate crops (do not plant nightshades in the same spot for 3 years). Avoid overhead watering; use drip lines.",
        careInstructions: "Water early in the day. Ensure spacing of 2-3 feet between plants to maximize airflow."
    },
    "rose_powdery_mildew": {
        diseaseName: "Powdery Mildew (Podosphaera pannosa)",
        confidence: "91%",
        symptoms: "White, powdery fungal growth on the surfaces of leaves, stems, and flower buds. Leaves may distort, curl, and fall prematurely.",
        causes: "Fungal spores that thrive in warm, dry days and cool, humid nights. Spreads easily by wind. Shady conditions favor its development.",
        organicTreatment: "Spray a mixture of 1 tbsp baking soda and 1 tsp liquid soap in 1 gallon of water. Alternatively, spray diluted milk (1 part milk, 9 parts water) in bright sunlight.",
        chemicalTreatment: "Apply systemic fungicides containing myclobutanil, triforine, or sulfur-based sprays.",
        prevention: "Plant resistant rose cultivars. Place roses in full sun (6+ hours). Prune to open up the center of the bush for high air circulation.",
        careInstructions: "Prune off and discard heavily infected foliage. Clean shears with rubbing alcohol between cuts."
    },
    "cucumber_spider_mites": {
        diseaseName: "Spider Mite Infestation (Tetranychidae)",
        confidence: "88%",
        symptoms: "Fine white speckling or stippling on the upper leaf surface. Fine webbing on the undersides of leaves and stems. Leaves turn yellow, bronze, and dry up.",
        causes: "Very tiny arachnids that thrive in hot, dry, and dusty conditions. They multiply rapidly and suck plant sap.",
        organicTreatment: "Spray the undersides of leaves with a strong blast of water to knock them off. Apply insecticidal soap, neem oil, or horticultural oils. Release predatory mites (Phytoseiulus persimilis).",
        chemicalTreatment: "Use miticides containing abamectin or bifenthrin. Avoid broad-spectrum insecticides which kill natural predators.",
        prevention: "Keep plants well-watered (stressed plants are more susceptible). Hose down dusty paths near the garden. Mulch to maintain humidity around the plant base.",
        careInstructions: "Check leaf undersides regularly, especially during dry hot summer months. Isolate infested plants immediately."
    },
    "rice_blast": {
        diseaseName: "Rice Blast (Magnaporthe oryzae)",
        confidence: "93%",
        symptoms: "Spindle-shaped spots on leaves with reddish-brown margins and gray centers. Can cause neck rot where the seed head collapses.",
        causes: "Fungal pathogen spreading rapidly in high humidity, warm temperature, and high nitrogen conditions.",
        organicTreatment: "Spray Pseudomonas fluorescens or Neem oil. Treat seeds with biological agents before sowing.",
        chemicalTreatment: "Apply Carbendazim 50% WP at 500g/ha or Tricyclazole 75% WP at 300g/ha.",
        prevention: "Avoid excess nitrogen fertilizer. Use resistant rice varieties. Destruct infected crop residue after harvest.",
        careInstructions: "Maintain a proper water level of 5cm in the field. Ensure adequate spacing."
    },
    "wheat_rust": {
        diseaseName: "Wheat Rust (Puccinia graminis)",
        confidence: "92%",
        symptoms: "Orange-brown pustules on leaves and stems. Powdery spores rub off on fingers, leaving rust-like stains.",
        causes: "Windborne fungal spores that thrive in cool, moist, and humid weather conditions.",
        organicTreatment: "Use compost tea sprays or sulphur-based organic dust. Grow rust-resistant crop varieties.",
        chemicalTreatment: "Foliar spray of Propiconazole (Tilt 25 EC) at 500 ml/ha at first appearance of rust.",
        prevention: "Eradicate barberry bushes (alternate host). Sowing at the optimum time (early November). Avoid overhead irrigation.",
        careInstructions: "Monitor the field regularly in late winter/early spring. Space rows at 22.5cm."
    },
    "maize_shoot_fly": {
        diseaseName: "Maize Shoot Fly (Atherigona soccata)",
        confidence: "89%",
        symptoms: "Wilting and drying of the central leaf (known as 'dead heart') in young seedlings. Smelly rotting stem bases.",
        causes: "A small grey fly that lays eggs on the leaves of young maize plants; larvae tunnel into the stem.",
        organicTreatment: "Apply Neem Seed Kernel Extract (NSKE) 5%. Release natural egg parasitoids (Trichogramma spp.).",
        chemicalTreatment: "Apply Carbofuran 3G at 33 kg/ha or spray Chlorpyriphos at sowing.",
        prevention: "Sow early (within 10 days of monsoon onset). Use higher seed rate and thin out infected seedlings at 20 DAS.",
        careInstructions: "Clean weed hosts around the crop border. Apply balanced N:150, P:75, K:75 kg/ha fertilizer."
    },
    "chickpea_pod_borer": {
        diseaseName: "Chickpea Pod Borer (Helicoverpa armigera)",
        confidence: "90%",
        symptoms: "Round holes chewed in pods. Larvae feeding on seeds inside. Defoliation of young leaves and flower buds.",
        causes: "Voracious moth caterpillars active during the pod initiation stage under warm temperatures.",
        organicTreatment: "Spray Nuclear Polyhedrosis Virus (NPV) at 250 LE/ha or Neem Seed Kernel Extract (NSKE) 5%. Set up pheromone traps.",
        chemicalTreatment: "Spray Indoxacarb 14.5% SC or Spinosad 45% SC according to package directions.",
        prevention: "Intercrop with mustard or linseed. Install bird perches (50/ha) to attract natural predatory birds. Sow early in October.",
        careInstructions: "Monitor flowers weekly. Shake plants onto a cloth to collect and destroy caterpillars manually."
    },
    "cotton_bollworm": {
        diseaseName: "Cotton Bollworm (Helicoverpa armigera)",
        confidence: "91%",
        symptoms: "Bored holes in bolls, squares, and flowers. Yellowing and premature shedding of squares and bolls. Fecal pellets around bored holes.",
        causes: "Caterpillars of the Helicoverpa moth hatching from eggs laid on tender cotton terminals.",
        organicTreatment: "Release Trichogramma egg parasitoids. Apply Neem oil 1% or Bacillus thuringiensis (Bt) formulations.",
        chemicalTreatment: "Apply Emamectin Benzoate 5% SG or Chlorantraniliprole 18.5% SC.",
        prevention: "Grow Bt-cotton cultivars. Crop rotation. Set up 5-10 pheromone traps per hectare.",
        careInstructions: "Deep summer ploughing to expose hibernating pupae to sun and birds."
    }
};

// Seasonal Plant Guide Data
const seasonalGuideData = {
    "India": {
        "Karnataka": {
            "June": {
                vegetables: ["Tomato", "Chili", "Brinjal", "Ladyfinger (Okra)", "French Beans"],
                fruits: ["Mango", "Papaya", "Banana", "Guava"],
                herbs: ["Coriander", "Mint", "Basil", "Lemongrass"],
                flowers: ["Marigold", "Jasmine", "Chrysanthemum"],
                plantingCalendar: "Sow seeds of nightshades in nurseries early in June. Transplant seedlings late June after monsoon rains start.",
                harvestCalendar: "Harvest leafy greens, summer squash, and early chili varieties sown in April.",
                waterRequirements: "Moderate to high. Adjust watering based on monsoon rainfall.",
                tempRequirements: "24°C - 32°C",
                growingTips: "Ensure excellent drainage in garden beds to prevent root rot from heavy monsoon showers. Spray neem oil weekly."
            },
            "December": {
                vegetables: ["Carrots", "Beetroot", "Radish", "Cabbage", "Cauliflower", "Spinach"],
                fruits: ["Grapes", "Pomegranate", "Custard Apple", "Banana"],
                herbs: ["Dill", "Fenugreek", "Coriander", "Parsley"],
                flowers: ["Rose", "Dahlia", "Petunia", "Aster"],
                plantingCalendar: "Direct sow root vegetables. Plant cool-season brassicas.",
                harvestCalendar: "Harvest sweet potatoes, winter squash, and early cabbage heads.",
                waterRequirements: "Low to moderate. Water in the morning once every 3-4 days.",
                tempRequirements: "15°C - 28°C",
                growingTips: "Excellent time for root crops. Keep soil loose and free of stones. Mulch to retain morning moisture."
            }
        },
        "Maharashtra": {
            "June": {
                vegetables: ["Onions", "Okra", "Bitter Gourd", "Cluster Beans"],
                fruits: ["Pomegranate", "Figs", "Custard Apple"],
                herbs: ["Fenugreek", "Coriander"],
                flowers: ["Marigold", "Hibiscus"],
                plantingCalendar: "Sow kharif crops like onion seeds in nurseries. Direct sow gourds.",
                harvestCalendar: "Harvest late mango cultivars and citrus fruits.",
                waterRequirements: "High. Water deeply during dry spells between monsoon bands.",
                tempRequirements: "26°C - 34°C",
                growingTips: "Mound up soil around base of gourd vines to prevent water pooling on main roots."
            }
        }
    },
    "USA": {
        "California": {
            "June": {
                vegetables: ["Tomato", "Bell Pepper", "Zucchini", "Cucumber", "Sweet Corn", "Green Beans"],
                fruits: ["Strawberries", "Peaches", "Plums", "Figs"],
                herbs: ["Basil", "Rosemary", "Thyme", "Oregano"],
                flowers: ["Sunflower", "Zinnia", "Marigold", "Lavender"],
                plantingCalendar: "Direct sow beans, corn, squash. Transplant warm-season peppers and eggplants.",
                harvestCalendar: "Harvest early tomatoes, berries, lettuce, and radishes.",
                waterRequirements: "High. Water deeply in the early morning to combat summer evaporation.",
                tempRequirements: "18°C - 30°C",
                growingTips: "Apply a 2-inch layer of organic mulch around plants to cool the soil and conserve water. Install drip irrigation."
            },
            "December": {
                vegetables: ["Kale", "Spinach", "Broccoli", "Brussels Sprouts", "Garlic", "Onions"],
                fruits: ["Lemons", "Oranges", "Grapefruit"],
                herbs: ["Cilantro", "Parsley", "Chives"],
                flowers: ["Pansies", "Cyclamen", "Ornamental Kale"],
                plantingCalendar: "Plant garlic cloves and onion sets. Sow winter cover crops like fava beans.",
                harvestCalendar: "Harvest kale, carrots, citrus fruits, and winter brassicas.",
                waterRequirements: "Very low. Rely on seasonal winter rains. Water only if dry for 10+ days.",
                tempRequirements: "5°C - 15°C",
                growingTips: "Protect tender plants from occasional frost nights using frost cloths. Avoid soil compaction by not working in wet mud."
            }
        }
    }
};

// Default Fallback Seasonal Guide Builder
const getFallbackSeasonalGuide = (country, state, month) => {
    return {
        vegetables: ["Lettuce", "Spinach", "Radishes", "Carrots", "Beans"],
        fruits: ["Berries", "Melons"],
        herbs: ["Basil", "Parsley", "Chives"],
        flowers: ["Marigolds", "Cosmos", "Petunias"],
        plantingCalendar: `Ideal time for seed propagation of seasonal varieties in ${state || country}.`,
        harvestCalendar: "Harvest mature leafy greens and fast-growing root vegetables.",
        waterRequirements: "Moderate. Keep soil consistently damp.",
        tempRequirements: "15°C - 25°C",
        growingTips: "Monitor soil moisture regularly. Apply organic liquid feed every 2 weeks to maximize yields."
    };
};

const indianSeasonalGuideData = {
    "January": {
        vegetables: ["Potato", "Tomato", "Bottle Gourd (Lauki)", "Radish"],
        fruits: ["Grapes", "Watermelon", "Muskmelon", "Apple"],
        herbs: [],
        grains: [],
        cash_crops: ["Sunflower"],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Direct sow root crops like Radish and Potato. Sowing watermelon and muskmelon in warmer pockets.",
        harvestCalendar: "Harvest winter brassicas (Cabbage, Cauliflower), Pigeon Peas, Black Gram, and Coffee.",
        waterRequirements: "Low to Moderate. Water once every 3-4 days in morning.",
        tempRequirements: "12°C - 24°C",
        growingTips: "Protect young seedlings from cold night frost. Keep soil loose around root zones for better expansion."
    },
    "February": {
        vegetables: ["Sweet Potato", "Potato", "Tomato", "Bitter Gourd (Karela)", "Lady Finger (Okra/Bhindi)", "Bottle Gourd (Lauki)", "Pumpkin", "Cucumber", "Radish"],
        fruits: ["Pomegranate", "Banana", "Grapes", "Watermelon", "Muskmelon", "Apple", "Orange", "Papaya"],
        herbs: [],
        grains: ["Maize (Corn)", "Kidney Beans (Rajma)", "Mung Bean (Green Gram/Moong)"],
        cash_crops: ["Sunflower"],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Sow warm-season crops: Okra, Bitter Gourd, Bottle Gourd, Maize, and Mung Bean.",
        harvestCalendar: "Harvest Potatoes, Chickpeas, Lentils, and Sunflower.",
        waterRequirements: "Moderate. Irrigate as temperatures begin to rise.",
        tempRequirements: "18°C - 28°C",
        growingTips: "Foliar spray of 2% urea on late crops helps. Sowing summer cucurbits on raised beds is recommended."
    },
    "March": {
        vegetables: ["Sweet Potato", "Cabbage", "Bitter Gourd (Karela)", "Lady Finger (Okra/Bhindi)", "Bottle Gourd (Lauki)", "Pumpkin", "Cauliflower", "Cucumber"],
        fruits: ["Pomegranate", "Banana", "Muskmelon", "Orange", "Papaya"],
        herbs: [],
        grains: ["Maize (Corn)", "Kidney Beans (Rajma)", "Mung Bean (Green Gram/Moong)"],
        cash_crops: ["Jute"],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Sow Jute, Cabbage, Bitter Gourd, Okra, Cucumber, and Melons.",
        harvestCalendar: "Peak harvest for Rabi crops: Wheat, Barley, Chickpea, Lentil, Grapes, and Mustard.",
        waterRequirements: "Moderate to High. Adjust irrigation interval to 2-3 days.",
        tempRequirements: "22°C - 34°C",
        growingTips: "Mulch beds to reduce water evaporation. Check for aphids on fresh summer sprouts."
    },
    "April": {
        vegetables: ["Cabbage", "Pumpkin", "Cauliflower"],
        fruits: [],
        herbs: [],
        grains: [],
        cash_crops: ["Jute"],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Sow Jute and summer brassicas. Keep beds ready for pre-monsoon crops.",
        harvestCalendar: "Harvest Rice, Mung Bean, Wheat, Barley, Onions, and Garlic.",
        waterRequirements: "High. Dry wind increases evaporation; water in early morning.",
        tempRequirements: "26°C - 38°C",
        growingTips: "Water plants deeply. Cover delicate crops with light green shade nets to protect from midday heat."
    },
    "May": {
        vegetables: ["Cabbage"],
        fruits: ["Pineapple"],
        herbs: ["Turmeric"],
        grains: [],
        cash_crops: ["Cotton", "Jute"],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Sow pre-monsoon Cotton, Jute, and Turmeric. Prepare nurseries for paddy seedlings.",
        harvestCalendar: "Harvest Mangoes, Watermelons, Muskmelons, Jackfruit, and summer vegetables.",
        waterRequirements: "Very High. Irrigate daily or twice daily in extreme dry areas.",
        tempRequirements: "30°C - 42°C",
        growingTips: "Deep summer ploughing to expose soil pathogens to sun. Keep basins around trees clean for irrigation."
    },
    "June": {
        vegetables: ["Onion", "Tomato", "Brinjal (Eggplant)", "Bitter Gourd (Karela)", "Lady Finger (Okra/Bhindi)", "Bottle Gourd (Lauki)", "Pumpkin", "Cucumber", "Drumstick (Moringa)"],
        fruits: ["Mango", "Orange", "Coconut", "Pineapple", "Jackfruit"],
        herbs: ["Turmeric", "Cardamom", "Black Pepper"],
        grains: ["Rice", "Maize (Corn)", "Pigeon Peas (Tur/Arhar)", "Soybean (Soyabean)", "Jowar (Sorghum)", "Ragi (Finger Millet)", "Horse Gram"],
        cash_crops: ["Cotton", "Coffee", "Sunflower"],
        flowers: ["Marigold", "Jasmine", "Rose", "Chrysanthemum"],
        plantingCalendar: "Monsoon onset sowing: Rice, Maize, Pigeon Peas, Soybean, Jowar, Cotton, and Gourds.",
        harvestCalendar: "Harvest summer sweet potatoes, early mangoes, and spring-sown vegetables.",
        waterRequirements: "Dependent on monsoon rain. Provide supplemental irrigation during dry spell.",
        tempRequirements: "26°C - 34°C",
        growingTips: "Ensure excellent drainage in garden beds to prevent waterlogging. Apply Trichoderma to prevent root rot."
    },
    "July": {
        vegetables: ["Sweet Potato", "Onion", "Tomato", "Brinjal (Eggplant)", "Bitter Gourd (Karela)", "Lady Finger (Okra/Bhindi)", "Bottle Gourd (Lauki)", "Pumpkin", "Cucumber", "Drumstick (Moringa)"],
        fruits: ["Pomegranate", "Mango", "Orange", "Coconut", "Pineapple", "Jackfruit"],
        herbs: ["Cardamom", "Black Pepper"],
        grains: ["Rice", "Maize (Corn)", "Pigeon Peas (Tur/Arhar)", "Moth Beans", "Mung Bean (Green Gram/Moong)", "Black Gram (Urad)", "Soybean (Soyabean)", "Jowar (Sorghum)", "Ragi (Finger Millet)", "Horse Gram"],
        cash_crops: ["Coffee", "Sunflower"],
        flowers: ["Marigold", "Jasmine", "Rose", "Chrysanthemum"],
        plantingCalendar: "Monsoon peak sowing: Rice, Maize, Pigeon Peas, Moth Beans, Urad, Moong, and Millets.",
        harvestCalendar: "Harvest early summer fruits: Mangoes, Pomegranates, Pineapples, and Jackfruits.",
        waterRequirements: "Low to Moderate. Avoid watering during heavy showers. Ensure drainage paths are clear.",
        tempRequirements: "24°C - 32°C",
        growingTips: "Control weeds quickly as they compete for nutrients. Spray neem oil to combat monsoon pests."
    },
    "August": {
        vegetables: ["Sweet Potato"],
        fruits: ["Pomegranate"],
        herbs: [],
        grains: ["Moth Beans"],
        cash_crops: [],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Plant late-season Sweet Potato and Pomegranate. Sow late Kharif pulse varieties.",
        harvestCalendar: "Harvest Bitter Gourd, Okra, Bottle Gourd, Cucumber, and early Monsoonal grains.",
        waterRequirements: "Low. Keep soil moist; watch out for heavy rain logging.",
        tempRequirements: "24°C - 30°C",
        growingTips: "Clean drainage blockages. Stake tall crops like maize to prevent them from falling in high winds."
    },
    "September": {
        vegetables: ["Cabbage", "Cauliflower", "Radish"],
        fruits: ["Banana", "Papaya"],
        herbs: [],
        grains: ["Jowar (Sorghum)", "Ragi (Finger Millet)", "Horse Gram"],
        cash_crops: [],
        flowers: ["Sunflower", "Marigold", "Hibiscus"],
        plantingCalendar: "Sow Cabbage, Cauliflower, Radish, and Rabi Jowar / Ragi.",
        harvestCalendar: "Harvest Maize, Moong, Urad, Soybeans, Jute, and early gourds.",
        waterRequirements: "Moderate. Maintain uniform soil moisture.",
        tempRequirements: "24°C - 32°C",
        growingTips: "Start preparation of nurseries for Rabi vegetables. Clear residual weeds from summer crop harvest."
    },
    "October": {
        vegetables: ["Potato", "Onion", "Cabbage", "Tomato", "Brinjal (Eggplant)", "Garlic", "Cauliflower", "Radish"],
        fruits: ["Banana", "Papaya"],
        herbs: ["Coriander (Dhania)"],
        grains: ["Rice", "Maize (Corn)", "Chickpea (Gram)", "Kidney Beans (Rajma)", "Mung Bean (Green Gram/Moong)", "Black Gram (Urad)", "Lentil (Masoor)", "Barley", "Jowar (Sorghum)", "Ragi (Finger Millet)", "Horse Gram"],
        cash_crops: ["Sunflower", "Rapeseed (Sarson)"],
        flowers: ["Marigold", "Jasmine", "Rose", "Chrysanthemum"],
        plantingCalendar: "Sow Rabi crops: Wheat, Chickpea, Lentil, Potato, Onion, Garlic, Barley, and Rapeseed.",
        harvestCalendar: "Harvest Rice, Maize, Soybeans, Cotton, Sunflower, and Kharif millets.",
        waterRequirements: "Moderate. Water morning time.",
        tempRequirements: "20°C - 30°C",
        growingTips: "Excellent time for root vegetables. Sowing pulse crops after rice harvest utilizes residual moisture."
    },
    "November": {
        vegetables: ["Potato", "Onion", "Cabbage", "Tomato", "Brinjal (Eggplant)", "Garlic", "Cauliflower", "Radish"],
        fruits: ["Watermelon", "Muskmelon"],
        herbs: ["Coriander (Dhania)"],
        grains: ["Rice", "Maize (Corn)", "Chickpea (Gram)", "Kidney Beans (Rajma)", "Lentil (Masoor)", "Barley", "Wheat"],
        cash_crops: ["Sunflower", "Rapeseed (Sarson)"],
        flowers: ["Marigold", "Jasmine", "Rose", "Chrysanthemum"],
        plantingCalendar: "Timely sowing of Wheat, Barley, Chickpea, Lentil, Potato, and Onion sets.",
        harvestCalendar: "Harvest late Rice, Pigeon Peas, Cotton, Coffee, and autumn sugarcane.",
        waterRequirements: "Low to Moderate. Water once in 4-5 days.",
        tempRequirements: "15°C - 26°C",
        growingTips: "Ensure phosphorus application at sowing. Keep soil friable around potato hills."
    },
    "December": {
        vegetables: ["Onion", "Radish"],
        fruits: ["Watermelon", "Muskmelon"],
        herbs: [],
        grains: [],
        cash_crops: [],
        flowers: ["Marigold", "Jasmine", "Rose", "Chrysanthemum"],
        plantingCalendar: "Late sowing of Wheat (in plains) and winter Radish, Onion.",
        harvestCalendar: "Harvest winter Cabbage, Cauliflower, Drumstick, Cardamom, and Black Pepper.",
        waterRequirements: "Low. Rely on winter showers if available. Water only if soil top 2 inches dry.",
        tempRequirements: "12°C - 24°C",
        growingTips: "Mulch heavily to conserve soil warmth. Collect fallen leaves to make organic compost."
    }
};

const getIndianSeasonalGuide = (state, month) => {
    const data = indianSeasonalGuideData[month];
    if (!data) return getFallbackSeasonalGuide('India', state, month);
    
    // Customize based on state temperature profile if needed
    const isSouthIndia = ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh"].includes(state);
    const isNorthIndia = ["Punjab", "Uttar Pradesh"].includes(state);
    
    let tempRequirements = data.tempRequirements;
    let growingTips = data.growingTips;
    
    if (month === "June" || month === "July" || month === "August" || month === "September") {
        tempRequirements = isSouthIndia ? "22°C - 30°C" : "25°C - 35°C";
    } else if (month === "October" || month === "November" || month === "December" || month === "January" || month === "February") {
        tempRequirements = isNorthIndia ? "8°C - 22°C (Cold/Frost risk)" : "15°C - 28°C (Mild winter)";
        if (isNorthIndia) {
            growingTips = "Protect young seedlings from cold night frost using mulch or cloches. Keep soil loose around root vegetables. " + data.growingTips;
        }
    }
    
    return {
        ...data,
        tempRequirements,
        growingTips
    };
};

export default function Planting() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('discover'); // discover, garden, doctor, seasonal, companion, harvest, kitchen, noticeboard, analytics
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryTab, setActiveCategoryTab] = useState('All');
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [visiblePlantsCount, setVisiblePlantsCount] = useState(24);

    // Garden State
    const [gardenPlants, setGardenPlants] = useState(() => {
        const saved = localStorage.getItem('garden_plants');
        if (saved) return JSON.parse(saved);
        // Pre-populate with a few starting plants
        return [
            { id: 1, plantId: 1, name: "Tomato", category: "Vegetable", datePlanted: "2026-05-15", quantity: 3, growthStage: "Flowering", lastWatered: "2026-06-20T08:00:00.000Z", lastFertilized: "2026-06-10T08:00:00.000Z", healthStatus: "Healthy" },
            { id: 2, plantId: 2, name: "Carrot", category: "Vegetable", datePlanted: "2026-05-28", quantity: 20, growthStage: "Vegetative", lastWatered: "2026-06-20T08:30:00.000Z", lastFertilized: "2026-05-28T08:30:00.000Z", healthStatus: "Needs Fertilizer" },
            { id: 3, plantId: 56, name: "Grape", category: "Fruit", datePlanted: "2025-03-10", quantity: 1, growthStage: "Fruiting", lastWatered: "2026-06-19T09:00:00.000Z", lastFertilized: "2026-06-01T09:00:00.000Z", healthStatus: "Healthy" }
        ];
    });

    // Harvest State
    const [harvestRecords, setHarvestRecords] = useState(() => {
        const saved = localStorage.getItem('farm_harvests');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: "Tomato", quantity: 4.5, unit: "kg", date: "2026-06-15", quality: "Excellent", notes: "First harvest from front bed. Super juicy!" },
            { id: 2, name: "Spinach", quantity: 2, unit: "kg", date: "2026-06-10", quality: "Good", notes: "Slight leafminer damage on outer leaves, but interior was pristine." }
        ];
    });

    // Storage/Pantry State
    const [pantryInventory, setPantryInventory] = useState(() => {
        const saved = localStorage.getItem('pantry_ingredients');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: "Tomatoes", quantity: 3.5, unit: "kg", dateStored: "2026-06-15", expiryDays: 5 },
            { id: 2, name: "Spinach", quantity: 1.2, unit: "kg", dateStored: "2026-06-10", expiryDays: 2 },
            { id: 3, name: "Carrots", quantity: 2.0, unit: "kg", dateStored: "2026-06-18", expiryDays: 14 }
        ];
    });

    // Weather Simulation
    const [weatherScenario, setWeatherScenario] = useState('Perfect Spring');
    const weatherData = {
        'Perfect Spring': { temp: 22, humidity: 55, wind: 12, rainProb: 10, sunrise: "06:05 AM", sunset: "07:15 PM", icon: "🌤️" },
        'Heavy Rain': { temp: 17, humidity: 95, wind: 24, rainProb: 95, sunrise: "06:08 AM", sunset: "07:12 PM", icon: "🌧️" },
        'Sunny Heat Wave': { temp: 37, humidity: 25, wind: 8, rainProb: 0, sunrise: "05:58 AM", sunset: "07:22 PM", icon: "☀️" },
        'Frosty Morning': { temp: 2, humidity: 40, wind: 15, rainProb: 5, sunrise: "06:30 AM", sunset: "06:45 PM", icon: "❄️" }
    };

    // Plant Doctor State
    const [uploadedLeaf, setUploadedLeaf] = useState(null);
    const [doctorDiagnosis, setDoctorDiagnosis] = useState(null);
    const [doctorLoading, setDoctorLoading] = useState(false);

    // Seasonal Guide State
    const [seasonalCountry, setSeasonalCountry] = useState('India');
    const [seasonalState, setSeasonalState] = useState('');
    const [seasonalMonth, setSeasonalMonth] = useState('June');

    // Companion Guide Lookup
    const [companionLookup, setCompanionLookup] = useState('Tomato');

    // Nutrition State
    const [nutritionProgress, setNutritionProgress] = useState(() => {
        const saved = localStorage.getItem('nutrition_progress');
        if (saved) return JSON.parse(saved);
        return { calories: 850, vitaminC: 45, calcium: 300, iron: 5, fiber: 12 };
    });

    // Noticeboard / Community state
    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('garden_posts');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                author: "Nandini Rao",
                date: "2026-06-20",
                title: "Tomato Blight Alert",
                tag: "Help",
                content: "Spotted dark rings on my lower tomato leaves after the rain last night. Is this early blight? Should I trim the leaves or spray neem oil immediately?",
                likes: 8,
                liked: false,
                comments: [
                    { id: 1, author: "Rahul K.", text: "Def Early Blight. Trim those lower leaves off today. Clean shears with alcohol so it doesn't spread." }
                ]
            },
            {
                id: 2,
                author: "Amit Patel",
                date: "2026-06-18",
                title: "Companion Success!",
                tag: "Tips",
                content: "Planting marigolds with my eggplant crops worked wonders this year. Beetles completely ignored my eggplants, while last year they shredded them! Highly recommend.",
                likes: 15,
                liked: false,
                comments: []
            }
        ];
    });

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTag, setNewPostTag] = useState('Tips');

    // Save states to localStorage
    useEffect(() => {
        localStorage.setItem('garden_plants', JSON.stringify(gardenPlants));
    }, [gardenPlants]);

    useEffect(() => {
        localStorage.setItem('farm_harvests', JSON.stringify(harvestRecords));
    }, [harvestRecords]);

    useEffect(() => {
        localStorage.setItem('pantry_ingredients', JSON.stringify(pantryInventory));
    }, [pantryInventory]);

    useEffect(() => {
        localStorage.setItem('nutrition_progress', JSON.stringify(nutritionProgress));
    }, [nutritionProgress]);

    useEffect(() => {
        localStorage.setItem('garden_posts', JSON.stringify(posts));
    }, [posts]);

    const [originalPlantData, setOriginalPlantData] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        fetch(`${apiUrl}/api/plants`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOriginalPlantData(data);
                }
            })
            .catch(err => {
                console.error("Error fetching plants from backend:", err);
            });
    }, []);

    // Decorate plants dynamically
    const enrichedPlants = useMemo(() => {
        return originalPlantData.map(p => enrichPlant(p));
    }, [originalPlantData]);

    // Filtered plants for Discover tab
    const filteredPlantsList = useMemo(() => {
        return enrichedPlants.filter(plant => {
            const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plant.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategoryTab === 'All' || plant.category === activeCategoryTab;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategoryTab, enrichedPlants]);

    useEffect(() => {
        setVisiblePlantsCount(24);
    }, [searchQuery, activeCategoryTab]);

    // Handle adding plant to garden
    const [plantQuantityInput, setPlantQuantityInput] = useState(1);
    const [isPlantingModalOpen, setIsPlantingModalOpen] = useState(false);
    const [plantToPlant, setPlantToPlant] = useState(null);

    const handlePlantCrop = () => {
        if (!plantToPlant) return;
        const newPlant = {
            id: Date.now(),
            plantId: plantToPlant.id,
            name: plantToPlant.name,
            category: plantToPlant.category,
            datePlanted: new Date().toISOString().split('T')[0],
            quantity: parseInt(plantQuantityInput) || 1,
            growthStage: "Seed",
            lastWatered: new Date().toISOString(),
            lastFertilized: new Date().toISOString(),
            healthStatus: "Healthy"
        };
        setGardenPlants([newPlant, ...gardenPlants]);
        setIsPlantingModalOpen(false);
        setPlantToPlant(null);
        setActiveTab('garden');
    };

    // Log Garden Action
    const logGardenAction = (id, action) => {
        setGardenPlants(prev => prev.map(p => {
            if (p.id === id) {
                if (action === 'water') {
                    return { ...p, lastWatered: new Date().toISOString(), healthStatus: p.healthStatus === 'Needs Water' ? 'Healthy' : p.healthStatus };
                } else if (action === 'fertilize') {
                    return { ...p, lastFertilized: new Date().toISOString(), healthStatus: p.healthStatus === 'Needs Fertilizer' ? 'Healthy' : p.healthStatus };
                } else if (action === 'check') {
                    const statuses = ['Healthy', 'Needs Water', 'Needs Fertilizer'];
                    const nextStatus = statuses[(statuses.indexOf(p.healthStatus) + 1) % statuses.length];
                    return { ...p, healthStatus: nextStatus };
                }
            }
            return p;
        }));
    };

    // Update Growth Stage
    const updateGrowthStage = (id, newStage) => {
        setGardenPlants(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, growthStage: newStage };
            }
            return p;
        }));
    };

    // Remove garden plant
    const removeGardenPlant = (id) => {
        setGardenPlants(prev => prev.filter(p => p.id !== id));
    };

    // Harvest crop action
    const [harvestCropInput, setHarvestCropInput] = useState(null);
    const [harvestQty, setHarvestQty] = useState(1);
    const [harvestQuality, setHarvestQuality] = useState('Excellent');
    const [harvestNotes, setHarvestNotes] = useState('');

    const handleLogHarvest = () => {
        if (!harvestCropInput) return;
        
        // Add to harvest records
        const newRecord = {
            id: Date.now(),
            name: harvestCropInput.name,
            quantity: parseFloat(harvestQty) || 1,
            unit: harvestCropInput.category === 'Fruit' || harvestCropInput.category === 'Vegetable' ? 'kg' : 'units',
            date: new Date().toISOString().split('T')[0],
            quality: harvestQuality,
            notes: harvestNotes
        };
        setHarvestRecords([newRecord, ...harvestRecords]);

        // Add/Update in Pantry Storage
        setPantryInventory(prev => {
            const normalizedHarvestName = harvestCropInput.name.endsWith('s') ? harvestCropInput.name : harvestCropInput.name + 's';
            const existingIndex = prev.findIndex(item => item.name.toLowerCase().includes(harvestCropInput.name.toLowerCase()) || harvestCropInput.name.toLowerCase().includes(item.name.toLowerCase()));
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + parseFloat(harvestQty),
                    dateStored: new Date().toISOString().split('T')[0]
                };
                return updated;
            } else {
                return [...prev, {
                    id: Date.now() + 1,
                    name: normalizedHarvestName,
                    quantity: parseFloat(harvestQty),
                    unit: newRecord.unit,
                    dateStored: new Date().toISOString().split('T')[0],
                    expiryDays: harvestCropInput.category === 'Fruit' ? 7 : 10
                }];
            }
        });

        // Optionally remove from garden if it's completely cleared
        if (harvestCropInput.gardenId) {
            removeGardenPlant(harvestCropInput.gardenId);
        }

        setHarvestCropInput(null);
        setHarvestQty(1);
        setHarvestNotes('');
        setActiveTab('harvest');
    };

    // Plant Doctor Upload handler
    const runDiagnosis = (key) => {
        setDoctorLoading(true);
        setUploadedLeaf(key);
        setTimeout(() => {
            setDoctorDiagnosis(plantDoctorDiseases[key]);
            setDoctorLoading(false);
        }, 1500);
    };

    const handleUploadClick = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDoctorLoading(true);
            setUploadedLeaf("custom");
            setTimeout(() => {
                // Mock custom leaf upload to randomly hit one of the cases
                const keys = Object.keys(plantDoctorDiseases);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                setDoctorDiagnosis(plantDoctorDiseases[randomKey]);
                setDoctorLoading(false);
            }, 1500);
        }
    };

    // Seasonal Guide Results
    const seasonalGuide = useMemo(() => {
        if (seasonalCountry === 'India') {
            return getIndianSeasonalGuide(seasonalState, seasonalMonth);
        }
        const countryData = seasonalGuideData[seasonalCountry];
        if (countryData) {
            const stateData = countryData[seasonalState];
            if (stateData) {
                const monthData = stateData[seasonalMonth];
                if (monthData) return monthData;
            }
        }
        return getFallbackSeasonalGuide(seasonalCountry, seasonalState, seasonalMonth);
    }, [seasonalCountry, seasonalState, seasonalMonth]);

    // Storage Actions
    const handleStorageAction = (action, item) => {
        if (action === 'cook') {
            // Navigate to Recipes with specific main ingredient query
            const singularName = item.name.toLowerCase().replace(/s$/, '');
            navigate(`/recipes?ingredient=${singularName}`);
        } else if (action === 'sell') {
            // Simulate listing item
            alert(`Listing ${item.quantity} ${item.unit} of local ${item.name} on the FarmLink Marketplace!`);
        } else if (action === 'donate') {
            alert(`Donation of ${item.quantity} ${item.unit} of ${item.name} set up. A notification has been sent to the nearest Community Food Shelter!`);
            // Deduct donated quantity
            setPantryInventory(prev => prev.filter(p => p.id !== item.id));
        }
    };

    // Recipe Matcher
    const mockKitchenRecipes = useMemo(() => {
        return [
            { name: "Sautéed Greens & Carrots", prep: "15 mins", ingredients: ["Spinach", "Carrots"], nutrients: { calories: 120, vitaminC: 60, calcium: 140, iron: 4, fiber: 5 } },
            { name: "Creamy Garden Tomato Soup", prep: "30 mins", ingredients: ["Tomatoes", "Garlic"], nutrients: { calories: 180, vitaminC: 80, calcium: 80, iron: 2, fiber: 3 } },
            { name: "Oven Roasted Roots", prep: "45 mins", ingredients: ["Potatoes", "Carrots"], nutrients: { calories: 250, vitaminC: 25, calcium: 40, iron: 3, fiber: 6 } }
        ];
    }, []);

    // Cook Meal Action
    const handleCookMeal = (recipe) => {
        // Subtract 0.5kg of each ingredient if in storage
        setPantryInventory(prev => {
            return prev.map(item => {
                const matches = recipe.ingredients.some(ing => item.name.toLowerCase().includes(ing.toLowerCase()));
                if (matches) {
                    const newQty = Math.max(0, item.quantity - 0.5);
                    return { ...item, quantity: parseFloat(newQty.toFixed(2)) };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });

        // Add nutrients
        setNutritionProgress(prev => ({
            calories: prev.calories + recipe.nutrients.calories,
            vitaminC: prev.vitaminC + recipe.nutrients.vitaminC,
            calcium: prev.calcium + recipe.nutrients.calcium,
            iron: prev.iron + recipe.nutrients.iron,
            fiber: prev.fiber + recipe.nutrients.fiber
        }));

        alert(`Delicious! Cooked ${recipe.name}. Available pantry items were updated and nutrients added to your tracker.`);
    };

    // Reset daily nutrition progress
    const handleResetNutrition = () => {
        setNutritionProgress({ calories: 0, vitaminC: 0, calcium: 0, iron: 0, fiber: 0 });
    };

    // Community post submit
    const handleSubmitPost = (e) => {
        e.preventDefault();
        if (!newPostTitle || !newPostContent) return;
        const newPost = {
            id: Date.now(),
            author: "You (Garden Owner)",
            date: new Date().toISOString().split('T')[0],
            title: newPostTitle,
            tag: newPostTag,
            content: newPostContent,
            likes: 0,
            liked: false,
            comments: []
        };
        setPosts([newPost, ...posts]);
        setNewPostTitle('');
        setNewPostContent('');
    };

    // Toggle Post Like
    const handleLikePost = (postId) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    likes: p.liked ? p.likes - 1 : p.likes + 1,
                    liked: !p.liked
                };
            }
            return p;
        }));
    };

    // Add Comment
    const [commentInputs, setCommentInputs] = useState({});
    const handleAddComment = (postId) => {
        const text = commentInputs[postId];
        if (!text) return;
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: [...p.comments, { id: Date.now(), author: "You", text }]
                };
            }
            return p;
        }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#372528] flex flex-col">
            <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-sm border-b border-[#4d7c0f]/5 px-8 py-6">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 max-w-full">
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
                        {[
                            { id: 'discover', label: 'Discover Plants' },
                            { id: 'garden', label: 'My Garden' },
                            { id: 'doctor', label: 'Plant Doctor' },
                            { id: 'seasonal', label: 'Seasonal Guide' }
                        ].map((link) => {
                            const isActive = activeTab === link.id;
                            return (
                                <button
                                    key={link.id}
                                    onClick={() => { setActiveTab(link.id); setSelectedPlant(null); }}
                                    className="relative group min-w-[180px]"
                                >
                                    <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 transition-all ${
                                        isActive ? 'bg-[#4d7c0f]' : 'bg-black/10 group-hover:bg-black/20'
                                    }`} />
                                    <div className={`relative px-6 py-2.5 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${
                                        isActive ? 'bg-white border-[#4d7c0f]' : 'bg-white border-black/10 group-hover:border-black/30'
                                    }`}>
                                        <span className={`text-xl font-serif italic whitespace-nowrap ${
                                            isActive ? 'text-[#4d7c0f]' : 'text-black/40 group-hover:text-black'
                                        }`}>
                                            {link.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search and Category Filters */}
                    {activeTab === 'discover' && (
                        <div className="flex flex-row gap-6 items-center shrink-0">
                            <div className="relative group min-w-[240px] flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search catalog..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-black focus:border-[#4d7c0f] transition-all py-1 px-2 outline-none italic font-serif text-base text-black"
                                />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100" size={16} />
                            </div>
                             <div className="flex gap-2">
                                {['All', 'Vegetable', 'Fruit', 'Grain/Legume', 'Herb/Spice', 'Cash Crop'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategoryTab(cat)}
                                        className={`px-4 py-1.5 text-xs font-mono border-2 uppercase tracking-wider transition-all ${
                                            activeCategoryTab === cat ? 'bg-black text-white border-black' : 'border-black/10 hover:border-black'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full px-12 py-20 relative">

                {/* 1. DISCOVER PLANTS TAB */}
                {activeTab === 'discover' && (
                    <div className="space-y-12">
                        {/* Tab header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">Discover Plants</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Explore gardening care parameters for 100+ species.</p>
                            </div>
                        </div>

                        {/* Plant Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {filteredPlantsList.slice(0, visiblePlantsCount).map((plant) => (
                                <div
                                    key={plant.id}
                                    onClick={() => setSelectedPlant(plant)}
                                    className="group cursor-pointer flex flex-col border border-black/10 bg-white p-6 shadow-sm hover:shadow-[6px_6px_0px_rgba(0,0,0,0.05)] hover:border-black transition-all h-full"
                                >
                                    <div className="aspect-square bg-[#f4f1e6] flex items-center justify-center p-6 border border-black/5 group-hover:bg-[#ebe8de] transition-colors relative">
                                        {plant.category === 'Vegetable' ? <Sprout size={50} strokeWidth={0.5} /> : <Leaf size={50} strokeWidth={0.5} />}
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 border border-black/5 text-[9px] font-mono uppercase bg-white">
                                            {plant.category}
                                        </div>
                                    </div>
                                    <div className="pt-4 text-center">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-black/60 group-hover:text-black transition-colors">{plant.name}</h4>
                                        <p className="text-[10px] italic font-serif opacity-40 mt-1">{plant.scientificName}</p>
                                        <p className="text-[10px] font-mono text-[#4d7c0f] font-bold mt-2">{plant.growthTime || '60 days'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPlantsList.length > visiblePlantsCount && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setVisiblePlantsCount(prev => prev + 24)}
                                    className="border-2 border-black bg-white hover:bg-black hover:text-white px-8 py-3 font-mono text-sm uppercase tracking-wider font-bold shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                                >
                                    Load More Plants
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. MY GARDEN TAB */}
                {activeTab === 'garden' && (
                    <div className="space-y-12">
                        {/* Header & Weather Widget */}
                        <div className="flex flex-col lg:flex-row justify-between gap-8 pb-6 border-b border-black/5">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">My Garden</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Manage your planted species, log care actions, and monitor conditions.</p>
                            </div>

                            {/* Weather Assistant */}
                            <div className="border border-black bg-[#f4f1e6] p-6 shadow-[5px_5px_0px_#372528] max-w-md w-full relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Weather Assistant</h4>
                                        <p className="text-[10px] font-mono opacity-50">Local forecast simulation</p>
                                    </div>
                                    {/* Weather Scenario Toggle */}
                                    <select 
                                        value={weatherScenario}
                                        onChange={(e) => setWeatherScenario(e.target.value)}
                                        className="text-[10px] font-mono border border-black/20 px-2 py-1 bg-white outline-none"
                                    >
                                        {Object.keys(weatherData).map(k => (
                                            <option key={k} value={k}>{k}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div className="text-4xl text-center">{weatherData[weatherScenario].icon}</div>
                                    <div className="col-span-3 space-y-1 font-mono text-[11px]">
                                        <div className="flex justify-between">
                                            <span>Temperature:</span>
                                            <span className="font-bold">{weatherData[weatherScenario].temp}°C</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Humidity:</span>
                                            <span className="font-bold">{weatherData[weatherScenario].humidity}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rain Prob:</span>
                                            <span className="font-bold">{weatherData[weatherScenario].rainProb}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Weather smart suggestions */}
                                <div className="mt-4 pt-3 border-t border-black/10 flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-[#aeb16d] shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-mono italic leading-tight text-black/80">
                                        {weatherScenario === 'Perfect Spring' && "Perfect Spring: Sunlight is ideal. Water according to schedule today."}
                                        {weatherScenario === 'Heavy Rain' && "Heavy Rain: Skip watering today. Ensure garden containers have drainage plugs open to prevent soil souring."}
                                        {weatherScenario === 'Sunny Heat Wave' && "Heat Wave Alert: Cover delicate leafy greens with shade cloth today. Set drip irrigation to run early morning."}
                                        {weatherScenario === 'Frosty Morning' && "Frost Warning: Cover seedlings with cloches or plastic sheets. Soil watering should be withheld."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Active Plants List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif italic text-2xl">Currently Growing ({gardenPlants.length})</h3>
                                <button 
                                    onClick={() => setActiveTab('discover')}
                                    className="flex items-center gap-2 border border-black px-4 py-2 text-xs font-mono hover:bg-white hover:shadow-[3px_3px_0px_#000] transition-all bg-[#ebe8de]"
                                >
                                    <Plus size={14} /> Plant New Crop
                                </button>
                            </div>

                            {gardenPlants.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-black/10 bg-white">
                                    <p className="font-serif italic text-lg opacity-40">Your garden is empty. Browse the catalog to plant crops!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                                    {gardenPlants.map((plant) => (
                                        <div key={plant.id} className="border-2 border-black bg-white p-8 shadow-[6px_6px_0px_#372528] flex flex-col justify-between transition-all hover:shadow-[8px_8px_0px_#372528]">
                                            <div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h4 className="text-2xl font-bold font-serif italic text-black">{plant.name}</h4>
                                                        <p className="text-xs font-mono opacity-50 uppercase tracking-widest mt-1">{plant.category}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 border-2 text-xs font-mono uppercase tracking-wider ${
                                                        plant.healthStatus === 'Healthy' ? 'border-[#4d7c0f] bg-[#4d7c0f]/10 text-[#4d7c0f]' :
                                                        plant.healthStatus === 'Needs Water' ? 'border-blue-600 bg-blue-50 text-blue-700 animate-pulse' :
                                                        'border-amber-600 bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {plant.healthStatus}
                                                    </span>
                                                </div>

                                                <div className="space-y-3 font-mono text-xs border-b-2 border-black/10 pb-6 mb-6">
                                                    <div className="flex justify-between py-0.5">
                                                        <span className="opacity-50">Planted On:</span>
                                                        <span className="font-bold">{plant.datePlanted}</span>
                                                    </div>
                                                    <div className="flex justify-between py-0.5">
                                                        <span className="opacity-50">Quantity:</span>
                                                        <span className="font-bold">{plant.quantity} plants</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-0.5">
                                                        <span className="opacity-50">Growth Stage:</span>
                                                        <select
                                                            value={plant.growthStage}
                                                            onChange={(e) => updateGrowthStage(plant.id, e.target.value)}
                                                            className="border-2 border-black bg-white px-3 py-1 text-xs font-mono outline-none cursor-pointer hover:border-[#4d7c0f] transition-colors"
                                                        >
                                                            {["Seed", "Sprout", "Vegetative", "Flowering", "Fruiting", "Ready to Harvest"].map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-between py-0.5">
                                                        <span className="opacity-50">Watered:</span>
                                                        <span className="font-bold">{new Date(plant.lastWatered).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => logGardenAction(plant.id, 'water')}
                                                        className="flex-1 py-2 px-3 border-2 border-black text-xs font-mono text-center transition-all uppercase bg-white text-black hover:bg-[#4d7c0f] hover:text-white hover:border-[#4d7c0f] active:translate-y-0.5"
                                                    >
                                                        Water
                                                    </button>
                                                    <button
                                                        onClick={() => logGardenAction(plant.id, 'fertilize')}
                                                        className="flex-1 py-2 px-3 border-2 border-black text-xs font-mono text-center transition-all uppercase bg-white text-black hover:bg-[#4d7c0f] hover:text-white hover:border-[#4d7c0f] active:translate-y-0.5"
                                                    >
                                                        Fertilize
                                                    </button>
                                                    <button
                                                        onClick={() => logGardenAction(plant.id, 'check')}
                                                        className="py-2 px-4 border-2 border-black text-xs font-mono transition-all bg-white text-black hover:bg-black hover:text-white active:translate-y-0.5"
                                                        title="Toggle Health Status"
                                                    >
                                                        Inspect
                                                    </button>
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    {plant.growthStage === "Ready to Harvest" ? (
                                                        <button
                                                            onClick={() => setHarvestCropInput({ name: plant.name, category: plant.category, gardenId: plant.id })}
                                                            className="w-full py-2.5 border-2 border-black text-sm font-mono font-bold bg-[#4d7c0f] text-white hover:bg-[#3f650c] text-center uppercase tracking-widest transition-all"
                                                        >
                                                            Harvest Crop
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => removeGardenPlant(plant.id)}
                                                            className="w-full py-2 border-2 border-red-600 text-xs font-mono text-red-600 hover:bg-red-50 hover:border-red-700 hover:text-red-700 text-center uppercase tracking-wider transition-all"
                                                        >
                                                            Remove Crop
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. PLANT DOCTOR TAB */}
                {activeTab === 'doctor' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5">
                            <h2 className="text-6xl font-serif italic tracking-tighter">Plant Doctor</h2>
                            <p className="text-xs font-mono opacity-50 mt-2">Diagnose leaf spots, blights, and pests instantly with simulated botanical analysis.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Side: Upload & Simulator */}
                            <div className="space-y-8">
                                <div className="border-2 border-dashed border-black/20 bg-white p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                                    <ImageIcon size={48} className="text-black/20 mb-4" />
                                    <p className="font-serif italic text-lg mb-2">Upload plant leaf image</p>
                                    <p className="text-[10px] font-mono opacity-40 mb-6">JPEG, PNG formats supported up to 5MB.</p>
                                    
                                    <label className="cursor-pointer bg-white border border-black px-6 py-2.5 font-mono text-xs shadow-[3px_3px_0px_#000] hover:bg-[#f4f1e6] active:translate-x-0.5 active:translate-y-0.5 transition-all">
                                        Choose File
                                        <input type="file" onChange={handleUploadClick} className="hidden" accept="image/*" />
                                    </label>
                                </div>

                                {/* Sample presets for testing */}
                                <div className="border border-black bg-[#f4f1e6] p-6 shadow-[4px_4px_0px_#000]">
                                    <h4 className="text-sm font-mono font-bold uppercase tracking-wider mb-4">Sample Leaves (Click to Diagnose)</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <button
                                            onClick={() => runDiagnosis("tomato_early_blight")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Tomato Leaf</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Concentric spots</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("rose_powdery_mildew")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Rose Leaf</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">White mold</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("cucumber_spider_mites")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Cucumber Leaf</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Webs / yellowing</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("rice_blast")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Rice Leaf</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Spindle lesions</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("wheat_rust")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Wheat Leaf</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Orange pustules</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("maize_shoot_fly")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Maize Shoot</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Dead heart stem</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("chickpea_pod_borer")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Chickpea Pod</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Bored pod holes</p>
                                        </button>
                                        <button
                                            onClick={() => runDiagnosis("cotton_bollworm")}
                                            className="border border-black bg-white p-3 text-left hover:shadow-[3px_3px_0px_#4d7c0f] transition-all group"
                                        >
                                            <p className="font-bold text-sm font-mono group-hover:text-[#4d7c0f]">Cotton Boll</p>
                                            <p className="text-[10px] font-mono opacity-50 mt-1">Boll damage</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Results Display */}
                            <div className="border border-black bg-white p-8 shadow-[6px_6px_0px_#372528] min-h-[400px] flex flex-col justify-center">
                                {doctorLoading ? (
                                    <div className="text-center py-20 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 border-4 border-[#4d7c0f] border-t-transparent rounded-full animate-spin mb-6" />
                                        <p className="font-mono text-xs animate-pulse">Running AI disease scans...</p>
                                    </div>
                                ) : doctorDiagnosis ? (
                                    <div className="space-y-6 font-mono text-[12px]">
                                        <div className="flex items-center justify-between border-b border-black/10 pb-4">
                                            <div>
                                                <span className="text-[9px] font-mono bg-red-100 text-red-700 px-2 py-0.5 uppercase">Diagnosis Result</span>
                                                <h3 className="text-xl font-serif italic text-black/80 mt-1">{doctorDiagnosis.diseaseName}</h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] opacity-40">Confidence</span>
                                                <p className="text-lg font-bold text-red-600 leading-none">{doctorDiagnosis.confidence}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[100px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Symptoms:</span>
                                            <span className="text-black/80">{doctorDiagnosis.symptoms}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Causes:</span>
                                            <span className="text-black/80">{doctorDiagnosis.causes}</span>
                                        </div>

                                        <div className="border-t border-black/5 pt-4 space-y-4">
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-[#4d7c0f] text-[10px] mb-1">🌿 Organic Treatment</h4>
                                                <p className="text-black/70 leading-relaxed">{doctorDiagnosis.organicTreatment}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-red-800 text-[10px] mb-1">🧪 Chemical Treatment</h4>
                                                <p className="text-black/70 leading-relaxed">{doctorDiagnosis.chemicalTreatment}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-[#372528] text-[10px] mb-1">🛡️ Prevention Method</h4>
                                                <p className="text-black/70 leading-relaxed">{doctorDiagnosis.prevention}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-[#372528] text-[10px] mb-1">📋 Care Instructions</h4>
                                                <p className="text-black/70 leading-relaxed">{doctorDiagnosis.careInstructions}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-black/30 font-mono text-xs">
                                        <Leaf size={40} className="mx-auto mb-4 opacity-10" />
                                        Upload a leaf image or select one of the testing presets to diagnose diseases.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. SEASONAL PLANT GUIDE TAB */}
                {activeTab === 'seasonal' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">Seasonal Guide</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Find calendar planting and harvesting lists for regions worldwide.</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="font-serif italic text-2xl border-2 border-black px-6 py-2.5 bg-[#ebe8de] select-none cursor-not-allowed">
                                    India
                                </div>
                                <select
                                    value={seasonalMonth}
                                    onChange={(e) => setSeasonalMonth(e.target.value)}
                                    className="font-serif italic text-2xl border-2 border-black px-6 py-2.5 bg-white outline-none"
                                >
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Guide Content Display */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6">
                                <div className="flex items-center gap-2 pb-4 border-b border-black/10">
                                    <div>
                                        <h3 className="font-serif italic text-3xl">{seasonalMonth} Gardening Recommendations</h3>
                                        <p className="text-xs font-mono opacity-50 uppercase">{seasonalCountry}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold text-[#4d7c0f] uppercase tracking-wider mb-2">What to Plant Now</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {seasonalGuide.vegetables && seasonalGuide.vegetables.map(v => (
                                                    <span key={v} className="border border-[#4d7c0f]/20 bg-green-50/50 text-[#4d7c0f] px-2.5 py-1 text-xs font-mono">{v} (Veg)</span>
                                                ))}
                                                {seasonalGuide.fruits && seasonalGuide.fruits.map(v => (
                                                    <span key={v} className="border border-amber-600/20 bg-amber-50/50 text-amber-800 px-2.5 py-1 text-xs font-mono">{v} (Fruit)</span>
                                                ))}
                                                {seasonalGuide.herbs && seasonalGuide.herbs.map(v => (
                                                    <span key={v} className="border border-[#4d7c0f]/20 bg-green-50/50 text-[#4d7c0f] px-2.5 py-1 text-xs font-mono">{v} (Herb)</span>
                                                ))}
                                                {seasonalGuide.grains && seasonalGuide.grains.map(v => (
                                                    <span key={v} className="border border-blue-600/20 bg-blue-50/50 text-blue-800 px-2.5 py-1 text-xs font-mono">{v} (Grain)</span>
                                                ))}
                                                {seasonalGuide.cash_crops && seasonalGuide.cash_crops.map(v => (
                                                    <span key={v} className="border border-red-600/20 bg-red-50/50 text-red-800 px-2.5 py-1 text-xs font-mono">{v} (Cash Crop)</span>
                                                ))}
                                                {seasonalGuide.flowers && seasonalGuide.flowers.map(v => (
                                                    <span key={v} className="border border-purple-600/20 bg-purple-50/50 text-purple-800 px-2.5 py-1 text-xs font-mono">{v} (Flower)</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-black/5">
                                            <div className="flex justify-between">
                                                <span className="opacity-50">Avg Temp Limits:</span>
                                                <span className="font-bold">{seasonalGuide.tempRequirements}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="opacity-50">Water Needs:</span>
                                                <span className="font-bold">{seasonalGuide.waterRequirements}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold uppercase tracking-wider text-black/60 mb-2">Planting Calendar</h4>
                                            <p className="text-black/80 leading-relaxed italic">"{seasonalGuide.plantingCalendar}"</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold uppercase tracking-wider text-black/60 mb-2">Harvest Calendar</h4>
                                            <p className="text-black/80 leading-relaxed italic">"{seasonalGuide.harvestCalendar}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips panel */}
                            <div className="border border-black bg-[#f4f1e6] p-8 shadow-[5px_5px_0px_#4d7c0f] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={18} className="text-[#4d7c0f]" />
                                        <h4 className="font-serif italic text-lg font-bold">Pro Seasonal Tips</h4>
                                    </div>
                                    <p className="font-mono text-sm leading-relaxed text-black/70 mb-6">
                                        {seasonalGuide.growingTips}
                                    </p>
                                </div>

                                <div className="border-t border-black/10 pt-4 font-mono text-[10px] opacity-40">
                                    *Guide parameters represent averages. Tailor micro-irrigation practices to your garden patch slope.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. COMPANION PLANT GUIDE TAB */}
                {activeTab === 'companion' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">Companion Guide</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Discover crop mutualisms and avoid competition in your garden beds.</p>
                            </div>

                            {/* Selection Dropdown */}
                            <div className="relative">
                                <label className="block text-[9px] font-mono uppercase tracking-wider mb-1 opacity-50">Select Crop</label>
                                <select
                                    value={companionLookup}
                                    onChange={(e) => setCompanionLookup(e.target.value)}
                                    className="font-mono text-xs border-2 border-black p-2 bg-white outline-none w-56"
                                >
                                    {Object.keys(companionGuideData).map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Display Results */}
                        {companionGuideData[companionLookup] ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Side Details */}
                                <div className="lg:col-span-2 border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6 font-mono text-xs">
                                    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                                        <div>
                                            <h3 className="font-serif italic text-2xl text-black/80">{companionLookup} Symbioses</h3>
                                            <p className="text-[9px] opacity-50">Companion Planting Framework</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold text-[#4d7c0f] uppercase tracking-wider mb-2">Beneficial Companions (Plant Together)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {companionGuideData[companionLookup].companions.map(c => (
                                                    <span key={c} className="border border-[#4d7c0f]/20 bg-green-50 text-[#4d7c0f] px-3 py-1 font-bold text-[10px]">{c}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <h4 className="font-bold text-red-800 uppercase tracking-wider mb-2">Enemies / Antagonists (Keep Apart)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {companionGuideData[companionLookup].avoid.map(c => (
                                                    <span key={c} className="border border-red-200 bg-red-50 text-red-700 px-3 py-1 font-bold text-[10px]">{c}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-black/5 pt-4 space-y-3">
                                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                                <span className="font-bold uppercase tracking-wider">Spacing Advice:</span>
                                                <span>{companionGuideData[companionLookup].spacing}</span>
                                            </div>
                                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                                <span className="font-bold uppercase tracking-wider">Primary Benefits:</span>
                                                <span>{companionGuideData[companionLookup].benefits}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Growing instructions side box */}
                                <div className="border border-black bg-[#f4f1e6] p-8 shadow-[5px_5px_0px_#4d7c0f] flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info size={16} />
                                            <h4 className="font-serif italic text-lg font-bold">Interplanting Advice</h4>
                                        </div>
                                        <p className="font-mono text-xs leading-relaxed text-black/75">
                                            {companionGuideData[companionLookup].advice}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-black/10 font-mono text-[9px] opacity-40">
                                        *Intelligent spacing minimizes leaf-contact diseases and nutrient competition.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-black/10 bg-white">
                                <p className="font-serif italic text-lg opacity-40">Select a plant from the dropdown to check companion guide.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 6. HARVEST & STORAGE TAB */}
                {activeTab === 'harvest' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-end">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">Harvests & Pantry</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Log crop yields and monitor storage inventory to reduce food waste.</p>
                            </div>

                            <button
                                onClick={() => setHarvestCropInput({ name: "Tomato", category: "Vegetable", gardenId: null })}
                                className="border border-black bg-white px-4 py-2 font-mono text-xs hover:shadow-[3px_3px_0px_#000] hover:bg-[#f4f1e6] transition-all flex items-center gap-2"
                            >
                                <Plus size={14} /> Log Harvest Manually
                            </button>
                        </div>

                        {/* Split layouts: Stored Pantry Ingredients & Harvest Logs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Pantry Storage */}
                            <div className="border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6">
                                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Package size={20} className="text-[#4d7c0f]" />
                                        <h3 className="font-serif italic text-2xl">Stored Produce (Pantry)</h3>
                                    </div>
                                    <span className="font-mono text-[9px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 uppercase font-bold">In Stock</span>
                                </div>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {pantryInventory.length === 0 ? (
                                        <p className="font-serif italic opacity-40 py-10 text-center text-sm">Storage is empty. Record harvests to fill pantry!</p>
                                    ) : (
                                        pantryInventory.map(item => (
                                            <div key={item.id} className="border border-black/5 bg-[#fdfbf7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-black transition-colors font-mono text-xs">
                                                <div>
                                                    <h4 className="font-bold text-sm">{item.name}</h4>
                                                    <div className="flex gap-4 text-[10px] opacity-50 mt-1">
                                                        <span>Stored: {item.dateStored}</span>
                                                        <span className={item.expiryDays <= 3 ? 'text-red-600 font-bold' : ''}>Expires in: ~{item.expiryDays} days</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-sm bg-white border border-black px-2 py-1">{item.quantity} {item.unit}</span>
                                                    <div className="flex gap-1">
                                                        <button 
                                                            onClick={() => handleStorageAction('cook', item)}
                                                            className="px-2 py-1 border border-black text-[9px] hover:bg-green-50 uppercase font-bold text-green-700 bg-white"
                                                            title="Cook Recipes"
                                                        >
                                                            Cook
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStorageAction('sell', item)}
                                                            className="px-2 py-1 border border-black text-[9px] hover:bg-amber-50 uppercase font-bold text-blue-700 bg-white"
                                                            title="Sell on Marketplace"
                                                        >
                                                            Sell
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStorageAction('donate', item)}
                                                            className="px-2 py-1 border border-black text-[9px] hover:bg-black/5 uppercase font-bold text-gray-700 bg-white"
                                                            title="Donate to Shelter"
                                                        >
                                                            Gift
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Harvest History logs */}
                            <div className="border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6">
                                <div className="flex items-center gap-2 border-b border-black/10 pb-4">
                                    <h3 className="font-serif italic text-2xl">Harvest Logs</h3>
                                </div>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {harvestRecords.length === 0 ? (
                                        <p className="font-serif italic opacity-40 py-10 text-center text-sm">No recorded harvest history.</p>
                                    ) : (
                                        harvestRecords.map(rec => (
                                            <div key={rec.id} className="border-b border-black/5 pb-4 last:border-b-0 font-mono text-xs">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-[10px] opacity-40">{rec.date}</span>
                                                        <h4 className="font-bold text-black/80">{rec.name} ({rec.quantity} {rec.unit})</h4>
                                                    </div>
                                                    <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold ${
                                                        rec.quality === 'Excellent' ? 'border-green-600 bg-green-50 text-green-700' :
                                                        rec.quality === 'Good' ? 'border-blue-600 bg-blue-50 text-blue-700' :
                                                        'border-amber-600 bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {rec.quality} Quality
                                                    </span>
                                                </div>
                                                {rec.notes && <p className="text-[11px] italic text-black/60 leading-snug">"{rec.notes}"</p>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. KITCHEN & STATS TAB */}
                {activeTab === 'kitchen' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h2 className="text-6xl font-serif italic tracking-tighter">Kitchen & Nutrition</h2>
                                <p className="text-xs font-mono opacity-50 mt-2">Cook meals based on your pantry stock and monitor daily vitamin/energy intake.</p>
                            </div>

                            <button 
                                onClick={handleResetNutrition}
                                className="border border-red-200 text-red-600 text-xs font-mono px-3 py-1.5 hover:bg-red-50"
                            >
                                Reset Daily Tracker
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Available Recipes to cook */}
                            <div className="lg:col-span-2 border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6">
                                <div className="flex items-center gap-2 border-b border-black/10 pb-4">
                                    <CookingPot size={22} className="text-[#4d7c0f]" />
                                    <h3 className="font-serif italic text-2xl font-bold">Dishes using Stored Crops</h3>
                                </div>

                                <div className="space-y-4">
                                    {mockKitchenRecipes.map((recipe, idx) => {
                                        // check if we have ingredients
                                        const hasIngredients = recipe.ingredients.every(ing => 
                                            pantryInventory.some(item => item.name.toLowerCase().includes(ing.toLowerCase()))
                                        );

                                        return (
                                            <div key={idx} className={`border border-black p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${hasIngredients ? 'bg-[#f4f1e6]/30' : 'opacity-65 bg-white'}`}>
                                                <div className="font-mono text-xs space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-sm font-bold text-black/80">{recipe.name}</h4>
                                                        <span className="text-[9px] opacity-40">Prep: {recipe.prep}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {recipe.ingredients.map(ing => {
                                                            const isAvailable = pantryInventory.some(item => item.name.toLowerCase().includes(ing.toLowerCase()));
                                                            return (
                                                                <span key={ing} className={`px-2 py-0.5 border text-[9px] uppercase ${isAvailable ? 'border-[#4d7c0f] text-[#4d7c0f] bg-green-50' : 'border-red-200 text-red-600 bg-red-50'}`}>
                                                                    {ing} {isAvailable ? '✓' : '✗'}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleCookMeal(recipe)}
                                                    disabled={!hasIngredients}
                                                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border border-black font-bold transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                                                        hasIngredients ? 'bg-[#4d7c0f] text-white hover:bg-[#3f650c]' : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed'
                                                    }`}
                                                >
                                                    Cook Meal
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nutrition Tracker progress */}
                            <div className="border border-black bg-white p-8 shadow-[5px_5px_0px_#000] space-y-6 font-mono text-xs">
                                <div className="flex items-center gap-2 border-b border-black/10 pb-4">
                                    <Apple size={20} className="text-red-700" />
                                    <h3 className="font-serif italic text-2xl">Nutrition Tracker</h3>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'calories', label: 'Calories', current: nutritionProgress.calories, goal: 2000, unit: 'kcal' },
                                        { key: 'vitaminC', label: 'Vitamin C', current: nutritionProgress.vitaminC, goal: 90, unit: 'mg' },
                                        { key: 'calcium', label: 'Calcium', current: nutritionProgress.calcium, goal: 1000, unit: 'mg' },
                                        { key: 'iron', label: 'Iron', current: nutritionProgress.iron, goal: 18, unit: 'mg' },
                                        { key: 'fiber', label: 'Dietary Fiber', current: nutritionProgress.fiber, goal: 25, unit: 'g' }
                                    ].map(stat => {
                                        const percentage = Math.min(100, Math.round((stat.current / stat.goal) * 100));
                                        return (
                                            <div key={stat.key} className="space-y-1">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="font-bold">{stat.label}</span>
                                                    <span>{stat.current} / {stat.goal} {stat.unit} ({percentage}%)</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 border border-black/10 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-[#4d7c0f] rounded-full transition-all duration-500" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-black/10 text-[9px] opacity-40 italic">
                                    *Nutritional values reflect estimates based on average organic produce metrics.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. NOTICEBOARD / COMMUNITY TAB */}
                {activeTab === 'noticeboard' && (
                    <div className="space-y-12">
                        <div className="pb-6 border-b border-black/5">
                            <h2 className="text-6xl font-serif italic tracking-tighter">Community</h2>
                            <p className="text-xs font-mono opacity-50 mt-2">Share gardening queries, swap techniques, and connect with local growers.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Feed List */}
                            <div className="lg:col-span-2 space-y-6">
                                {posts.map(post => (
                                    <div key={post.id} className="border border-black bg-white p-6 shadow-[4px_4px_0px_#372528] font-mono text-xs space-y-4">
                                        <div className="flex justify-between items-start border-b border-black/5 pb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#4d7c0f]">{post.author}</span>
                                                    <span className="text-[9px] opacity-40">{post.date}</span>
                                                </div>
                                                <h3 className="text-base font-bold font-serif italic text-black/80 mt-1">{post.title}</h3>
                                            </div>
                                            <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold ${
                                                post.tag === 'Help' ? 'border-red-400 bg-red-50 text-red-600' :
                                                post.tag === 'Tips' ? 'border-[#4d7c0f] bg-green-50 text-[#4d7c0f]' :
                                                'border-purple-300 bg-purple-50 text-purple-700'
                                            }`}>
                                                {post.tag}
                                            </span>
                                        </div>

                                        <p className="text-black/75 leading-relaxed font-sans">{post.content}</p>

                                        {/* Likes / Comments toggles */}
                                        <div className="flex gap-6 border-t border-black/5 pt-3 text-[10px] text-black/60">
                                            <button 
                                                onClick={() => handleLikePost(post.id)}
                                                className={`flex items-center gap-1.5 hover:text-[#4d7c0f] font-bold ${post.liked ? 'text-[#4d7c0f]' : ''}`}
                                            >
                                                <ThumbsUp size={12} className={post.liked ? 'fill-[#4d7c0f]' : ''} /> {post.likes} Likes
                                            </button>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare size={12} /> {post.comments.length} Comments
                                            </div>
                                        </div>

                                        {/* Comments list */}
                                        {post.comments.length > 0 && (
                                            <div className="bg-gray-50 p-4 space-y-3 border-l-2 border-black/10">
                                                {post.comments.map(c => (
                                                    <div key={c.id} className="text-[10px] leading-tight">
                                                        <span className="font-bold text-[#4d7c0f] mr-2">{c.author}:</span>
                                                        <span className="text-black/80">{c.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Write Comment input */}
                                        <div className="flex gap-2 pt-2 border-t border-black/5">
                                            <input
                                                type="text"
                                                placeholder="Write a reply..."
                                                value={commentInputs[post.id] || ''}
                                                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                className="flex-1 bg-transparent border-b border-black/10 focus:border-[#4d7c0f] outline-none text-[11px] py-1 px-1"
                                            />
                                            <button 
                                                onClick={() => handleAddComment(post.id)}
                                                className="px-3 py-1 border border-black hover:bg-black hover:text-white transition-all text-[10px] uppercase font-bold"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Create New Post Box */}
                            <div className="border border-black bg-[#f4f1e6] p-8 shadow-[5px_5px_0px_#000] h-fit">
                                <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-3">
                                    <PlusCircle size={18} className="text-[#4d7c0f]" />
                                    <h4 className="font-serif italic text-lg font-bold">Write a Post</h4>
                                </div>

                                <form onSubmit={handleSubmitPost} className="space-y-4 font-mono text-xs">
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Post Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Aphids on sweet peppers..."
                                            value={newPostTitle}
                                            onChange={(e) => setNewPostTitle(e.target.value)}
                                            className="w-full border border-black/20 p-2 bg-white outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Category Tag</label>
                                        <select
                                            value={newPostTag}
                                            onChange={(e) => setNewPostTag(e.target.value)}
                                            className="w-full border border-black/20 p-2 bg-white outline-none"
                                        >
                                            <option value="Tips">Gardening Tips</option>
                                            <option value="Help">Disease/Pest Help</option>
                                            <option value="Showoff">Show off my Harvest</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Message Content</label>
                                        <textarea
                                            placeholder="Describe what you want to share with the neighborhood..."
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            rows={5}
                                            className="w-full border border-black/20 p-2 bg-white outline-none resize-none font-sans"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:bg-[#4d7c0f] hover:text-white hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-[11px] uppercase font-bold"
                                    >
                                        Publish Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* MODAL: PLANT PROFILE (DETAILED CARE CARD) */}
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
                            className="relative w-full max-w-4xl h-[85vh] bg-white border-2 border-black shadow-[20px_20px_0px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-10"
                        >
                            {/* Plant Header Box */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
                                <div className="bg-white border-2 border-black px-10 py-3 shadow-[6px_6px_0px_#4d7c0f] relative">
                                    <h2 className="text-3xl font-serif italic tracking-tighter text-center whitespace-nowrap">
                                        {selectedPlant.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPlant(null)}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all z-[60]"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                                {/* Left Side Illustration */}
                                <div className="md:w-[40%] bg-[#ebe8de] border-r border-black/10 flex flex-col items-center justify-center relative p-10 shrink-0">
                                    {selectedPlant.category === 'Vegetable' ? (
                                        <Sprout size={200} strokeWidth={0.2} className="text-black opacity-60" />
                                    ) : (
                                        <Leaf size={200} strokeWidth={0.2} className="text-black opacity-60" />
                                    )}
                                    
                                    <button
                                        onClick={() => { setPlantToPlant(selectedPlant); setIsPlantingModalOpen(true); }}
                                        className="mt-8 border-2 border-black bg-[#4d7c0f] text-white px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-bold shadow-[4px_4px_0px_#000] hover:bg-[#3f650c] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                                    >
                                        Plant Seedlings
                                    </button>
                                </div>

                                {/* Right Side: 13 Required Fields Details (Typewriter Aesthetic) */}
                                <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                                    <div className="mt-16 space-y-8 font-mono text-[12px] tracking-tight text-black/75">
                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Scientific Name</span>
                                            <span className="italic font-serif text-base text-[#4d7c0f] font-bold">{selectedPlant.scientificName}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Description</span>
                                            <span className="leading-relaxed">{selectedPlant.description}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Growing Season</span>
                                            <span>{selectedPlant.growingSeason}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Water Need</span>
                                            <span>{selectedPlant.waterRequirement}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Sunlight Needs</span>
                                            <span>{selectedPlant.sunlightRequirement}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Soil Profile</span>
                                            <span>{selectedPlant.soilType}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Fertilizer Regimen</span>
                                            <span>{selectedPlant.fertilizerRecommendations}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Harvest Window</span>
                                            <span>{selectedPlant.harvestPeriod}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Companion Crops</span>
                                            <span>{selectedPlant.companionPlants}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Common Pests</span>
                                            <span>{selectedPlant.commonPests}</span>
                                        </div>

                                        <div className="grid grid-cols-[160px_1fr] gap-4">
                                            <span className="font-bold uppercase tracking-wider">Common Diseases</span>
                                            <span className="text-red-900 font-bold">{selectedPlant.commonDiseases}</span>
                                        </div>

                                        <div className="pt-6 border-t border-black/10">
                                            <h4 className="font-bold uppercase tracking-[0.2em] text-[#4d7c0f] mb-3">Essential Growing Advice</h4>
                                            <p className="leading-relaxed italic font-serif text-sm text-black/80">
                                                "{selectedPlant.growingTips}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: PLANT CROP QUANTITY PROMPT */}
            <AnimatePresence>
                {isPlantingModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsPlantingModalOpen(false)} />
                        <div className="relative bg-white border-2 border-black p-8 shadow-[6px_6px_0px_#000] w-full max-w-sm font-mono text-xs space-y-6 z-10">
                            <h3 className="font-serif italic text-xl border-b border-black/10 pb-3">Start Planting {plantToPlant?.name}</h3>
                            
                            <div>
                                <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-2">How many seeds/seedlings to plant?</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={plantQuantityInput}
                                    onChange={(e) => setPlantQuantityInput(e.target.value)}
                                    className="w-full border-2 border-black p-3 bg-[#fdfbf7] outline-none text-base font-bold"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsPlantingModalOpen(false)}
                                    className="flex-1 py-2 border border-black hover:bg-gray-50 uppercase text-[10px] font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePlantCrop}
                                    className="flex-1 py-2 border-2 border-black bg-[#4d7c0f] text-white hover:bg-[#3f650c] shadow-[3px_3px_0px_#000] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase text-[10px] font-bold"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: RECORD HARVEST PROMPT */}
            <AnimatePresence>
                {harvestCropInput && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setHarvestCropInput(null)} />
                        <div className="relative bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000] w-full max-w-md font-mono text-xs space-y-6 z-10">
                            <h3 className="font-serif italic text-xl border-b border-black/10 pb-3">Record Harvest: {harvestCropInput.name}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={harvestQty}
                                        onChange={(e) => setHarvestQty(e.target.value)}
                                        className="w-full border border-black p-2 bg-[#fdfbf7] outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Unit</label>
                                    <span className="w-full border border-black/10 p-2 block bg-gray-50 uppercase font-bold text-gray-500">
                                        {harvestCropInput.category === 'Fruit' || harvestCropInput.category === 'Vegetable' ? 'kg' : 'units'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Quality Assessment</label>
                                <select
                                    value={harvestQuality}
                                    onChange={(e) => setHarvestQuality(e.target.value)}
                                    className="w-full border border-black p-2 bg-white outline-none"
                                >
                                    <option value="Excellent">Excellent (No blemishes, prime taste)</option>
                                    <option value="Good">Good (Minor cosmetic spots)</option>
                                    <option value="Fair">Fair (Edible, best cooked/processed)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[9px] uppercase tracking-wider opacity-50 mb-1">Harvest Notes</label>
                                <textarea
                                    placeholder="e.g. harvested in morning moisture, very crisp..."
                                    value={harvestNotes}
                                    onChange={(e) => setHarvestNotes(e.target.value)}
                                    className="w-full border border-black p-2 bg-white outline-none resize-none font-sans"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setHarvestCropInput(null)}
                                    className="flex-1 py-2.5 border border-black hover:bg-gray-50 uppercase text-[10px] font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogHarvest}
                                    className="flex-1 py-2.5 border-2 border-black bg-[#4d7c0f] text-white hover:bg-[#3f650c] shadow-[4px_4px_0px_#000] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase text-[10px] font-bold"
                                >
                                    Log & Store
                                </button>
                            </div>
                        </div>
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
