import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    PerspectiveCamera,
    OrbitControls,
    Environment,
    ContactShadows,
    BakeShadows,
    useGLTF,
    Float
} from '@react-three/drei';
import * as THREE from 'three';
import { FallingLeaves } from '../components/FallingLeaves';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TreeModel() {
    const { scene } = useGLTF('/scene.gltf');
    useMemo(() => {
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                materials.forEach(mat => {
                    if (mat && mat.name && mat.name.toLowerCase().includes('leave')) {
                        mat.color.setStyle('#4d7c0f');
                        mat.emissive = new THREE.Color('#162505');
                        mat.emissiveIntensity = 0.2;
                    }
                });
            }
        });
    }, [scene]);

    return (
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
            <primitive object={scene} position={[0, -24, 0]} scale={2.6} />
        </Float>
    );
}

export default function IntroFarm() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-full bg-[#fdfbf7] overflow-hidden">
            {/* Back to Portal */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-black/40 hover:text-black transition-colors"
            >
                <ArrowLeft size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Portal</span>
            </button>

            {/* Culinary Poem - Left Aligned */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="absolute left-12 top-[15%] -translate-y-1/2 max-w-sm z-20 pointer-events-none select-none hidden lg:block"
            >
                <div className="space-y-4 text-[#4d7c0f] italic font-serif leading-relaxed text-sm tracking-wide opacity-80">
                    <p>
                        Begin with a basket of intention,<br />
                        wheels humming softly across tiled aisles,<br />
                        a quiet promise to feed tomorrow<br />
                        with choices made today.
                    </p>
                    <p>
                        Reach for rice that remembers fields,<br />
                        lentils holding monsoon patience,<br />
                        vegetables still whispering soil stories—<br />
                        green with life, red with ripeness.
                    </p>
                    <p>
                        Choose fruits kissed by seasons,<br />
                        milk carrying the calm of mornings,<br />
                        spices wrapped in paper and memory,<br />
                        each one a journey in a pinch.
                    </p>
                </div>
            </motion.div>

            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 5, 50]} fov={38} />
                <ambientLight intensity={0.45} />
                <directionalLight
                    position={[30, 40, 20]}
                    intensity={1.9}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-20, 10, -15]} intensity={0.9} color="#ffebcc" />

                <Suspense fallback={null}>
                    <TreeModel />
                    <FallingLeaves count={800} />
                    <Environment preset="forest" />
                    <ContactShadows
                        position={[0, -24, 0]}
                        opacity={0.5}
                        scale={100}
                        blur={3.5}
                        far={40}
                        color="#111a08"
                    />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate
                    autoRotateSpeed={0.25}
                    maxPolarAngle={Math.PI / 1.7}
                    minPolarAngle={Math.PI / 2.8}
                />
                <BakeShadows />
            </Canvas>

            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-10">
                <h1 className="text-7xl md:text-9xl font-light text-farm-900 tracking-tighter mb-4 opacity-95 font-serif">
                    FarmConnect
                </h1>
            </div>

            {/* Action Button to functional page */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/buyer/dashboard')}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                    <div className="relative px-12 py-4 bg-white border-2 border-black flex items-center justify-center transition-transform group-active:translate-x-0.5 group-active:translate-y-0.5">
                        <span className="text-xl font-serif italic text-black whitespace-nowrap">Enter Marketplace</span>
                    </div>
                </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.04)]" />
        </div>
    );
}
