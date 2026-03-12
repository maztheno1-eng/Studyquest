import React from 'react';

const StatsBar = ({ manaCrystals, xp, level, streak }) => {
  const xpProgress = (xp % 100);
  
  return (
    <div className="topbar">
      <div className="brand">
        <div className="title">⚔️ StudyQuest</div>
        <div className="sub">RPG Study Companion</div>
      </div>
      
      <div className="stats">
        <div className="pill">
          <span className="crystalDot"></span>
          <b>{manaCrystals}</b> Mana Crystals
        </div>
        <div className="pill">
          <span>⭐</span>
          <b>Level {level}</b>
        </div>
        <div className="pill">
          <span>🔥</span>
          <b>{streak}</b> Day Streak
        </div>
        <div className="pill">
          <span>📊</span>
          XP: {xpProgress}/100
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
