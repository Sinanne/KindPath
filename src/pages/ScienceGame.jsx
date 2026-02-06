import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, RefreshCcw, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

// ============================================================================
// ANIMATED RUNNER COMPONENTS - SIDE PROFILE VIEW
// ============================================================================

// Earth Runner - Side profile, leaning forward, dynamic running pose
const EarthRunner = ({ isJumping, animationPhase }) => {
    const legAngle1 = animationPhase % 2 === 0 ? 45 : -35;
    const legAngle2 = animationPhase % 2 === 0 ? -35 : 45;
    const armAngle1 = animationPhase % 2 === 0 ? -40 : 30;
    const armAngle2 = animationPhase % 2 === 0 ? 30 : -40;

    return (
        <svg viewBox="0 0 80 100" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="skinGradE" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DEB887" />
                    <stop offset="100%" stopColor="#D2A679" />
                </linearGradient>
                <linearGradient id="shirtGradE" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="shortsGradE" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="shoeGradE" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
                <linearGradient id="hatGradE" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
            </defs>

            {/* Back Arm (behind body) */}
            <g style={{
                transform: isJumping ? 'rotate(60deg)' : `rotate(${armAngle2}deg)`,
                transformOrigin: '35px 32px'
            }}>
                <rect x="30" y="30" width="6" height="20" rx="3" fill="url(#shirtGradE)" />
                <ellipse cx="33" cy="52" rx="4" ry="3" fill="url(#skinGradE)" />
            </g>

            {/* Back Leg */}
            <g style={{
                transform: isJumping ? 'rotate(-30deg)' : `rotate(${legAngle2}deg)`,
                transformOrigin: '35px 58px'
            }}>
                <rect x="32" y="56" width="8" height="24" rx="3" fill="url(#skinGradE)" />
                <rect x="30" y="76" width="12" height="8" rx="3" fill="url(#shoeGradE)" />
                <rect x="28" y="80" width="16" height="5" rx="2" fill="url(#shoeGradE)" />
            </g>

            {/* Body - leaning forward */}
            <g transform="rotate(-15, 40, 45)">
                {/* Torso */}
                <rect x="28" y="28" width="20" height="28" rx="5" fill="url(#shirtGradE)" />
                {/* Shirt detail */}
                <path d="M32 32 L44 32" stroke="#2563EB" strokeWidth="2" />
            </g>

            {/* Head - side profile */}
            <g transform="translate(35, 8)">
                {/* Face/Head */}
                <ellipse cx="10" cy="10" rx="10" ry="11" fill="url(#skinGradE)" />
                {/* Hair peeking from under hat */}
                <path d="M-2 12 Q0 8 4 10" fill="#2D1B0E" />
                <path d="M0 14 Q2 12 5 14" fill="#2D1B0E" />

                {/* Red Baseball Cap */}
                <ellipse cx="10" cy="5" rx="12" ry="8" fill="url(#hatGradE)" />
                <path d="M8 5 Q10 -2 22 3 L24 6 Q12 2 8 5" fill="url(#hatGradE)" />
                {/* Cap brim */}
                <path d="M18 7 Q26 5 28 8 Q26 10 18 9 Z" fill="#B91C1C" />
                {/* Cap button on top */}
                <circle cx="10" cy="-1" r="2" fill="#B91C1C" />
                {/* Cap stitching detail */}
                <path d="M4 3 Q10 0 16 3" stroke="#DC2626" strokeWidth="0.5" fill="none" />

                {/* Eye */}
                <ellipse cx="16" cy="9" rx="2" ry="2.5" fill="#1E1E1E" />
                <circle cx="17" cy="8" r="0.8" fill="white" />
                {/* Nose */}
                <path d="M20 12 Q22 14 20 16" stroke="#C4A27A" strokeWidth="1.5" fill="none" />
                {/* Determined expression */}
                <path d="M17 17 L22 16" stroke="#8B6E5A" strokeWidth="1.5" />
            </g>

            {/* Shorts */}
            <path d="M28 52 L48 52 L46 62 L38 60 L30 62 Z" fill="url(#shortsGradE)" transform="rotate(-10, 38, 56)" />

            {/* Front Leg */}
            <g style={{
                transform: isJumping ? 'rotate(25deg)' : `rotate(${legAngle1}deg)`,
                transformOrigin: '40px 58px'
            }}>
                <rect x="36" y="56" width="9" height="26" rx="4" fill="url(#skinGradE)" />
                <rect x="34" y="78" width="14" height="9" rx="4" fill="url(#shoeGradE)" />
                <rect x="32" y="82" width="18" height="6" rx="2" fill="url(#shoeGradE)" />
                {/* Shoe detail */}
                <path d="M34 85 L48 85" stroke="#FCA5A5" strokeWidth="1" />
            </g>

            {/* Front Arm */}
            <g style={{
                transform: isJumping ? 'rotate(-50deg)' : `rotate(${armAngle1}deg)`,
                transformOrigin: '42px 32px'
            }}>
                <rect x="38" y="30" width="7" height="22" rx="3" fill="url(#shirtGradE)" />
                <ellipse cx="42" cy="54" rx="4" ry="3" fill="url(#skinGradE)" />
            </g>
        </svg>
    );
};

