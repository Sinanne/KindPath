import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Trophy, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

// STABLE GEOGRAPHY DATA (Outside component to prevent re-renders)
const CONTINENT_DATA = {
    'North America': { 
        id: 'na',
        color: '#8B5CF6', 
        animals: '🦅 Eagles, 🐻 Bears, 🦬 Bison', 
        landmark: '🗽 Statue of Liberty', 
        fact: 'Has the Grand Canyon - one of the world\'s largest!',
        path: 'M150,50 L200,40 L280,50 L350,100 L350,180 L320,220 L300,260 L280,300 L240,320 L200,300 L180,260 L140,220 L100,180 L80,120 L100,70 L130,60 Z',
        labelPos: { x: 220, y: 160 }
    },
    'South America': { 
        id: 'sa',
        color: '#10B981', 
        animals: '🦜 Parrots, 🐒 Monkeys, 🦙 Llamas', 
        landmark: '🗿 Machu Picchu', 
        fact: 'The Amazon Rainforest makes 20% of Earth\'s oxygen!',
        path: 'M280,320 L350,310 L420,340 L440,380 L420,450 L380,520 L330,580 L280,590 L240,550 L230,480 L240,400 L260,340 Z',
        labelPos: { x: 330, y: 440 }
    },
    'Europe': { 
        id: 'eu',
        color: '#3B82F6', 
        animals: '🦌 Deer, 🐺 Wolves, 🦔 Hedgehogs', 
        landmark: '🗼 Eiffel Tower', 
        fact: 'Has over 40 different countries!',
        path: 'M500,80 L560,70 L640,70 L680,100 L680,180 L640,240 L580,250 L520,230 L480,180 L480,120 Z',
        labelPos: { x: 570, y: 150 }
    },
    'Africa': { 
        id: 'af',
        color: '#F59E0B', 
        animals: '🦁 Lions, 🐘 Elephants, 🦒 Giraffes', 
        landmark: '🏛️ Pyramids of Giza', 
        fact: 'Home to the Sahara, the world\'s largest hot desert!',
        path: 'M500,260 L580,250 L680,270 L750,320 L770,400 L740,520 L680,600 L600,600 L530,550 L480,450 L470,360 L480,290 Z',
        labelPos: { x: 610, y: 420 }
    },
    'Asia': { 
        id: 'as',
        color: '#EF4444', 
        animals: '🐼 Pandas, 🐅 Tigers, 🐉 Komodo Dragons', 
        landmark: '🏯 Great Wall of China', 
        fact: 'The largest continent with over 4 billion people!',
        path: 'M680,80 L800,60 L950,70 L1050,120 L1100,250 L1050,380 L950,440 L850,420 L750,380 L700,320 L680,240 L670,150 Z',
        labelPos: { x: 880, y: 220 }
    },
    'Australia': { 
        id: 'oc',
        color: '#F97316', 
        animals: '🦘 Kangaroos, 🐨 Koalas, 🦆 Platypus', 
        landmark: '🎭 Sydney Opera House', 
        fact: 'The only continent that is also a country!',
        path: 'M950,480 L1050,470 L1120,530 L1100,620 L1000,650 L930,600 L930,520 Z',
        labelPos: { x: 1020, y: 550 }
    },
    'Antarctica': { 
        id: 'an',
        color: '#06B6D4', 
        animals: '🐧 Penguins, 🦭 Seals, 🐋 Whales', 
        landmark: '❄️ South Pole', 
        fact: 'The coldest place on Earth - it can reach -89°C!',
        path: 'M200,680 L400,660 L600,665 L800,660 L1000,670 L1050,720 L1000,760 L800,770 L600,765 L400,770 L200,760 L150,720 Z',
        labelPos: { x: 600, y: 720 }
    }
};

