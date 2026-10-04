import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Kanban,
  Calendar,
  Youtube,
  DollarSign,
  Share2,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';

export default function WeeklySprintsView() {
  const { weeklyClusters, setSelectedDate, setCurrentView } = useApp();
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('ALL');

  const filteredClusters = weeklyClusters.filter(w => {
    if (selectedPhaseFilter !== 'ALL' && w.fase_id !== parseInt(selectedPhaseFilter)) {
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
              <Kanban size={20} color="var(--color-revenue)" />
              <span>13-Week Sprints & Campaign Board</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              13 tema mingguan terintegrasi menyatukan Revenue + YouTube + Membership + WA
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedPhaseFilter('ALL')}
              className={`badge ${selectedPhaseFilter === 'ALL' ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
            >
              Semua Fase (13 Wk)
            </button>
            <button
              onClick={() => setSelectedPhaseFilter('1')}
              className={`badge ${selectedPhaseFilter === '1' ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
            >
              Fase 1 (W1-W4)
            </button>
            <button
              onClick={() => setSelectedPhaseFilter('2')}
              className={`badge ${selectedPhaseFilter === '2' ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
            >
              Fase 2 (W5-W8)
            </button>
            <button
              onClick={() => setSelectedPhaseFilter('3')}
              className={`badge ${selectedPhaseFilter === '3' ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
            >
              Fase 3 (W9-W13)
            </button>
          </div>
        </div>
      </div>

      {/* 13 SPRINTS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredClusters.map(item => {
          const faseName = item.fase_id === 1 ? 'Fase 1: Reset' : (item.fase_id === 2 ? 'Fase 2: Double Down' : 'Fase 3: Scale');

          return (
            <div
              key={item.id}
              className="os-card"
              style={{
                borderTop: `4px solid ${item.fase_id === 1 ? '#38BDF8' : (item.fase_id === 2 ? '#F59E0B' : '#10B981')}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '18px'
              }}
            >
              <div>
                {/* CARD TOP INFO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-channel-membership font-mono" style={{ fontSize: '12px' }}>
                      WEEK {item.week_number}
                    </span>
                    <span className="badge badge-planned" style={{ fontSize: '10px' }}>
                      {faseName}
                    </span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.start_date} s/d {item.end_date}
                  </span>
                </div>

                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.revenue_focus}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--color-revenue)', fontWeight: 600, marginBottom: '12px' }}>
                  Kampanye: {item.primary_campaign}
                </div>

                {/* CAMPAIGN & YOUTUBE DETAILS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginBottom: '14px' }}>
                  <div className="os-card-elevated">
                    <strong style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Youtube size={13} />
                      <span>YouTube Theme:</span>
                    </strong>
                    <p style={{ color: 'var(--text-primary)' }}>{item.youtube_focus}</p>
                    <ul style={{ paddingLeft: '16px', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                      <li>LF #1: {item.yt_longform_1}</li>
                      <li>LF #2: {item.yt_longform_2}</li>
                      <li>Live: {item.yt_live}</li>
                    </ul>
                  </div>

                  <div className="os-card-elevated">
                    <strong style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <Target size={13} />
                      <span>Sumber Belajar Deliverables:</span>
                    </strong>
                    <p style={{ color: 'var(--text-secondary)' }}>{item.sumber_belajar_outputs}</p>
                  </div>

                  <div className="os-card-elevated">
                    <strong style={{ color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <Users size={13} />
                      <span>Fokus WhatsApp & Audiens:</span>
                    </strong>
                    <p style={{ color: 'var(--text-secondary)' }}>{item.wa_focus}</p>
                  </div>
                </div>
              </div>

              {/* TARGET REVENUE FOOTER */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Target Gross / Pekan:</div>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-revenue)' }}>
                    Rp {Number(item.revenue_target_gross).toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDate(item.start_date);
                    setCurrentView('dashboard');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                >
                  <span>Buka Hari Pertama</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
