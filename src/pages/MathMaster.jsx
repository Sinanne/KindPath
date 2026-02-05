import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, RefreshCcw, Star, Calculator, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const MathMaster = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playPerfect] = useSound(SOUND_URLS.perfect);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [digits, setDigits] = useState(1);
    const [operation, setOperation] = useState('+');
    const [equation, setEquation] = useState({ a: 0, b: 0, answer: 0 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    const colorScheme = {
        primary: '#FF4D4D',
        accent: '#CC0000',
        bgSubtle: 'rgba(255, 77, 77, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const generateEquation = () => {
        let a, b, answer;
        let min, max;
        if (digits === 1) { min = 1; max = 9; }
        else if (digits === 2) { min = 10; max = 99; }
        else if (digits === 3) { min = 100; max = 999; }
        else { min = 1000; max = 9999; }

        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * (max - min + 1)) + min;
                b = Math.floor(Math.random() * (max - min + 1)) + min;
                answer = a + b;
                break;
            case '-':
                const val1 = Math.floor(Math.random() * (max - min + 1)) + min;
                const val2 = Math.floor(Math.random() * (max - min + 1)) + min;
                a = Math.max(val1, val2);
                b = Math.min(val1, val2);
                answer = a - b;
                break;
            case '*':
                let multMaxA = digits > 2 ? 100 : max;
                let multMaxB = digits > 2 ? 10 : 10;
                a = Math.floor(Math.random() * multMaxA) + 1;
                b = Math.floor(Math.random() * multMaxB) + 1;
                answer = a * b;
                break;
            case '/':
                let divMax = digits > 2 ? 10 : 10;
                b = Math.floor(Math.random() * divMax) + 1;
                answer = Math.floor(Math.random() * (digits > 2 ? 50 : max)) + 1;
                a = b * answer;
                break;
            default:
                a = 1; b = 1; answer = 2;
        }

        const opts = new Set([answer]);
        while (opts.size < 4) {
            let offset = Math.floor(Math.random() * 10) - 5;
            let wrong = answer + offset;
            if (wrong >= 0 && wrong !== answer) opts.add(wrong);
        }

        setEquation({ a, b, answer });
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        setFeedback(null);
    };

    useEffect(() => {
        generateEquation();
    }, [operation, level, digits]);

    const handleAnswerClick = (selected) => {
        if (selected === equation.answer) {
            playCorrect();
            setFeedback('correct');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > 0 && newStreak % 5 === 0) {
                playPerfect();
                setLevel(prev => prev + 1);
            }
            setTimeout(() => generateEquation(), 1000);
        } else {
            playWrong();
            setFeedback('wrong');
            setStreak(0);
            setLevel(prev => Math.max(1, prev - 1));
        }
    };

    const operations = [
        { symbol: '+', label: 'ADD' },
        { symbol: '-', label: 'SUB' },
        { symbol: '*', label: 'MULT' },
        { symbol: '/', label: 'DIV' }
    ];

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle, display: 'flex', flexDirection: 'column' }}>
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
                            <Calculator size={24} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B' }}>Math Master</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 0 #F1F5F9' }}>
                        <Trophy color="#F59E0B" size={20} />
                        <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold' }}>Level {level}</span>
                    </div>
                    <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 0 #F1F5F9' }}>
                        <Flame color="#EF4444" size={20} />
                        <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold' }}>{streak} Streak</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
                {/* Digit Selector */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#64748B', marginBottom: '12px' }}>DIGITS</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3].map(d => (
                            <motion.button
                                key={d}
                                whileTap={{ y: 3, boxShadow: 'none' }}
                                onClick={() => setDigits(d)}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background: digits === d ? colorScheme.primary : 'white',
                                    color: digits === d ? 'white' : '#1E293B',
                                    border: 'none',
                                    borderRadius: '15px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    boxShadow: digits === d ? `0 4px 0 ${colorScheme.accent}` : '0 4px 0 #E2E8F0',
                                    cursor: 'pointer'
                                }}
                            >
                                {d}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Operation Switcher */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#64748B', marginBottom: '12px' }}>OPERATION</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {operations.map(op => (
                            <motion.button
                                key={op.symbol}
                                whileTap={{ y: 3, boxShadow: 'none' }}
                                onClick={() => setOperation(op.symbol)}
                                style={{
                                    padding: '8px 20px',
                                    background: operation === op.symbol ? colorScheme.primary : 'white',
                                    color: operation === op.symbol ? 'white' : '#1E293B',
                                    border: 'none',
                                    borderRadius: '15px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    boxShadow: operation === op.symbol ? `0 4px 0 ${colorScheme.accent}` : '0 4px 0 #E2E8F0',
                                    cursor: 'pointer'
                                }}
                            >
                                {op.symbol} {op.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '40px' }}>
                <motion.div
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        background: 'white',
                        borderRadius: '40px',
                        padding: '60px',
                        boxShadow: '0 15px 0 #F1F5F9',
                        border: '4px solid #F8FAFC',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.2,
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                        <motion.div
                            key={`${equation.a}-${equation.b}-${operation}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: '80px', fontWeight: '900', color: '#1E293B', marginBottom: '50px', fontFamily: 'Fredoka' }}
                        >
                            {equation.a} {operation} {equation.b} = <span style={{ color: colorScheme.primary }}>?</span>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '24px',
                            width: '100%',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            {options.map((opt, i) => (
                                <motion.button
                                    key={`${opt}-${i}`}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ y: 5, boxShadow: 'none' }}
                                    onClick={() => handleAnswerClick(opt)}
                                    style={{
                                        height: '100px',
                                        fontSize: '40px',
                                        background: 'white',
                                        color: '#1E293B',
                                        border: '4px solid #F8FAFC',
                                        borderRadius: '24px',
                                        fontFamily: 'Fredoka',
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 0 #F1F5F9',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {feedback === 'correct' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(16, 185, 129, 0.95)',
                                    borderRadius: '36px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    zIndex: 10
                                }}
                            >
                                <Star size={100} fill="white" style={{ marginBottom: '20px' }} />
                                <h1 style={{ fontSize: '72px', fontFamily: 'Fredoka' }}>Super!</h1>
                                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Level {level} Reached!</p>
                            </motion.div>
                        )}

                        {feedback === 'wrong' && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    background: '#EF4444',
                                    padding: '16px 40px',
                                    borderRadius: '24px',
                                    color: 'white',
                                    boxShadow: '0 8px 0 #991B1B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    zIndex: 20
                                }}
                            >
                                <RefreshCcw size={24} />
                                <span style={{ fontSize: '22px', fontWeight: '900', fontFamily: 'Fredoka' }}>TRY AGAIN!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default MathMaster;