// Space Runner - Side profile astronaut
const SpaceRunner = ({ isJumping, animationPhase, planetColor }) => {
    const legAngle1 = animationPhase % 2 === 0 ? 40 : -30;
    const legAngle2 = animationPhase % 2 === 0 ? -30 : 40;
    const armAngle1 = animationPhase % 2 === 0 ? -35 : 25;
    const armAngle2 = animationPhase % 2 === 0 ? 25 : -35;

    return (
        <svg viewBox="0 0 85 100" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="suitGradS" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>
                <linearGradient id="visorGradS" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="bootGradS" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#64748B" />
                    <stop offset="100%" stopColor="#334155" />
                </linearGradient>
            </defs>

            {/* Backpack */}
            <rect x="18" y="30" width="14" height="28" rx="4" fill="#94A3B8" />
            <rect x="20" y="34" width="3" height="6" rx="1" fill="#475569" />
            <rect x="20" y="44" width="3" height="6" rx="1" fill="#475569" />
            <circle cx="26" cy="52" r="3" fill={planetColor}>
                <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
            </circle>

            {/* Back Arm */}
            <g style={{
                transform: isJumping ? 'rotate(55deg)' : `rotate(${armAngle2}deg)`,
                transformOrigin: '35px 35px'
            }}>
                <rect x="30" y="33" width="8" height="20" rx="4" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
                <ellipse cx="34" cy="55" rx="5" ry="4" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* Back Leg */}
            <g style={{
                transform: isJumping ? 'rotate(-25deg)' : `rotate(${legAngle2}deg)`,
                transformOrigin: '38px 58px'
            }}>
                <rect x="34" y="56" width="10" height="24" rx="4" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
                <ellipse cx="39" cy="84" rx="8" ry="6" fill="url(#bootGradS)" />
            </g>

            {/* Body - bulky suit, leaning forward */}
            <g transform="rotate(-12, 42, 45)">
                <ellipse cx="42" cy="42" rx="14" ry="18" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="2" />
                {/* Chest panel */}
                <rect x="36" y="36" width="12" height="10" rx="2" fill="#334155" />
                <circle cx="39" cy="40" r="1.5" fill="#22C55E">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="45" cy="40" r="1.5" fill="#EF4444" />
            </g>

            {/* Helmet - side profile */}
            <g transform="translate(32, 2)">
                {/* Helmet shell */}
                <ellipse cx="18" cy="18" rx="18" ry="17" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="2" />
                {/* Visor - golden reflective */}
                <ellipse cx="24" cy="18" rx="12" ry="11" fill="url(#visorGradS)" />
                {/* Visor reflection */}
                <path d="M18 12 Q24 8 30 14" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
                {/* Antenna */}
                <rect x="8" y="4" width="3" height="10" rx="1" fill="#64748B" />
                <circle cx="9.5" cy="2" r="3" fill="#EF4444">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
            </g>

            {/* Front Leg */}
            <g style={{
                transform: isJumping ? 'rotate(20deg)' : `rotate(${legAngle1}deg)`,
                transformOrigin: '44px 58px'
            }}>
                <rect x="40" y="56" width="11" height="26" rx="5" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
                <ellipse cx="46" cy="86" rx="10" ry="7" fill="url(#bootGradS)" />
                {/* Boot detail */}
                <path d="M38 86 L54 86" stroke="#1E293B" strokeWidth="1" />
            </g>

            {/* Front Arm */}
            <g style={{
                transform: isJumping ? 'rotate(-45deg)' : `rotate(${armAngle1}deg)`,
                transformOrigin: '48px 35px'
            }}>
                <rect x="44" y="33" width="9" height="22" rx="4" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
                <ellipse cx="49" cy="57" rx="6" ry="5" fill="url(#suitGradS)" stroke="#94A3B8" strokeWidth="1" />
            </g>
        </svg>
    );
};

