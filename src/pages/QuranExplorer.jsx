import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Book, ChevronRight, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuranExplorer = () => {
    const navigate = useNavigate();
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahData, setSurahData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const audioRef = useRef(null);

    const colorScheme = {
        primary: '#10B981', // Emerald
        accent: '#059669',
        bgSubtle: 'rgba(16, 185, 129, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const surahs = [
        { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", meaning: "The Opening" },
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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => selectedSurah ? setSelectedSurah(null) : navigate('/')}
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
                            <Book size={24} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B' }}>Quran Explorer</h2>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!selectedSurah ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', direction: 'rtl' }}
                    >
                        {surahs.map((surah) => (
                            <motion.div
                                key={surah.number}
                                whileHover={{ y: -10 }}
                                whileTap={{ y: 0, boxShadow: 'none' }}
                                onClick={() => setSelectedSurah(surah)}
                                style={{
                                    cursor: 'pointer',
                                    border: '3px solid #F1F5F9',
                                    background: 'white',
                                    textAlign: 'center',
                                    padding: '50px 30px',
                                    position: 'relative',
                                    borderRadius: '40px',
                                    boxShadow: '0 15px 0 #D1FAE5',
                                    direction: 'ltr'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '20px', left: '20px', width: '45px', height: '45px', background: colorScheme.bgSubtle, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorScheme.primary, fontWeight: '900', fontSize: '16px', border: '2px solid #D1FAE5', fontFamily: 'Fredoka' }}>
                                    {surah.number}
                                </div>
                                <h1 style={{ fontSize: '72px', marginBottom: '15px', color: colorScheme.primary, fontFamily: 'Amiri' }}>{surah.name}</h1>
                                <h3 style={{ color: '#1E293B', fontWeight: 'bold', fontFamily: 'Fredoka', fontSize: '24px' }}>{surah.englishName}</h3>
                                <p style={{ color: '#64748B', fontSize: '18px', fontFamily: 'Fredoka' }}>{surah.meaning}</p>
                                <div style={{
                                    marginTop: '30px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: colorScheme.primary,
                                    fontWeight: 'bold',
                                    fontFamily: 'Fredoka',
                                    fontSize: '18px'
                                }}>
                                    Learn Now <ChevronRight size={20} />
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
                                        padding: '50px 30px',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: '40px',
                                        boxShadow: '0 15px 0 #064E3B',
                                        border: '4px solid rgba(255,255,255,0.1)',
                                        marginBottom: '40px'
                                    }}
                                >
                                    <h1 style={{ fontSize: '64px', marginBottom: '10px', fontFamily: 'Amiri' }}>{surahData.name}</h1>
                                    <p style={{ fontSize: '22px', opacity: 0.9, marginBottom: '25px', fontFamily: 'Fredoka' }}>{selectedSurah.englishName} • {selectedSurah.meaning}</p>

                                    <div style={{ fontSize: '36px', fontFamily: 'Amiri', marginBottom: '40px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '24px', display: 'inline-block' }}>
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                        <motion.button
                                            whileTap={{ y: 5, boxShadow: 'none' }}
                                            onClick={handlePlayPause}
                                            style={{
                                                background: 'white',
                                                color: colorScheme.accent,
                                                padding: '20px 50px',
                                                fontSize: '24px',
                                                borderRadius: '24px',
                                                border: 'none',
                                                fontFamily: 'Fredoka',
                                                fontWeight: 'bold',
                                                boxShadow: '0 10px 0 #D1FAE5',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}
                                        >
                                            {isPlaying ? <Pause size={32} /> : <Play size={32} />} {isPlaying ? 'Pause' : 'Play All'}
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ y: 5, boxShadow: 'none' }}
                                            onClick={resetSurah}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                padding: '20px',
                                                borderRadius: '24px',
                                                border: '3px solid white',
                                                boxShadow: '0 10px 0 rgba(0,0,0,0.1)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <RotateCcw size={32} />
                                        </motion.button>
                                    </div>
                                </motion.div>

                                <div style={{
                                    background: 'white',
                                    padding: '60px 40px',
                                    borderRadius: '40px',
                                    boxShadow: '0 15px 0 #E2E8F0',
                                    border: '4px solid #F8FAFC',
                                    direction: 'rtl',
                                    textAlign: 'center'
                                }}>
                                    {surahData.ayahs.map((ayah, index) => (
                                        <motion.span
                                            key={ayah.number}
                                            onClick={() => jumpToAyah(index)}
                                            animate={{
                                                backgroundColor: currentAyahIndex === index ? '#D1FAE5' : 'transparent',
                                                color: currentAyahIndex === index ? '#065F46' : '#1F2937',
                                                scale: currentAyahIndex === index ? 1.05 : 1
                                            }}
                                            whileHover={{ scale: 1.08, backgroundColor: '#F0FDFA' }}
                                            style={{
                                                fontSize: '44px',
                                                fontFamily: 'Amiri',
                                                padding: '12px 20px',
                                                borderRadius: '24px',
                                                display: 'inline-block',
                                                margin: '12px',
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
