import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Volume2, Book, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const EnglishJourney = () => {
    const navigate = useNavigate();
    const { addStars } = useGamification();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [finished, setFinished] = useState(false);
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });

    const [shuffledWords, setShuffledWords] = useState([]);

    const colorScheme = {
        primary: '#FFD93D',
        accent: '#C29100',
        bgSubtle: 'rgba(255, 217, 61, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    useEffect(() => {
        const wordsList = [
            { word: 'APPLE', image: '🍎', hint: 'A crunchy red fruit.' },
            { word: 'BIRD', image: '🐦', hint: 'It can fly in the sky.' },
            { word: 'CAT', image: '🐱', hint: 'It says "Meow!".' },
            { word: 'DOG', image: '🐶', hint: 'It says "Woof!".' },
            { word: 'TOMATO', image: '🍅', hint: 'A soft red vegetable (or fruit!).' },
            { word: 'CARROT', image: '🥕', hint: 'Crunchy, orange, and rabbits love them.' },
            { word: 'POTATO', image: '🥔', hint: 'You can make French fries from these.' },
            { word: 'ONION', image: '🧅', hint: 'A round vegetable that might make you cry!' },
            { word: 'CORN', image: '🌽', hint: 'Yellow kernels that grow on a cob.' }
        ];
        setShuffledWords([...wordsList].sort(() => Math.random() - 0.5));
    }, []);

    const currentWord = shuffledWords[currentWordIndex];

    const handleCharClick = useCallback((char) => {
        if (userInput.length < currentWord.word.length) {
            const nextInput = (userInput + char).toUpperCase();
            setUserInput(nextInput);

            if (nextInput === currentWord.word) {
                playCorrect();
                setIsCorrect(true);
                setTimeout(() => {
                    if (currentWordIndex + 1 < shuffledWords.length) {
                        setCurrentWordIndex(currentWordIndex + 1);
                        setUserInput('');
                        setIsCorrect(null);
                    } else {
                        playPerfect();
                        setFinished(true);
                        addStars(50, 'english');
                    }
                }, 1500);
            } else if (nextInput.length === currentWord.word.length) {
                playWrong();
                setIsCorrect(false);
                setTimeout(() => {
                    setUserInput('');
                    setIsCorrect(null);
                }, 1000);
            }
        }
    }, [userInput, currentWord, currentWordIndex, playCorrect, playPerfect, shuffledWords.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (finished) return;
            const char = e.key.toUpperCase();
            if (/^[A-Z]$/.test(char)) {
                handleCharClick(char);
            } else if (e.key === 'Backspace') {
                setUserInput(prev => prev.slice(0, -1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleCharClick, finished]);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{ background: 'white', color: '#64748B', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '16px', padding: '10px' }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 0 #E2E8F0',
                        border: '2px solid #F1F5F9'
                    }}>
                        <div style={{ background: colorScheme.primary, padding: '6px', borderRadius: '10px' }}>
                            <Book size={20} color="#1E293B" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: 'var(--fs-lg)' }}>English Garden</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => navigate('/english/game')}
                        style={{ background: '#6366F1', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontFamily: 'Fredoka', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 0 #4338CA', fontSize: '14px' }}
                    >
                        <Sparkles size={16} /> POP
                    </motion.button>
                    <div style={{ background: 'white', padding: '8px 16px', borderRadius: '16px', fontWeight: 'bold', fontFamily: 'Fredoka', color: '#64748B', boxShadow: '0 6px 0 #F1F5F9', fontSize: '12px' }}>
                        {currentWordIndex + 1} / {shuffledWords.length}
                    </div>
                </div>
            </header>

            {!finished ? (
                shuffledWords.length > 0 && currentWord ? (
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <motion.div
                            key={currentWord.word}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'white',
                                borderRadius: '32px',
                                padding: 'clamp(20px, 5vw, 40px)',
                                boxShadow: '0 10px 0 #E2E8F0',
                                border: '3px solid #F8FAFC',
                                marginBottom: '30px'
                            }}
                        >
                            <div style={{ fontSize: 'clamp(60px, 15vw, 120px)', marginBottom: '5px' }}>{currentWord.image}</div>
                            <p style={{ color: '#64748B', fontSize: 'var(--fs-base)', marginBottom: '25px', fontFamily: 'Fredoka', fontWeight: 'bold' }}>{currentWord.hint}</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                {currentWord.word.split('').map((_, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: 'clamp(35px, 10vw, 70px)',
                                            height: 'clamp(40px, 12vw, 80px)',
                                            background: '#F8FAFC',
                                            borderRadius: '12px',
                                            borderBottom: '4px solid #CBD5E1',
                                            fontSize: 'clamp(24px, 8vw, 48px)',
                                            fontWeight: '900',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isCorrect === false ? '#EF4444' : '#3B82F6',
                                            fontFamily: 'Fredoka'
                                        }}
                                    >
                                        {userInput[idx] || ''}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                                {letters.map(char => (
                                    <motion.button
                                        key={char}
                                        whileTap={{ y: 2, boxShadow: 'none' }}
                                        onClick={() => handleCharClick(char)}
                                        style={{
                                            background: 'white',
                                            color: '#1E293B',
                                            border: '2px solid #F1F5F9',
                                            padding: '10px 4px',
                                            fontSize: 'clamp(14px, 4vw, 22px)',
                                            fontFamily: 'Fredoka',
                                            fontWeight: 'bold',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 0 #E2E8F0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {char}
                                    </motion.button>
                                ))}
                                <motion.button
                                    whileTap={{ y: 2, boxShadow: 'none' }}
                                    onClick={() => setUserInput('')}
                                    style={{
                                        gridColumn: 'span 2',
                                        background: '#EF4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: 'clamp(12px, 3vw, 18px)',
                                        fontWeight: 'bold',
                                        fontFamily: 'Fredoka',
                                        boxShadow: '0 4px 0 #991B1B',
                                        cursor: 'pointer'
                                    }}
                                >
                                    CLEAR
                                </motion.button>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {isCorrect && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: '#10B981', fontWeight: 'bold', fontSize: '48px', fontFamily: 'Fredoka' }}
                                >
                                    🌟 PERFECT! 🌟
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : <div style={{ textAlign: 'center' }}>Loading...</div>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        maxWidth: '600px',
                        margin: '60px auto',
                        textAlign: 'center',
                        background: 'white',
                        padding: '60px',
                        borderRadius: '40px',
                        boxShadow: '0 15px 0 #F1F5F9',
                        border: '4px solid #F8FAFC'
                    }}
                >
                    <CheckCircle size={80} color="#10B981" style={{ margin: '0 auto 24px' }} />
                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '48px', color: '#1E293B' }}>Garden Complete!</h1>
                    <p style={{ fontSize: '24px', marginBottom: '32px', color: '#64748B' }}>You are a Spelling Star! 🌟</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        style={{
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            padding: '20px 40px',
                            borderRadius: '20px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            fontFamily: 'Fredoka',
                            boxShadow: '0 8px 0 #1D4ED8',
                            cursor: 'pointer'
                        }}
                    >
                        Back Home
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default EnglishJourney;
