import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Globe, Droplets, Heart, Flower2, Sun, Waves, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScienceExplorer = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const colorScheme = {
        primary: '#3B82F6',
        accent: '#1D4ED8',
        bgSubtle: 'rgba(59, 130, 246, 0.05)',
        cardBg: 'white',
        cardShadow: '#F1F5F9'
    };

    const scienceTopics = [
        {
            id: 'planets',
            title: 'Solar System',
            icon: <Rocket size={40} />,
            emoji: '🚀',
            color: '#3B82F6',
            description: 'Explore the planets, sun, and learn amazing facts about our solar system!',
            route: '/science/planets'
        },
        {
            id: 'world',
            title: 'World Explorer',
            icon: <Globe size={40} />,
            emoji: '🌍',
            color: '#10B981',
            description: 'Discover continents, countries, and learn about our amazing planet Earth!',
            route: '/science/world-explorer'
        },
        {
            id: 'matter',
            title: 'States of Matter',
            icon: <Droplets size={40} />,
            emoji: '💧',
            color: '#06B6D4',
            description: 'Learn about solids, liquids, and gases through fun interactive experiments!',
            route: '/science/states-of-matter'
        },
        {
            id: 'body',
            title: 'Human Body',
            icon: <Heart size={40} />,
            emoji: '❤️',
            color: '#EC4899',
            description: 'Explore your amazing body and learn how your organs work together!',
            route: '/science/human-body'
        },
        {
            id: 'plants',
            title: 'Plant Life Cycle',
            icon: <Flower2 size={40} />,
            emoji: '🌱',
            color: '#22C55E',
            description: 'Follow the journey of a plant from a tiny seed to a beautiful flower!',
            route: '/science/plant-cycle'
        },
        {
            id: 'seasons',
            title: 'Seasons & Weather',
            icon: <Sun size={40} />,
            emoji: '☀️',
            color: '#F59E0B',
            description: 'Discover the four seasons and learn about different types of weather!',
            route: '/science/seasons-weather'
        },
        {
            id: 'float',
            title: 'Float or Sink',
            icon: <Waves size={40} />,
            emoji: '🌊',
            color: '#0EA5E9',
            description: 'Test your predictions and learn about density with fun experiments!',
            route: '/science/float-sink'
        }
    ];

    return (
        <div className="container" style={{ padding: isMobile ? '20px 10px' : '40px 20px', minHeight: '100vh', background: colorScheme.bgSubtle, overflowX: 'hidden' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '15px' }}>
                    <motion.button
                        whileTap={{ y: 4, boxShadow: 'none' }}
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{ background: 'white', color: '#64748B', boxShadow: '0 4px 0 #E2E8F0', borderRadius: '14px', padding: '8px' }}
                    >
                        <ArrowLeft size={isMobile ? 18 : 20} />
                    </motion.button>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '6px' : '10px',
                        background: 'white',
                        padding: isMobile ? '4px 12px' : '6px 16px',
                        borderRadius: '16px',
                        boxShadow: '0 6px 0 #E2E8F0',
                        border: '2px solid #F1F5F9'
                    }}>
                        <div style={{ background: colorScheme.primary, padding: '5px', borderRadius: '8px' }}>
                            <Rocket size={isMobile ? 16 : 20} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontFamily: 'Fredoka', color: '#1E293B', fontSize: isMobile ? '16px' : 'var(--fs-lg)' }}>Science Explorer</h2>
                    </div>
                </div>
            </header>

            {/* Topic Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {scienceTopics.map(topic => (
                    <motion.div
                        key={topic.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ y: 5, boxShadow: 'none' }}
                        onClick={() => navigate(topic.route)}
                        style={{
                            cursor: 'pointer',
                            background: 'white',
                            borderRadius: '28px',
                            padding: '25px',
                            boxShadow: '0 10px 0 #E2E8F0',
                            border: '3px solid #F8FAFC',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {/* Icon Circle */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: `${topic.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            border: `3px solid ${topic.color}30`
                        }}>
                            <div style={{ fontSize: '50px' }}>
                                {topic.emoji}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 style={{ 
                            fontSize: 'var(--fs-lg)', 
                            marginBottom: '10px', 
                            fontFamily: 'Fredoka', 
                            color: topic.color,
                            fontWeight: 'bold'
                        }}>
                            {topic.title}
                        </h3>

                        {/* Description */}
                        <p style={{ 
                            color: '#64748B', 
                            fontFamily: 'Fredoka', 
                            fontSize: 'var(--fs-sm)', 
                            lineHeight: '1.5',
                            marginBottom: '15px',
                            flex: 1
                        }}>
                            {topic.description}
                        </p>

                        {/* Explore Button */}
                        <motion.div 
                            variants={{
                                pulse: {
                                    scale: [1, 1.05, 1],
                                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }
                            }}
                            animate="pulse"
                            style={{ 
                                marginTop: '15px', 
                                background: topic.color,
                                color: 'white', 
                                padding: '10px 24px',
                                borderRadius: '16px',
                                fontWeight: 'bold', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                fontFamily: 'Fredoka', 
                                fontSize: '16px',
                                boxShadow: `0 4px 0 ${topic.color}CC`
                            }}
                        >
                            Explore <ChevronRight size={18} />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ScienceExplorer;
