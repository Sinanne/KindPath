import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const LanguageGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addStars } = useGamification();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });

    const words = [
        { en: 'APPLE', ar: 'تفاحة', image: '🍎' },
        { en: 'CAT', ar: 'قطة', image: '🐱' },
        { en: 'SUN', ar: 'شمس', image: '☀️' },
        { en: 'MOON', ar: 'قمر', image: '🌙' },
        { en: 'BOOK', ar: 'كتاب', image: '📚' },
        { en: 'BIRD', ar: 'طائر', image: '🐦' },
        { en: 'FISH', ar: 'سمكة', image: '🐟' }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [spelled, setSpelled] = useState('');
    const [bubbles, setBubbles] = useState([]);
    const [gameState, setGameState] = useState('playing'); // playing, success

    const currentWord = words[currentIdx];
    const spawnTimerRef = useRef(null);
    const laneRef = useRef(0); // Track next lane to spawn in

    // Reset game for next word
    useEffect(() => {
        setSpelled('');
        setBubbles([]);
        setGameState('playing');

        // Initial burst of 3 bubbles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnBubble(), i * 400);
        }

        // Start spawn interval - faster spawning (1.5s)
        spawnTimerRef.current = setInterval(spawnBubble, 1500);
        return () => clearInterval(spawnTimerRef.current);
    }, [currentIdx]);

    const spawnBubble = useCallback(() => {
        if (gameState !== 'playing') return;

        const letters = currentWord.en.split('');
        const neededLetter = letters[spelled.length];
        const extras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !letters.includes(l));

        // 70% chance to spawn the needed letter for better flow
        const isNeeded = Math.random() < 0.7;
        const letter = isNeeded ? neededLetter : (Math.random() > 0.5 ? letters[Math.floor(Math.random() * letters.length)] : extras[Math.floor(Math.random() * extras.length)]);

        const id = Math.random().toString(36).substr(2, 9);
        const lane = laneRef.current % 5;
        laneRef.current++;

        const newBubble = {
            id,
            letter,
            x: 10 + (lane * 20),
            duration: 8 + Math.random() * 3, // Slightly faster: 8-11 seconds
        };

        setBubbles(prev => [...prev, newBubble]);
    }, [currentWord.en, spelled.length, gameState]);

    const handlePop = (bubble) => {
        const nextLetter = currentWord.en[spelled.length];

        if (bubble.letter === nextLetter) {
            playCorrect();
            const nextSpelled = spelled + bubble.letter;
            setSpelled(nextSpelled);

            // Remove the bubble
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));

            if (nextSpelled === currentWord.en) {
                setGameState('success');
                setScore(s => s + 20);
                playPerfect();
                
                // Award stars based on subject
                const subject = location.pathname.includes('arabic') ? 'arabic' : 'english';
                addStars(20, subject);

                clearInterval(spawnTimerRef.current);
                setTimeout(() => {
                    setCurrentIdx((prev) => (prev + 1) % words.length);
                }, 1500);
            }
        } else {
            // Wrong letter - just shake or something? 
            // For kids, let's just make it a "ghost" pop - it disappears but doesn't count
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        }
    };

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', zIndex: 50, flexWrap: 'wrap', gap: '15px' }}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/english')}
                    style={{ background: 'white', color: '#0EA5E9', padding: '10px', border: 'none', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.1)' }}
                >
                    <ArrowLeft size={24} />
                </motion.button>

                <div style={{ background: 'white', padding: '8px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                    <Star color="#F59E0B" fill="#F59E0B" size={24} />
                    <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: 'var(--fs-lg)', color: '#1E293B' }}>{score}</span>
                </div>
            </header>

            {/* Main Area */}
            <div style={{ flex: 1, width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

                {/* Word Card */}
                <motion.div
                    layout
                    style={{
                        textAlign: 'center', marginBottom: '40px', background: 'white', padding: '20px',
                        width: '90%', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '2px solid #F0F9FF', zIndex: 10
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={currentWord.image}
                        style={{ fontSize: 'clamp(60px, 15vw, 100px)', marginBottom: '10px' }}
                    >
                        {currentWord.image}
                    </motion.div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {currentWord.en.split('').map((l, i) => (
                            <motion.div
                                key={i}
                                animate={spelled.length > i ? { scale: [1, 1.2, 1], backgroundColor: '#10B981' } : {}}
                                style={{
                                    width: 'clamp(40px, 12vw, 65px)', height: 'clamp(60px, 16vw, 85px)', background: spelled.length > i ? '#10B981' : '#F8FAFC',
                                    borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    fontSize: 'clamp(24px, 8vw, 44px)', fontWeight: 'bold', color: spelled.length > i ? 'white' : '#CBD5E1',
                                    fontFamily: 'Fredoka', border: '3px solid #E2E8F0'
                                }}
                            >
                                {spelled.length > i ? l : ''}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bubble Container */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <AnimatePresence>
                        {bubbles.map(b => (
                            <motion.button
                                key={b.id}
                                initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
                                animate={{ y: '30vh', opacity: 1, scale: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                transition={{ y: { duration: b.duration, ease: "linear" }, opacity: { duration: 0.5 } }}
                                onAnimationComplete={() => {
                                    // Remove bubble if it reaches the end of animation (middle of screen)
                                    setBubbles(prev => prev.filter(item => item.id !== b.id));
                                }}
                                onClick={() => handlePop(b)}
                                style={{
                                    position: 'absolute', left: `${b.x}%`, transform: 'translateX(-50%)',
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(186, 230, 253, 0.4) 100%)',
                                    border: '3px solid rgba(255,255,255,0.8)', cursor: 'pointer', pointerEvents: 'auto',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    fontSize: '42px', fontWeight: 'bold', color: '#0369A1',
                                    fontFamily: 'Fredoka', boxShadow: '0 10px 30px rgba(186, 230, 253, 0.4)',
                                    outline: 'none'
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.8 }}
                            >
                                {b.letter}
                                <div style={{ position: 'absolute', top: '15%', left: '20%', width: '25%', height: '25%', background: 'white', borderRadius: '50%', opacity: 0.6 }} />
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Tip */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    marginTop: 'auto', background: 'white', padding: '12px 30px', borderRadius: '25px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)', color: '#64748B', fontWeight: 'bold',
                    fontSize: 'var(--fs-base)', fontFamily: 'Fredoka', zIndex: 10
                }}
            >
                Spelling: <span style={{ color: '#0EA5E9' }}>{spelled || '...'}</span> 🫧
            </motion.div>

            <style>{`
                @font-face {
                    font-family: 'Fredoka';
                    src: url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
                }
            `}</style>
        </div>
    );
};

export default LanguageGame;
