import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Beaker, BookOpen, Star, Zap, Languages, Rocket, Globe, Book, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const subjects = [
        {
            id: 'math',
            title: 'MATH',
            icon: <Calculator size={48} color="white" />,
            color: '#FF4D4D',
            accent: '#CC0000',
            bgLight: 'rgba(255, 255, 255, 0.2)',
            level: 'Level 1'
        },
        {
            id: 'science',
            title: 'SCIENCE',
            icon: <Globe size={48} color="white" />,
            color: '#3B82F6',
            accent: '#1D4ED8',
            bgLight: 'rgba(255, 255, 255, 0.2)',
            level: 'Level 2'
        },
        {
            id: 'english',
            title: 'ENGLISH',
            icon: <Book size={48} color="white" />,
            color: '#FFD93D',
            accent: '#C29100',
            bgLight: 'rgba(255, 255, 255, 0.4)',
            level: 'Level 1'
        },
        {
            id: 'arabic',
            title: 'ARABIC',
            icon: <Languages size={48} color="white" />,
            color: '#A855F7',
            accent: '#7E22CE',
            bgLight: 'rgba(255, 255, 255, 0.2)',
            level: 'Level 1'
        },
        {
            id: 'quran',
            title: 'QURAN',
            icon: <Star size={48} color="white" />,
            color: '#10B981',
            accent: '#047857',
            bgLight: 'rgba(255, 255, 255, 0.2)',
            level: 'Level 3'
        },
        {
            id: 'reading',
            title: 'STORIES',
            icon: <BookOpen size={48} color="white" />,
            color: '#F472B6',
            accent: '#BE185D',
            bgLight: 'rgba(255, 255, 255, 0.2)',
            level: 'Level 2'
        }
    ];

    const [fact, setFact] = useState("Honeybees can flap their wings 200 times every second! 🐝");

    const facts = [
        "Honeybees can flap their wings 200 times every second! 🐝",
        "Octopuses have three hearts! 💙💙💙",
        "A shrimp's heart is located in its head! 🦐",
        "Snails can sleep for up to three years! 🐌",
        "Elephants are the only animals that can't jump! 🐘"
    ];

    const nextFact = () => {
        const currentIdx = facts.indexOf(fact);
        const nextIdx = (currentIdx + 1) % facts.length;
        setFact(facts[nextIdx]);
    };

    return (
        <div className="container" style={{ padding: '40px 16px', background: '#FDFCF0', minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '20px',
                        background: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 0 #E2E8F0',
                        border: '2px solid #F1F5F9'
                    }}
                >
                    <Rocket color="#3B82F6" size={28} />
                    <h1 style={{ color: '#1E293B', fontSize: 'var(--fs-lg)', fontFamily: 'Fredoka', margin: 0 }}>KindPath</h1>
                </motion.div>

                <h1 style={{ fontSize: 'var(--fs-2xl)', color: '#1E293B', fontFamily: 'Fredoka', fontWeight: 'bold', margin: '10px 0' }}>
                    Hi <span style={{ color: '#3B82F6' }}>Explorer!</span>
                </h1>
                <p style={{ color: '#64748B', fontSize: 'var(--fs-base)', fontWeight: '500' }}>Pick a subject to start your adventure!</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {subjects.map((subject) => (
                    <motion.div
                        key={subject.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => navigate(`/${subject.id}`)}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: subject.color,
                            borderRadius: '28px',
                            padding: '20px',
                            position: 'relative',
                            boxShadow: `0 8px 0 ${subject.accent}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            transition: 'all 0.1s ease'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(0,0,0,0.1)',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {subject.level}
                        </div>

                        <div style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: subject.bgLight,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px'
                        }}>
                            {React.cloneElement(subject.icon, { size: 36 })}
                        </div>

                        <h2 style={{
                            color: 'white',
                            fontSize: 'var(--fs-lg)',
                            letterSpacing: '1px',
                            margin: 0,
                            fontFamily: 'Fredoka',
                            fontWeight: 'bold'
                        }}>
                            {subject.title}
                        </h2>
                    </motion.div>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px'
            }}>
                {/* My Stars Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '32px',
                    padding: '24px',
                    boxShadow: '0 8px 0 #F1F5F9',
                    border: '2px solid #F8FAFC'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Trophy color="#F59E0B" size={24} />
                        <h3 style={{ color: '#1E293B', margin: 0, fontSize: 'var(--fs-lg)' }}>My Stars</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FFD93D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 4px 0 #C29100' }}>
                                <Star fill="black" size={28} />
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Math Star</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 4px 0 #1D4ED8' }}>
                                <Rocket color="white" size={28} />
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Space Ace</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                <Star color="#E2E8F0" size={28} />
                            </div>
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Next...</span>
                        </div>
                    </div>
                </div>

                {/* Fun Fact Section */}
                <div style={{
                    background: '#FF8C42',
                    borderRadius: '32px',
                    padding: '24px',
                    color: 'white',
                    position: 'relative',
                    boxShadow: '0 12px 0 #D35400',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-20px',
                        opacity: 0.2,
                        transform: 'rotate(-15deg)'
                    }}>
                        <Zap size={100} color="white" />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '15px', marginBottom: '16px' }}>
                        <Zap size={16} />
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Fun Fact</span>
                    </div>

                    <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: '12px', lineHeight: '1.2' }}>Did you know?</h3>
                    <p style={{ fontSize: 'var(--fs-base)', marginBottom: '20px', opacity: 0.9 }}>{fact}</p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextFact}
                        style={{
                            background: 'white',
                            color: '#FF8C42',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '16px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 0 #E2E8F0',
                            position: 'relative',
                            zIndex: 5
                        }}
                    >
                        WOW! Next Fact
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
