import React, { useState } from 'react';
import { BADGES } from '../lib/gamification';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';

export default function BadgesModal({ isOpen, onClose, userXp, userBadges = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen) return null;

  const unlockedBadgeIds = new Set(userBadges.map(b => b.badge_id));
  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'posting', label: 'Posting' },
    { id: 'streak', label: 'Streak' },
    { id: 'revenue', label: 'Cuan' },
    { id: 'special', label: 'Spesial' },
  ];

  const filteredBadges = BADGES.filter(b => activeCategory === 'all' || b.category === activeCategory);
  const totalUnlocked = BADGES.filter(b => unlockedBadgeIds.has(b.id)).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '100%', maxHeight: '85dvh', display: 'flex', flexDirection: 'column' }}
      >
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-revenue)' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Koleksi Badge & Level
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Level {userXp?.level || 1} ({userXp?.total_xp || 0} XP) - Terbuka {totalUnlocked} dari {BADGES.length} Badge
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={activeCategory === cat.id ? 'badge badge-done' : 'badge badge-planned'}
              style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* BADGES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredBadges.map(badge => {
            const isUnlocked = unlockedBadgeIds.has(badge.id);
            const userBadgeInfo = userBadges.find(b => b.badge_id === badge.id);

            return (
              <div
                key={badge.id}
                className="os-card-elevated"
                style={{
                  padding: '12px',
                  opacity: isUnlocked ? 1 : 0.45,
                  borderColor: isUnlocked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                  background: isUnlocked ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '24px' }}>{badge.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {badge.category}
                    </div>
                  </div>
                  {isUnlocked ? (
                    <CheckCircle2 size={16} color="var(--color-revenue)" />
                  ) : (
                    <Lock size={15} color="var(--text-tertiary)" />
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {badge.description}
                </div>
                {isUnlocked && userBadgeInfo?.unlocked_at && (
                  <div className="font-mono" style={{ fontSize: '10px', color: 'var(--color-revenue)', marginTop: '6px' }}>
                    Unlocked: {userBadgeInfo.unlocked_at.slice(0, 10)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
