import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Volume2, CheckCircle, RefreshCcw, Book, Play, Pause, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const AyahSorterGame = () => {
    const navigate = useNavigate();
    const [playPerfect] = useSound(SOUND_URLS.perfect);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playCorrect] = useSound(SOUND_URLS.correct);

    const availableSurahs = [
        { number: 112, name: 'Al-Ikhlas', nameAr: 'الإخلاص' },
        { number: 113, name: 'Al-Falaq', nameAr: 'الفلق' },
        { number: 114, name: 'An-Nas', nameAr: 'الناس' }
    ];

    const [currentSurahInfo, setCurrentSurahInfo] = useState(availableSurahs[0]);
    const [ayahs, setAyahs] = useState([]); // Original correct order
    const [items, setItems] = useState([]); // Shuffled items for UI
    const [isSuccess, setIsSuccess] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSelection, setShowSelection] = useState(false);

    const audioRef = useRef(new Audio());
    const [playingAyahId, setPlayingAyahId] = useState(null);

    const fetchSurahData = async (surahNumber) => {
        setLoading(true);
        setIsSuccess(false);
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
            const data = await response.json();

            // Clean Bismillah for non-Fatiha surahs in first ayah
            let processedAyahs = data.data.ayahs.map(a => ({
                id: a.number,
                text: a.text,
                audio: a.audio,
                numberInSurah: a.numberInSurah
            }));

            if (surahNumber !== 1 && processedAyahs.length > 0) {
                const bismillahRegex = /^بِسْمِ [ٱا]للَّهِ [ٱا]لرَّحْمَٰ?نِ [ٱا]لرَّحِيمِ\s*/;
                processedAyahs[0].text = processedAyahs[0].text.replace(bismillahRegex, "").trim();
            }

            setAyahs(processedAyahs);
            setItems([...processedAyahs].sort(() => Math.random() - 0.5));
        } catch (error) {
            console.error("Error fetching Ayahs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurahData(currentSurahInfo.number);
    }, [currentSurahInfo]);

    const playAyahAudio = (audioUrl, id) => {
        if (playingAyahId === id) {
            audioRef.current.pause();
            setPlayingAyahId(null);
        } else {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
            setPlayingAyahId(id);
            audioRef.current.onended = () => setPlayingAyahId(null);
        }
    };

    const checkOrder = () => {
        const isCorrect = items.every((item, index) => item.id === ayahs[index].id);
        if (isCorrect) {
            playPerfect();
            setIsSuccess(true);
            setScore(prev => prev + 100);
        } else {
            playWrong();
        }
    };

    const handleSurahChange = (surah) => {
        setCurrentSurahInfo(surah);
        setShowSelection(false);
    };

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh', background: '#F0FDFA', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <header style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <motion.button
                    whileTap={{ y: 4, boxShadow: 'none' }}
                    onClick={() => navigate('/quran')}
                    style={{ background: 'white', color: '#64748B', padding: '10px', border: 'none', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '16px', cursor: 'pointer' }}
                >
                    <ArrowLeft size={20} />
                </motion.button>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => setShowSelection(true)}
                        style={{ background: 'white', color: '#10B981', padding: '8px 16px', border: 'none', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '16px', cursor: 'pointer', fontFamily: 'Fredoka', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                    >
                        <List size={18} /> SURAHS
                    </motion.button>
                    <div style={{ background: 'white', padding: '6px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 0 #E2E8F0', border: '2px solid #F1F5F9' }}>
                        <Star color="#F59E0B" fill="#F59E0B" size={20} />
                        <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: 'var(--fs-lg)', color: '#1E293B' }}>{score}</span>
                    </div>
                </div>
            </header>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'Fredoka', color: '#1E293B', marginBottom: '10px' }}>Ayahs Sorter 📖</h1>
                <p style={{ fontFamily: 'Fredoka', color: '#64748B', fontSize: '18px' }}>
                    Sort Surah **{currentSurahInfo.name}** correctly!
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <RefreshCcw size={48} color="#10B981" />
                    </motion.div>
                    <p style={{ color: '#059669', fontWeight: 'bold', marginTop: '20px' }}>Loading Ayahs...</p>
                </div>
            ) : (
                <>
                    <Reorder.Group axis="y" values={items} onReorder={setItems} style={{ width: '100%', maxWidth: '600px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {items.map((item) => (
                            <Reorder.Item
                                key={item.id}
                                value={item}
                                style={{
                                    background: 'white', padding: '15px 20px', borderRadius: '20px', border: '2px solid #F1F5F9', boxShadow: '0 6px 0 #F1F5F9', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '15px', direction: 'rtl'
                                }}
                            >
                                <div style={{ background: '#F0FDFA', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#10B981', shrink: 0 }}>
                                    <Book size={18} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    <div style={{ fontSize: 'clamp(18px, 5vw, 28px)', fontWeight: 'bold', color: '#1E293B', fontFamily: 'Amiri' }}>{item.text}</div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); playAyahAudio(item.audio, item.id); }}
                                    style={{ background: playingAyahId === item.id ? '#10B981' : '#F1F5F9', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: playingAyahId === item.id ? 'white' : '#6366F1' }}
                                >
                                    {playingAyahId === item.id ? <Pause size={18} /> : <Volume2 size={18} />}
                                </motion.button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkOrder}
                        style={{
                            marginTop: '40px', padding: '15px 40px', background: '#10B981', color: 'white', border: 'none', borderRadius: '20px',
                            fontSize: '20px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: '0 8px 0 #047857', cursor: 'pointer'
                        }}
                    >
                        CHECK ORDER
                    </motion.button>
                </>
            )}

            {/* Selection Modal */}
            <AnimatePresence>
                {showSelection && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                        onClick={() => setShowSelection(false)}
                    >
                        <motion.div
                            initial={{ y: 50, scale: 0.9 }}
                            animate={{ y: 0, scale: 1 }}
                            style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '90%', maxWidth: '400px', textAlign: 'center' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ fontFamily: 'Fredoka', marginBottom: '30px' }}>Choose a Surah</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {availableSurahs.map(s => (
                                    <motion.button
                                        key={s.number}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSurahChange(s)}
                                        style={{
                                            padding: '20px', borderRadius: '20px', border: '2px solid #F1F5F9', background: currentSurahInfo.number === s.number ? '#F0FDFA' : 'white',
                                            cursor: 'pointer', fontFamily: 'Fredoka', fontSize: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}
                                    >
                                        <span style={{ color: '#64748B' }}>{s.name}</span>
                                        <span style={{ fontFamily: 'Amiri', color: '#10B981', fontSize: '24px' }}>{s.nameAr}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(16, 185, 129, 0.95)', zIndex: 1000,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                            <CheckCircle size={120} fill="white" color="transparent" />
                        </motion.div>
                        <h1 style={{ fontSize: '80px', fontFamily: 'Fredoka', marginTop: '20px' }}>Masha'Allah!</h1>
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Success in Surah {currentSurahInfo.name}!</p>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => fetchSurahData(currentSurahInfo.number)}
                            style={{
                                marginTop: '40px', padding: '15px 40px', background: 'white', color: '#10B981', border: 'none', borderRadius: '20px',
                                fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 0 #D1FAE5', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <RefreshCcw size={24} /> PLAY AGAIN
                        </motion.button>
                        <motion.button
                            onClick={() => setShowSelection(true)}
                            style={{ marginTop: '20px', background: 'transparent', color: 'white', border: '2px solid white', padding: '10px 30px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            CHANGE SURAH
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Fredoka:wght@400;600;900&display=swap');
            `}</style>
        </div>
    );
};

export default AyahSorterGame;
