import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Thermometer, Trophy, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const StatesOfMatter = () => {
    const navigate = useNavigate();
    const { addStars } = useGamification();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [stage, setStage] = useState('learn');
    const [temperature, setTemperature] = useState(50);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const colorScheme = { primary: '#06B6D4', accent: '#0891B2' };

    const getState = () => {
        if (temperature <= 0) return 'solid';
        if (temperature >= 100) return 'gas';
        return 'liquid';
    };

    const stateInfo = {
        solid: { name: 'Solid (Ice)', emoji: '🧊', color: '#60A5FA', desc: 'Molecules vibrate in place but stay together', examples: ['Ice cubes', 'Rocks', 'Wood'] },
        liquid: { name: 'Liquid (Water)', emoji: '💧', color: '#3B82F6', desc: 'Molecules move around freely but stay close', examples: ['Water', 'Juice', 'Milk'] },
        gas: { name: 'Gas (Steam)', emoji: '💨', color: '#94A3B8', desc: 'Molecules zoom everywhere with lots of energy', examples: ['Steam', 'Air', 'Clouds'] }
    };

    const quizQuestions = [
        { q: 'What state is an ice cube?', a: 'Solid', options: ['Solid', 'Liquid', 'Gas'] },
        { q: 'What happens when water reaches 100°C?', a: 'It becomes steam (gas)', options: ['It freezes', 'It becomes steam (gas)', 'Nothing happens'] },
        { q: 'In which state do molecules move the most?', a: 'Gas', options: ['Solid', 'Liquid', 'Gas'] },
        { q: 'At what temperature does water freeze?', a: '0°C', options: ['100°C', '50°C', '0°C'] },
    ];

    const handleQuizAnswer = (answer) => {
        const isCorrect = answer === quizQuestions[quizIndex].a;
        if (isCorrect) { playCorrect(); setScore(score + 1); } else { playWrong(); }
        if (quizIndex + 1 < quizQuestions.length) {
            setTimeout(() => setQuizIndex(quizIndex + 1), 500);
        } else {
            setTimeout(() => { 
                setStage('results'); 
                playPerfect(); 
                addStars(score * 10, 'science');
            }, 500);
        }
    };

    const info = stateInfo[getState()];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: isMobile ? '10px' : '20px', background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', overflowX: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => stage === 'learn' ? navigate('/science') : setStage('learn')} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Droplets size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>States of Matter</span>
                        </div>
                    </div>
                    {stage === 'learn' && (
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
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => { setStage('quiz'); setQuizIndex(0); setScore(0); }} 
                            style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #D97706' }}
                        >
                            Take Quiz! 🎯
                        </motion.button>
                    )}
                </header>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        {stage === 'learn' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {/* Main Demo Area */}
                                <div style={{ 
                                    flex: 1, 
                                    background: 'white', 
                                    borderRadius: '24px', 
                                    padding: isMobile ? '20px 15px' : '25px', 
                                    boxShadow: '0 8px 0 #E2E8F0', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: isMobile ? '25px' : '50px', 
                                    minHeight: 0,
                                    flexDirection: isMobile ? 'column' : 'row'
                                }}>
                                    {/* Temperature Slider */}
                                    <div style={{ textAlign: 'center' }}>
                                        <motion.div key={getState()} initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ fontSize: '100px', marginBottom: '15px' }}>
                                            {info.emoji}
                                        </motion.div>
                                        <h2 style={{ fontFamily: 'Fredoka', fontSize: '28px', color: info.color, marginBottom: '8px' }}>{info.name}</h2>
                                        <p style={{ fontFamily: 'Fredoka', fontSize: '15px', color: '#64748B', maxWidth: '300px', margin: '0 auto 20px' }}>{info.desc}</p>
                                        
                                        <div style={{ background: '#F1F5F9', padding: isMobile ? '15px' : '20px 30px', borderRadius: '20px', width: isMobile ? '100%' : '350px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
                                                <Thermometer size={28} color="#EF4444" />
                                                <span style={{ fontFamily: 'Fredoka', fontSize: '32px', fontWeight: 'bold', color: temperature <= 0 ? '#60A5FA' : temperature >= 100 ? '#EF4444' : '#3B82F6' }}>
                                                    {temperature}°C
                                                </span>
                                            </div>
                                            <input type="range" min="-20" max="120" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} style={{ width: '100%', height: '12px', cursor: 'pointer', accentColor: info.color }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontFamily: 'Fredoka', fontSize: '13px', color: '#94A3B8' }}>
                                                <span>🧊 Freeze (0°C)</span><span>💧 Room</span><span>💨 Boil (100°C)</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* State Cards */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
                                        {Object.entries(stateInfo).map(([key, state]) => (
                                            <div key={key} style={{ background: getState() === key ? `${state.color}15` : '#F8FAFC', padding: isMobile ? '10px 15px' : '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: getState() === key ? `2px solid ${state.color}` : '2px solid transparent', minWidth: isMobile ? 'auto' : '250px' }}>
                                                <div style={{ fontSize: '40px' }}>{state.emoji}</div>
                                                <div>
                                                    <h4 style={{ fontFamily: 'Fredoka', color: state.color, margin: 0, fontSize: '16px' }}>{state.name.split(' ')[0]}</h4>
                                                    <p style={{ fontFamily: 'Fredoka', fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>{state.examples.join(', ')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Tip */}
                                <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '12px 20px', marginTop: '15px', textAlign: 'center', flexShrink: 0 }}>
                                    <span style={{ fontFamily: 'Fredoka', fontSize: '14px', color: '#92400E' }}>💡 <strong>Tip:</strong> Drag the slider to change the temperature and watch water change between solid, liquid, and gas!</span>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'quiz' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '40px', borderRadius: '28px', boxShadow: '0 10px 0 #E2E8F0', maxWidth: '550px', width: '100%' }}>
                                    <p style={{ color: colorScheme.primary, fontWeight: 'bold', fontFamily: 'Fredoka', marginBottom: '10px', fontSize: '15px' }}>Question {quizIndex + 1} of {quizQuestions.length}</p>
                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '24px', marginBottom: '25px', color: '#1E293B' }}>{quizQuestions[quizIndex].q}</h2>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {quizQuestions[quizIndex].options.map((opt) => (
                                            <motion.button key={opt} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleQuizAnswer(opt)} style={{ background: 'white', border: '2px solid #E2E8F0', padding: '16px', borderRadius: '14px', fontFamily: 'Fredoka', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0', textAlign: 'left' }}>{opt}</motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'results' && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', textAlign: 'center' }}>
                                    <Trophy size={70} color="#F59E0B" style={{ marginBottom: '20px' }} />
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>Amazing!</h1>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '22px', color: '#64748B', marginBottom: '25px' }}><strong style={{ color: colorScheme.primary }}>{score}</strong> / {quizQuestions.length} correct!</p>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setStage('quiz'); setQuizIndex(0); setScore(0); }} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #1D4ED8' }}>Try Again</motion.button>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStage('learn')} style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: `0 4px 0 ${colorScheme.accent}` }}>Learn More</motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StatesOfMatter;
