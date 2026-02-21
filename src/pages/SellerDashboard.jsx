import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, ScanLine, Save, MapPin, Package, Trash2, Edit2, Camera, X, Upload, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CATALOG_ITEMS = [
    // Vegetables
    { name: 'Tomato', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200' },
    { name: 'Potato', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=200' },
    { name: 'Onion', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1508747703725-7197bea3f849?auto=format&fit=crop&q=80&w=200' },
    { name: 'Carrot', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200' },
    { name: 'Spinach', category: 'vegetable', unit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Broccoli', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cauliflower', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cabbage', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1550411294-b753584f1994?auto=format&fit=crop&q=80&w=200' },
    { name: 'Brinjal', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1664964724813-255476a8ec28?auto=format&fit=crop&q=80&w=200' },
    { name: 'Capsicum', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1563563914569-befe4af7d2df?auto=format&fit=crop&q=80&w=200' },
    { name: 'Green Peas', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980aa8?auto=format&fit=crop&q=80&w=200' },
    { name: 'Okra (Lady Finger)', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1425543103986-226d3d8d13d8?auto=format&fit=crop&q=80&w=200' },
    { name: 'Bitter Gourd', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1619759367352-736dde73685e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Bottle Gourd', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1620054700092-26d24639db54?auto=format&fit=crop&q=80&w=200' },
    { name: 'Radish', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cucumber', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=200' },
    { name: 'Garlic', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8dd0e6d6?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ginger', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8dd0e6d6?auto=format&fit=crop&q=80&w=200' },
    { name: 'Coriander', category: 'vegetable', unit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1588879462276-88eb7c5e2191?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pumpkin', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1570527140771-020891229bb4?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sweet Potato', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1573562548987-0b192804361e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Beetroot', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1551066035-7cda26f1c4df?auto=format&fit=crop&q=80&w=200' },
    { name: 'Corn', category: 'vegetable', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200' },
    { name: 'Green Chili', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1588252303782-b7a868b40839?auto=format&fit=crop&q=80&w=200' },
    { name: 'French Beans', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1567375080004-9430c44c5d5d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Mushroom', category: 'vegetable', unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1504472478235-8af92062ef99?auto=format&fit=crop&q=80&w=200' },
    { name: 'Lettuce', category: 'vegetable', unit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=200' },
    { name: 'Mint', category: 'vegetable', unit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sweet Corn', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200' },
    { name: 'Drumstick', category: 'vegetable', unit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1518977822534-7049a61e0595?auto=format&fit=crop&q=80&w=200' }, // Placeholder-ish
    { name: 'Ridge Gourd', category: 'vegetable', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1620054700092-26d24639db54?auto=format&fit=crop&q=80&w=200' }, // Placeholder

    // Fruits
    { name: 'Apple', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200' },
    { name: 'Banana', category: 'fruit', unit: 'dozen', imageUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=200' },
    { name: 'Mango', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200' },
    { name: 'Orange', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Grapes', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1537640538965-17565236b589?auto=format&fit=crop&q=80&w=200' },
    { name: 'Watermelon', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200' },
    { name: 'Papaya', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1617117866792-c47d739c940c?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pineapple', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pomegranate', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1615485925694-a67994143d96?auto=format&fit=crop&q=80&w=200' },
    { name: 'Guava', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c25?auto=format&fit=crop&q=80&w=200' },
    { name: 'Strawberry', category: 'fruit', unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=200' },
    { name: 'Kiwi', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e06138a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Lemon', category: 'fruit', unit: 'dozen', imageUrl: 'https://images.unsplash.com/photo-1590502593747-4279906de475?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pear', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=200' },
    { name: 'Peach', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1629828945638-31fc0f5908cd?auto=format&fit=crop&q=80&w=200' },
    { name: 'Plum', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1623326162391-7f41535451ec?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cherry', category: 'fruit', unit: 'box', imageUrl: 'https://images.unsplash.com/photo-1528821128474-27f963b0bdd4?auto=format&fit=crop&q=80&w=200' },
    { name: 'Avocado', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1523049673856-3eb53bd670ac?auto=format&fit=crop&q=80&w=200' },
    { name: 'Coconut', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dragon Fruit', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b15?auto=format&fit=crop&q=80&w=200' },
    { name: 'Muskmelon', category: 'fruit', unit: 'pc', imageUrl: 'https://images.unsplash.com/photo-1596752001712-881c95697274?auto=format&fit=crop&q=80&w=200' },
    { name: 'Custard Apple', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200' }, // Placeholder
    { name: 'Fig', category: 'fruit', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1601379769094-1b3a88636e0d?auto=format&fit=crop&q=80&w=200' },
];

export default function SellerDashboard() {
    const navigate = useNavigate();
    const { user, updateUserLocation } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('vegetable');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editData, setEditData] = useState({ storeName: '', address: '' });
    const [suggestions, setSuggestions] = useState([]);

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        unit: 'kg',
        stock: '',
        category: 'vegetable', // vegetable, fruit
        image: null,
        imageUrl: null // Added to store catalog image url
    });

    useEffect(() => {
        loadProducts();
    }, []);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const loadProducts = async () => {
        if (user?.id) {
            setLoading(true);
            const data = await api.getProducts(user.id);
            setProducts(data);
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        try {
            const productToAdd = {
                ...newProduct,
                sellerId: user.id,
                imageUrl: newProduct.imageUrl || newProduct.image || `https://source.unsplash.com/400x300/?${newProduct.name},${newProduct.category}`
            };
            if (!newProduct.image) {
                productToAdd.imageUrl = `https://placehold.co/400x300?text=${newProduct.name}`;
            }

            await api.addProduct(productToAdd);
            toast.success('Product added successfully!');
            setNewProduct({ name: '', price: '', unit: 'kg', stock: '', category: 'vegetable', image: null });
            loadProducts();
        } catch (err) {
            toast.error('Failed to add product');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prev => ({ ...prev, imageUrl: reader.result }));
                toast.success('Image uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer rear camera on mobile
            });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (err) {
            console.error("Camera access error:", err);
            toast.error('Unable to access camera. Please allow permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        const video = document.getElementById('camera-feed');
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setNewProduct(prev => ({ ...prev, imageUrl: dataUrl }));
            stopCamera();
            toast.success('Photo captured!');
        }
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    };

    const handleAutoLocation = () => {
        if (navigator.geolocation) {
            const toastId = toast.loading('Detecting your location...');
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const address = await reverseGeocode(latitude, longitude);
                    await updateUserLocation(latitude, longitude, address);
                    toast.success('Location updated!', { id: toastId });
                },
                (error) => {
                    toast.error('Unable to retrieve location', { id: toastId });
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error('Geolocation is not supported');
        }
    };

    const fetchAddressSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Suggestion error:", error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updates = {
                storeName: editData.storeName,
                address: editData.address
            };

            // If address changed and we have a selected suggestion, we could update lat/lng too
            // For now, keeping it simple as requested

            await api.updateProfile(user.id, updates);
            toast.success('Profile updated successfully!');
            setIsEditProfileOpen(false);
            window.location.reload(); // Quick way to refresh auth state if not using a better listener
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const deleteProduct = async (id) => {
        await api.deleteProduct(id);
        loadProducts();
        toast.success('Product removed');
    };

    return (
        <div className="min-h-screen bg-[#f4f1e6] font-sans text-[#372528] overflow-x-hidden">
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Section Title */}
                <div className="mb-16 text-center relative">
                    <h2 className="text-5xl font-serif italic text-black">{user?.storeName || 'My Farm Shop'}</h2>
                </div>

                <div className="space-y-12">

                    {/* Camera Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
                            <div className="w-full max-w-lg bg-black rounded-2xl overflow-hidden relative">
                                <button
                                    onClick={stopCamera}
                                    className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                                >
                                    <X size={24} />
                                </button>
                                <video
                                    id="camera-feed"
                                    autoPlay
                                    playsInline
                                    ref={(video) => {
                                        if (video && stream) {
                                            video.srcObject = stream;
                                        }
                                    }}
                                    className="w-full h-auto max-h-[70vh] object-cover"
                                />
                                <div className="p-6 flex justify-center bg-gray-900">
                                    <button
                                        onClick={capturePhoto}
                                        className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:scale-105 transition-transform flex items-center justify-center"
                                    >
                                        <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1. Top Section: Your Menu */}
                    <div className="bg-white border-2 border-black p-8 relative">
                        <div className="absolute -top-4 -left-4 bg-black text-white px-6 py-2 font-serif italic text-xl">
                            Your Menu
                        </div>


                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading products...</div>
                        ) : products.length === 0 ? (
                            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Package className="text-gray-400" size={32} />
                                </div>
                                <p>No products added yet.</p>
                                <p className="text-sm">Select items from the catalog below to items using the form to start selling.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(product => (
                                    <div key={product.id} className="relative group">
                                        <div className="absolute inset-0 bg-black/5 translate-x-1 translate-y-1" />
                                        <div className="relative bg-white border border-black p-4 flex gap-6 transition-all group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                                            <div className="w-24 h-24 bg-[#fdfbf7] border border-black/10 overflow-hidden shrink-0">
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-serif italic text-black">{product.name}</h3>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                                                        {product.category}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xl font-serif italic text-black">₹{product.price}<span className="text-xs font-sans not-italic text-black/40">/{product.unit}</span></p>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#aeb16d]">Stock: {product.stock}</p>
                                                    </div>
                                                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-black/20 hover:text-red-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Profile Info + Add Product Form */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Moved Header Section here */}
                            <div className="bg-white border-2 border-black p-8 relative">
                                <div className="absolute -top-4 -right-4 bg-[#aeb16d] text-white px-6 py-1 font-serif italic text-lg z-10">
                                    Shop Profile
                                </div>
                                <div className="flex justify-between items-start gap-2 relative">
                                    <div>
                                        <h1 className="text-2xl font-serif italic text-black">{user?.storeName || 'My Farm Shop'}</h1>
                                        <p className="text-black/40 flex flex-col gap-1 mt-4">
                                            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                                <MapPin size={14} className="shrink-0" />
                                                {user?.location
                                                    ? (user.address || `Lat: ${user.location.lat.toFixed(4)}, Lng: ${user.location.lng.toFixed(4)}`)
                                                    : 'Location Not Set'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <button
                                            onClick={() => {
                                                setEditData({ storeName: user?.storeName || '', address: user?.address || '' });
                                                setIsEditProfileOpen(true);
                                            }}
                                            className="relative group focus:outline-none"
                                        >
                                            <div className="absolute inset-0 bg-black translate-x-0.5 translate-y-0.5" />
                                            <div className="relative px-4 py-1.5 bg-white border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                                                Edit Profile
                                            </div>
                                        </button>
                                        <button
                                            onClick={handleAutoLocation}
                                            className="text-xs font-bold uppercase tracking-widest text-[#aeb16d] hover:text-black transition-colors"
                                        >
                                            Update Location
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-black p-8 relative pt-12">
                                <div className="absolute top-0 left-0 bg-black text-white px-6 py-2 font-serif italic text-xl">
                                    Add New Item
                                </div>

                                <form onSubmit={handleCreateProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Product Name</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                placeholder="e.g. Fresh Carrots"
                                                className="flex-1 bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-2 outline-none italic font-serif text-lg"
                                            />
                                            {/* Two buttons: Upload & Camera */}
                                            <label className="relative group p-2 cursor-pointer" title="Upload Photo">
                                                <div className="absolute inset-0 bg-black translate-x-0.5 translate-y-0.5" />
                                                <div className="relative p-2 bg-white border border-black flex items-center justify-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <Upload size={18} />
                                                </div>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="relative group p-2"
                                                title="Take Photo"
                                            >
                                                <div className="absolute inset-0 bg-[#aeb16d] translate-x-0.5 translate-y-0.5" />
                                                <div className="relative p-2 bg-white border border-black flex items-center justify-center">
                                                    <Camera size={18} />
                                                </div>
                                            </button>
                                        </div>
                                        {newProduct.imageUrl && (
                                            <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden relative group">
                                                <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProduct({ ...newProduct, imageUrl: null })}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mt-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Category</label>
                                            <select
                                                value={newProduct.category}
                                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-2 outline-none italic font-serif text-lg appearance-none cursor-pointer"
                                            >
                                                <option value="vegetable">Vegetable</option>
                                                <option value="fruit">Fruit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-2 outline-none italic font-serif text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mt-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Stock Qty</label>
                                            <input
                                                type="number"
                                                value={newProduct.stock}
                                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                placeholder="Amount"
                                                className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-2 outline-none italic font-serif text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Unit</label>
                                            <select
                                                value={newProduct.unit}
                                                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-2 outline-none italic font-serif text-lg appearance-none cursor-pointer"
                                            >
                                                <option value="kg">kg</option>
                                                <option value="g">g</option>
                                                <option value="pcs">pcs</option>
                                                <option value="dozen">dozen</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="relative group w-full mt-4"
                                    >
                                        <div className="absolute inset-0 bg-[#aeb16d] translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                                        <div className="relative w-full py-4 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                            <span className="text-xl font-serif italic text-black flex items-center gap-2">
                                                <Save size={20} /> Add to Menu
                                            </span>
                                        </div>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white border-2 border-black p-8 relative h-full flex flex-col pt-16">
                                <div className="absolute top-0 left-0 bg-black text-white px-8 py-3 font-serif italic text-2xl w-full flex justify-between items-center">
                                    <span>Quick Add Catalog</span>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-9 pr-4 py-1 bg-white border border-white/20 text-black text-xs outline-none w-40 sm:w-56 font-sans placeholder:text-black/30 italic transition-all focus:ring-1 focus:ring-[#aeb16d]/30"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-8">
                                    {['vegetable', 'fruit'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className="relative group"
                                        >
                                            <div className={`absolute inset-0 translate-x-1 translate-y-1 transition-all ${filter === f ? 'bg-[#aeb16d]' : 'bg-black/10'
                                                }`} />
                                            <div className={`relative px-6 py-2 border-2 flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5 ${filter === f ? 'bg-white border-[#aeb16d]' : 'bg-white border-black/10'
                                                }`}>
                                                <span className={`text-sm font-serif italic capitalize ${filter === f ? 'text-[#aeb16d]' : 'text-black/40'
                                                    }`}>
                                                    {f}s
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                    {['vegetable', 'fruit'].map((category) => {
                                        if (filter !== category) return null;

                                        // Filter items by category and search term
                                        const items = CATALOG_ITEMS.filter(item =>
                                            item.category === category &&
                                            item.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        );

                                        if (items.length === 0) return null;

                                        return (
                                            <div key={category}>
                                                <h3 className="font-semibold text-gray-700 mb-3 capitalize sticky top-0 bg-white py-2 z-10">{category}s</h3>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                    {items.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setNewProduct({ ...newProduct, ...item, price: '', stock: '', imageUrl: item.imageUrl })}
                                                            className="relative aspect-square overflow-hidden border border-black/10 hover:border-black transition-all group"
                                                        >
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-2 border-t border-black/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                                <span className="block font-serif italic text-black text-xs text-center">{item.name}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Empty State for Search */}
                                    {CATALOG_ITEMS.filter(item =>
                                        item.category === filter &&
                                        item.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).length === 0 && (
                                            <div className="text-center py-8 text-gray-500 text-sm">
                                                No items found.
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditProfileOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditProfileOpen(false)}
                            className="absolute inset-0 bg-white/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <button
                                onClick={() => setIsEditProfileOpen(false)}
                                className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-serif italic text-black mb-8 underline decoration-1 underline-offset-8">Edit Shop Profile</h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Shop Name</label>
                                    <input
                                        type="text"
                                        value={editData.storeName}
                                        onChange={(e) => setEditData({ ...editData, storeName: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-0 outline-none italic font-serif text-lg"
                                        placeholder="Your Farm Shop Name"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">Shop Address</label>
                                    <input
                                        type="text"
                                        value={editData.address}
                                        onChange={(e) => {
                                            setEditData({ ...editData, address: e.target.value });
                                            fetchAddressSuggestions(e.target.value);
                                        }}
                                        className="w-full bg-transparent border-b-2 border-black focus:border-[#aeb16d] transition-all py-2 px-0 outline-none italic font-serif text-lg"
                                        placeholder="Type your address..."
                                    />
                                    {suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border-2 border-black mt-2 z-[110] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {suggestions.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setEditData({ ...editData, address: s.display_name });
                                                        setSuggestions([]);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm font-sans hover:bg-black hover:text-white transition-colors border-b border-black/5 last:border-0"
                                                >
                                                    {s.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="relative group w-full"
                                    >
                                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                                        <div className="relative w-full py-3 bg-[#aeb16d] border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                            <span className="text-xl font-serif italic text-white flex items-center gap-2">
                                                Update Profile
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
