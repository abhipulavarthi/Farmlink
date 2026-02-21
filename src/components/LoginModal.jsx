import { useState, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Store, X } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { FallingLeaves } from './FallingLeaves';
import toast from 'react-hot-toast';

export default function LoginModal({ isOpen, onClose }) {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [role] = useState('seller');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const requestPin = (e) => {
        e.preventDefault();
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setShowPin(true);
            toast.success('PIN sent to your mobile: 1234 (Simulated)');
            setLoading(false);
        }, 1000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (pin !== '1234') {
            toast.error('Invalid PIN. Use 1234');
            return;
        }

        try {
            const userData = await login(phone, role);
            onClose();
            if (userData) {
                navigate('/seller/dashboard');
            }
        } catch (err) {
            // Error handled in context
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center">
            {/* Instant Background Backdrop */}
            <div
                className="absolute inset-0 bg-white/95 backdrop-blur-xl cursor-pointer"
                onClick={onClose}
            />

            <div className="w-full h-full bg-transparent relative flex flex-col items-center justify-center overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-12 right-12 text-black/40 hover:text-black z-20 transition-colors p-4"
                >
                    <X size={32} />
                </button>

                <div className="w-full max-w-2xl px-8 flex flex-col z-10">
                    {!showPin ? (
                        <form onSubmit={requestPin} className="space-y-12">
                            <div className="space-y-4">
                                <p className="text-2xl font-semibold text-black/80 text-center md:text-left">Seller Login</p>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="0000000000"
                                    className="w-full text-6xl md:text-8xl font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/5 bg-transparent p-0 leading-tight tracking-tighter text-center md:text-left"
                                    maxLength={10}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-8 items-center md:items-start">
                                <div className="flex flex-col gap-4 w-full">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative group w-fit"
                                    >
                                        <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                        <div className="relative px-10 py-3 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                            <span className="text-xl font-serif italic text-black">
                                                {loading ? 'Processing...' : 'Continue as Seller'}
                                            </span>
                                        </div>
                                    </button>
                                    <p className="text-black/40 font-medium text-center md:text-left">
                                        Are you a new seller?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                navigate('/register');
                                            }}
                                            className="text-black hover:underline font-bold"
                                        >
                                            Register Store
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
                            <div className="space-y-4 max-w-sm">
                                <h2 className="text-5xl font-bold text-black tracking-tight">Enter PIN</h2>
                                <button
                                    type="button"
                                    onClick={() => setShowPin(false)}
                                    className="text-xs font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors pt-4"
                                >
                                    Change Number
                                </button>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="0000"
                                    className="w-full text-8xl md:text-[10rem] font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/[0.03] bg-transparent p-0 tracking-[0.1em]"
                                    maxLength={4}
                                    autoFocus
                                    required
                                />
                                <div className="h-2 w-full bg-black/5 absolute bottom-4 left-0" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="hidden"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
