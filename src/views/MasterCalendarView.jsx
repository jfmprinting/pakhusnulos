import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Share2,
  Youtube,
  MessageSquare,
  Database
} from 'lucide-react';

export default function MasterCalendarView() {
  const {
    calendar,
    dailyProducts,
    sumberBelajar,
    updateCalendarStatus,
    selectedDate,
    setSelectedDate
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('ALL');
  const [selectedFase, setSelectedFase] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDayDrawer, setSelectedDayDrawer] = useState(null);

  // Filtered calendar items
  const filteredCalendar = useMemo(() => {
    return calendar.filter(item => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          item.date.includes(q) ||
          item.day_name.toLowerCase().includes(q) ||
          item.weekly_theme.toLowerCase().includes(q) ||
          item.revenue_focus.toLowerCase().includes(q) ||
          item.daily_product_content.toLowerCase().includes(q) ||
          item.youtube_content.toLowerCase().includes(q) ||
          item.wa_distribution.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Week
      if (selectedWeek !== 'ALL' && item.week_number !== parseInt(selectedWeek)) {
        return false;
      }

      // Fase
      if (selectedFase !== 'ALL') {
        const fase = item.week_number <= 4 ? 1 : (item.week_number <= 8 ? 2 : 3);
        if (fase !== parseInt(selectedFase)) return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [calendar, searchQuery, selectedWeek, selectedFase, selectedStatus]);

  // Current drawer day details
  const drawerDay = selectedDayDrawer ? calendar.find(c => c.date === selectedDayDrawer) : null;
  const drawerDp = drawerDay ? dailyProducts.find(d => d.date === drawerDay.date) : null;
  const drawerSb = drawerDay ? sumberBelajar.find(s => s.target_date === drawerDay.date) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER & FILTERS */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={20} color="var(--color-revenue)" />
              <span>90-Day Master Calendar Cockpit (91 Hari)</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Menampilkan {filteredCalendar.length} dari 91 hari operasional terintegrasi
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-done font-mono">
              Selesai: {calendar.filter(c => c.status === 'Done').length}
            </span>
            <span className="badge badge-planned font-mono">
              Tersisa: {calendar.filter(c => c.status !== 'Done').length}
            </span>
          </div>
        </div>

        {/* CONTROLS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Cari topik / konten..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            value={selectedFase}
            onChange={e => setSelectedFase(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Fase (1, 2, 3)</option>
            <option value="1">Fase 1: Hari 1-30 (350K/hari)</option>
            <option value="2">Fase 2: Hari 31-60 (425K/hari)</option>
            <option value="3">Fase 3: Hari 61-90 (500K/hari)</option>
          </select>

          <select
            value={selectedWeek}
            onChange={e => setSelectedWeek(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Pekan (Week 1-13)</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Status</option>
            <option value="Planned">Planned</option>
            <option value="Done">Done</option>
            <option value="Past">Past</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (HIDDEN ON MOBILE) */}
      <div className="table-container desktop-table">
        <table className="os-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Hari</th>
              <th>Wk</th>
              <th>Tema Mingguan</th>
              <th>Social Media (TikTok/Threads)</th>
              <th>YouTube Focus</th>
              <th>WhatsApp Touchpoint</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalendar.map(item => {
              const isSelected = item.date === selectedDate;
              const isDone = item.status === 'Done';
              return (
                <tr
                  key={item.id}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.08)' : undefined,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setSelectedDayDrawer(item.date);
                  }}
                >
                  <td className="font-mono" style={{ fontWeight: 600, color: isSelected ? 'var(--color-revenue)' : 'var(--text-primary)' }}>
                    {item.date}
                  </td>
                  <td>{item.day_name}</td>
                  <td className="font-mono">W{item.week_number}</td>
                  <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.weekly_theme}
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#C084FC' }}>
                    {item.daily_product_content}
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#F87171' }}>
                    {item.youtube_content !== '-' ? item.youtube_content : 'Rest / Repurpose'}
                  </td>
                  <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#4ADE80' }}>
                    {item.wa_distribution}
                  </td>
                  <td>
                    <span className={`badge ${item.priority === 'P0' ? 'badge-p0' : 'badge-p1'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={e => updateCalendarStatus(item.date, e.target.value)}
                      className="select-field"
                      style={{ fontSize: '11px', padding: '4px 6px' }}
                    >
                      <option value="Planned">Planned</option>
                      <option value="Done">Done</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Past">Past</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(item.date);
                        setSelectedDayDrawer(item.date);
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST & CARDS VIEW (VISIBLE ON MOBILE ONLY) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="mobile-cards-view">
        {filteredCalendar.map(item => {
          const isSelected = item.date === selectedDate;
          const isDone = item.status === 'Done';
          return (
            <div
              key={item.id}
              className="os-card-elevated"
              style={{
                borderColor: isSelected ? 'var(--color-revenue)' : (isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'),
                padding: '12px 14px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedDate(item.date);
                setSelectedDayDrawer(item.date);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.date} ({item.day_name.slice(0, 3)})
                  </span>
                  <span className="badge badge-channel-membership font-mono" style={{ fontSize: '10px' }}>
                    W{item.week_number}
                  </span>
                </div>
                <div onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => updateCalendarStatus(item.date, isDone ? 'Planned' : 'Done')}
                    className={`badge ${isDone ? 'badge-done' : 'badge-planned'}`}
                    style={{ border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    {isDone ? 'Selesai ✓' : 'Planned'}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.weekly_theme}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#C084FC' }}>
                  <strong>Social:</strong> {item.daily_product_content}
                </span>
                <span style={{ color: '#F87171' }}>
                  <strong>YouTube:</strong> {item.youtube_content !== '-' ? item.youtube_content : 'Rest / Repurpose'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER MODAL */}
      {selectedDayDrawer && drawerDay && (
        <div className="modal-overlay" onClick={() => setSelectedDayDrawer(null)}>
          <div className="drawer-bottom" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-p0 font-mono" style={{ marginBottom: '4px' }}>
                  {drawerDay.priority} CRITICAL
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: 800 }}>
                  {drawerDay.day_name}, {drawerDay.date} (Week {drawerDay.week_number})
                </h2>
              </div>
              <button onClick={() => setSelectedDayDrawer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Tema Pekan & Fokus Revenue
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {drawerDay.weekly_theme}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {drawerDay.revenue_focus}
                </div>
              </div>

              <div className="os-card-elevated" style={{ borderLeft: '3px solid var(--color-social)' }}>
                <div style={{ fontWeight: 700, color: '#C084FC', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={15} />
                  <span>Konten Harian TikTok & Threads</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {drawerDay.daily_product_content}
                </p>
                {drawerDp && (
                  <div style={{ marginTop: '6px', fontSize: '12px' }}>
                    <div>Angle: <strong>{drawerDp.content_angle}</strong></div>
                    <div>Produk: <strong>{drawerDp.recommended_product}</strong></div>
                    <div>Status: {drawerDp.is_published ? 'Sudah Tayang ✓' : 'Belum Tayang'}</div>
                  </div>
                )}
              </div>

              <div className="os-card-elevated" style={{ borderLeft: '3px solid var(--color-youtube)' }}>
                <div style={{ fontWeight: 700, color: '#F87171', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Youtube size={15} />
                  <span>YouTube Cadence</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {drawerDay.youtube_content !== '-' ? drawerDay.youtube_content : 'Hari Distribusi / Rest (Tanpa Video Baru)'}
                </p>
              </div>

              <div className="os-card-elevated" style={{ borderLeft: '3px solid var(--color-wa)' }}>
                <div style={{ fontWeight: 700, color: '#4ADE80', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={15} />
                  <span>WhatsApp Touchpoint</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {drawerDay.wa_distribution}
                </p>
              </div>

              {drawerSb && (
                <div className="os-card-elevated" style={{ borderLeft: '3px solid var(--color-membership)' }}>
                  <div style={{ fontWeight: 700, color: '#FBBF24', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={15} />
                    <span>Sumber Belajar Rilis ({drawerSb.tier})</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {drawerSb.content_title} (Menu: {drawerSb.menu})
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Ubah Status:</span>
                  <select
                    value={drawerDay.status}
                    onChange={e => updateCalendarStatus(drawerDay.date, e.target.value)}
                    className="select-field"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Done">Done</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Past">Past</option>
                  </select>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => {
                    updateCalendarStatus(drawerDay.date, drawerDay.status === 'Done' ? 'Planned' : 'Done');
                    setSelectedDayDrawer(null);
                  }}
                >
                  {drawerDay.status === 'Done' ? 'Tandai Planned' : 'Tandai SELESAI (Done)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
