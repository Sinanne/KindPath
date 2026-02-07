import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Book, ChevronRight, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';

const QuranExplorer = () => {
    const navigate = useNavigate();
    const { addStars, unlockBadge } = useGamification();
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahData, setSurahData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const audioRef = useRef(null);
    const ayahRefs = useRef([]);

    // Initialize/Reset ayahRefs when surahData changes
    useEffect(() => {
        if (surahData) {
            ayahRefs.current = ayahRefs.current.slice(0, surahData.ayahs.length);
        }
    }, [surahData]);

    const colorScheme = {
        primary: '#10B981', // Emerald
        accent: '#059669',
        bgSubtle: 'rgba(16, 185, 129, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const surahs = [
        { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", meaning: "The Opening" },
        { number: 80, name: "عبس", englishName: "Abasa", meaning: "He Frowned" },
        { number: 81, name: "التكوير", englishName: "At-Takwir", meaning: "The Overthrowing" },
        { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", meaning: "The Defrauders" },
        { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", meaning: "The Sincerity" },
        { number: 113, name: "الفلق", englishName: "Al-Falaq", meaning: "The Daybreak" },
        { number: 114, name: "الناس", englishName: "An-Nas", meaning: "The Mankind" }
    ];

    const fetchSurah = async (number) => {
        setLoading(true);
        setSurahData(null);
        setCurrentAyahIndex(0);
        setIsPlaying(false);
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/ar.alafasy`);
            const data = await response.json();

            // Clean Bismillah from the first Ayah for all Surahs except Al-Fatiha (Surah 1)
            if (number !== 1 && data.data.ayahs.length > 0) {
                const bismillahRegex = /^بِسْمِ [ٱا]للَّهِ [ٱا]لرَّحْمَٰ?نِ [ٱا]لرَّحِيمِ\s*/;
                data.data.ayahs[0].text = data.data.ayahs[0].text.replace(bismillahRegex, "").trim();
            }

            setSurahData(data.data);
        } catch (error) {
            console.error("Error fetching surah:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSurah) {
            fetchSurah(selectedSurah.number);
        }
    }, [selectedSurah]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAyahEnd = () => {
        if (surahData && currentAyahIndex < surahData.ayahs.length - 1) {
            setCurrentAyahIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            setCurrentAyahIndex(0);
            const starsToAward = surahData.ayahs.length * 10;
            addStars(starsToAward, 'quran');
            unlockBadge('quran_explorer', 'Quran Explorer', '🌟');
        }
    };

    const jumpToAyah = (index) => {
        setCurrentAyahIndex(index);
        setIsPlaying(true);
    };

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Playback error:", e));
        }

        // Auto-scroll to current ayah
        if (ayahRefs.current[currentAyahIndex]) {
            ayahRefs.current[currentAyahIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [currentAyahIndex, isPlaying]);

    const resetSurah = () => {
        setCurrentAyahIndex(0);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => selectedSurah ? setSelectedSurah(null) : navigate('/')}
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
                            <Book size={20} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: 'var(--fs-lg)' }}>Quran Explorer</h2>
                    </div>
                </div>

                <motion.button
                    whileTap={{ y: 4, boxShadow: 'none' }}
                    onClick={() => navigate('/quran/sorter')}
                    style={{
                        background: '#6366F1',
                        color: 'white',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: '16px',
                        fontFamily: 'Fredoka',
                        fontWeight: 'bold',
                        boxShadow: '0 6px 0 #4338CA',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px'
                    }}
                >
                    <Book size={18} fill="white" /> GAME
                </motion.button>
            </header>

            <AnimatePresence mode="wait">
                {!selectedSurah ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', direction: 'rtl' }}
                    >
                        {surahs.map((surah) => (
                            <motion.div
                                key={surah.number}
                                whileHover={{ y: -5 }}
                                whileTap={{ y: 0, boxShadow: 'none' }}
                                onClick={() => setSelectedSurah(surah)}
                                style={{
                                    cursor: 'pointer',
                                    border: '3px solid #F1F5F9',
                                    background: 'white',
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                    position: 'relative',
                                    borderRadius: '32px',
                                    boxShadow: '0 10px 0 #D1FAE5',
                                    direction: 'ltr'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '15px', left: '15px', width: '35px', height: '35px', background: colorScheme.bgSubtle, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorScheme.primary, fontWeight: '900', fontSize: '14px', border: '2px solid #D1FAE5', fontFamily: 'Fredoka' }}>
                                    {surah.number}
                                </div>
                                <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px', color: colorScheme.primary, fontFamily: 'Amiri' }}>{surah.name}</h1>
                                <h3 style={{ color: '#1E293B', fontWeight: 'bold', fontFamily: 'Fredoka', fontSize: 'var(--fs-lg)' }}>{surah.englishName}</h3>
                                <p style={{ color: '#64748B', fontSize: 'var(--fs-sm)', fontFamily: 'Fredoka' }}>{surah.meaning}</p>
                                <div style={{
                                    marginTop: '20px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: colorScheme.primary,
                                    fontWeight: 'bold',
                                    fontFamily: 'Fredoka',
                                    fontSize: '14px'
                                }}>
                                    Learn Now <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        style={{ maxWidth: '1000px', margin: '0 auto' }}
                    >
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '120px' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                                    <RotateCcw size={64} color={colorScheme.primary} />
                                </motion.div>
                                <h3 style={{ marginTop: '24px', color: colorScheme.accent, fontFamily: 'Fredoka' }}>Opening {selectedSurah.englishName}...</h3>
                            </div>
                        ) : surahData && (
                            <div style={{ padding: '0', overflow: 'hidden', background: 'transparent' }}>
                                <motion.div
                                    style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                                        padding: '40px 20px',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: '32px',
                                        boxShadow: '0 12px 0 #064E3B',
                                        border: '4px solid rgba(255,255,255,0.1)',
                                        marginBottom: '30px'
                                    }}
                                >
                                    <h1 style={{ fontSize: 'clamp(40px, 10vw, 64px)', marginBottom: '5px', fontFamily: 'Amiri' }}>{surahData.name}</h1>
                                    <p style={{ fontSize: 'var(--fs-base)', opacity: 0.9, marginBottom: '20px', fontFamily: 'Fredoka' }}>{selectedSurah.englishName} • {selectedSurah.meaning}</p>

                                    <div style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontFamily: 'Amiri', marginBottom: '30px', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '20px', display: 'inline-block' }}>
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                        <motion.button
                                            whileTap={{ y: 5, boxShadow: 'none' }}
                                            onClick={handlePlayPause}
                                            style={{
                                                background: 'white',
                                                color: colorScheme.accent,
                                                padding: '12px 30px',
                                                fontSize: '18px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontFamily: 'Fredoka',
                                                fontWeight: 'bold',
                                                boxShadow: '0 8px 0 #D1FAE5',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}
                                        >
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} />} {isPlaying ? 'Pause' : 'Play All'}
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ y: 5, boxShadow: 'none' }}
                                            onClick={resetSurah}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                padding: '12px',
                                                borderRadius: '20px',
                                                border: '2px solid white',
                                                boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <RotateCcw size={24} />
                                        </motion.button>
                                    </div>
                                </motion.div>

                                <div style={{
                                    background: 'white',
                                    padding: 'clamp(30px, 8vw, 60px) clamp(16px, 5vw, 40px)',
                                    borderRadius: '32px',
                                    boxShadow: '0 12px 0 #E2E8F0',
                                    border: '3px solid #F8FAFC',
                                    direction: 'rtl',
                                    textAlign: 'center'
                                }}>
                                    {surahData.ayahs.map((ayah, index) => (
                                        <motion.span
                                            key={ayah.number}
                                            ref={el => ayahRefs.current[index] = el}
                                            onClick={() => jumpToAyah(index)}
                                            animate={{
                                                backgroundColor: currentAyahIndex === index ? '#D1FAE5' : 'transparent',
                                                color: currentAyahIndex === index ? '#065F46' : '#1F2937',
                                                scale: currentAyahIndex === index ? 1.05 : 1
                                            }}
                                            whileHover={{ scale: 1.08, backgroundColor: '#F0FDFA' }}
                                            style={{
                                                fontSize: 'clamp(28px, 8vw, 44px)',
                                                fontFamily: 'Amiri',
                                                padding: '8px 15px',
                                                borderRadius: '16px',
                                                display: 'inline-block',
                                                margin: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                lineHeight: '1.6'
                                            }}
                                        >
                                            {ayah.text} <span style={{ color: colorScheme.primary, fontSize: '28px', verticalAlign: 'middle', marginRight: '10px' }}>﴿{ayah.numberInSurah}﴾</span>
                                        </motion.span>
                                    ))}
                                </div>

                                <audio
                                    ref={audioRef}
                                    src={surahData.ayahs[currentAyahIndex].audio}
                                    onEnded={handleAyahEnd}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Fredoka:wght@400;600;900&display=swap');
                body {
                    font-family: 'Fredoka', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default QuranExplorer;
