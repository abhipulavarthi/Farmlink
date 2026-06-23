import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FallingLeaves({ count = 250 }) {
    const meshRef = useRef();

    const leafShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.1, 0.1, 0.4, 0.4, 0.4, 1.0);
        shape.bezierCurveTo(0.4, 1.4, 0.1, 1.8, 0, 2.2);
        shape.bezierCurveTo(-0.1, 1.8, -0.4, 1.4, -0.4, 1.0);
        shape.bezierCurveTo(-0.4, 0.4, -0.1, 0.1, 0, 0);
        return shape;
    }, []);

    const leaves = useMemo(() => {
        const temp = [];
        const colors = ['#2d4a1e', '#3a5a2a', '#4a6b22', '#6b8e23', '#8b4513', '#a0522d', '#556b2f'];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 150,
                y: 35 + Math.random() * 50,
                z: (Math.random() - 0.5) * 120,
                rotationX: Math.random() * Math.PI,
                rotationY: Math.random() * Math.PI,
                rotationZ: Math.random() * Math.PI,
                speed: 0.05 + Math.random() * 0.15,
                wobble: Math.random() * 20,
                wobbleSpeed: 0.2 + Math.random() * 0.5,
                size: 0.1 + Math.random() * 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
        return temp;
    }, [count]);

    const dummy = new THREE.Object3D();
    const colorObj = new THREE.Color();

    useFrame((state, delta) => {
        if (!meshRef.current || !meshRef.current.instanceMatrix) return;

        leaves.forEach((leaf, i) => {
            leaf.y -= leaf.speed;
            leaf.x += Math.sin(state.clock.elapsedTime * leaf.wobbleSpeed + leaf.wobble) * 0.05;
            leaf.z += Math.cos(state.clock.elapsedTime * leaf.wobbleSpeed + leaf.wobble) * 0.05;

            if (leaf.y < -30) {
                leaf.y = 40 + Math.random() * 20;
                leaf.x = (Math.random() - 0.5) * 150;
                leaf.z = (Math.random() - 0.5) * 120;
            }

            leaf.rotationX += delta * 0.7;
            leaf.rotationZ += delta * 0.4;

            dummy.position.set(leaf.x, leaf.y, leaf.z);
            dummy.rotation.set(leaf.rotationX, leaf.rotationY, leaf.rotationZ);
            dummy.scale.setScalar(leaf.size);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            colorObj.set(leaf.color);
            meshRef.current.setColorAt(i, colorObj);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false} castShadow>
            <shapeGeometry args={[leafShape]} />
            <meshStandardMaterial
                side={THREE.DoubleSide}
                roughness={0.8}
                transparent
                opacity={0.93}
            />
        </instancedMesh>
    );
}