const WorldExplorer = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [stage, setStage] = useState('explore');
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const colorScheme = { primary: '#10B981', accent: '#059669' };

    const quizQuestions = [
        { q: 'Which continent has kangaroos?', a: 'Australia', options: ['Africa', 'Australia', 'Asia'] },
        { q: 'Where are the Pyramids of Giza?', a: 'Africa', options: ['Europe', 'Asia', 'Africa'] },
        { q: 'Which continent has pandas?', a: 'Asia', options: ['North America', 'Asia', 'Antarctica'] },
        { q: 'Where is the Amazon Rainforest?', a: 'South America', options: ['Africa', 'South America', 'Australia'] },
        { q: 'Which is the coldest continent?', a: 'Antarctica', options: ['Europe', 'Antarctica', 'Asia'] },
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

    const handleContinentClick = (name) => {
        setSelectedContinent(selectedContinent === name ? null : name);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: isMobile ? '10px' : '20px', background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)', overflowX: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => stage === 'explore' ? navigate('/science') : setStage('explore')} 
                            style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}
                        >
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Globe size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>World Explorer</span>
                        </div>
                    </div>
                    {stage === 'explore' && (
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
                        {stage === 'explore' && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                style={{ 
                                    flex: 1, 
                                    display: 'flex', 
                                    gap: '20px', 
                                    overflow: isMobile ? 'auto' : 'hidden', 
                                    padding: '5px',
                                    flexDirection: isMobile ? 'column' : 'row'
                                }}
                            >
                                {/* LEFT: Map Container */}
                                <div style={{ 
                                    flex: isMobile ? 'none' : 7, 
                                    height: isMobile ? '300px' : 'auto',
                                    background: 'white', 
                                    borderRadius: '28px', 
                                    padding: '15px', 
                                    boxShadow: '0 8px 0 #E2E8F0', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    overflow: 'hidden', 
                                    position: 'relative',
                                    flexShrink: 0
                                }}>
                                    {/* Map Container Content */}
                                    
                                    <svg viewBox="0 0 1200 800" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                                        <rect width="1200" height="800" fill="#E0F2FE" rx="16" />
                                        <line x1="0" y1="400" x2="1200" y2="400" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="10,10" />
                                        <line x1="600" y1="0" x2="600" y2="800" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="10,10" />
                                        
                                        {Object.entries(CONTINENT_DATA).map(([name, data]) => (
                                            <g key={name} style={{ cursor: 'pointer' }}>
                                                <motion.path
                                                    d={data.path}
                                                    fill={selectedContinent === name ? data.color : `${data.color}E6`}
                                                    stroke="white"
                                                    strokeWidth={selectedContinent === name ? "4" : "2"}
                                                    onClick={() => handleContinentClick(name)}
                                                    animate={{
                                                        scale: selectedContinent === name ? 1.05 : 1,
                                                        filter: selectedContinent === name ? 'drop-shadow(0 0 15px rgba(0,0,0,0.3))' : 'none'
                                                    }}
                                                    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                                                    style={{ transformOrigin: 'center', transition: 'fill 0.3s' }}
                                                />
                                                <text 
                                                    x={data.labelPos.x} 
                                                    y={data.labelPos.y} 
                                                    fill="white"
                                                    fontSize="18" 
                                                    fontFamily="Fredoka" 
                                                    fontWeight="bold" 
                                                    textAnchor="middle"
                                                    pointerEvents="none"
                                                    style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))' }}
                                                >
                                                    {name}
                                                </text>
                                            </g>
                                        ))}

                                        <g transform="translate(1120, 100)" opacity="0.6">
                                            <circle r="40" fill="white" />
                                            <text y="-50" textAnchor="middle" fill="#64748B" fontWeight="bold" fontSize="14">N</text>
                                            <path d="M0,-30 L10,0 L0,30 L-10,0 Z" fill="#EF4444" />
                                        </g>
                                    </svg>
                                </div>

                                {/* RIGHT: Info Sidebar */}
                                <div style={{ 
                                    flex: isMobile ? 'none' : 3, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '15px',
                                    minWidth: isMobile ? 'auto' : '300px'
                                }}>
                                    <AnimatePresence mode="wait">
                                        {selectedContinent ? (
                                            <motion.div 
                                                key={selectedContinent}
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -30 }}
                                                style={{ 
                                                    flex: 1, 
                                                    background: 'white', 
                                                    borderRadius: '28px', 
                                                    padding: isMobile ? '20px' : '25px', 
                                                    boxShadow: '0 8px 0 #E2E8F0',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    border: `2px solid ${CONTINENT_DATA[selectedContinent].color}20`
                                                }}
                                            >
                                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                    <div style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        borderRadius: '24px', 
                                                        background: CONTINENT_DATA[selectedContinent].color, 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        margin: '0 auto 15px',
                                                        boxShadow: `0 8px 20px ${CONTINENT_DATA[selectedContinent].color}40`
                                                    }}>
                                                        <Globe size={40} color="white" />
                                                    </div>
                                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '28px', color: '#1E293B', margin: 0 }}>{selectedContinent}</h2>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                                                    <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                                                        <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🐾 Wildlife</span>
                                                        <span style={{ fontFamily: 'Fredoka', fontSize: '16px', color: '#1E293B' }}>{CONTINENT_DATA[selectedContinent].animals}</span>
                                                    </div>

                                                    <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                                                        <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🏛️ Landmark</span>
                                                        <span style={{ fontFamily: 'Fredoka', fontSize: '16px', color: '#1E293B' }}>{CONTINENT_DATA[selectedContinent].landmark}</span>
                                                    </div>

                                                    <div style={{ flex: 1 }} />

                                                    <div style={{ background: '#FFFBEB', padding: '20px', borderRadius: '22px', border: '2px dashed #FDE68A', position: 'relative' }}>
                                                        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#F59E0B', color: 'white', padding: '2px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>DID YOU KNOW?</div>
                                                        <p style={{ fontFamily: 'Fredoka', fontSize: '15px', color: '#92400E', lineHeight: '1.5', margin: 0 }}>
                                                            {CONTINENT_DATA[selectedContinent].fact}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{ 
                                                    flex: 1, 
                                                    background: 'white', 
                                                    borderRadius: '28px', 
                                                    padding: '30px', 
                                                    boxShadow: '0 8px 0 #E2E8F0',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textAlign: 'center',
                                                    color: '#94A3B8',
                                                    fontFamily: 'Fredoka'
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '100px', 
                                                    height: '100px', 
                                                    borderRadius: '50%', 
                                                    background: '#F1F5F9', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    marginBottom: '20px'
                                                }}>
                                                    <Globe size={48} color="#CBD5E1" strokeWidth={1.5} />
                                                </div>
                                                <h3 style={{ fontSize: '20px', color: '#64748B', marginBottom: '10px' }}>Ready to Explore?</h3>
                                                <p style={{ fontSize: '15px', lineHeight: '1.4' }}>Click on any continent on the map to discover amazing facts and animals!</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'quiz' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '40px', borderRadius: '28px', boxShadow: '0 10px 0 #E2E8F0', maxWidth: '550px', width: '100%' }}>
                                    <p style={{ color: colorScheme.primary, fontWeight: 'bold', fontFamily: 'Fredoka', marginBottom: '10px', fontSize: '15px' }}>
                                        Question {quizIndex + 1} of {quizQuestions.length}
                                    </p>
                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '24px', marginBottom: '25px', color: '#1E293B' }}>
                                        {quizQuestions[quizIndex].q}
                                    </h2>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {quizQuestions[quizIndex].options.map((opt) => (
                                            <motion.button key={opt} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleQuizAnswer(opt)} style={{ background: 'white', border: '2px solid #E2E8F0', padding: '16px', borderRadius: '14px', fontFamily: 'Fredoka', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0', textAlign: 'left' }}>
                                                {opt}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'results' && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', textAlign: 'center' }}>
                                    <Trophy size={70} color="#F59E0B" style={{ marginBottom: '20px' }} />
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>World Explorer!</h1>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '22px', color: '#64748B', marginBottom: '25px' }}>
                                        You got <strong style={{ color: colorScheme.primary }}>{score}</strong> out of <strong>{quizQuestions.length}</strong> correct!
                                    </p>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setStage('quiz'); setQuizIndex(0); setScore(0); }} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #1D4ED8' }}>
                                            Try Again
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStage('explore')} style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: `0 4px 0 ${colorScheme.accent}` }}>
                                            Explore More
                                        </motion.button>
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

export default WorldExplorer;
