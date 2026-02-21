const API_BASE_URL = 'http://localhost:8080/api';

const STORE_KEYS = {
    CURRENT_USER: 'farm_connect_current_user',
};

// Helper for session
const getSessionUser = () => {
    const data = localStorage.getItem(STORE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
};

const setSessionUser = (user) => {
    localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(user));
};

// Helper to map backend user to frontend user
const mapUser = (backendUser) => {
    if (!backendUser) return null;
    return {
        ...backendUser,
        location: backendUser.latitude && backendUser.longitude ? {
            lat: backendUser.latitude,
            lng: backendUser.longitude
        } : null
    };
};

export const api = {
    // Auth
    register: async (name, phone, pin, role) => {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, pin, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        const mapped = mapUser(data);
        setSessionUser(mapped);
        return mapped;
    },

    login: async (phone, role, pin) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, role, pin }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        const mapped = mapUser(data);
        setSessionUser(mapped);
        return mapped;
    },

    getCurrentUser: () => {
        return getSessionUser();
    },

    logout: async () => {
        localStorage.removeItem(STORE_KEYS.CURRENT_USER);
    },

    updateProfile: async (userId, updates) => {
        // Map frontend location to backend fields
        const backendUpdates = { ...updates };
        if (updates.location) {
            backendUpdates.latitude = updates.location.lat;
            backendUpdates.longitude = updates.location.lng;
            delete backendUpdates.location;
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendUpdates),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Update failed');

        const mapped = mapUser(data);
        // Sync local session if it's the current user
        const currentUser = getSessionUser();
        if (currentUser?.id === userId) {
            setSessionUser(mapped);
        }
        return mapped;
    },

    // Sellers
    getSellers: async (lat, lng, radiusKm = 10) => {
        const response = await fetch(`${API_BASE_URL}/users/sellers`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch sellers');

        const sellers = data.map(mapUser);

        // Sorting by distance on client side if location provided
        if (lat && lng) {
            return sellers.map(seller => {
                if (!seller.location) return { ...seller, distance: Infinity };
                const dist = getDistanceFromLatLonInKm(lat, lng, seller.location.lat, seller.location.lng);
                return { ...seller, distance: dist };
            }).sort((a, b) => a.distance - b.distance);
        }
        return sellers;
    },

    getSellerById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch seller');
        return mapUser(data);
    },

    // Products
    getProducts: async (sellerId) => {
        const response = await fetch(`${API_BASE_URL}/products?sellerId=${sellerId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
        return data;
    },

    getAllProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
        return data;
    },

    addProduct: async (product) => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to add product');
        return data;
    },

    updateProduct: async (productId, updates) => {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update product');
        return data;
    },

    deleteProduct: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete product');
        }
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
