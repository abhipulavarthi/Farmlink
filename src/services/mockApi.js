// Simulated delay for "Backend" feel
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STORE_KEYS = {
    USERS: 'farm_connect_users',
    PRODUCTS: 'farm_connect_products',
    CURRENT_USER: 'farm_connect_current_user',
};

// Seed Data
const seedData = () => {
    if (!localStorage.getItem(STORE_KEYS.USERS)) {
        const users = [
            {
                id: 's1', phone: '9999999999', role: 'seller', name: 'Raju Farmer', storeName: 'Raju Organics',
                description: 'Organic vegetables straight from my field.',
                location: { lat: 17.3850, lng: 78.4867 }, // Hyderabad area
                joinedAt: new Date().toISOString()
            },
            {
                id: 's2', phone: '8888888888', role: 'seller', name: 'Lakshmi Market', storeName: 'Lakshmi Greens',
                description: 'Fresh daily greens and seasonal fruits.',
                location: { lat: 17.3950, lng: 78.4967 },
                joinedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(users));
    }

    if (!localStorage.getItem(STORE_KEYS.PRODUCTS)) {
        const products = [
            { id: 'p1', sellerId: 's1', name: 'Tomatoes', price: '30', unit: 'kg', stock: '50', category: 'vegetable', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
            { id: 'p2', sellerId: 's1', name: 'Potatoes', price: '40', unit: 'kg', stock: '100', category: 'vegetable', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400' },
            { id: 'p3', sellerId: 's2', name: 'Spinach', price: '20', unit: 'bunch', stock: '20', category: 'vegetable', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400' },
            { id: 'p4', sellerId: 's2', name: 'Mangoes', price: '120', unit: 'kg', stock: '30', category: 'fruit', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400' }
        ];
        localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    }
};

// Initial Data Loading
const loadData = (key) => {
    seedData();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
    // Auth
    register: async (name, phone, pin, role) => {
        await delay(1200);
        const users = loadData(STORE_KEYS.USERS);
        const existingUser = users.find((u) => u.phone === phone);

        if (existingUser) {
            throw new Error('User already exists with this phone number');
        }

        const newUser = {
            id: crypto.randomUUID(),
            name,
            phone,
            pin, // In a real app, this would be hashed
            role,
            location: null,
            address: '',
            joinedAt: new Date().toISOString(),
        };

        if (role === 'seller') {
            newUser.storeName = `${name}'s Farm Shop`;
            newUser.description = 'Fresh vegetables and fruits directly from the farm.';
        }

        users.push(newUser);
        saveData(STORE_KEYS.USERS, users);

        // Save session
        localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(newUser));
        return newUser;
    },

    login: async (phone, role, pin) => {
        await delay(800);
        const users = loadData(STORE_KEYS.USERS);
        let user = users.find((u) => u.phone === phone);

        if (!user) {
            throw new Error('User not found. Please register.');
        }

        // If pin is provided, check it (optional for now to keep it backward compatible)
        if (pin && user.pin && user.pin !== pin) {
            throw new Error('Invalid PIN');
        }

        // Update role if switching
        if (role && user.role !== role) {
            user.role = role;
            if (role === 'seller' && !user.storeName) {
                user.storeName = `${user.name}'s Farm Shop`;
                user.description = 'Fresh vegetables and fruits directly from the farm.';
            }
            const index = users.findIndex((u) => u.phone === phone);
            users[index] = user;
            saveData(STORE_KEYS.USERS, users);
        }

        // Save session
        localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
    },

    getCurrentUser: () => {
        const data = localStorage.getItem(STORE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    logout: async () => {
        await delay(300);
        localStorage.removeItem(STORE_KEYS.CURRENT_USER);
    },

    updateProfile: async (userId, updates) => {
        await delay(500);
        const users = loadData(STORE_KEYS.USERS);
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            saveData(STORE_KEYS.USERS, users);

            // Update session if it's the current user
            const currentUser = api.getCurrentUser();
            if (currentUser?.id === userId) {
                localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
            }
            return users[index];
        }
        throw new Error('User not found');
    },

    // Sellers
    getSellers: async (lat, lng, radiusKm = 10) => {
        await delay(600);
        const users = loadData(STORE_KEYS.USERS);
        // Filter by role 'seller'
        let sellers = users.filter(u => u.role === 'seller');

        // Filter by distance if location provided (Simple Haversine or mock)
        // For demo, if no location, return all. 
        // If location, sort by distance.
        if (lat && lng) {
            sellers = sellers.map(seller => {
                if (!seller.location) return { ...seller, distance: Infinity };
                const dist = getDistanceFromLatLonInKm(lat, lng, seller.location.lat, seller.location.lng);
                return { ...seller, distance: dist };
            }).sort((a, b) => a.distance - b.distance); // Sort by nearest
        }

        return sellers;
    },

    getSellerById: async (id) => {
        await delay(400);
        const users = loadData(STORE_KEYS.USERS);
        return users.find(u => u.id === id);
    },

    // Products
    getProducts: async (sellerId) => {
        await delay(500);
        const products = loadData(STORE_KEYS.PRODUCTS);
        return products.filter(p => p.sellerId === sellerId);
    },

    getAllProducts: async () => {
        // Optional: for search features users might want to see all veg available nearby
        await delay(500);
        return loadData(STORE_KEYS.PRODUCTS);
    },

    addProduct: async (product) => {
        await delay(600);
        const products = loadData(STORE_KEYS.PRODUCTS);
        const newProduct = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...product,
        };
        products.push(newProduct);
        saveData(STORE_KEYS.PRODUCTS, products);
        return newProduct;
    },

    updateProduct: async (productId, updates) => {
        await delay(400);
        const products = loadData(STORE_KEYS.PRODUCTS);
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            saveData(STORE_KEYS.PRODUCTS, products);
            return products[index];
        }
        throw new Error('Product not found');
    },

    deleteProduct: async (productId) => {
        await delay(400);
        let products = loadData(STORE_KEYS.PRODUCTS);
        products = products.filter(p => p.id !== productId);
        saveData(STORE_KEYS.PRODUCTS, products);
    }
};

// Helper: Haversine Formula for distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