// ============================================================================
// SCROLLING GROUND COMPONENT
// ============================================================================

const ScrollingGround = ({ planetName, groundColor, isPlaying, speed }) => {
    const getGroundPattern = () => {
        const slots = 20;
        const items = [];
        for (let i = 0; i < slots; i++) {
            const x = (i / slots) * 100;
            if (planetName === 'Earth') {
                items.push(<circle key={i} cx={`${x}%`} cy="20" r="8" fill="rgba(255,255,255,0.2)" />);
                items.push(<path key={`p${i}`} d={`M${x}% 2`} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />);
            } else if (planetName === 'Moon') {
                items.push(<circle key={i} cx={`${x}%`} cy="15" r="10" fill="rgba(0,0,0,0.1)" />);
                items.push(<circle key={`c${i}`} cx={`${x + 2}%`} cy="25" r="4" fill="rgba(0,0,0,0.05)" />);
            } else if (planetName === 'Mars') {
                items.push(<path key={i} d={`M${x}% 10 L${x + 3}% 30 L${x - 3}% 30 Z`} fill="rgba(0,0,0,0.1)" />);
            } else if (planetName === 'Jupiter') {
                items.push(<rect key={i} x={`${x}%`} y="10" width="15" height="4" rx="2" fill="rgba(255,255,255,0.1)" />);
            }
        }
        return items;
    };
    
    // Sync animation duration with game speed (base speed 8 was 1.5s)
    const duration = speed ? (1.5 * 8 / speed) : 1.5;

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200%',
            height: '40px',
            background: `linear-gradient(to bottom, ${groundColor}, ${groundColor}dd)`,
            zIndex: 6,
            borderTop: '4px solid rgba(255,255,255,0.4)',
            overflow: 'hidden'
        }}>
            <svg
                width="200%"
                height="100%"
                style={{
                    animation: isPlaying ? `scrollGround ${duration}s linear infinite` : 'none'
                }}
            >
                {getGroundPattern()}
            </svg>
            <style>{`
                @keyframes scrollGround {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

// ============================================================================
// OBSTACLE COMPONENTS - Pikes and Themed Hazards
// ============================================================================

const EarthObstacle = ({ width, height }) => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
            <linearGradient id="rockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716C" />
                <stop offset="100%" stopColor="#44403C" />
            </linearGradient>
        </defs>
        <path d="M10 100 L20 60 L35 80 L50 30 L65 70 L80 50 L90 100 Z" fill="url(#rockGrad)" />
        <path d="M15 100 L30 75 L50 45 L70 65 L85 100 Z" fill="#57534E" opacity="0.5" />
        <path d="M5 100 Q8 85 12 100" stroke="#22C55E" strokeWidth="3" fill="none" />
        <path d="M85 100 Q88 88 92 100" stroke="#22C55E" strokeWidth="3" fill="none" />
    </svg>
);

const MoonObstacle = ({ width, height }) => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
            <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
        </defs>
        <polygon points="15,100 25,20 35,100" fill="url(#crystalGrad)" />
        <polygon points="30,100 45,40 60,100" fill="url(#crystalGrad)" />
        <polygon points="55,100 70,15 85,100" fill="url(#crystalGrad)" />
        <path d="M25 30 L28 50" stroke="white" strokeWidth="2" opacity="0.6" />
        <path d="M70 25 L73 45" stroke="white" strokeWidth="2" opacity="0.6" />
    </svg>
);

const MarsObstacle = ({ width, height }) => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
            <linearGradient id="marsSpikeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
        </defs>
        <polygon points="10,100 20,10 30,100" fill="url(#marsSpikeGrad)" />
        <polygon points="25,100 40,25 55,100" fill="url(#marsSpikeGrad)" />
        <polygon points="50,100 65,5 80,100" fill="url(#marsSpikeGrad)" />
        <polygon points="70,100 85,35 100,100" fill="url(#marsSpikeGrad)" />
        <path d="M20 20 L22 40" stroke="#FCA5A5" strokeWidth="2" opacity="0.5" />
        <path d="M65 15 L67 35" stroke="#FCA5A5" strokeWidth="2" opacity="0.5" />
    </svg>
);

const JupiterObstacle = ({ width, height }) => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
            <linearGradient id="gasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <ellipse cx="25" cy="80" rx="20" ry="15" fill="url(#gasGrad)" opacity="0.8" />
        <ellipse cx="25" cy="60" rx="15" ry="12" fill="url(#gasGrad)" opacity="0.7" />
        <ellipse cx="25" cy="45" rx="10" ry="8" fill="url(#gasGrad)" opacity="0.6" />
        <ellipse cx="70" cy="85" rx="25" ry="18" fill="url(#gasGrad)" opacity="0.8" />
        <ellipse cx="70" cy="60" rx="18" ry="14" fill="url(#gasGrad)" opacity="0.7" />
        <ellipse cx="70" cy="40" rx="12" ry="10" fill="url(#gasGrad)" opacity="0.6" />
        <ellipse cx="70" cy="25" rx="8" ry="6" fill="url(#gasGrad)" opacity="0.5" filter="url(#glow)" />
    </svg>
);

// ============================================================================
// DUST PARTICLE EFFECT
// ============================================================================

const DustParticles = ({ isRunning, planetColor }) => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.06,
        size: 4 + Math.random() * 5,
        offsetY: Math.random() * 15
    }));

    if (!isRunning) return null;

    return (
        <div style={{ position: 'absolute', left: '40px', bottom: '45px', pointerEvents: 'none' }}>
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    animate={{
                        x: [-5, -40 - Math.random() * 30],
                        y: [p.offsetY, p.offsetY - 10 - Math.random() * 15],
                        opacity: [0.9, 0],
                        scale: [1, 0.3]
                    }}
                    transition={{
                        duration: 0.5,
                        delay: p.delay,
                        repeat: Infinity,
                        repeatDelay: 0.15
                    }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: planetColor,
                        opacity: 0.7
                    }}
                />
            ))}
        </div>
    );
};

// ============================================================================
// ENHANCED BACKGROUNDS
// ============================================================================

const EarthBackground = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #60A5FA, #93C5FD, #DBEAFE)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '60px', width: '50px', height: '50px', background: 'radial-gradient(#FEF08A, #FBBF24)', borderRadius: '50%', boxShadow: '0 0 40px #FBBF24' }} />
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0 }}>
            <ellipse cx="100" cy="60" rx="40" ry="20" fill="white" opacity="0.9" />
            <ellipse cx="130" cy="55" rx="30" ry="18" fill="white" opacity="0.9" />
            <ellipse cx="70" cy="65" rx="25" ry="15" fill="white" opacity="0.9" />
            <ellipse cx="600" cy="80" rx="50" ry="22" fill="white" opacity="0.8" />
            <ellipse cx="640" cy="75" rx="35" ry="20" fill="white" opacity="0.8" />
            <ellipse cx="350" cy="45" rx="30" ry="15" fill="white" opacity="0.7" />
        </svg>
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: '40px' }}>
            <path d="M-100 400 Q150 200 400 400 T900 400 T1400 400" fill="#86EFAC" opacity="0.5" />
            <path d="M-200 400 Q100 280 350 400 T800 400 T1300 400" fill="#4ADE80" opacity="0.7" />
            <path d="M-100 400 Q200 320 450 400 T950 400" fill="#22C55E" />
        </svg>
    </div>
);

const MoonBackground = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0F172A, #1E293B)', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0 }}>
            {[...Array(50)].map((_, i) => (
                <circle
                    key={i}
                    cx={Math.random() * 1000}
                    cy={Math.random() * 300}
                    r={0.5 + Math.random() * 1.5}
                    fill="white"
                    opacity={0.3 + Math.random() * 0.7}
                >
                    <animate attributeName="opacity" values={`${0.3 + Math.random() * 0.3};1;${0.3 + Math.random() * 0.3}`} dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
                </circle>
            ))}
        </svg>
        <div style={{ position: 'absolute', top: '30px', right: '80px', width: '60px', height: '60px' }}>
            <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#3B82F6" />
                <path d="M20 40 Q50 30 80 50 Q60 70 30 60 Q20 50 20 40" fill="#22C55E" opacity="0.8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.5" />
            </svg>
        </div>
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: '40px' }}>
            <path d="M-100 400 Q100 350 300 380 Q500 360 700 390 Q900 370 1100 400" fill="#64748B" />
            <circle cx="150" cy="370" r="20" fill="#4B5563" opacity="0.5" />
            <circle cx="450" cy="385" r="30" fill="#4B5563" opacity="0.4" />
            <circle cx="750" cy="375" r="25" fill="#4B5563" opacity="0.5" />
        </svg>
    </div>
);

const MarsBackground = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #431407, #7C2D12, #B45309)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40px', left: '80px', width: '35px', height: '35px', background: 'radial-gradient(#FCD34D, #F59E0B)', borderRadius: '50%', opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(180, 83, 9, 0.3), transparent)', height: '40%' }} />
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: '40px' }}>
            <path d="M-100 400 L100 200 L250 350 L400 150 L550 380 L700 180 L850 320 L1000 100 L1100 400 Z" fill="#9A3412" opacity="0.4" />
            <path d="M-50 400 L150 280 L350 400 L500 250 L650 400 L800 300 L950 400" fill="#7C2D12" opacity="0.7" />
            <path d="M-100 400 Q200 380 400 400 Q600 390 800 400 Q950 395 1100 400" fill="#92400E" />
        </svg>
    </div>
);

const JupiterBackground = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #451A03, #78350F, #92400E)', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, opacity: 0.4 }}>
            <rect x="0" y="30" width="100%" height="25" fill="#D97706" />
            <rect x="0" y="80" width="100%" height="40" fill="#B45309" />
            <rect x="0" y="150" width="100%" height="30" fill="#D97706" />
            <rect x="0" y="220" width="100%" height="50" fill="#B45309" />
        </svg>
        <ellipse cx="200" cy="100" rx="40" ry="25" fill="#DC2626" opacity="0.4" style={{ position: 'absolute' }} />
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: '40px' }}>
            <ellipse cx="500" cy="420" rx="600" ry="80" fill="#78350F" />
            <ellipse cx="500" cy="410" rx="550" ry="60" fill="#92400E" />
        </svg>
    </div>
);

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

const GravityRunner = () => {
    const navigate = useNavigate();
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });

    const planets = [
        { name: 'Moon', gravity: 0.15, color: '#94A3B8', groundColor: '#64748B', bg: <MoonBackground />, ObstacleComponent: MoonObstacle, dustColor: '#94A3B8' },
        { name: 'Mars', gravity: 0.25, color: '#EF4444', groundColor: '#B91C1C', bg: <MarsBackground />, ObstacleComponent: MarsObstacle, dustColor: '#DC2626' },
        { name: 'Earth', gravity: 0.45, color: '#3B82F6', groundColor: '#16A34A', bg: <EarthBackground />, ObstacleComponent: EarthObstacle, dustColor: '#A3A3A3' },
        { name: 'Jupiter', gravity: 0.8, color: '#F59E0B', groundColor: '#78350F', bg: <JupiterBackground />, ObstacleComponent: JupiterObstacle, dustColor: '#D97706' }
    ];

    const [currentPlanet, setCurrentPlanet] = useState(planets[2]);
    const [gameState, setGameState] = useState('start');
    const [score, setScore] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [animationPhase, setAnimationPhase] = useState(0);

    // Physics State
    const [posY, setPosY] = useState(0);
    const velocityRef = useRef(0);
    const posYRef = useRef(0);
    const isJumpingRef = useRef(false);

    const gameRef = useRef(null);
    const frameRef = useRef();
    const lastTimeRef = useRef(0);
    const spawnTimerRef = useRef(0);
    const animationTimerRef = useRef(0);

    const handleJump = useCallback(() => {
        if (gameState !== 'playing' || isJumpingRef.current) return;
        velocityRef.current = 15;
        isJumpingRef.current = true;
    }, [gameState]);

    // Keyboard event listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                if (gameState === 'start') {
                    startGame();
                } else {
                    handleJump();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, handleJump]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setObstacles([]);
        setPosY(0);
        posYRef.current = 0;
        velocityRef.current = 0;
        isJumpingRef.current = false;
        spawnTimerRef.current = 0;
        animationTimerRef.current = 0;
        lastTimeRef.current = performance.now();
    };

    const update = (time) => {
        if (gameState !== 'playing') {
            cancelAnimationFrame(frameRef.current);
            return;
        }

        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // Animation phase for running legs - faster animation
        animationTimerRef.current += delta;
        if (animationTimerRef.current > 80) {
            setAnimationPhase(prev => prev + 1);
            animationTimerRef.current = 0;
        }

        // Physics Update
        if (isJumpingRef.current || posYRef.current > 0) {
            velocityRef.current -= currentPlanet.gravity * (delta / 16) * 2;
            posYRef.current += velocityRef.current * (delta / 16);

            if (posYRef.current <= 0) {
                posYRef.current = 0;
                velocityRef.current = 0;
                isJumpingRef.current = false;
            }
            setPosY(posYRef.current);
        }

        // Obstacle Update
        // Start even slower for mobile (4.5), increase by 0.5 every 100 UI points
        const obstacleSpeed = 4.5 + Math.floor(score / 1000) * 0.5;
        setObstacles(prev => {
            const next = prev.map(obs => ({ ...obs, x: obs.x - (obstacleSpeed * delta / 16) }));

            for (const obs of next) {
                const playerLeft = 55;
                const playerRight = 100; // Narrower player box for fairness
                const obstacleLeft = obs.x;
                const obstacleRight = obs.x + obs.width;
                const obstacleHeight = obs.height;

                const hasXOverlap = obstacleLeft < playerRight && obstacleRight > playerLeft;
                // Higher tolerance for Y overlap (was -10, now -20)
                const hasYOverlap = posYRef.current < (obstacleHeight - 20);

                if (hasXOverlap && hasYOverlap) {
                    setGameState('gameover');
                    playWrong();
                    return next;
                }
            }
            return next.filter(obs => obs.x > -150);
        });

        // Spawn Logic - More generous gaps (was 3000, now 3500)
        spawnTimerRef.current += delta;
        const spawnInterval = 3500 - (obstacleSpeed * 180);
        if (spawnTimerRef.current > Math.max(1200, spawnInterval)) {
            const w = 45 + Math.random() * 35; // Slightly smaller obstacles
            const h = 45 + Math.random() * 35;
            setObstacles(prev => [...prev, { id: Date.now(), x: 900, width: w, height: h }]);
            spawnTimerRef.current = 0;
        }

        setScore(s => s + 1);
        if (score > 0 && score % 10000 === 0) playPerfect();

        frameRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            frameRef.current = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(frameRef.current);
    }, [gameState, currentPlanet]);

    const isOnEarth = currentPlanet.name === 'Earth';
    const isJumping = isJumpingRef.current || posY > 5;

    return (
        <div
            tabIndex="0"
            onClick={handleJump}
            style={{ padding: '40px 20px', minHeight: '100vh', background: '#0F172A', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', outline: 'none' }}
        >
            <header style={{ 
                width: '100%', 
                maxWidth: '1000px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px', 
                zIndex: 10, 
                flexWrap: 'nowrap', // Don't wrap on header to keep it clean
                gap: '10px' 
            }}>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); navigate('/science'); }}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px', border: 'none', borderRadius: '16px', cursor: 'pointer', flexShrink: 0 }}
                >
                    <ArrowLeft size={20} />
                </motion.button>

                <h2 style={{ fontFamily: 'Fredoka', margin: 0, fontSize: '18px', textAlign: 'center', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gravity Runner</h2>

                <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    <Star color="#F59E0B" fill="#F59E0B" size={16} />
                    <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px' }}>{Math.floor(score / 10)}</span>
                </div>
            </header>

            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '20px', 
                zIndex: 10, 
                flexWrap: 'nowrap', // Keep planet selection on one row with scroll if needed
                overflowX: 'auto',
                width: '100%',
                paddingBottom: '5px',
                justifyContent: 'center',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}>
                {planets.map(p => (
                    <motion.button
                        key={p.name}
                        onClick={(e) => { e.stopPropagation(); setCurrentPlanet(p); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '6px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: currentPlanet.name === p.name ? p.color : 'rgba(255,255,255,0.1)',
                            color: 'white', fontWeight: 'bold', fontFamily: 'Fredoka', fontSize: '12px',
                            boxShadow: currentPlanet.name === p.name ? `0 3px 10px ${p.color}50` : 'none',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {p.name}
                    </motion.button>
                ))}
            </div>

            <div ref={gameRef} style={{ 
                flex: 1, 
                width: '100%', 
                maxWidth: '850px', 
                minHeight: '250px', // Smaller minHeight for mobile
                height: 'auto', 
                background: '#000', 
                borderRadius: '24px', 
                border: '3px solid white', 
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                aspectRatio: '16/9' // Maintain aspect ratio on mobile
            }}>

                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    {currentPlanet.bg}
                </div>

                {/* Animated Character - Side Profile */}
                <div
                    style={{
                        position: 'absolute', left: '55px', bottom: `${40 + posY}px`, zIndex: 5,
                        width: '60px', height: '75px',
                        transition: isJumping ? 'none' : 'transform 0.05s'
                    }}
                >
                    {isOnEarth ? (
                        <EarthRunner isJumping={isJumping} animationPhase={animationPhase} />
                    ) : (
                        <SpaceRunner isJumping={isJumping} animationPhase={animationPhase} planetColor={currentPlanet.color} />
                    )}
                </div>

                {/* Dust Particles */}
                {gameState === 'playing' && !isJumping && (
                    <DustParticles isRunning={true} planetColor={currentPlanet.dustColor} />
                )}

                {/* Styled Obstacles */}
                {obstacles.map(obs => (
                    <div
                        key={obs.id}
                        style={{
                            position: 'absolute', bottom: '40px', left: `${obs.x}px`,
                            width: `${obs.width}px`, height: `${obs.height}px`,
                            zIndex: 5
                        }}
                    >
                        <currentPlanet.ObstacleComponent width={obs.width} height={obs.height} />
                    </div>
                ))}

                {/* Scrolling Ground */}
                <ScrollingGround
                    planetName={currentPlanet.name}
                    groundColor={currentPlanet.groundColor}
                    isPlaying={gameState === 'playing'}
                    speed={8 + Math.floor(score / 1000) * 0.5}
                />

                <AnimatePresence>
                    {gameState === 'start' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                            <div style={{ width: '80px', height: '100px', marginBottom: '20px' }}>
                                {isOnEarth ? <EarthRunner isJumping={false} animationPhase={0} /> : <SpaceRunner isJumping={false} animationPhase={0} planetColor={currentPlanet.color} />}
                            </div>
                            <h1 style={{ fontFamily: 'Fredoka', fontSize: '36px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>READY FOR MISSION?</h1>
                            <p style={{ color: '#94A3B8', marginBottom: '20px' }}>Press Space, W, ↑ or Tap to Jump!</p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                style={{ padding: '15px 40px', background: `linear-gradient(135deg, ${currentPlanet.color}, ${currentPlanet.color}cc)`, border: 'none', borderRadius: '20px', color: 'white', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer', boxShadow: `0 8px 30px ${currentPlanet.color}50` }}
                            >
                                GO! 🚀
                            </motion.button>
                        </motion.div>
                    )}

                    {gameState === 'gameover' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <RefreshCcw size={64} color="#EF4444" style={{ marginBottom: '20px' }} />
                            </motion.div>
                            <h1 style={{ fontFamily: 'Fredoka', color: '#EF4444', textShadow: '0 4px 20px rgba(239,68,68,0.3)' }}>MISSION FAILED!</h1>
                            <p style={{ fontSize: '24px', marginBottom: '20px' }}>Score: <strong>{Math.floor(score / 10)}</strong></p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                style={{ padding: '15px 40px', background: 'linear-gradient(135deg, white, #E2E8F0)', border: 'none', borderRadius: '20px', color: '#0F172A', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 30px rgba(255,255,255,0.2)' }}
                            >
                                RETRY 🔄
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', opacity: 0.8 }}>
                <p style={{ fontFamily: 'Fredoka', fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Info size={18} />
                    Current Gravity: {currentPlanet.gravity} G • {isOnEarth ? '👟 Casual Mode' : '🧑‍🚀 Space Suit'}
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
            `}</style>
        </div>
    );
};

export default GravityRunner;
