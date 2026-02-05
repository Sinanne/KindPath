import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket, Info, CheckCircle, HelpCircle, ZoomIn, ZoomOut, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const ScienceExplorer = () => {
    const navigate = useNavigate();
    const [selectedPlanetId, setSelectedPlanetId] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.8);
    const [time, setTime] = useState(0);

    const [playCorrect] = useSound(SOUND_URLS.correct);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playPerfect] = useSound(SOUND_URLS.perfect);

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
        // Decrease angle for counter-clockwise rotation in screen coordinates (0 -> -90 is right -> top)
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
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{ background: 'white', color: '#64748B', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '16px' }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'white',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 0 #E2E8F0',
                        border: '2px solid #F1F5F9'
                    }}>
                        <div style={{ background: colorScheme.primary, padding: '8px', borderRadius: '12px' }}>
                            <Rocket size={24} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B' }}>Science Explorer</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => { setShowQuiz(false); setQuizFinished(false); }}
                        style={{
                            background: !showQuiz ? colorScheme.primary : 'white',
                            color: !showQuiz ? 'white' : '#64748B',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '16px',
                            fontFamily: 'Fredoka',
                            fontWeight: 'bold',
                            boxShadow: !showQuiz ? `0 6px 0 ${colorScheme.accent}` : '0 6px 0 #E2E8F0',
                            cursor: 'pointer'
                        }}
                    >
                        Explore
                    </motion.button>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => setShowQuiz(true)}
                        style={{
                            background: showQuiz ? colorScheme.primary : 'white',
                            color: showQuiz ? 'white' : '#64748B',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '16px',
                            fontFamily: 'Fredoka',
                            fontWeight: 'bold',
                            boxShadow: showQuiz ? `0 6px 0 ${colorScheme.accent}` : '0 6px 0 #E2E8F0',
                            cursor: 'pointer'
                        }}
                    >
                        Quiz
                    </motion.button>
                </div>
            </header>

            {!showQuiz ? (
                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                    {/* Mission Mode Sidebar */}
                    <div style={{ width: '250px', background: 'white', padding: '24px', borderRadius: '32px', boxShadow: '0 10px 0 #E2E8F0', border: '2px solid #F8FAFC' }}>
                        <h4 style={{ marginBottom: '20px', color: '#94A3B8', fontFamily: 'Fredoka' }}>QUICK TRAVEL</h4>
                        {planets.map(p => (
                            <motion.button
                                key={p.name}
                                whileHover={{ x: 5 }}
                                whileTap={{ x: 0 }}
                                onClick={() => { setSelectedPlanetId(p.id); if (!selectedPlanetId) setZoomLevel(1.5); }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px',
                                    background: selectedPlanetId === p.id ? colorScheme.bgSubtle : 'transparent',
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: '#1E293B',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '5px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }}></div>
                                {p.name}
                                {selectedPlanetId === p.id && <MapPin size={14} style={{ marginLeft: 'auto', color: colorScheme.primary }} />}
                            </motion.button>
                        ))}
                    </div>

                    {/* Space View */}
                    <div
                        onClick={() => setSelectedPlanetId(null)}
                        style={{ flex: 1, position: 'relative', height: '650px', background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)', borderRadius: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '5px solid white', boxShadow: '0 20px 0 #E2E8F0', cursor: 'grab' }}
                    >
                        {/* Zoom Controls */}
                        <div style={{ position: 'absolute', left: '30px', bottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 20 }}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                                style={{ background: 'white', color: '#1E293B', padding: '15px', borderRadius: '16px', border: 'none', boxShadow: '0 5px 0 #F1F5F9', cursor: 'pointer' }}
                            >
                                <ZoomIn size={24} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                                style={{ background: 'white', color: '#1E293B', padding: '15px', borderRadius: '16px', border: 'none', boxShadow: '0 5px 0 #F1F5F9', cursor: 'pointer' }}
                            >
                                <ZoomOut size={24} />
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
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ position: 'absolute', right: '30px', top: '30px', width: '320px', background: 'white', color: '#1E293B', padding: '30px', borderRadius: '32px', boxShadow: `0 15px 0 ${colorScheme.primary}`, border: '4px solid #F8FAFC', zIndex: 30 }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h2 style={{ color: selectedPlanet.color, fontFamily: 'Fredoka', margin: 0, fontSize: '28px' }}>{selectedPlanet.name}</h2>
                                        <button onClick={() => setSelectedPlanetId(null)} style={{ border: 'none', background: '#F1F5F9', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                                    </div>
                                    <p style={{ lineHeight: '1.6', marginBottom: '20px', fontFamily: 'Fredoka', color: '#475569', fontSize: '18px' }}>{selectedPlanet.info}</p>
                                    <div style={{ background: colorScheme.bgSubtle, padding: '20px', borderRadius: '20px', display: 'flex', gap: '15px', border: '2px dashed #E2E8F0' }}>
                                        <Info size={28} color={colorScheme.primary} />
                                        <p style={{ fontSize: '15px', fontStyle: 'italic', margin: 0, color: '#334155', fontFamily: 'Fredoka' }}>{selectedPlanet.fact}</p>
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
                <div style={{ maxWidth: '700px', margin: '40px auto', textAlign: 'center' }}>
                    {!quizFinished ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ background: 'white', padding: '50px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}
                        >
                            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: colorScheme.primary, fontFamily: 'Fredoka', fontSize: '20px' }}>Mission {currentQuestion + 1} of {quizQuestions.length}</span>
                                <HelpCircle color="#94A3B8" />
                            </div>
                            <h2 style={{ marginBottom: '40px', fontFamily: 'Fredoka', color: '#1E293B', fontSize: '32px' }}>{quizQuestions[currentQuestion].q}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                {quizQuestions[currentQuestion].options.map(opt => (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ y: 5, boxShadow: 'none' }}
                                        onClick={() => handleAnswer(opt)}
                                        style={{ background: 'white', color: '#1E293B', border: '3px solid #F1F5F9', padding: '20px', borderRadius: '24px', fontSize: '20px', fontFamily: 'Fredoka', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 0 #F1F5F9' }}
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
                            style={{ background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}
                        >
                            <CheckCircle size={80} color="#10B981" style={{ margin: '0 auto 24px' }} />
                            <h1 style={{ marginBottom: '16px', fontFamily: 'Fredoka', fontSize: '48px', color: '#1E293B' }}>Mission Complete!</h1>
                            <p style={{ fontSize: '24px', marginBottom: '40px', color: '#64748B', fontFamily: 'Fredoka' }}>Your Score: <span style={{ color: colorScheme.primary, fontWeight: '900' }}>{score} / {quizQuestions.length}</span></p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setShowQuiz(false); setQuizFinished(false); setCurrentQuestion(0); setScore(0); }}
                                style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '20px 40px', borderRadius: '24px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: `0 8px 0 ${colorScheme.accent}`, cursor: 'pointer' }}
                            >
                                Back to Space
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScienceExplorer;
