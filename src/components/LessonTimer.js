import React, { useState, useEffect } from 'react';

const LessonTimer = ({ onComplete, manaCrystals }) => {
  const [subject, setSubject] = useState('Mathematics');
  const [isStudying, setIsStudying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [lessonActive, setLessonActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isStudying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStudying) {
      // Auto-complete when timer hits 0
      finishLesson();
    }
    return () => clearInterval(interval);
  }, [isStudying, timeLeft]);

  const startLesson = () => {
    setIsStudying(true);
    setLessonActive(true);
    setTimeLeft(25 * 60);
  };

  const finishLesson = () => {
    setIsStudying(false);
    const earned = onComplete(subject);
    alert(`🎉 Lesson Complete! +${earned} Mana Crystals!`);
    resetTimer();
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setLessonActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subjects = ['Mathematics', 'Science', 'History', 'Programming', 'Language', 'Art', 'Music'];

  return (
    <div className="card">
      <h2>📚 Study Session</h2>
      
      {!lessonActive ? (
        <>
          <div className="row">
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              disabled={isStudying}
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="hr"></div>
          
          <p className="small">Complete a 25-minute focus session to earn <b>50 Mana Crystals</b> guaranteed!</p>
          
          <button className="btn good" onClick={startLesson} style={{width: '100%', marginTop: '10px'}}>
            Start Lesson (+50💎)
          </button>
        </>
      ) : (
        <>
          <div className="timer">{formatTime(timeLeft)}</div>
          <p className="small" style={{textAlign: 'center'}}>Studying: <b>{subject}</b></p>
          
          <div className="hr"></div>
          
          <div className="row" style={{justifyContent: 'center'}}>
            <button className="btn" onClick={finishLesson}>
              ✅ Complete Early
            </button>
            <button className="btn ghost" onClick={resetTimer}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonTimer;
