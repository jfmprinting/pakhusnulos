import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Timer, X, Sparkles } from 'lucide-react';

const PRESETS = [15, 25, 45, 60];
const THEMES = [
  { id: 'deep_focus', label: '🎯 Deep Focus', color: '#10B981' },
  { id: 'nature', label: '🌿 Nature', color: '#34D399' },
  { id: 'minimal', label: '⚪ Minimal', color: '#94A3B8' },
];

export default function FocusTimerModal({ isOpen, onClose, onSessionComplete }) {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('deep_focus');
  const intervalRef = useRef(null);

  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close(), 500);
    } catch (e) {
      // Audio might be blocked by browser policy
    }
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      playBeep();
      if (onSessionComplete) {
        onSessionComplete(duration, theme);
      }
    }
  }, [isRunning, secondsLeft, duration, theme, onSessionComplete, playBeep]);

  if (!isOpen) return null;

  const handleSelectPreset = (mins) => {
    if (isRunning) return;
    setDuration(mins);
    setSecondsLeft(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
  };

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Timer size={20} color="var(--color-revenue)" />
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Focus Timer (Pomodoro)
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* PRESET BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => handleSelectPreset(p)}
              disabled={isRunning}
              className={duration === p ? 'badge badge-done' : 'badge badge-planned'}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning && duration !== p ? 0.5 : 1
              }}
            >
              {p} Menit
            </button>
          ))}
        </div>

        {/* CIRCULAR TIMER SVG */}
        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="6"
            />
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke={currentTheme.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div className="font-mono" style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              +{Math.floor(duration / 5)} XP saat selesai
            </div>
          </div>
        </div>

        {/* TIMER CONTROLS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-primary"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isRunning ? '#EF4444' : 'var(--color-revenue)',
              borderColor: isRunning ? '#DC2626' : 'var(--color-revenue)'
            }}
          >
            {isRunning ? <Pause size={24} color="#FFFFFF" /> : <Play size={24} color="#064E3B" style={{ marginLeft: '3px' }} />}
          </button>

          <button
            onClick={handleReset}
            className="btn-secondary"
            disabled={secondsLeft === duration * 60}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* THEME SELECTION */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => !isRunning && setTheme(t.id)}
              className={theme === t.id ? 'badge badge-done' : 'badge badge-planned'}
              style={{ fontSize: '11px', padding: '4px 10px', cursor: 'pointer' }}
            >
              {t.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
