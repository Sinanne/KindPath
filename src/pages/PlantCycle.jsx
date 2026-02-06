import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flower2, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import SOUND_URLS from '../utils/sounds';

const PlantCycle = () => {
    const navigate = useNavigate();
    const [playCorrect] = useSound(SOUND_URLS.correct, { volume: 0.4 });
    const [playWrong] = useSound(SOUND_URLS.wrong, { volume: 0.4 });
    const [playPerfect] = useSound(SOUND_URLS.perfect, { volume: 0.4 });
    
    const [stage, setStage] = useState('learn');
    const [currentStep, setCurrentStep] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);

    const colorScheme = { primary: '#22C55E', accent: '#16A34A' };

    const lifeCycleSteps = [
        { name: 'Seed', emoji: '🌰', desc: 'A tiny seed contains everything needed to grow a new plant!', fact: 'Some seeds can stay alive for hundreds of years!' },
        { name: 'Germination', emoji: '🌱', desc: 'With water and warmth, the seed cracks open and roots grow down.', fact: 'The first root always grows straight down toward gravity!' },
        { name: 'Seedling', emoji: '🌿', desc: 'A baby plant pushes up through the soil with its first leaves.', fact: 'The first leaves often look different from adult leaves.' },
        { name: 'Growth', emoji: '🪴', desc: 'The plant grows more leaves to catch sunlight and make food.', fact: 'Plants make their own food using sunlight!' },
        { name: 'Flowering', emoji: '🌸', desc: 'Beautiful flowers bloom to attract bees and make new seeds.', fact: 'Bees and butterflies help spread pollen between flowers!' },
        { name: 'Fruit & Seeds', emoji: '🍎', desc: 'Flowers become fruit with new seeds inside to start the cycle again!', fact: 'One sunflower can produce over 1,000 seeds!' }
    ];

    const quizQuestions = [
        { q: 'What does a plant start as?', a: 'A seed', options: ['A flower', 'A seed', 'A leaf'] },
        { q: 'What do seeds need to grow?', a: 'Water and warmth', options: ['Ice', 'Water and warmth', 'Darkness'] },
        { q: 'What comes after the flower stage?', a: 'Fruit and seeds', options: ['Seed', 'Seedling', 'Fruit and seeds'] },
    ];

    const handleQuizAnswer = (answer) => {
        const isCorrect = answer === quizQuestions[quizIndex].a;
        if (isCorrect) { playCorrect(); setScore(score + 1); } else { playWrong(); }
        if (quizIndex + 1 < quizQuestions.length) {
            setTimeout(() => setQuizIndex(quizIndex + 1), 500);
        } else {
            setTimeout(() => { setStage('results'); playPerfect(); }, 500);
        }
    };

    const step = lifeCycleSteps[currentStep];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => stage === 'learn' ? navigate('/science') : setStage('learn')} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '10px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <ArrowLeft size={20} color="#64748B" />
                        </motion.button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 4px 0 #E2E8F0' }}>
                            <Flower2 size={22} color={colorScheme.primary} />
                            <span style={{ fontFamily: 'Fredoka', fontWeight: 'bold', color: '#1E293B', fontSize: '18px' }}>Plant Life Cycle</span>
                        </div>
                    </div>
                    {stage === 'learn' && (
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
                            onClick={() => { setStage('quiz'); setQuizIndex(0); setScore(0); }} 
                            style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #D97706' }}
                        >
                            Take Quiz! 🎯
                        </motion.button>
                    )}
                </header>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        {stage === 'learn' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {/* Timeline - Horizontal */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexShrink: 0 }}>
                                    {lifeCycleSteps.map((s, i) => (
                                        <motion.button
                                            key={s.name}
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentStep(i)}
                                            style={{
                                                flex: 1,
                                                background: currentStep === i ? colorScheme.primary : 'white',
                                                border: 'none',
                                                borderRadius: '14px',
                                                padding: '12px',
                                                cursor: 'pointer',
                                                boxShadow: currentStep === i ? `0 4px 0 ${colorScheme.accent}` : '0 4px 0 #E2E8F0',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <span style={{ fontSize: '28px' }}>{s.emoji}</span>
                                            <span style={{ fontFamily: 'Fredoka', fontSize: '11px', color: currentStep === i ? 'white' : '#64748B', fontWeight: 'bold' }}>{s.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                                
                                {/* Current Stage Content */}
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ flex: 1, background: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 8px 0 #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 0 }}
                                >
                                    <p style={{ fontFamily: 'Fredoka', color: colorScheme.primary, fontWeight: 'bold', marginBottom: '8px', fontSize: '15px' }}>
                                        Stage {currentStep + 1} of {lifeCycleSteps.length}
                                    </p>
                                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '90px', marginBottom: '15px' }}>
                                        {step.emoji}
                                    </motion.div>
                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B', marginBottom: '10px' }}>{step.name}</h2>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '17px', color: '#64748B', marginBottom: '20px', maxWidth: '500px' }}>{step.desc}</p>
                                    <div style={{ background: '#FEF3C7', padding: '14px 24px', borderRadius: '14px', maxWidth: '450px' }}>
                                        <p style={{ fontFamily: 'Fredoka', fontSize: '14px', color: '#92400E', margin: 0 }}>💡 <strong>Fun Fact:</strong> {step.fact}</p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '20px', marginTop: '25px' }}>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} style={{ padding: '12px 24px', background: currentStep === 0 ? '#F1F5F9' : 'white', border: '2px solid #E2E8F0', borderRadius: '14px', cursor: currentStep === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fredoka', fontWeight: 'bold', color: currentStep === 0 ? '#94A3B8' : '#1E293B' }}>
                                            <ChevronLeft size={20} /> Previous
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentStep(Math.min(lifeCycleSteps.length - 1, currentStep + 1))} disabled={currentStep === lifeCycleSteps.length - 1} style={{ padding: '12px 24px', background: currentStep === lifeCycleSteps.length - 1 ? '#F1F5F9' : colorScheme.primary, border: 'none', borderRadius: '14px', cursor: currentStep === lifeCycleSteps.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fredoka', fontWeight: 'bold', color: currentStep === lifeCycleSteps.length - 1 ? '#94A3B8' : 'white', boxShadow: currentStep === lifeCycleSteps.length - 1 ? 'none' : `0 4px 0 ${colorScheme.accent}` }}>
                                            Next <ChevronRight size={20} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {stage === 'quiz' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '40px', borderRadius: '28px', boxShadow: '0 10px 0 #E2E8F0', maxWidth: '550px', width: '100%' }}>
                                    <p style={{ color: colorScheme.primary, fontWeight: 'bold', fontFamily: 'Fredoka', marginBottom: '10px', fontSize: '15px' }}>Question {quizIndex + 1} of {quizQuestions.length}</p>
                                    <h2 style={{ fontFamily: 'Fredoka', fontSize: '24px', marginBottom: '25px', color: '#1E293B' }}>{quizQuestions[quizIndex].q}</h2>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {quizQuestions[quizIndex].options.map((opt) => (
                                            <motion.button key={opt} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleQuizAnswer(opt)} style={{ background: 'white', border: '2px solid #E2E8F0', padding: '16px', borderRadius: '14px', fontFamily: 'Fredoka', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 0 #E2E8F0', textAlign: 'left' }}>{opt}</motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {stage === 'results' && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 12px 0 #E2E8F0', textAlign: 'center' }}>
                                    <Trophy size={70} color="#F59E0B" style={{ marginBottom: '20px' }} />
                                    <h1 style={{ fontFamily: 'Fredoka', fontSize: '32px', color: '#1E293B' }}>Plant Pro!</h1>
                                    <p style={{ fontFamily: 'Fredoka', fontSize: '22px', color: '#64748B', marginBottom: '25px' }}><strong style={{ color: colorScheme.primary }}>{score}</strong> / {quizQuestions.length} correct!</p>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setStage('quiz'); setQuizIndex(0); setScore(0); }} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 0 #1D4ED8' }}>Try Again</motion.button>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setStage('learn'); setCurrentStep(0); }} style={{ background: colorScheme.primary, color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontFamily: 'Fredoka', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: `0 4px 0 ${colorScheme.accent}` }}>Learn More</motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PlantCycle;
