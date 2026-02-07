import React, { createContext, useState, useContext, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
    // Initialize stars by subject from localStorage
    const [subjectStars, setSubjectStars] = useState(() => {
        const saved = localStorage.getItem('kindpath_subject_stars');
        if (saved) return JSON.parse(saved);
        
        // Migration: if total stars exists but not subject stars, put them in math
        const legacyTotal = localStorage.getItem('kindpath_stars');
        if (legacyTotal) {
            return { math: parseInt(legacyTotal, 10) };
        }
        return {};
    });

    const [badges, setBadges] = useState(() => {
        const saved = localStorage.getItem('kindpath_badges');
        return saved ? JSON.parse(saved) : [];
    });

    const [level, setLevel] = useState(1);

    // Calculate total stars dynamically
    const totalStars = Object.values(subjectStars).reduce((sum, val) => sum + val, 0);

    // Save stars whenever they change
    useEffect(() => {
        localStorage.setItem('kindpath_subject_stars', JSON.stringify(subjectStars));
        localStorage.setItem('kindpath_stars', totalStars.toString()); // Keep for back-compat
        
        // Simple level calculation: 1 level per 100 stars
        const calculatedLevel = Math.floor(totalStars / 100) + 1;
        setLevel(calculatedLevel);
    }, [subjectStars, totalStars]);

    useEffect(() => {
        localStorage.setItem('kindpath_badges', JSON.stringify(badges));
    }, [badges]);

    const addStars = (amount, subjectId = 'math') => {
        setSubjectStars(prev => ({
            ...prev,
            [subjectId]: (prev[subjectId] || 0) + amount
        }));
    };

    const unlockBadge = (badgeId, badgeName, badgeIcon) => {
        if (!badges.some(b => b.id === badgeId)) {
            const newBadge = { id: badgeId, name: badgeName, icon: badgeIcon, date: new Date().toISOString() };
            setBadges(prev => [...prev, newBadge]);
            return true; // Badge newly unlocked
        }
        return false; // Badge already owned
    };

    const getRankInfo = () => {
        const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
        const plateau = 500;
        const totalIndex = Math.floor(totalStars / plateau);
        const tierIndex = Math.min(Math.floor(totalIndex / 3), tiers.length - 1);
        const levelInTier = 3 - (totalIndex % 3);
        
        return {
            tier: tiers[tierIndex],
            level: levelInTier,
            name: `${tiers[tierIndex]} ${levelInTier}`,
            progress: ((totalStars % plateau) / plateau) * 100,
            starsToNext: plateau - (totalStars % plateau)
        };
    };

    const value = {
        totalStars,
        subjectStars,
        badges,
        level,
        addStars,
        unlockBadge,
        getRankInfo
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};
