import React, { useState } from 'react';

const BattleArena = ({ manaCrystals, spendCrystals, addXp, level, streak }) => {
  const [inBattle, setInBattle] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [bossName, setBossName] = useState('');
  const [battleLog, setBattleLog] = useState([]);
  const [battleWon, setBattleWon] = useState(null);

  const bosses = [
    'Math Dragon', 'History Hydra', 'Science Slime', 
    'Grammar Goblin', 'Coding Chimera', 'Algebra Archon'
  ];

  const enterDungeon = () => {
    if (manaCrystals < 10) {
      alert('❌ Need 10 crystals to enter! Complete a lesson first.');
      return;
    }
    
    const boss = bosses[Math.floor(Math.random() * bosses.length)];
    setBossName(boss);
    setPlayerHp(100 + (level * 20));
    setBossHp(100 + (streak * 10));
    setBattleLog([`👹 ${boss} appears!`, '⚔️ Battle started!']);
    setInBattle(true);
    setBattleWon(null);
  };

  const castSpell = (spellType) => {
    const spells = {
      fireball: { name: 'Fireball', cost: 10, dmg: 25, heal: 0 },
      heal: { name: 'Heal', cost: 15, dmg: 0, heal: 40 },
      ultimate: { name: 'Ultimate', cost: 50, dmg: 80, heal: 0 }
    };

    const spell = spells[spellType];
    
    if (!spendCrystals(spell.cost)) {
      setBattleLog(prev => [`❌ Not enough crystals! Need ${spell.cost}`, ...prev]);
      return;
    }

    let newLog = [`💎 Spent ${spell.cost} crystals on ${spell.name}`];

    if (spell.heal > 0) {
      const newHp = Math.min(playerHp + spell.heal, 100 + (level * 20));
      setPlayerHp(newHp);
      newLog.push(`💚 Healed for ${spell.heal} HP!`);
    } else {
      // Deal damage with variance
      const damage = spell.dmg + Math.floor(Math.random() * 10) - 5;
      const newBossHp = bossHp - damage;
      setBossHp(newBossHp);
      newLog.push(`⚡ ${spell.name} dealt ${damage} damage!`);

      if (newBossHp <= 0) {
        winBattle();
        return;
      }
    }

    // Boss counter-attack
    const bossDamage = Math.floor(Math.random() * 15) + 10;
    const newPlayerHp = playerHp - bossDamage;
    setPlayerHp(newPlayerHp);
    newLog.push(`👹 ${bossName} attacks for ${bossDamage} damage!`);

    if (newPlayerHp <= 0) {
      loseBattle();
      return;
    }

    setBattleLog(prev => [...newLog, ...prev].slice(0, 20));
  };

  const winBattle = () => {
    const bonus = 25;
    setManaCrystals(prev => prev + bonus);
    addXp(50);
    setBattleWon(true);
    setInBattle(false);
    setBattleLog(prev => [
      '🎉 VICTORY! Boss defeated!',
      `💎 Bonus: +${bonus} crystals!`,
      '⭐ +50 XP!',
      ...prev
    ]);
  };

  const loseBattle = () => {
    setBattleWon(false);
    setInBattle(false);
    setBattleLog(prev => [
      '💀 DEFEATED!',
      '📚 Study more and try again!',
      ...prev
    ]);
  };

  const fleeBattle = () => {
    setInBattle(false);
    setBattleLog([]);
  };

  const maxPlayerHp = 100 + (level * 20);
  const maxBossHp = 100 + (streak * 10);

  return (
    <div className="card">
      <h2>⚔️ Dungeon Battle</h2>
      
      {!inBattle ? (
        <>
          <p className="small">
            Enter the dungeon to fight bosses using your Mana Crystals!
            <br/>
            <b>Costs 10 crystals to enter</b>
          </p>
          
          <div className="hr"></div>
          
          <div className="row">
            <button 
              className="btn danger" 
              onClick={enterDungeon}
              disabled={manaCrystals < 10}
            >
              🌑 Enter Dungeon (10💎)
            </button>
          </div>
          
          {battleWon === true && (
            <p style={{color: 'var(--good)', marginTop: '10px'}}>🏆 Last battle won! +25 crystals!</p>
          )}
          {battleWon === false && (
            <p style={{color: 'var(--danger)', marginTop: '10px'}}>💀 Defeated! Study harder!</p>
          )}
        </>
      ) : (
        <>
          <div className="battleTop">
            <div>
              <b>🧙‍♂️ You (Lv{level})</b>
              <div className="hpbar">
                <div 
                  className="hpfill" 
                  style={{width: `${(playerHp / maxPlayerHp) * 100}%`}}
                ></div>
              </div>
              <span className="small">{playerHp}/{maxPlayerHp} HP</span>
            </div>
            
            <div style={{textAlign: 'right'}}>
              <b>👹 {bossName}</b>
              <div className="hpbar">
                <div 
                  className="hpfill boss" 
                  style={{width: `${(bossHp / maxBossHp) * 100}%`}}
                ></div>
              </div>
              <span className="small">{bossHp}/{maxBossHp} HP</span>
            </div>
          </div>
          
          <div className="hr"></div>
          
          <div className="row">
            <button className="btn danger" onClick={() => castSpell('fireball')}>
              🔥 Fireball (10💎)
            </button>
            <button className="btn" onClick={() => castSpell('heal')}>
              💚 Heal (15💎)
            </button>
            <button className="btn good" onClick={() => castSpell('ultimate')}>
              ⚡ Ultimate (50💎)
            </button>
          </div>
          
          <div className="row" style={{marginTop: '10px'}}>
            <button className="btn ghost" onClick={fleeBattle}>
              🏃 Flee Battle
            </button>
            <span className="small">Crystals: {manaCrystals}</span>
          </div>
          
          <div className="hr"></div>
          
          <div className="log">
            {battleLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BattleArena;
