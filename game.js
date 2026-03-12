// Game State
let game = {
  crystals: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lessons: [],
  inBattle: false,
  playerHp: 100,
  bossHp: 100,
  bossName: '',
  timer: null,
  timeLeft: 1500 // 25 minutes in seconds
};

// Load from localStorage
function loadGame() {
  const saved = localStorage.getItem('studyquest');
  if (saved) {
    game = {...game, ...JSON.parse(saved)};
  }
  updateUI();
}

// Save to localStorage
function saveGame() {
  localStorage.setItem('studyquest', JSON.stringify({
    crystals: game.crystals,
    xp: game.xp,
    level: game.level,
    streak: game.streak,
    lessons: game.lessons
  }));
}

// Update all UI elements
function updateUI() {
  document.getElementById('crystalCount').textContent = game.crystals;
  document.getElementById('levelCount').textContent = game.level;
  document.getElementById('streakCount').textContent = game.streak;
  document.getElementById('xpCount').textContent = game.xp % 100;
  document.getElementById('lessonTotal').textContent = game.lessons.length;
  document.getElementById('totalEarned').textContent = game.crystals + (game.lessons.length * 50);
  document.getElementById('streakDisplay').textContent = game.streak;
}

// Format time MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start Lesson
function startLesson() {
  const subject = document.getElementById('subjectSelect').value;
  game.currentSubject = subject;
  game.timeLeft = 1500; // 25 minutes
  
  document.getElementById('lessonSetup').style.display = 'none';
  document.getElementById('lessonActive').style.display = 'block';
  document.getElementById('currentSubject').textContent = subject;
  
  // Start timer
  game.timer = setInterval(() => {
    game.timeLeft--;
    document.getElementById('timerDisplay').textContent = formatTime(game.timeLeft);
    
    if (game.timeLeft <= 0) {
      completeLesson();
    }
  }, 1000);
}

// Complete Lesson - THE CORE MECHANIC: +50 crystals
function completeLesson() {
  clearInterval(game.timer);
  
  const REWARD = 50; // Guaranteed 50 crystals
  
  game.crystals += REWARD;
  game.xp += 25;
  game.streak++;
  game.lessons.push({
    subject: game.currentSubject,
    date: new Date().toISOString()
  });
  
  // Level up check
  if (game.xp >= game.level * 100) {
    game.level++;
    alert(`🎉 LEVEL UP! You are now Level ${game.level}!`);
  }
  
  saveGame();
  updateUI();
  
  alert(`✅ Lesson Complete! +${REWARD} Mana Crystals!`);
  cancelLesson();
}

// Cancel lesson
function cancelLesson() {
  clearInterval(game.timer);
  document.getElementById('lessonSetup').style.display = 'block';
  document.getElementById('lessonActive').style.display = 'none';
  document.getElementById('timerDisplay').textContent = '25:00';
}

// Enter Dungeon
function enterDungeon() {
  if (game.crystals < 10) {
    alert('❌ Need 10 crystals! Complete a lesson first.');
    return;
  }
  
  const bosses = ['Math Dragon', 'History Hydra', 'Science Slime', 'Grammar Goblin', 'Coding Chimera'];
  game.bossName = bosses[Math.floor(Math.random() * bosses.length)];
  game.inBattle = true;
  game.playerHp = 100 + (game.level * 20);
  game.bossHp = 100 + (game.streak * 10);
  
  document.getElementById('battleLobby').style.display = 'none';
  document.getElementById('battleArena').style.display = 'block';
  document.getElementById('bossName').textContent = game.bossName;
  document.getElementById('playerLevel').textContent = game.level;
  document.getElementById('playerMaxHp').textContent = game.playerHp;
  document.getElementById('bossMaxHp').textContent = game.bossHp;
  
  updateBattleUI();
  logBattle(`👹 ${game.bossName} appears!`, '⚔️ Battle started!');
}

// Cast Spell
function castSpell(spell) {
  const spells = {
    fireball: {name: 'Fireball', cost: 10, dmg: 25, heal: 0},
    heal: {name: 'Heal', cost: 15, dmg: 0, heal: 40},
    ultimate: {name: 'Ultimate', cost: 50, dmg: 80, heal: 0}
  };
  
  const s = spells[spell];
  
  if (game.crystals < s.cost) {
    logBattle(`❌ Need ${s.cost} crystals!`);
    return;
  }
  
  game.crystals -= s.cost;
  saveGame();
  updateUI();
  
  let messages = [`💎 Spent ${s.cost} on ${s.name}`];
  
  if (s.heal > 0) {
    game.playerHp = Math.min(game.playerHp + s.heal, 100 + (game.level * 20));
    messages.push(`💚 Healed ${s.heal} HP!`);
  } else {
    const dmg = s.dmg + Math.floor(Math.random() * 10) - 5;
    game.bossHp -= dmg;
    messages.push(`⚡ ${s.name} dealt ${dmg} dmg!`);
    
    if (game.bossHp <= 0) {
      winBattle();
      return;
    }
  }
  
  // Boss attacks
  const bossDmg = Math.floor(Math.random() * 15) + 10;
  game.playerHp -= bossDmg;
  messages.push(`👹 ${game.bossName} hits ${bossDmg}!`);
  
  if (game.playerHp <= 0) {
    loseBattle();
    return;
  }
  
  updateBattleUI();
  logBattle(...messages);
}

// Update battle bars
function updateBattleUI() {
  const playerMax = 100 + (game.level * 20);
  const bossMax = 100 + (game.streak * 10);
  
  document.getElementById('playerHp').textContent = Math.max(0, game.playerHp);
  document.getElementById('playerHpBar').style.width = `${(game.playerHp / playerMax) * 100}%`;
  document.getElementById('bossHp').textContent = Math.max(0, game.bossHp);
  document.getElementById('bossHpBar').style.width = `${(game.bossHp / bossMax) * 100}%`;
}

// Battle log
function logBattle(...messages) {
  const log = document.getElementById('battleLog');
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = msg;
    log.insertBefore(div, log.firstChild);
  });
}

// Win battle
function winBattle() {
  const bonus = 25;
  game.crystals += bonus;
  game.xp += 50;
  
  if (game.xp >= game.level * 100) {
    game.level++;
  }
  
  saveGame();
  updateUI();
  
  document.getElementById('lastResult').innerHTML = `<span style="color:var(--good)">🏆 Victory! +${bonus} crystals!</span>`;
  endBattle();
}

// Lose battle
function loseBattle() {
  document.getElementById('lastResult').innerHTML = `<span style="color:var(--danger)">💀 Defeated! Study more!</span>`;
  endBattle();
}

// Flee
function fleeBattle() {
  endBattle();
}

// End battle
function endBattle() {
  game.inBattle = false;
  document.getElementById('battleLobby').style.display = 'block';
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('battleLog').innerHTML = '';
}

// Reset game
function resetGame() {
  if (confirm('Reset all progress?')) {
    localStorage.removeItem('studyquest');
    game = {
      crystals: 0, xp: 0, level: 1, streak: 0, lessons: [],
      inBattle: false, playerHp: 100, bossHp: 100, bossName: '', timer: null, timeLeft: 1500
    };
    updateUI();
  }
}

// Start
loadGame();
