import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Languages, Volume2, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const ArabicAdventure = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playPerfect] = useSound(SOUND_URLS.perfect);

    const [stage, setStage] = useState('selection'); // selection | alphabet | numbers | words
    const [subStage, setSubStage] = useState('animals'); // animals | objects
    const [selectedItem, setSelectedItem] = useState(null);

    const colorScheme = {
        primary: '#A855F7',
        accent: '#7E22CE',
        bgSubtle: 'rgba(168, 85, 247, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const alphabet = [
        { letter: 'أ', name: 'Alif', word: 'أَسَد', translation: 'Lion' },
        { letter: 'ب', name: 'Ba', word: 'بَيْت', translation: 'House' },
        { letter: 'ت', name: 'Ta', word: 'تُفَّاح', translation: 'Apple' },
        { letter: 'ث', name: 'Tha', word: 'ثَعْلَب', translation: 'Fox' },
        { letter: 'ج', name: 'Jim', word: 'جَمَل', translation: 'Camel' },
        { letter: 'ح', name: 'Ha', word: 'حِصَان', translation: 'Horse' },
        { letter: 'خ', name: 'Kha', word: 'خُبْز', translation: 'Bread' },
        { letter: 'د', name: 'Dal', word: 'دُب', translation: 'Bear' },
        { letter: 'ذ', name: 'Thal', word: 'ذُرَة', translation: 'Corn' },
        { letter: 'ر', name: 'Ra', word: 'رُمَّان', translation: 'Pomegranate' },
        { letter: 'ز', name: 'Zay', word: 'زَيْتُون', translation: 'Olive' },
        { letter: 'س', name: 'Sin', word: 'سَمَكَة', translation: 'Fish' },
        { letter: 'ش', name: 'Shin', word: 'شَمْس', translation: 'Sun' },
        { letter: 'ص', name: 'Sad', word: 'صَقْر', translation: 'Falcon' },
        { letter: 'ض', name: 'Dad', word: 'ضِفْدَع', translation: 'Frog' },
        { letter: 'ط', name: 'Ta', word: 'طَيَّارَة', translation: 'Airplane' },
        { letter: 'ظ', name: 'Za', word: 'ظَرْف', translation: 'Envelope' },
        { letter: 'ع', name: 'Ayn', word: 'عَيْن', translation: 'Eye' },
        { letter: 'غ', name: 'Ghayn', word: 'غَزَال', translation: 'Gazelle' },
        { letter: 'ف', name: 'Fa', word: 'فِيل', translation: 'Elephant' },
        { letter: 'ق', name: 'Qaf', word: 'قَمَر', translation: 'Moon' },
        { letter: 'ك', name: 'Kaf', word: 'كِتَاب', translation: 'Book' },
        { letter: 'ل', name: 'Lam', word: 'لَيْمُون', translation: 'Lemon' },
        { letter: 'م', name: 'Mim', word: 'مَوْز', translation: 'Banana' },
        { letter: 'ن', name: 'Nun', word: 'نَجْمَة', translation: 'Star' },
        { letter: 'هـ', name: 'Ha', word: 'هِرَّة', translation: 'Cat' },
        { letter: 'و', name: 'Waw', word: 'وَرْدَة', translation: 'Flower' },
        { letter: 'ي', name: 'Ya', word: 'يَد', translation: 'Hand' },
    ];

    const numbers = [
        { ar: '١', en: '1', name: 'Wahid' },
        { ar: '٢', en: '2', name: 'Ithnan' },
        { ar: '٣', en: '3', name: 'Thalatha' },
        { ar: '٤', en: '4', name: 'Arba\'a' },
        { ar: '٥', en: '5', name: 'Khamsa' },
        { ar: '٦', en: '6', name: 'Sitta' },
        { ar: '٧', en: '7', name: 'Sab\'a' },
        { ar: '٨', en: '8', name: 'Thamaniya' },
        { ar: '٩', en: '9', name: 'Tis\'a' },
        { ar: '١٠', en: '10', name: 'Ashara' },
    ];

    const animals = [
        { ar: 'أَسَد', en: 'Lion', emoji: '🦁' },
        { ar: 'حِصَان', en: 'Horse', emoji: '🐴' },
        { ar: 'قِطَّة', en: 'Cat', emoji: '🐱' },
        { ar: 'فِيل', en: 'Elephant', emoji: '🐘' },
        { ar: 'جَمَل', en: 'Camel', emoji: '🐪' },
    ];

    const objects = [
        { ar: 'بَيْت', en: 'House', emoji: '🏠' },
        { ar: 'كِتَاب', en: 'Book', emoji: '📚' },
        { ar: 'قَلَم', en: 'Pen', emoji: '✏️' },
        { ar: 'شَمْس', en: 'Sun', emoji: '☀️' },
        { ar: 'قَمَر', en: 'Moon', emoji: '🌙' },
    ];

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => stage === 'selection' ? navigate('/') : setStage('selection')}
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
                            <Languages size={20} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: 'var(--fs-lg)' }}>Arabic Adventure</h2>
                    </div>
                </div>
            </header>

            {stage === 'selection' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => setStage('alphabet')}
                        style={{
                            cursor: 'pointer',
                            background: 'white',
                            borderRadius: '28px',
                            padding: '24px',
                            textAlign: 'center',
                            boxShadow: `0 8px 0 ${colorScheme.primary}`,
                            border: '2px solid #F1F5F9'
                        }}
                    >
                        <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px', color: colorScheme.primary, fontFamily: 'Fredoka' }}>أ ب ت</h1>
                        <h3 style={{ fontFamily: 'Fredoka', fontSize: 'var(--fs-lg)' }}>Alphabet</h3>
                        <p style={{ color: '#64748B', fontSize: 'var(--fs-sm)' }}>Shapes & Sounds!</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => setStage('numbers')}
                        style={{
                            cursor: 'pointer',
                            background: 'white',
                            borderRadius: '28px',
                            padding: '24px',
                            textAlign: 'center',
                            boxShadow: `0 8px 0 ${colorScheme.primary}`,
                            border: '2px solid #F1F5F9'
                        }}
                    >
                        <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px', color: colorScheme.primary, fontFamily: 'Fredoka' }}>١ ٢ ٣</h1>
                        <h3 style={{ fontFamily: 'Fredoka', fontSize: 'var(--fs-lg)' }}>Numbers</h3>
                        <p style={{ color: '#64748B', fontSize: 'var(--fs-sm)' }}>Count to 10!</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => setStage('words')}
                        style={{
                            cursor: 'pointer',
                            background: 'white',
                            borderRadius: '28px',
                            padding: '24px',
                            textAlign: 'center',
                            boxShadow: `0 8px 0 ${colorScheme.primary}`,
                            border: '2px solid #F1F5F9'
                        }}
                    >
                        <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px', color: colorScheme.primary, fontFamily: 'Fredoka' }}>🦁 🏠</h1>
                        <h3 style={{ fontFamily: 'Fredoka', fontSize: 'var(--fs-lg)' }}>First Words</h3>
                        <p style={{ color: '#64748B', fontSize: 'var(--fs-sm)' }}>Basic Vocab!</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => navigate('/arabic/game')}
                        style={{
                            cursor: 'pointer',
                            background: '#6366F1',
                            borderRadius: '28px',
                            padding: '24px',
                            textAlign: 'center',
                            boxShadow: `0 8px 0 #4338CA`,
                            border: '2px solid rgba(255,255,255,0.1)',
                            color: 'white'
                        }}
                    >
                        <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px', color: 'white', fontFamily: 'Fredoka' }}>🫧✨</h1>
                        <h3 style={{ fontFamily: 'Fredoka', fontSize: 'var(--fs-lg)' }}>Word Pop</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--fs-sm)' }}>Pop & Spell!</p>
                    </motion.div>
                </div>
            )}

            {stage === 'alphabet' && (
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', fontFamily: 'Fredoka', fontSize: '36px' }}>Alphabet Explorer</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px', direction: 'rtl' }}>
                        {alphabet.map(item => (
                            <motion.button
                                key={item.letter}
                                whileHover={{ y: -5 }}
                                whileTap={{ y: 5, boxShadow: 'none' }}
                                onClick={() => { setSelectedItem(item); speak(item.letter); playCorrect(); }}
                                style={{
                                    height: '140px',
                                    fontSize: '60px',
                                    background: 'white',
                                    borderRadius: '24px',
                                    border: selectedItem?.letter === item.letter ? `4px solid ${colorScheme.primary}` : '2px solid #F1F5F9',
                                    color: colorScheme.primary,
                                    boxShadow: '0 8px 0 #F1F5F9',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontFamily: 'Fredoka'
                                }}
                            >
                                {item.letter}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedItem && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: '40px',
                                    textAlign: 'center',
                                    background: 'white',
                                    borderRadius: '32px',
                                    padding: '24px',
                                    boxShadow: `0 10px 0 ${colorScheme.primary}`,
                                    border: '4px solid #F8FAFC'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', direction: 'rtl', flexWrap: 'wrap' }}>
                                    <h1 style={{ fontSize: 'clamp(80px, 20vw, 120px)', color: colorScheme.primary, margin: 0, fontFamily: 'Fredoka' }}>{selectedItem.letter}</h1>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ margin: 0, fontSize: 'var(--fs-2xl)', fontFamily: 'Fredoka' }}>{selectedItem.name}</h2>
                                        <p style={{ fontSize: 'var(--fs-xl)', color: '#64748B', margin: '10px 0', fontFamily: 'Fredoka' }}>{selectedItem.word}</p>
                                        <p style={{ fontSize: 'var(--fs-base)', margin: 0, fontFamily: 'Fredoka' }}>English: <strong>{selectedItem.translation}</strong></p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => speak(selectedItem.word)}
                                    style={{
                                        background: colorScheme.primary,
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 30px',
                                        borderRadius: '20px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        fontFamily: 'Fredoka',
                                        boxShadow: `0 6px 0 ${colorScheme.accent}`,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Volume2 size={24} /> Hear Word
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {stage === 'numbers' && (
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', fontFamily: 'Fredoka', fontSize: '36px' }}>Number Garden</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '25px', direction: 'rtl' }}>
                        {numbers.map(num => (
                            <motion.div
                                key={num.ar}
                                whileHover={{ y: -5 }}
                                whileTap={{ y: 5, boxShadow: 'none' }}
                                onClick={() => { speak(num.ar); playCorrect(); }}
                                style={{
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'white',
                                    borderRadius: '32px',
                                    padding: '30px',
                                    boxShadow: '0 10px 0 #F1F5F9',
                                    border: '2px solid #F8FAFC'
                                }}
                            >
                                <h1 style={{ color: colorScheme.primary, fontSize: '72px', margin: 0, fontFamily: 'Fredoka' }}>{num.ar}</h1>
                                <p style={{ fontSize: '28px', margin: '10px 0 5px', fontWeight: 'bold', fontFamily: 'Fredoka' }}>{num.name}</p>
                                <p style={{ fontSize: '20px', color: '#64748B', fontFamily: 'Fredoka' }}>({num.en})</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {stage === 'words' && (
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        <motion.button
                            whileTap={{ y: 4, boxShadow: 'none' }}
                            onClick={() => setSubStage('animals')}
                            style={{
                                background: subStage === 'animals' ? colorScheme.primary : 'white',
                                color: subStage === 'animals' ? 'white' : colorScheme.primary,
                                padding: '10px 25px',
                                borderRadius: '16px',
                                border: 'none',
                                fontFamily: 'Fredoka',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: subStage === 'animals' ? `0 6px 0 ${colorScheme.accent}` : '0 6px 0 #F1F5F9',
                                cursor: 'pointer'
                            }}
                        >
                            Animals 🦁
                        </motion.button>
                        <motion.button
                            whileTap={{ y: 4, boxShadow: 'none' }}
                            onClick={() => setSubStage('objects')}
                            style={{
                                background: subStage === 'objects' ? colorScheme.primary : 'white',
                                color: subStage === 'objects' ? 'white' : colorScheme.primary,
                                padding: '10px 25px',
                                borderRadius: '16px',
                                border: 'none',
                                fontFamily: 'Fredoka',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: subStage === 'objects' ? `0 6px 0 ${colorScheme.accent}` : '0 6px 0 #F1F5F9',
                                cursor: 'pointer'
                            }}
                        >
                            Objects 🏠
                        </motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px', direction: 'rtl' }}>
                        {(subStage === 'animals' ? animals : objects).map(item => (
                            <motion.div
                                key={item.ar}
                                whileHover={{ y: -5 }}
                                whileTap={{ y: 5, boxShadow: 'none' }}
                                onClick={() => { speak(item.ar); playCorrect(); }}
                                style={{
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'white',
                                    borderRadius: '32px',
                                    padding: '40px',
                                    boxShadow: '0 12px 0 #F1F5F9',
                                    border: '2px solid #F8FAFC'
                                }}
                            >
                                <div style={{ fontSize: '80px', marginBottom: '20px' }}>{item.emoji}</div>
                                <h1 style={{ color: colorScheme.primary, margin: '0 0 10px', fontSize: '40px', fontFamily: 'Fredoka' }}>{item.ar}</h1>
                                <p style={{ fontSize: '24px', color: '#64748B', margin: 0, fontFamily: 'Fredoka' }}>{item.en}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArabicAdventure;
