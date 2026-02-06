import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, CheckCircle, ChevronRight, Volume2, Library, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';
import BeeImage from '../Pictures/TheBusyLittleBee.png';
import TugboatImage from '../Pictures/TheBraveLittleTugboat.png';
import SquirrelImage from '../Pictures/SammyTheCuriousSquirrel.png';
import FishImage from '../Pictures/FinsTheRainbowFish.png';

const ReadingJourney = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    const [stage, setStage] = useState('selection'); // selection | story | typing | quiz | vocab
    const [selectedStory, setSelectedStory] = useState(null);
    const [quizScore, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentVocab, setCurrentVocab] = useState(0);
    
    // Typing game state
    const [typedText, setTypedText] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

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
                { q: "What was the bee's name?", options: ["Barnaby", "Bobby", "Billy", "Buster"], a: "Barnaby" },
                { q: "Where did Barnaby live?", options: ["A bird nest", "A beehive", "A flower", "A hollow log"], a: "A beehive" },
                { q: "What did the bees make together?", options: ["Golden nectar", "Silver honey", "Sweet flowers", "Shiny wax"], a: "Silver honey" }
            ],
            vocab: [
                { word: "Busy", type: "synonym", options: ["Active", "Sleepy", "Lazy", "Quiet"], a: "Active" },
                { word: "Sweet", type: "antonym", options: ["Sour", "Sugar", "Yummy", "Salty"], a: "Sour" }
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
                { q: "Where did Toby live?", options: ["In a lake", "In a harbor", "In a bathtub", "In a river"], a: "In a harbor" },
                { q: "What happened on the stormy night?", options: ["Toby got lost", "A ship got stuck", "Toby took a nap", "It started to snow"], a: "A ship got stuck" },
                { q: "How did Toby help the giant ship?", options: ["He pulled it", "He pushed it", "He sang to it", "He called for help"], a: "He pulled it" }
            ],
            vocab: [
                { word: "Brave", type: "synonym", options: ["Courageous", "Scared", "Quiet", "Weak"], a: "Courageous" },
                { word: "Giant", type: "antonym", options: ["Tiny", "Huge", "Strong", "Big"], a: "Tiny" }
            ]
        },
        {
            id: 3,
            title: "The Curious Squirrel's Nut",
            image: SquirrelImage,
            description: "Sammy finds a giant golden acorn and learns that sharing is the best treasure.",
            content: [
                "Sammy was a very curious squirrel who loved searching for treasures in the Oak Wood.",
                "One morning, he found the biggest, shiniest golden acorn he had ever seen!",
                "It was too heavy for Sammy to carry alone, so he called his forest friends to help.",
                "Together, they rolled the golden nut all the way to Sammy's cozy tree hollow.",
                "Sammy shared the nut with everyone, proving that the best treasures are even better when shared."
            ],
            questions: [
                { q: "What did Sammy find?", options: ["A golden acorn", "A red apple", "A silver coin", "A blue berry"], a: "A golden acorn" },
                { q: "Why did Sammy call his friends?", options: ["To play games", "To help carry the nut", "To share a secret", "To find a map"], a: "To help carry the nut" },
                { q: "What did Sammy learn?", options: ["Nuts are tasty", "Sharing is best", "Oak Wood is big", "Winter is coming"], a: "Sharing is best" }
            ],
            vocab: [
                { word: "Curious", type: "synonym", options: ["Inquisitive", "Bored", "Angry", "Tired"], a: "Inquisitive" },
                { word: "Giant", type: "antonym", options: ["Tiny", "Huge", "Strong", "Heavy"], a: "Tiny" }
            ]
        },
        {
            id: 4,
            title: "The Rainbow Fish's Friend",
            image: FishImage,
            description: "Fins explores the shimmering sea and finds a brand new friend to play with.",
            content: [
                "Fins was the most colorful fish in the shimmering sea, but he felt a little lonely.",
                "He wanted to find a friend who liked to play tag in the coral reef.",
                "Deep in the blue water, Fins met a friendly dolphin named Dash.",
                "Dash showed Fins how to leap through the waves and race past the giant sea turtles.",
                "Now, Fins and Dash are the best of friends, exploring the ocean together every day."
            ],
            questions: [
                { q: "How did Fins feel at the start?", options: ["Happy", "Lonely", "Scared", "Excited"], a: "Lonely" },
                { q: "What animal is Fins' new friend?", options: ["A crab", "A shark", "A dolphin", "A turtle"], a: "A dolphin" },
                { q: "What do Fins and Dash do together?", options: ["Eat lunch", "Explore the ocean", "Take naps", "Sing songs"], a: "Explore the ocean" }
            ],
            vocab: [
                { word: "Colorful", type: "synonym", options: ["Vibrant", "Gray", "Plain", "Dark"], a: "Vibrant" },
                { word: "Friendly", type: "antonym", options: ["Mean", "Kind", "Nice", "Warm"], a: "Mean" }
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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
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
                            <Library size={20} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: 'var(--fs-lg)' }}>Reading Journey</h2>
                    </div>
                </div>
            </header>

            {stage === 'selection' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {stories.map(story => (
                        <motion.div
                            key={story.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ y: 5, boxShadow: 'none' }}
                            onClick={() => { setSelectedStory(story); setStage('story'); setCurrentVocab(0); }}
                            style={{
                                cursor: 'pointer',
                                background: 'white',
                                borderRadius: '28px',
                                padding: '20px',
                                boxShadow: '0 10px 0 #E2E8F0',
                                border: '3px solid #F8FAFC'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: 'clamp(140px, 30vw, 220px)',
                                background: '#F8FAFC',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                marginBottom: '15px',
                                border: '2px solid #F1F5F9'
                            }}>
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: '8px', fontFamily: 'Fredoka', color: '#1E293B' }}>{story.title}</h3>
                            <p style={{ color: '#64748B', fontFamily: 'Fredoka', fontSize: 'var(--fs-sm)', lineHeight: '1.4' }}>{story.description}</p>
                            <div style={{ marginTop: '15px', color: colorScheme.primary, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Fredoka', fontSize: '16px' }}>
                                Open Book <ChevronRight size={18} />
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
                            padding: 'clamp(20px, 5vw, 60px)',
                            background: 'white',
                            borderRadius: '32px',
                            boxShadow: '0 12px 0 #E2E8F0',
                            border: '3px solid #F8FAFC'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: 'clamp(200px, 50vw, 450px)',
                            background: '#F8FAFC',
                            borderRadius: '24px',
                            marginBottom: '30px',
                            overflow: 'hidden',
                            border: '3px solid #F1F5F9',
                            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
                        }}>
                            <img
                                src={selectedStory.image}
                                alt={selectedStory.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h1 style={{ marginBottom: '20px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: 'var(--fs-xl)', color: '#1E293B' }}>{selectedStory.title}</h1>
                        <div style={{ fontSize: 'var(--fs-base)', lineHeight: '1.6', color: '#334155', textAlign: 'center', fontFamily: 'Fredoka' }}>
                            {selectedStory.content.map((para, i) => (
                                <p key={i} style={{ marginBottom: '20px' }}>{para}</p>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '20px' }}>
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
                                onClick={() => { setStage('quiz'); setCurrentQuestion(0); setScore(0); }}
                                style={{
                                    padding: '16px 40px',
                                    fontSize: '18px',
                                    background: '#F59E0B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    boxShadow: '0 6px 0 #D97706',
                                    cursor: 'pointer'
                                }}
                            >
                                Go to Quiz! 🎯
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { 
                                    setStage('typing'); 
                                    setTypedText(''); 
                                    setStartTime(null); 
                                    setIsTypingComplete(false);
                                    setWpm(0);
                                    setAccuracy(100);
                                    setElapsedTime(0);
                                }}
                                style={{
                                    padding: '16px 40px',
                                    fontSize: '18px',
                                    background: '#3B82F6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 'bold',
                                    boxShadow: '0 6px 0 #1D4ED8',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Keyboard size={20} /> Typing Challenge
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {stage === 'typing' && selectedStory && (() => {
                const fullText = selectedStory.content.join(' ');
                
                const handleTyping = (e) => {
                    const value = e.target.value;
                    
                    // Start timer on first keystroke
                    if (!startTime && value.length > 0) {
                        setStartTime(Date.now());
                    }
                    
                    setTypedText(value);
                    
                    // Calculate stats
                    if (startTime) {
                        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
                        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
                        
                        // Count correct characters
                        let correctChars = 0;
                        for (let i = 0; i < value.length; i++) {
                            if (value[i] === fullText[i]) correctChars++;
                        }
                        
                        const words = correctChars / 5; // Standard: 5 chars = 1 word
                        const currentWpm = timeElapsed > 0 ? Math.round(words / timeElapsed) : 0;
                        setWpm(currentWpm);
                        
                        const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
                        setAccuracy(currentAccuracy);
                    }
                    
                    // Check if complete
                    if (value.length >= fullText.length) {
                        setIsTypingComplete(true);
                        playPerfect();
                    }
                };
                
                return (
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: 'clamp(20px, 5vw, 40px)',
                                background: 'white',
                                borderRadius: '32px',
                                boxShadow: '0 12px 0 #E2E8F0',
                                border: '3px solid #F8FAFC'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                                <h2 style={{ fontFamily: 'Fredoka', fontSize: '24px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Keyboard size={28} color="#3B82F6" /> Typing Challenge
                                </h2>
                                <div style={{ display: 'flex', gap: '20px', fontFamily: 'Fredoka' }}>
                                    <div style={{ textAlign: 'center', background: '#F0FDF4', padding: '10px 20px', borderRadius: '16px' }}>
                                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>{wpm}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>WPM</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: '#EFF6FF', padding: '10px 20px', borderRadius: '16px' }}>
                                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3B82F6' }}>{accuracy}%</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>Accuracy</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: '#FEF3C7', padding: '10px 20px', borderRadius: '16px' }}>
                                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F59E0B' }}>{elapsedTime}s</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>Time</div>
                                    </div>
                                </div>
                            </div>
                            
                            {!isTypingComplete ? (
                                <>
                                    <div style={{
                                        background: '#F8FAFC',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        marginBottom: '20px',
                                        fontFamily: 'Fredoka',
                                        fontSize: '18px',
                                        lineHeight: '2',
                                        border: '2px solid #E2E8F0'
                                    }}>
                                        {fullText.split('').map((char, i) => {
                                            let color = '#94A3B8'; // Default gray
                                            if (i < typedText.length) {
                                                color = typedText[i] === char ? '#10B981' : '#EF4444'; // Green or red
                                            }
                                            return (
                                                <span key={i} style={{ 
                                                    color, 
                                                    backgroundColor: i === typedText.length ? '#FEF08A' : 'transparent',
                                                    padding: i === typedText.length ? '2px 0' : '0'
                                                }}>
                                                    {char}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    
                                    <textarea
                                        value={typedText}
                                        onChange={handleTyping}
                                        placeholder="Start typing the story here..."
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            minHeight: '120px',
                                            padding: '20px',
                                            fontFamily: 'Fredoka',
                                            fontSize: '18px',
                                            border: '3px solid #E2E8F0',
                                            borderRadius: '16px',
                                            resize: 'none',
                                            outline: 'none'
                                        }}
                                    />
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <CheckCircle size={80} color="#10B981" style={{ marginBottom: '20px' }} />
                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B', marginBottom: '10px' }}>Challenge Complete!</h2>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '20px', color: '#64748B', marginBottom: '30px' }}>
                                        You typed {fullText.split(' ').length} words at <strong style={{ color: '#10B981' }}>{wpm} WPM</strong> with <strong style={{ color: '#3B82F6' }}>{accuracy}% accuracy</strong>!
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => { 
                                                setTypedText(''); 
                                                setStartTime(null); 
                                                setIsTypingComplete(false);
                                                setWpm(0);
                                                setAccuracy(100);
                                                setElapsedTime(0);
                                            }}
                                            style={{ padding: '16px 30px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 0 #1D4ED8' }}
                                        >
                                            Try Again
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => { setStage('quiz'); setCurrentQuestion(0); setScore(0); }}
                                            style={{ padding: '16px 30px', background: colorScheme.primary, color: 'white', border: 'none', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: `0 6px 0 ${colorScheme.accent}` }}
                                        >
                                            Continue to Quiz →
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                );
            })()}

            {stage === 'quiz' && selectedStory && (
                <div style={{ maxWidth: '650px', margin: '40px auto' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: '28px' }}>Story Quiz</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'white', padding: 'clamp(20px, 5vw, 50px)', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', border: '3px solid #F8FAFC' }}
                    >
                        <p style={{ fontSize: '14px', color: colorScheme.primary, fontWeight: 'bold', marginBottom: '10px', fontFamily: 'Fredoka' }}>QUESTION {currentQuestion + 1} OF {selectedStory.questions.length}</p>
                        <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: '30px', fontFamily: 'Fredoka', color: '#1E293B' }}>{selectedStory.questions[currentQuestion].q}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                            {selectedStory.questions[currentQuestion].options.map(opt => (
                                <motion.button
                                    key={opt}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleNextQuestion(opt)}
                                    style={{ background: 'white', color: '#1E293B', border: '2px solid #F1F5F9', padding: '15px', fontSize: '18px', borderRadius: '20px', fontFamily: 'Fredoka', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 6px 0 #F1F5F9' }}
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
                            onClick={() => { setStage('vocab'); setCurrentVocab(0); }}
                            style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '20px 50px', borderRadius: '20px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Fredoka', boxShadow: `0 8px 0 ${colorScheme.accent}`, cursor: 'pointer' }}
                        >
                            Start Word Fun!
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {stage === 'vocab' && selectedStory && (
                <div style={{ maxWidth: '650px', margin: '40px auto' }}>
                    <h2 style={{ marginBottom: '25px', textAlign: 'center', fontFamily: 'Fredoka', fontSize: '28px' }}>Word Magic</h2>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: 'clamp(30px, 8vw, 50px)', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', border: '3px solid #F8FAFC' }}>
                        <p style={{ textAlign: 'center', fontSize: '16px', marginBottom: '20px', color: '#64748B', fontFamily: 'Fredoka' }}>
                            Find the <strong style={{ color: colorScheme.primary }}>{selectedStory.vocab[currentVocab].type}</strong> for:
                        </p>
                        <h1 style={{ textAlign: 'center', fontSize: 'clamp(40px, 12vw, 80px)', marginBottom: '30px', color: colorScheme.primary, fontFamily: 'Fredoka' }}>{selectedStory.vocab[currentVocab].word}</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {selectedStory.vocab[currentVocab].options.map(opt => (
                                <motion.button
                                    key={opt}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ y: 5, boxShadow: 'none' }}
                                    onClick={() => {
                                        if (opt === selectedStory.vocab[currentVocab].a) {
                                            playPerfect();
                                            if (currentVocab + 1 < selectedStory.vocab.length) {
                                                setCurrentVocab(currentVocab + 1);
                                            } else {
                                                setStage('finished');
                                            }
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
