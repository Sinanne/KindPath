import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const SeasonsWeather = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [stage, setStage] = useState('learn');
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const colorScheme = { primary: '#F59E0B', accent: '#D97706' };

    const seasons = [
        { name: 'Spring', emoji: '🌸', color: '#EC4899', weather: '🌧️ Rainy and mild', clothes: '🧥 Light jackets', activities: '🌷 Planting gardens', fact: 'Baby animals are born in spring!' },
        { name: 'Summer', emoji: '☀️', color: '#F59E0B', weather: '☀️ Hot and sunny', clothes: '👕 T-shirts & shorts', activities: '🏊 Swimming & beach', fact: 'The longest days of the year!' },
        { name: 'Autumn', emoji: '🍂', color: '#EA580C', weather: '🌬️ Cool and breezy', clothes: '🧣 Scarves & jackets', activities: '🎃 Pumpkin picking', fact: 'Leaves change colors and fall!' },
        { name: 'Winter', emoji: '❄️', color: '#3B82F6', weather: '❄️ Cold and snowy', clothes: '🧥 Heavy coats', activities: '⛷️ Skiing & snowmen', fact: 'No two snowflakes are the same!' }
    ];

    const weatherTypes = [
        { name: 'Sunny', emoji: '☀️', desc: 'Clear skies' },
        { name: 'Rainy', emoji: '🌧️', desc: 'Water falls' },
        { name: 'Snowy', emoji: '❄️', desc: 'Ice crystals' },
        { name: 'Windy', emoji: '💨', desc: 'Moving air' },
        { name: 'Cloudy', emoji: '☁️', desc: 'Grey skies' },
        { name: 'Stormy', emoji: '⛈️', desc: 'Thunder!' }
    ];

    const quizQuestions = [
        { q: 'Which season is the hottest?', a: 'Summer', options: ['Winter', 'Summer', 'Spring'] },
        { q: 'When do leaves change color and fall?', a: 'Autumn', options: ['Spring', 'Summer', 'Autumn'] },
        { q: 'Which weather type brings snowflakes?', a: 'Snowy', options: ['Rainy', 'Sunny', 'Snowy'] },
    ];

    const handleQuizAnswer = (answer) => {
        const isCorrect = answer === quizQuestions[quizIndex].a;
        if (isCorrect) { playCorrect(); setScore(score + 1); } else { playWrong(); }
        if (quizIndex + 1 < quizQuestions.length) {
            setTimeout(() => setQuizIndex(quizIndex + 1), 500);
        } else {
            setTimeout(() => { setStage('results'); playPerfect(); }, 500);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: isMobile ? '10px' : '20px', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', overflowX: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => stage === 'learn' ? navigate('/science') : setStage('learn')} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Sun size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>Seasons & Weather</span>
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
                                {/* Seasons Row */}
                                <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '10px' : '15px', boxShadow: '0 6px 0 #E2E8F0', marginBottom: '15px', flexShrink: 0 }}>
                                    <h3 style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '13px', margin: '0 0 12px', textAlign: 'center' }}>🗓️ THE SEASONS</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px' }}>
                                        {seasons.map((season) => (
                                            <motion.div
                                                key={season.name}
                                                whileHover={{ y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedSeason(selectedSeason?.name === season.name ? null : season)}
                                                style={{
                                                    background: selectedSeason?.name === season.name ? `${season.color}15` : '#F8FAFC',
                                                    borderRadius: '16px',
                                                    padding: isMobile ? '12px' : '15px',
                                                    cursor: 'pointer',
                                                    border: selectedSeason?.name === season.name ? `3px solid ${season.color}` : '3px solid transparent',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <div style={{ fontSize: isMobile ? '35px' : '45px', marginBottom: '4px' }}>{season.emoji}</div>
                                                <h4 style={{ fontFamily: 'Fredoka', color: season.color, margin: 0, fontSize: isMobile ? '15px' : '17px' }}>{season.name}</h4>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Weather Types & Info */}
                                <div style={{ flex: 1, display: 'flex', gap: '15px', minHeight: 0, flexDirection: isMobile ? 'column' : 'row' }}>
                                    {/* Weather Types */}
                                    <div style={{ flex: 1, background: 'white', borderRadius: '20px', padding: '15px', boxShadow: '0 6px 0 #E2E8F0', overflowY: isMobile ? 'visible' : 'auto' }}>
                                        <h3 style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '13px', margin: '0 0 12px', textAlign: 'center' }}>🌤️ WEATHER TYPES</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '10px' }}>
                                            {weatherTypes.map((w) => (
                                                <div key={w.name} style={{ background: '#F8FAFC', padding: '15px 10px', borderRadius: '14px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: isMobile ? '30px' : '35px', marginBottom: '4px' }}>{w.emoji}</div>
                                                    <h5 style={{ fontFamily: 'Fredoka', fontSize: isMobile ? '12px' : '13px', color: '#1E293B', margin: '0 0 2px' }}>{w.name}</h5>
                                                    <span style={{ fontFamily: 'Fredoka', fontSize: '10px', color: '#94A3B8' }}>{w.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Season Info Panel */}
                                    <div style={{ flex: 1, background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 6px 0 #E2E8F0', display: 'flex', flexDirection: 'column', minHeight: isMobile ? '200px' : 'auto' }}>
                                        {selectedSeason ? (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ height: '100%', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'stretch', gap: isMobile ? '20px' : '0' }}>
                                                <div style={{ textAlign: 'center', marginBottom: isMobile ? '0' : '15px', minWidth: isMobile ? '100px' : 'auto' }}>
                                                    <div style={{ fontSize: isMobile ? '50px' : '60px' }}>{selectedSeason.emoji}</div>
                                                    <h3 style={{ fontFamily: 'Fredoka', fontSize: isMobile ? '20px' : '26px', color: selectedSeason.color, margin: '5px 0 0' }}>{selectedSeason.name}</h3>
                                                </div>
                                                <div style={{ fontFamily: 'Fredoka', fontSize: '14px', color: '#475569', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <p style={{ margin: '0 0 5px', fontSize: isMobile ? '13px' : '14px' }}><strong>Weather:</strong> {selectedSeason.weather}</p>
                                                    <p style={{ margin: '0 0 5px', fontSize: isMobile ? '13px' : '14px' }}><strong>Clothes:</strong> {selectedSeason.clothes}</p>
                                                    <p style={{ margin: '0 0 10px', fontSize: isMobile ? '13px' : '14px' }}><strong>Activities:</strong> {selectedSeason.activities}</p>
                                                    <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '12px', marginTop: 'auto' }}>
                                                        <span style={{ fontSize: isMobile ? '12px' : '13px' }}><strong>💡 Fact:</strong> {selectedSeason.fact}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'Fredoka' }}>
                                                <Sun size={55} color="#E2E8F0" />
                                                <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '16px' }}>Click a season above<br />to learn all about it!</p>
                                            </div>
                                        )}
                                    </div>
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
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>Weather Wizard!</h1>
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

export default SeasonsWeather;
