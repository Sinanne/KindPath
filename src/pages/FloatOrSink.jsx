import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Waves, Trophy, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const FloatOrSink = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [currentItem, setCurrentItem] = useState(0);
    const [prediction, setPrediction] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const colorScheme = { primary: '#0EA5E9', accent: '#0284C7' };

    const items = [
        { name: 'Apple', emoji: '🍎', floats: true, reason: 'Apples have air pockets inside that help them float!' },
        { name: 'Rock', emoji: '🪨', floats: false, reason: 'Rocks are very dense and heavy, so they sink quickly.' },
        { name: 'Wooden Block', emoji: '🪵', floats: true, reason: 'Wood is less dense than water, so it floats!' },
        { name: 'Coin', emoji: '🪙', floats: false, reason: 'Metal coins are much denser than water.' },
        { name: 'Beach Ball', emoji: '🏐', floats: true, reason: 'Beach balls are full of air, making them very light!' },
        { name: 'Key', emoji: '🔑', floats: false, reason: 'Keys are made of metal which is heavier than water.' },
        { name: 'Rubber Duck', emoji: '🦆', floats: true, reason: 'Rubber ducks are hollow with air inside!' },
        { name: 'Marble', emoji: '⚫', floats: false, reason: 'Marbles are solid glass and sink right to the bottom.' },
    ];

    const item = items[currentItem];

    const handlePrediction = (willFloat) => {
        setPrediction(willFloat);
        setShowResult(true);
        setAttempts(attempts + 1);
        
        const isCorrect = willFloat === item.floats;
        if (isCorrect) { playCorrect(); setScore(score + 1); } else { playWrong(); }
        
        setTimeout(() => {
            if (currentItem + 1 < items.length) {
                setCurrentItem(currentItem + 1);
                setPrediction(null);
                setShowResult(false);
            } else {
                setGameComplete(true);
                playPerfect();
            }
        }, 2200);
    };

    const resetGame = () => {
        setCurrentItem(0);
        setPrediction(null);
        setShowResult(false);
        setScore(0);
        setAttempts(0);
        setGameComplete(false);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/science')} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Waves size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>Float or Sink?</span>
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '8px 18px', borderRadius: '14px', boxShadow: '0 4px 0 #E2E8F0', fontFamily: 'Fredoka', fontSize: '16px' }}>
                        Score: <strong style={{ color: colorScheme.primary }}>{score}/{attempts}</strong>
                    </div>
                </header>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        {!gameComplete ? (
                            <motion.div key={currentItem} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {/* Progress */}
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', flexShrink: 0 }}>
                                    {items.map((_, i) => (
                                        <div key={i} style={{ flex: 1, height: '8px', borderRadius: '4px', background: i < currentItem ? '#10B981' : i === currentItem ? colorScheme.primary : '#E2E8F0' }} />
                                    ))}
                                </div>
                                
                                {/* Main Game Area */}
                                <div style={{ flex: 1, background: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 8px 0 #E2E8F0', display: 'flex', gap: '30px', minHeight: 0 }}>
                                    {/* Water Tank */}
                                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '14px', textAlign: 'center', margin: '0 0 10px' }}>
                                            Item {currentItem + 1} of {items.length}
                                        </p>
                                        
                                        {/* Water Container */}
                                        <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(180deg, #BAE6FD 0%, #0EA5E9 25%, #0284C7 100%)', borderRadius: '24px', overflow: 'hidden', borderBottom: '8px solid #0369A1' }}>
                                            {/* Water Surface Line */}
                                            <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.4)', zIndex: 5 }} />
                                            
                                            {/* Animated Item */}
                                            <motion.div
                                                key={currentItem}
                                                initial={{ top: '-20%', left: '50%', x: '-50%', rotate: 0 }}
                                                animate={showResult 
                                                    ? { 
                                                        top: item.floats ? '20%' : '80%', 
                                                        left: '50%',
                                                        x: '-50%',
                                                        rotate: item.floats ? [0, 5, -5, 0] : [0, 15],
                                                        scale: [1, 1.1, 1]
                                                    } 
                                                    : { top: '5%', left: '50%', x: '-50%', rotate: 0 }
                                                }
                                                transition={showResult 
                                                    ? { 
                                                        top: { duration: item.floats ? 0.6 : 1.2, type: 'spring', bounce: item.floats ? 0.4 : 0 },
                                                        rotate: { duration: 2, repeat: item.floats ? Infinity : 0, ease: "easeInOut" }
                                                    } 
                                                    : { duration: 0.3 }
                                                }
                                                style={{ 
                                                    position: 'absolute', 
                                                    fontSize: '80px',
                                                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                                                    zIndex: 10
                                                }}
                                            >
                                                {/* Bobbing animation for floating items */}
                                                <motion.div
                                                    animate={showResult && item.floats ? { y: [0, -8, 0] } : { y: 0 }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    {item.emoji}
                                                </motion.div>
                                            </motion.div>

                                            {/* Ripples / Waves */}
                                            <motion.div 
                                                animate={{ x: [-10, 10, -10] }} 
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                                                style={{ position: 'absolute', top: '22%', left: '-10%', right: '-10%', textAlign: 'center', fontSize: '24px', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}
                                            >
                                                〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
                                            </motion.div>
                                        </div>
                                    </div>
                                    
                                    {/* Controls & Info */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h2 style={{ fontFamily: 'Fredoka', fontSize: '24px', color: '#1E293B', textAlign: 'center', marginBottom: '20px' }}>
                                            Will the <span style={{ color: colorScheme.primary }}>{item.name}</span> float or sink?
                                        </h2>
                                        
                                        {!showResult ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <motion.button 
                                                    variants={{
                                                        pulse: {
                                                            scale: [1, 1.05, 1],
                                                            filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
                                                            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                                        }
                                                    }}
                                                    animate="pulse"
                                                    whileHover={{ scale: 1.1 }} 
                                                    whileTap={{ scale: 0.97 }} 
                                                    onClick={() => handlePrediction(true)} 
                                                    style={{ padding: '18px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 5px 0 #059669' }}
                                                >
                                                    🏊 Float!
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }} 
                                                    whileTap={{ scale: 0.97 }} 
                                                    onClick={() => handlePrediction(false)} 
                                                    style={{ padding: '18px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 5px 0 #DC2626' }}
                                                >
                                                    ⬇️ Sink!
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '20px', borderRadius: '16px', background: prediction === item.floats ? '#DCFCE7' : '#FEE2E2', textAlign: 'center' }}>
                                                <p style={{ fontFamily: 'Fredoka', fontSize: '20px', fontWeight: 'bold', color: prediction === item.floats ? '#166534' : '#991B1B', margin: '0 0 10px' }}>
                                                    {prediction === item.floats ? '✅ Correct!' : '❌ Not quite!'}
                                                </p>
                                                <p style={{ fontFamily: 'Fredoka', fontSize: '14px', color: '#475569', margin: 0 }}>
                                                    {item.reason}
                                                </p>
                                            </motion.div>
                                        )}
                                        
                                        {/* Science Tip */}
                                        <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '12px', marginTop: '20px' }}>
                                            <p style={{ fontFamily: 'Fredoka', fontSize: '13px', color: '#92400E', margin: 0, textAlign: 'center' }}>
                                                💡 <strong>Density</strong> = how tightly packed stuff is. Less dense than water = floats!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', textAlign: 'center' }}>
                                    <Trophy size={70} color="#F59E0B" style={{ marginBottom: '20px' }} />
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>
                                        {score >= 7 ? 'Density Master!' : score >= 5 ? 'Great Job!' : 'Keep Learning!'}
                                    </h1>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '22px', color: '#64748B', marginBottom: '25px' }}>
                                        You got <strong style={{ color: colorScheme.primary }}>{score}</strong> out of <strong>{items.length}</strong> correct!
                                    </p>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetGame} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', padding: '16px 28px', background: colorScheme.primary, color: 'white', border: 'none', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer', boxShadow: `0 5px 0 ${colorScheme.accent}` }}>
                                        <RotateCcw size={20} /> Play Again
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FloatOrSink;
