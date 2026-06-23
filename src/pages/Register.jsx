import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Store, X, ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { FallingLeaves } from '../components/FallingLeaves';
import toast from 'react-hot-toast';

export default function Register() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [role] = useState('seller');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleRegisterInitiate = (e) => {
        e.preventDefault();
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        if (pin.length < 4) {
            toast.error('Please enter a 4-digit PIN');
            return;
        }
        if (!name) {
            toast.error('Please enter your name');
            return;
        }
        setShowOtpStep(true);
        toast.success('Verification code sent: 1234');
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        if (otp !== '1234') {
            toast.error('Invalid verification code. Use 1234');
            return;
        }

        try {
            const userData = await register(name, phone, pin, role);
            if (userData) {
                navigate('/seller/dashboard');
            }
        } catch (err) {
            // Error already handled
        }
    };

    return (
        <div className="h-full w-full bg-[#fdfbf7] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.02)]" />

            <button
                onClick={() => showOtpStep ? setShowOtpStep(false) : navigate('/?login=true')}
                className="absolute top-12 left-12 text-black/40 hover:text-black z-20 transition-colors p-4 group"
                title="Back"
            >
                <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
                onClick={() => navigate('/')}
                className="absolute top-12 right-12 text-black/40 hover:text-black z-20 transition-colors p-4 group"
                title="Go Home"
            >
                <Store size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-full max-w-4xl px-8 flex flex-col z-10 py-20">
                {!showOtpStep ? (
                    <form onSubmit={handleRegisterInitiate} className="space-y-12">
                        <div className="space-y-12">
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-black/30">Register Local Store</h2>
                            {/* Name Input */}
                            <div className="space-y-4">
                                <p className="text-2xl font-semibold text-black/80">Full Name</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full text-4xl md:text-6xl font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/5 bg-transparent p-0 leading-tight tracking-tighter"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-4">
                                <p className="text-2xl font-semibold text-black/80">Phone Number</p>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="0000000000"
                                    className="w-full text-4xl md:text-6xl font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/5 bg-transparent p-0 leading-tight tracking-tighter"
                                    maxLength={10}
                                    required
                                />
                            </div>

                            {/* PIN Input */}
                            <div className="space-y-4">
                                <p className="text-2xl font-semibold text-black/80">Set 4-Digit PIN</p>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="0000"
                                    className="w-full text-4xl md:text-6xl font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/5 bg-transparent p-0 leading-tight tracking-[0.2em]"
                                    maxLength={4}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <button
                                type="submit"
                                className="relative group w-fit"
                            >
                                <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                <div className="relative px-12 py-4 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                    <span className="text-2xl font-serif italic text-black">Register Store</span>
                                </div>
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndRegister} className="space-y-12">
                        <div className="space-y-12">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-black/30">Verify Phone</h2>
                                <p className="text-black/40 font-medium">Entering code sent to {phone}</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-2xl font-semibold text-black/80">Enter OTP</p>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="0000"
                                    className="w-full text-8xl md:text-[10rem] font-bold text-black border-none focus:ring-0 outline-none placeholder:text-black/[0.03] bg-transparent p-0 tracking-[0.1em]"
                                    maxLength={4}
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative group w-fit"
                            >
                                <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                <div className="relative px-12 py-4 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                                    <span className="text-2xl font-serif italic text-black">
                                        {loading ? 'Verifying...' : 'Complete Registration'}
                                    </span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowOtpStep(false)}
                                className="text-black/40 hover:text-black font-bold uppercase tracking-widest text-sm text-left transition-colors"
                            >
                                Edit Details
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
