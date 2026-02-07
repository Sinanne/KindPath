import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const HumanBody = () => {
    const navigate = useNavigate();
    const { addStars } = useGamification();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [stage, setStage] = useState('learn');
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const colorScheme = { primary: '#EC4899', accent: '#DB2777' };

    const organs = [
        { name: 'Brain', emoji: '🧠', color: '#F472B6', job: 'Controls thinking, memory, and all body functions', fact: 'Uses 20% of your body\'s energy!' },
        { name: 'Heart', emoji: '❤️', color: '#EF4444', job: 'Pumps blood to your entire body', fact: 'Beats about 100,000 times every day!' },
        { name: 'Lungs', emoji: '🫁', color: '#60A5FA', job: 'Helps you breathe in oxygen', fact: 'Stretched out, they\'d cover a tennis court!' },
        { name: 'Stomach', emoji: '🟢', color: '#22C55E', job: 'Breaks down food with acids', fact: 'Makes a new lining every few days!' },
        { name: 'Bones', emoji: '🦴', color: '#E5E7EB', job: 'Give your body shape and protect organs', fact: 'Adults have 206 bones!' },
        { name: 'Muscles', emoji: '💪', color: '#F87171', job: 'Help you move and stay strong', fact: 'You have over 600 muscles!' }
    ];

    const quizQuestions = [
        { q: 'What organ helps you think?', a: 'Brain', options: ['Heart', 'Brain', 'Stomach'] },
        { q: 'What pumps blood through your body?', a: 'Heart', options: ['Brain', 'Lungs', 'Heart'] },
        { q: 'Which organs help you breathe?', a: 'Lungs', options: ['Lungs', 'Stomach', 'Heart'] },
        { q: 'How many bones do adults have?', a: '206', options: ['100', '206', '300'] },
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

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: isMobile ? '10px' : '20px', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', overflowX: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => stage === 'learn' ? navigate('/science') : setStage('learn')} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Heart size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>Human Body</span>
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
                                <p style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '14px', textAlign: 'center', margin: '0 0 10px' }}>
                                    👆 Click on any body part to learn what it does!
                                </p>
                                
                                {/* Organ Grid */}
                                <div style={{ 
                                    flex: 1, 
                                    background: 'white', 
                                    borderRadius: '24px', 
                                    padding: isMobile ? '12px' : '20px', 
                                    boxShadow: '0 8px 0 #E2E8F0', 
                                    display: 'grid', 
                                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                                    gap: isMobile ? '10px' : '15px', 
                                    minHeight: 0,
                                    overflowY: 'auto'
                                }}>
                                    {organs.map((organ) => (
                                        <motion.div
                                            key={organ.name}
                                            whileHover={{ y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedOrgan(selectedOrgan?.name === organ.name ? null : organ)}
                                            style={{
                                                background: selectedOrgan?.name === organ.name ? `${organ.color}15` : '#F8FAFC',
                                                borderRadius: '20px',
                                                padding: isMobile ? '15px 10px' : '25px',
                                                cursor: 'pointer',
                                                border: selectedOrgan?.name === organ.name ? `3px solid ${organ.color}` : '3px solid transparent',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ fontSize: isMobile ? '40px' : '55px', marginBottom: '5px' }}>{organ.emoji}</div>
                                            <h4 style={{ fontFamily: 'Fredoka', color: organ.color, margin: 0, fontSize: isMobile ? '14px' : '18px' }}>{organ.name}</h4>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Info Panel - Bottom */}
                                <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '15px' : '15px 25px', marginTop: '15px', boxShadow: '0 6px 0 #E2E8F0', minHeight: '85px', flexShrink: 0 }}>
                                    {selectedOrgan ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            style={{ 
                                                display: 'flex', 
                                                gap: isMobile ? '12px' : '25px', 
                                                alignItems: isMobile ? 'flex-start' : 'center',
                                                flexDirection: isMobile ? 'column' : 'row' 
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: isMobile ? 'auto' : '150px' }}>
                                                <div style={{ fontSize: isMobile ? '35px' : '45px' }}>{selectedOrgan.emoji}</div>
                                                <h3 style={{ fontFamily: 'Fredoka', fontSize: isMobile ? '20px' : '24px', color: selectedOrgan.color, margin: 0 }}>{selectedOrgan.name}</h3>
                                            </div>
                                            <div style={{ flex: 1, fontFamily: 'Fredoka', fontSize: isMobile ? '13px' : '15px', color: '#475569' }}>
                                                <strong>🎯 Job:</strong> {selectedOrgan.job}
                                            </div>
                                            <div style={{ background: '#FEF3C7', padding: '10px 18px', borderRadius: '12px', maxWidth: isMobile ? '100%' : '280px', width: '100%' }}>
                                                <span style={{ fontFamily: 'Fredoka', fontSize: isMobile ? '12px' : '13px', color: '#92400E' }}><strong>💡 Fun Fact:</strong> {selectedOrgan.fact}</span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', color: '#94A3B8', fontFamily: 'Fredoka', height: '100%' }}>
                                            <Heart size={30} color="#E2E8F0" />
                                            <span style={{ fontSize: '16px' }}>Tap a body part above to learn about it!</span>
                                        </div>
                                    )}
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
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>Body Expert!</h1>
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

export default HumanBody;
