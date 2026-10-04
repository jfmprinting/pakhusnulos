import React from 'react';

export default function XpBar({ level, currentXP, xpForNext, progress, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '3px 8px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'border-color 0.15s ease'
      }}
      title="Klik untuk melihat Badge Koleksi & Pencapaian XP"
    >
      <span
        className="font-mono"
        style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#064E3B',
          background: 'var(--color-revenue)',
          padding: '2px 7px',
          borderRadius: 'var(--radius-full)',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap'
        }}
      >
        Lv.{level}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '64px',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '99px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              borderRadius: '99px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            whiteSpace: 'nowrap'
          }}
        >
          {currentXP}/{xpForNext}
        </span>
      </div>
    </div>
  );
}
