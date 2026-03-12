import { useState, useEffect } from 'react';

const useGameState = () => {
  // Load from localStorage or use defaults
  const [manaCrystals, setManaCrystals] = useState(() => {
    const saved = localStorage.getItem('sq_crystals');
    return saved ? parseInt(saved) : 0;
  });
  
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('sq_xp');
    return saved ? parseInt(saved) : 0;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('sq_level');
    return saved ? parseInt(saved) : 1;
  });
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('sq_streak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [lessonsCompleted, setLessonsCompleted] = useState(() => {
    const saved = localStorage.getItem('sq_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sq_crystals', manaCrystals);
    localStorage.setItem('sq_xp', xp);
    localStorage.setItem('sq_level', level);
    localStorage.setItem('sq_streak', streak);
    localStorage.setItem('sq_lessons', JSON.stringify(lessonsCompleted));
  }, [manaCrystals, xp, level, streak, lessonsCompleted]);

  const completeLesson = (subject) => {
    const REWARD = 50; // Guaranteed 50 crystals per lesson
    
    setManaCrystals(prev => prev + REWARD);
    setXp(prev => {
      const newXp = prev + 25;
      // Level up check
      if (newXp >= level * 100) {
        setLevel(l => l + 1);
      }
      return newXp;
    });
    setStreak(prev => prev + 1);
    setLessonsCompleted(prev => [...prev, { subject, date: new Date().toISOString() }]);
    
    return REWARD;
  };

  const spendCrystals = (amount) => {
    if (manaCrystals >= amount) {
      setManaCrystals(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addXp = (amount) => {
    setXp(prev => {
      const newXp = prev + amount;
      if (newXp >= level * 100) {
        setLevel(l => l + 1);
      }
      return newXp;
    });
  };

  const resetGame = () => {
    setManaCrystals(0);
    setXp(0);
    setLevel(1);
    setStreak(0);
    setLessonsCompleted([]);
    localStorage.clear();
  };

  return {
    manaCrystals,
    xp,
    level,
    streak,
    lessonsCompleted,
    completeLesson,
    spendCrystals,
    addXp,
    resetGame
  };
};

export default useGameState;
