import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket, Info, CheckCircle, HelpCircle, ZoomIn, ZoomOut, X, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const Planets = () => {
    const navigate = useNavigate();
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.8);
    const [time, setTime] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });

    const requestRef = useRef();

    // Game loop for real-time planet tracking
    const animate = (t) => {
        setTime(t / 1000);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const colorScheme = {
        primary: '#3B82F6',
        accent: '#1D4ED8',
        bgSubtle: 'rgba(59, 130, 246, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    // Stable planetary data with scattered start angles
    const planets = useMemo(() => [
        { id: 0, name: 'Sun', color: '#F59E0B', size: 100, orbitSize: 0, speed: 0, info: 'The Sun is a star at the center of our solar system. It is very hot!', fact: 'The Sun is so big that 1.3 million Earths could fit inside it!', startAngle: 0 },
        { id: 1, name: 'Mercury', color: '#94A3B8', size: 18, orbitSize: 150, speed: 10, info: 'Mercury is the smallest planet and closest to the Sun.', fact: 'Mercury is fast! It orbits the Sun every 88 Earth days.', startAngle: Math.random() * 360 },
        { id: 2, name: 'Venus', color: '#FCD34D', size: 32, orbitSize: 220, speed: 20, info: 'Venus is the hottest planet in our solar system.', fact: 'A day on Venus is longer than a year on Venus!', startAngle: Math.random() * 360 },
        { id: 3, name: 'Earth', color: '#3B82F6', size: 34, orbitSize: 310, speed: 30, info: 'Earth is our home! It is the only planet we know that has life.', fact: 'Earth is called the "Blue Planet" because it is covered in water.', startAngle: Math.random() * 360 },
        { id: 4, name: 'Mars', color: '#EF4444', size: 28, orbitSize: 400, speed: 45, info: 'Mars is called the Red Planet because its soil looks like rusty iron.', fact: 'Mars has the tallest volcano in the entire solar system!', startAngle: Math.random() * 360 },
        { id: 5, name: 'Jupiter', color: '#FDBA74', size: 65, orbitSize: 550, speed: 80, info: 'Jupiter is the largest planet! It is a gas giant.', fact: 'The Great Red Spot is a storm that has lasted hundreds of years!', startAngle: Math.random() * 360 },
        { id: 6, name: 'Saturn', color: '#FDE047', size: 60, orbitSize: 720, speed: 120, info: 'Saturn is famous for its beautiful rings made of ice and rock.', fact: 'Saturn could float in water because it is mostly gas!', startAngle: Math.random() * 360 },
        { id: 7, name: 'Uranus', color: '#93C5FD', size: 45, orbitSize: 880, speed: 200, info: 'Uranus is an ice giant that rotates on its side.', fact: 'Uranus was the first planet discovered with a telescope!', startAngle: Math.random() * 360 },
        { id: 8, name: 'Neptune', color: '#6366F1', size: 42, orbitSize: 1050, speed: 300, info: 'Neptune is the coldest and windiest planet.', fact: 'Neptune has a "Great Dark Spot" just like Jupiters red spot!', startAngle: Math.random() * 360 }
    ], []);

    const quizQuestions = [
        { q: 'Which planet is known as our home?', options: ['Mars', 'Earth', 'Sun'], answer: 'Earth' },
        { q: 'Which is the largest planet in our solar system?', options: ['Jupiter', 'Saturn', 'Uranus'], answer: 'Jupiter' },
        { q: 'Which planet has beautiful rings of ice?', options: ['Mercury', 'Venus', 'Saturn'], answer: 'Saturn' },
        { q: 'Which planet is the closest to the Sun?', options: ['Mercury', 'Earth', 'Venus'], answer: 'Mercury' },
        { q: 'Which planet is the coldest and windiest?', options: ['Mars', 'Neptune', 'Jupiter'], answer: 'Neptune' },
        { q: 'Why is Mars called the Red Planet?', options: ['Its hot', 'Its soil is rusty', 'It has red trees'], answer: 'Its soil is rusty' }
    ];

    const getPlanetPos = (p) => {
        if (p.id === 0) return { x: 0, y: 0 };
        const currentAngle = (p.startAngle - (time * 360 / p.speed)) * (Math.PI / 180);
        return {
            x: (p.orbitSize / 2) * Math.cos(currentAngle),
            y: (p.orbitSize / 2) * Math.sin(currentAngle)
        };
    };

    const selectedPlanet = planets.find(p => p.id === selectedPlanetId);
    const targetPos = selectedPlanet ? getPlanetPos(selectedPlanet) : { x: 0, y: 0 };

    const handleAnswer = (option) => {
        if (option === quizQuestions[currentQuestion].answer) {
            playCorrect();
            setScore(score + 1);
        } else {
            playWrong();
        }
        if (currentQuestion + 1 < quizQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            playPerfect();
            setQuizFinished(true);
        }
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.3));

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', background: colorScheme.bgSubtle, overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '15px', 
                    flexShrink: 0,
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    gap: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/science')}
                            className="btn"
                            style={{ background: 'white', color: '#64748B', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '14px', padding: isMobile ? '8px' : '10px' }}
                        >
                            <ArrowLeft size={18} />
                        </motion.button>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'white',
                            padding: isMobile ? '5px 12px' : '6px 16px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 0 #E2E8F0',
                            border: '2px solid #F1F5F9'
                        }}>
                            <div style={{ background: colorScheme.primary, padding: '5px', borderRadius: '8px' }}>
                                <Rocket size={18} color="white" />
                            </div>
                            <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: isMobile ? '16px' : '18px' }}>Solar System</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/science/game')}
                            style={{
                                background: '#10B981',
                                color: 'white',
                                padding: isMobile ? '8px 12px' : '10px 16px',
                                border: 'none',
                                borderRadius: '14px',
                                fontFamily: 'Fredoka',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 0 #059669',
                                cursor: 'pointer',
                                fontSize: isMobile ? '12px' : '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Trophy size={14} /> {isMobile ? 'Play' : 'Play Mission Game'}
                        </motion.button>

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
                            onClick={() => setShowQuiz(!showQuiz)}
                            style={{
                                background: showQuiz ? '#3B82F6' : '#F59E0B',
                                color: 'white',
                                padding: isMobile ? '8px 12px' : '10px 24px',
                                border: 'none',
                                borderRadius: '14px',
                                fontFamily: 'Fredoka',
                                fontWeight: 'bold',
                                boxShadow: showQuiz ? '0 4px 0 #1D4ED8' : '0 4px 0 #D97706',
                                cursor: 'pointer',
                                fontSize: isMobile ? '12px' : '14px'
                            }}
                        >
                            {showQuiz ? (isMobile ? 'X' : 'Explore') : (isMobile ? 'Quiz' : 'Take Quiz! 🎯')}
                        </motion.button>
                    </div>
                </header>

                {!showQuiz ? (
                    <div style={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
                        {/* Mission Mode Sidebar */}
                        <div style={{ 
                            width: isMobile ? '100%' : '220px', 
                            background: 'white', 
                            padding: isMobile ? '10px' : '15px', 
                            borderRadius: '24px', 
                            boxShadow: '0 8px 0 #E2E8F0', 
                            border: '2px solid #F8FAFC', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            overflowY: isMobile ? 'hidden' : 'auto',
                            flexShrink: 0
                        }}>
                            <h4 style={{ marginBottom: '8px', color: '#94A3B8', fontFamily: 'Fredoka', fontSize: '11px', textAlign: isMobile ? 'center' : 'left' }}>QUICK TRAVEL</h4>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: isMobile ? 'row' : 'column', 
                                gap: '6px', 
                                overflowX: isMobile ? 'auto' : 'visible',
                                paddingBottom: isMobile ? '5px' : '0',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none'
                            }}>
                                {planets.map(p => (
                                    <motion.button
                                        key={p.name}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setSelectedPlanetId(p.id); if (!selectedPlanetId) setZoomLevel(1.5); }}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px',
                                            background: selectedPlanetId === p.id ? colorScheme.bgSubtle : 'transparent',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#1E293B',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontFamily: 'Fredoka',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            transition: 'background 0.2s',
                                            minWidth: isMobile ? '100px' : 'auto'
                                        }}
                                    >
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }}></div>
                                        {p.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Space View */}
                        <div
                            onClick={() => setSelectedPlanetId(null)}
                            style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)', borderRadius: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 8px 0 #E2E8F0', cursor: 'grab' }}
                        >
                            {/* Zoom Controls */}
                            <div style={{ position: 'absolute', left: '20px', bottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 20 }}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                                    style={{ background: 'white', color: '#1E293B', padding: '12px', borderRadius: '14px', border: 'none', boxShadow: '0 4px 0 #F1F5F9', cursor: 'pointer' }}
                                >
                                    <ZoomIn size={20} />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                                    style={{ background: 'white', color: '#1E293B', padding: '12px', borderRadius: '14px', border: 'none', boxShadow: '0 4px 0 #F1F5F9', cursor: 'pointer' }}
                                >
                                    <ZoomOut size={20} />
                                </motion.button>
                            </div>

                            {/* Stars */}
                            {[...Array(100)].map((_, i) => (
                                <div key={i} style={{ position: 'absolute', width: '2px', height: '2px', background: 'white', left: `${(Math.sin(i * 123.45) * 0.5 + 0.5) * 100}%`, top: `${(Math.cos(i * 678.9) * 0.5 + 0.5) * 100}%`, opacity: Math.sin(i), borderRadius: '50%' }}></div>
                            ))}

                            {/* Zoomable & Translatatable Content */}
                            <motion.div
                                animate={{
                                    scale: zoomLevel,
                                    x: -targetPos.x * zoomLevel,
                                    y: -targetPos.y * zoomLevel
                                }}
                                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                                style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                {/* All Planets */}
                                {planets.map((p) => {
                                    const pos = getPlanetPos(p);
                                    return (
                                        <React.Fragment key={p.name}>
                                            {/* Orbit Line */}
                                            {p.orbitSize > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    borderRadius: '50%',
                                                    width: `${p.orbitSize}px`,
                                                    height: `${p.orbitSize}px`,
                                                    pointerEvents: 'none'
                                                }}></div>
                                            )}

                                            {/* Planet Itself */}
                                            <motion.div
                                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                                onClick={(e) => { e.stopPropagation(); setSelectedPlanetId(p.id); }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `calc(50% + ${pos.x}px)`,
                                                    top: `calc(50% + ${pos.y}px)`,
                                                    marginLeft: -p.size / 2,
                                                    marginTop: -p.size / 2,
                                                    width: `${p.size}px`,
                                                    height: `${p.size}px`,
                                                    borderRadius: '50%',
                                                    background: p.color,
                                                    cursor: 'pointer',
                                                    boxShadow: p.id === 0 ? `0 0 80px ${p.color}` : `0 0 20px ${p.color}80`,
                                                    zIndex: p.id === 0 ? 5 : 6,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {p.name === 'Saturn' && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        width: '180%',
                                                        height: '35%',
                                                        border: '4px solid rgba(253, 224, 47, 0.4)',
                                                        borderRadius: '100%',
                                                        transform: 'rotate(-15deg)'
                                                    }}></div>
                                                )}
                                                {/* Hover Name Label */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileHover={{ opacity: 1, y: 30 }}
                                                    style={{ position: 'absolute', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Fredoka', pointerEvents: 'none', whiteSpace: 'nowrap' }}
                                                >
                                                    {p.name}
                                                </motion.div>
                                            </motion.div>
                                        </React.Fragment>
                                    );
                                })}
                            </motion.div>

                            <AnimatePresence>
                                {selectedPlanet && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            position: 'absolute', right: window.innerWidth < 768 ? '10px' : '30px',
                                            left: window.innerWidth < 768 ? '10px' : 'auto',
                                            top: window.innerWidth < 768 ? 'auto' : '30px',
                                            bottom: window.innerWidth < 768 ? '10px' : 'auto',
                                            width: window.innerWidth < 768 ? 'calc(100% - 20px)' : '320px',
                                            background: 'white', color: '#1E293B', padding: '20px', borderRadius: '24px',
                                            boxShadow: `0 10px 0 ${colorScheme.primary}`, border: '3px solid #F8FAFC', zIndex: 30
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h2 style={{ color: selectedPlanet.color, fontFamily: 'Fredoka', margin: 0, fontSize: '24px' }}>{selectedPlanet.name}</h2>
                                            <button onClick={() => setSelectedPlanetId(null)} style={{ border: 'none', background: '#F1F5F9', color: '#64748B', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                                        </div>
                                        <p style={{ lineHeight: '1.5', marginBottom: '15px', fontFamily: 'Fredoka', color: '#475569', fontSize: '14px' }}>{selectedPlanet.info}</p>
                                        <div style={{ background: colorScheme.bgSubtle, padding: '12px', borderRadius: '15px', display: 'flex', gap: '10px', border: '2px dashed #E2E8F0' }}>
                                            <Info size={20} color={colorScheme.primary} />
                                            <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0, color: '#334155', fontFamily: 'Fredoka' }}>{selectedPlanet.fact}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Direction Tip */}
                            {!selectedPlanetId && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    style={{ position: 'absolute', bottom: '30px', right: '30px', color: 'white', fontFamily: 'Fredoka', fontSize: '14px', pointerEvents: 'none' }}
                                >
                                    Click a planet to follow its mission! 🚀
                                </motion.div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ maxWidth: '700px', margin: '20px auto', textAlign: 'center', width: '100%' }}>
                        {!quizFinished ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'white', padding: isMobile ? '30px 20px' : '50px', borderRadius: '32px', boxShadow: '0 10px 0 #E2E8F0', border: '3px solid #F8FAFC' }}
                            >
                                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: colorScheme.primary, fontFamily: 'Fredoka', fontSize: '16px' }}>Mission {currentQuestion + 1} of {quizQuestions.length}</span>
                                    <HelpCircle color="#94A3B8" size={20} />
                                </div>
                                <h2 style={{ marginBottom: '30px', fontFamily: 'Fredoka', color: '#1E293B', fontSize: '24px' }}>{quizQuestions[currentQuestion].q}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                    {quizQuestions[currentQuestion].options.map(opt => (
                                        <motion.button
                                            key={opt}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(opt)}
                                            style={{ background: 'white', color: '#1E293B', border: '3px solid #F1F5F9', padding: '16px', borderRadius: '20px', fontSize: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 6px 0 #F1F5F9' }}
                                        >
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ background: 'white', padding: '40px 20px', borderRadius: '32px', boxShadow: '0 10px 0 #E2E8F0', border: '3px solid #F8FAFC' }}
                            >
                                <CheckCircle size={60} color="#10B981" style={{ margin: '0 auto 20px' }} />
                                <h1 style={{ marginBottom: '12px', fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>Mission Complete!</h1>
                                <p style={{ fontSize: '18px', marginBottom: '30px', color: '#64748B', fontFamily: 'Fredoka' }}>Your Score: <span style={{ color: colorScheme.primary, fontWeight: '900' }}>{score} / {quizQuestions.length}</span></p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setShowQuiz(false); setQuizFinished(false); setCurrentQuestion(0); setScore(0); }}
                                    style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '16px 32px', borderRadius: '20px', fontSize: '20px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: `0 6px 0 ${colorScheme.accent}`, cursor: 'pointer' }}
                                >
                                    Back to Space
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Planets;
