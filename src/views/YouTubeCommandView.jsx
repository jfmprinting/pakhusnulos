import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Youtube,
  ShieldCheck,
  Video,
  PlaySquare,
  Radio,
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';

export default function YouTubeCommandView() {
  const { youtubeSchedule, selectedDate } = useApp();
  const [selectedWeek, setSelectedWeek] = useState('ALL');

  const filteredSchedule = youtubeSchedule.filter(item => {
    if (selectedWeek !== 'ALL' && item.week_number !== parseInt(selectedWeek)) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Youtube size={20} color="var(--color-youtube)" />
              <span>YouTube Growth Command Center (90 Hari)</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Jadwal ketat 5 slot mingguan: 2 Long-form (Selasa & Jumat), 2 Shorts (Rabu & Sabtu), 1 Live (Minggu)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: 'var(--radius-md)', color: '#FCA5A5', fontSize: '12px', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>PROTEKSI BEBAN: Dilarang menambah slot YouTube baru</span>
          </div>
        </div>

        {/* WEEK FILTER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            onClick={() => setSelectedWeek('ALL')}
            className={`badge ${selectedWeek === 'ALL' ? 'badge-p2' : 'badge-planned'}`}
            style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
          >
            Semua Pekan (13 Weeks)
          </button>
          {Array.from({ length: 13 }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setSelectedWeek(String(i + 1))}
              className={`badge ${selectedWeek === String(i + 1) ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
            >
              W{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 13 WEEKS CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredSchedule.map(item => {
          return (
            <div
              key={item.id}
              className="os-card"
              style={{
                borderLeft: '4px solid var(--color-youtube)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-channel-yt font-mono" style={{ fontSize: '12px' }}>
                    Week {item.week_number}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {item.start_date} s/d {item.end_date}
                  </span>
                  <span className="badge badge-channel-membership">
                    {item.fase}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-done font-mono" style={{ fontSize: '11px' }}>
                    Target: {item.watch_target} Jam Tayang
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Fokus Mingguan: {item.focus}
              </div>

              {/* SLOTS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                
                {/* LONG FORM 1 */}
                <div className="os-card-elevated">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#F87171', marginBottom: '4px' }}>
                    <Video size={14} />
                    <span>Selasa: Long-form #1</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.longform_1}
                  </p>
                </div>

                {/* LONG FORM 2 */}
                <div className="os-card-elevated">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#F87171', marginBottom: '4px' }}>
                    <Video size={14} />
                    <span>Jumat: Long-form #2</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.longform_2}
                  </p>
                </div>

                {/* LIVE */}
                <div className="os-card-elevated">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38BDF8', marginBottom: '4px' }}>
                    <Radio size={14} />
                    <span>Minggu: Live Session</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.live_session}
                  </p>
                </div>

              </div>

              {/* REVIEW & INTEGRATION RULE FOOTER */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <strong>Evaluasi Mingguan:</strong> {item.review_notes}
                </div>
                <div style={{ color: '#FCA5A5' }}>
                  <strong>Aturan:</strong> {item.integration_rule}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
