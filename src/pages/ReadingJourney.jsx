import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, CheckCircle, ChevronRight, Volume2, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';
import BeeImage from '../Pictures/TheBusyLittleBee.png';
import TugboatImage from '../Pictures/TheBraveLittleTugboat.png';

const ReadingJourney = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct);
    const [playWrong] = useSound(SOUND_URLS.wrong);
    const [playPerfect] = useSound(SOUND_URLS.perfect);
    const [stage, setStage] = useState('selection'); // selection | story | quiz | vocab
    const [selectedStory, setSelectedStory] = useState(null);
    const [quizScore, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const colorScheme = {
        primary: '#F97316',
        accent: '#C2410C',
        bgSubtle: 'rgba(249, 115, 22, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const stories = [
        {
            id: 1,
            title: "The Busy Little Bee",
            image: BeeImage,
            description: "Learn about Barnaby and his golden honey adventure!",
            content: [
                "Once there was a busy little bee named Barnaby.",
                "Barnaby flew from flower to flower gathering golden nectar.",
                "He lived in a big, buzzing beehive with all his friends.",
                "They worked together to make sweet, silver honey for the winter."
            ],
            questions: [
                { q: "What was the bee's name?", options: ["Barnaby", "Bobby", "Billy"], a: "Barnaby" },
                { q: "Where did Barnaby live?", options: ["A bird nest", "A beehive", "A flower"], a: "A beehive" },
                { q: "What did the bees make together?", options: ["Golden nectar", "Silver honey", "Sweet flowers"], a: "Silver honey" }
            ],
            vocab: [
                { word: "Busy", type: "synonym", options: ["Active", "Sleepy", "Lazy"], a: "Active" },
                { word: "Sweet", type: "antonym", options: ["Sour", "Sugar", "Yummy"], a: "Sour" }
            ]
        },
        {
            id: 2,
            title: "The Brave Little Tugboat",
            image: TugboatImage,
            description: "Join Toby on a stormy night in the busy harbor!",
            content: [
                "Toby was the smallest tugboat in the busy harbor.",
                "While the big ships carried heavy boxes, Toby helped them find their way.",
                "One stormy night, a giant cargo ship got stuck in the thick mud.",
                "Toby pulled with all his might, and slowly, the giant ship started to move!",
                "Everyone cheered for Toby, the bravest little boat of all."
            ],
            questions: [
                { q: "Where did Toby live?", options: ["In a lake", "In a harbor", "In a bathtub"], a: "In a harbor" },
                { q: "What happened on the stormy night?", options: ["Toby got lost", "A ship got stuck", "Toby took a nap"], a: "A ship got stuck" },
                { q: "How did Toby help the giant ship?", options: ["He pulled it", "He pushed it", "He sang to it"], a: "He pulled it" }
            ],
            vocab: [
                { word: "Brave", type: "synonym", options: ["Courageous", "Scared", "Quiet"], a: "Courageous" },
                { word: "Giant", type: "antonym", options: ["Tiny", "Huge", "Strong"], a: "Tiny" }
            ]
        }
    ];

    const handleNextQuestion = (answer) => {
        if (answer === selectedStory.questions[currentQuestion].a) {
            playCorrect();
            setScore(quizScore + 1);
        } else {
            playWrong();
        }

        if (currentQuestion + 1 < selectedStory.questions.length) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 500);
        } else {
            setTimeout(() => {
                setStage('vocab-intro');
            }, 1000);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => stage === 'selection' ? navigate('/') : setStage('selection')}
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
                            <Library size={24} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B' }}>Reading Journey</h2>
                    </div>
                </div>
            </header>

            {stage === 'selection' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {stories.map(story => (
                        <motion.div
                            key={story.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ y: 5, boxShadow: 'none' }}
                            onClick={() => { setSelectedStory(story); setStage('story'); }}
                            style={{
                                cursor: 'pointer',
                                background: 'white',
                                borderRadius: '32px',
                                padding: '30px',
                                boxShadow: '0 12px 0 #E2E8F0',
                                border: '3px solid #F8FAFC'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '220px',
                                background: '#F8FAFC',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                marginBottom: '25px',
                                border: '2px solid #F1F5F9'
                            }}>
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '28px', marginBottom: '12px', fontFamily: 'Fredoka', color: '#1E293B' }}>{story.title}</h3>
                            <p style={{ color: '#64748B', fontFamily: 'Fredoka', fontSize: '18px', lineHeight: '1.5' }}>{story.description}</p>
                            <div style={{ marginTop: '25px', color: colorScheme.primary, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fredoka', fontSize: '20px' }}>
                                Open Book <ChevronRight size={22} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {stage === 'story' && selectedStory && (
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '60px',
                            background: 'white',
                            borderRadius: '40px',
                            boxShadow: '0 15px 0 #E2E8F0',
                            border: '4px solid #F8FAFC'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '450px',
                            background: '#F8FAFC',
                            borderRadius: '32px',
                            marginBottom: '50px',
                            overflow: 'hidden',
                            border: '5px solid #F1F5F9',
                            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
                        }}>
                            <img
                                src={selectedStory.image}
                                alt={selectedStory.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h1 style={{ marginBottom: '40px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: '48px', color: '#1E293B' }}>{selectedStory.title}</h1>
                        <div style={{ fontSize: '26px', lineHeight: '1.8', color: '#334155', textAlign: 'center', fontFamily: 'Fredoka' }}>
                            {selectedStory.content.map((para, i) => (
                                <p key={i} style={{ marginBottom: '30px' }}>{para}</p>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setStage('quiz'); setCurrentQuestion(0); setScore(0); }}
                                style={{
                                    padding: '24px 60px',
                                    fontSize: '24px',
                                    background: colorScheme.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '24px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    boxShadow: `0 8px 0 ${colorScheme.accent}`,
                                    cursor: 'pointer'
                                }}
                            >
                                I'm Finished Reading! 🌟
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {stage === 'quiz' && selectedStory && (
                <div style={{ maxWidth: '650px', margin: '40px auto' }}>
                    <h2 style={{ marginBottom: '32px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: '36px' }}>Story Quiz</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'white', padding: '50px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}
                    >
                        <p style={{ fontSize: '18px', color: colorScheme.primary, fontWeight: 'bold', marginBottom: '15px', fontFamily: 'Fredoka' }}>QUESTION {currentQuestion + 1} OF {selectedStory.questions.length}</p>
                        <h3 style={{ fontSize: '32px', marginBottom: '40px', fontFamily: 'Fredoka', color: '#1E293B' }}>{selectedStory.questions[currentQuestion].q}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            {selectedStory.questions[currentQuestion].options.map(opt => (
                                <motion.button
                                    key={opt}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ y: 5, boxShadow: 'none' }}
                                    onClick={() => handleNextQuestion(opt)}
                                    style={{ background: 'white', color: '#1E293B', border: '3px solid #F1F5F9', padding: '20px', fontSize: '22px', borderRadius: '24px', fontFamily: 'Fredoka', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 0 #F1F5F9' }}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {stage === 'vocab-intro' && (
                <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}>
                        <Star size={80} fill="#F59E0B" color="#F59E0B" style={{ margin: '0 auto 24px' }} />
                        <h1 style={{ fontFamily: 'Fredoka', fontSize: '42px', color: '#1E293B' }}>Great Comprehension!</h1>
                        <p style={{ fontSize: '22px', marginBottom: '40px', color: '#64748B', fontFamily: 'Fredoka' }}>You got {quizScore} out of {selectedStory.questions.length} correct. Now let's learn some new words!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStage('vocab')}
                            style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '20px 50px', borderRadius: '20px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: `0 8px 0 ${colorScheme.accent}`, cursor: 'pointer' }}
                        >
                            Start Word Fun!
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {stage === 'vocab' && selectedStory && (
                <div style={{ maxWidth: '650px', margin: '60px auto' }}>
                    <h2 style={{ marginBottom: '32px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: '36px' }}>Word Magic</h2>
                    <motion.div initial={{ opacity: 0, y: i => i * 20 }} style={{ background: 'white', padding: '50px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}>
                        <p style={{ textAlign: 'center', fontSize: '22px', marginBottom: '25px', color: '#64748B', fontFamily: 'Fredoka' }}>
                            Find the <strong style={{ color: colorScheme.primary }}>{selectedStory.vocab[0].type}</strong> for:
                        </p>
                        <h1 style={{ textAlign: 'center', fontSize: '80px', marginBottom: '50px', color: colorScheme.primary, fontFamily: 'Fredoka' }}>{selectedStory.vocab[0].word}</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {selectedStory.vocab[0].options.map(opt => (
                                <motion.button
                                    key={opt}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ y: 5, boxShadow: 'none' }}
                                    onClick={() => {
                                        if (opt === selectedStory.vocab[0].a) {
                                            playPerfect();
                                            setStage('finished');
                                        } else {
                                            playWrong();
                                        }
                                    }}
                                    style={{ background: 'white', border: '3px solid #F1F5F9', padding: '25px', borderRadius: '24px', fontSize: '24px', fontFamily: 'Fredoka', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 0 #F1F5F9' }}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {stage === 'finished' && (
                <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 15px 0 #E2E8F0', border: '4px solid #F8FAFC' }}>
                        <CheckCircle size={100} color="#10B981" style={{ margin: '0 auto 24px' }} />
                        <h1 style={{ fontFamily: 'Fredoka', fontSize: '48px', color: '#1E293B' }}>Journey Complete!</h1>
                        <p style={{ fontSize: '24px', marginBottom: '40px', color: '#64748B', fontFamily: 'Fredoka' }}>You are becoming a master reader! 📖🌟</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStage('selection')}
                            style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '20px 50px', borderRadius: '20px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: '0 8px 0 #1D4ED8', cursor: 'pointer' }}
                        >
                            Pick Another Story
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ReadingJourney;
