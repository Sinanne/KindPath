import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Star, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const MathGame = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playPerfect] = useSound(SOUND_URLS.perfect);

    const [equation, setEquation] = useState({ a: 0, b: 0, answer: 0 });
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [isCharging, setIsCharging] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const slotRef = useRef(null);

    const colorScheme = {
        primary: '#FF4D4D',
        accent: '#CC0000',
        robotBody: '#64748B',
        robotMetal: '#CBD5E1',
        robotGlow: '#22D3EE',
        success: '#10B981',
        error: '#EF4444'
    };

    const generateGame = () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;

        const opts = new Set([answer]);
        while (opts.size < 4) {
            let wrong = answer + (Math.floor(Math.random() * 10) - 5);
            if (wrong >= 0 && wrong !== answer) opts.add(wrong);
        }

        setEquation({ a, b, answer });
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        setFeedback(null);
        setIsCharging(false);
    };

    useEffect(() => {
        generateGame();
    }, []);

    const handleAnswer = (val) => {
        if (val === equation.answer) {
            playCorrect();
            setFeedback('correct');
            setIsCharging(true);
            setScore(s => s + 10);
            if ((score + 10) % 50 === 0) playPerfect();
            setTimeout(() => generateGame(), 1500);
        } else {
            playWrong();
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    const checkDrop = (event, info, opt) => {
        if (!slotRef.current) return;
        const slotRect = slotRef.current.getBoundingClientRect();
        const { x, y } = info.point;

        if (
            x >= slotRect.left &&
            x <= slotRect.right &&
            y >= slotRect.top &&
            y <= slotRect.bottom
        ) {
            handleAnswer(opt);
        }
    };

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh', background: '#F0F9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
            <header style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', zIndex: 10, flexWrap: 'wrap', gap: '15px' }}>
                <motion.button
                    whileTap={{ y: 4, boxShadow: 'none' }}
                    onClick={() => navigate('/math')}
                    style={{ background: 'white', color: '#64748B', padding: '10px', border: 'none', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '16px', cursor: 'pointer' }}
                >
                    <ArrowLeft size={20} />
                </motion.button>

                <div style={{ background: 'white', padding: '8px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 0 #E2E8F0', border: '2px solid #F1F5F9' }}>
                    <Zap color="#F59E0B" fill="#F59E0B" size={20} />
                    <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: 'var(--fs-lg)', color: '#1E293B' }}>{score}</span>
                </div>
            </header>

            <div style={{ flex: 1, width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '40px', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>

                {/* Advanced Robot */}
                <div style={{ position: 'relative', width: 'clamp(200px, 80vw, 300px)', height: 'clamp(300px, 110vw, 450px)', display: 'flex', flexDirection: 'column', alignItems: 'center', shrink: 0 }}>
                    {/* Floating Head */}
                    <motion.div
                        animate={isCharging ? { y: [-5, 5, -5] } : { y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: isCharging ? 0.3 : 3, ease: 'easeInOut' }}
                        style={{ width: '140px', height: '120px', background: colorScheme.robotBody, borderRadius: '35px', border: '6px solid #0F172A', position: 'relative', zIndex: 5, boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.2)' }}
                    >
                        {/* Expressive Eyes */}
                        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '35px' }}>
                            <motion.div
                                animate={feedback === 'correct' ? { scaleY: 0.1 } : { scaleY: 1 }}
                                style={{ width: '24px', height: '24px', borderRadius: '50%', background: isCharging ? colorScheme.robotGlow : '#0F172A', boxShadow: isCharging ? `0 0 20px ${colorScheme.robotGlow}` : 'none' }}
                            />
                            <motion.div
                                animate={feedback === 'correct' ? { scaleY: 0.1 } : { scaleY: 1 }}
                                style={{ width: '24px', height: '24px', borderRadius: '50%', background: isCharging ? colorScheme.robotGlow : '#0F172A', boxShadow: isCharging ? `0 0 20px ${colorScheme.robotGlow}` : 'none' }}
                            />
                        </div>
                        {/* Antenna */}
                        <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '40px', background: '#0F172A' }}>
                            <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{ width: '20px', height: '20px', borderRadius: '50%', background: isCharging ? colorScheme.robotGlow : '#64748B', position: 'absolute', top: '-15px', left: '-6px', boxShadow: isCharging ? `0 0 15px ${colorScheme.robotGlow}` : 'none' }}
                            />
                        </div>
                    </motion.div>

                    {/* Torso */}
                    <motion.div
                        style={{
                            width: 'clamp(180px, 70vw, 260px)', height: 'clamp(200px, 75vw, 280px)', background: colorScheme.robotBody, borderRadius: '40px', border: '6px solid #0F172A', marginTop: '-10px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                            boxShadow: `inset 0 -10px 20px rgba(0,0,0,0.1), 0 15px 30px rgba(0,0,0,0.1)`
                        }}
                    >
                        {/* Digital Screen */}
                        <div style={{ width: '80%', height: '30%', background: '#0F172A', borderRadius: '20px', marginTop: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #334155' }}>
                            <span style={{ fontSize: 'clamp(24px, 10vw, 42px)', fontWeight: '900', color: isCharging ? colorScheme.robotGlow : '#ECFEFF', fontFamily: 'Fredoka', letterSpacing: '2px' }}>
                                {equation.a} + {equation.b}
                            </span>
                        </div>

                        {/* Magnetic Power Core (Drop Target) */}
                        <div
                            ref={slotRef}
                            style={{
                                width: 'clamp(60px, 20vw, 100px)', height: 'clamp(60px, 20vw, 100px)', background: '#020617', borderRadius: '50%', marginTop: '10%',
                                border: `4px solid ${feedback === 'wrong' ? colorScheme.error : isCharging ? colorScheme.robotGlow : '#1E293B'}`,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',
                                boxShadow: isCharging ? `0 0 20px ${colorScheme.robotGlow}80` : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <AnimatePresence>
                                {isCharging ? (
                                    <motion.div key="zap" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <Zap color={colorScheme.robotGlow} fill={colorScheme.robotGlow} size={30} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="waiting" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                                        <div style={{ width: '40px', height: '3px', background: 'rgba(34, 211, 238, 0.2)', borderRadius: '2px' }}></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {/* Glow ring */}
                            <div style={{ position: 'absolute', inset: -8, border: '2px solid rgba(34, 211, 238, 0.1)', borderRadius: '50%' }}></div>
                        </div>
                    </motion.div>

                    {/* Floating Base */}
                    <div style={{ marginTop: '20px', width: '200px', height: '30px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', filter: 'blur(5px)' }}></div>
                </div>

                {/* Battery Cells (Draggable Items) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    {options.map((opt, i) => (
                        <motion.div
                            key={`${opt}-${i}`}
                            drag
                            dragSnapToOrigin
                            onDragEnd={(e, info) => checkDrop(e, info, opt)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileDrag={{ scale: 1.2, zIndex: 100, cursor: 'grabbing' }}
                            style={{
                                width: 'clamp(80px, 25vw, 110px)', height: 'clamp(100px, 30vw, 140px)', background: 'white', borderRadius: '20px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                fontSize: 'clamp(24px, 8vw, 38px)', fontWeight: '900', color: '#0F172A', fontFamily: 'Fredoka',
                                boxShadow: '0 8px 0 #E2E8F0', border: '4px solid #F1F5F9', cursor: 'grab',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* Battery Styling */}
                            <div style={{ position: 'absolute', top: 0, width: '100%', height: '8px', background: '#F1F5F9' }}></div>
                            <span style={{ position: 'relative', zIndex: 1 }}>{opt}</span>
                            <div style={{ width: '30px', height: '10px', background: '#F1F5F9', border: '2px solid #E2E8F0', borderRadius: '4px', marginTop: '8px' }}></div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: '30px', textAlign: 'center', background: 'white', padding: '15px 30px', borderRadius: '25px', boxShadow: '0 8px 0 #E2E8F0', zIndex: 10, maxWidth: '90%' }}
            >
                <p style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '16px', fontWeight: 'bold' }}>
                    Drag a **Battery** into the Robot's heart! 💖
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <RefreshCcw color="#94A3B8" size={24} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Success Overlay */}
            <AnimatePresence>
                {feedback === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(34, 211, 238, 0.9)', zIndex: 1000,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                            <Star size={120} fill="white" />
                        </motion.div>
                        <h1 style={{ fontSize: '80px', fontFamily: 'Fredoka', marginTop: '20px' }}>POWER UP!</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>+10 XP ENERGY RECEIVED</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MathGame;
