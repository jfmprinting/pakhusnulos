import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cleanDash } from '../lib/utils';
import {
  CheckCircle2,
  Circle,
  Share2,
  Youtube,
  MessageSquare,
  Database,
  ExternalLink,
  Copy,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Plus,
  Minus,
  PlusCircle,
  Trash2,
  Award,
  Video,
  Camera,
  Flame,
  Check
} from 'lucide-react';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const getPlatformIcon = (name, icon) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('tiktok') || icon === 'Video') return Video;
  if (lower.includes('instagram') || icon === 'Camera') return Camera;
  if (lower.includes('youtube') || lower.includes('yt')) return Youtube;
  if (lower.includes('whatsapp') || lower.includes('wa') || icon === 'MessageCircle') return MessageSquare;
  return Share2;
};

export default function DashboardView() {
  const {
    activeDay,
    activeDailyProduct,
    activeWeekCluster,
    activeYt,
    activeWaDay,
    sumberBelajar,
    updateCalendarStatus,
    updateDailyProduct,
    showToast,
    setCurrentView,
    selectedDate,

    // Post & Cuan integrations
    platforms,
    activeDailyLog,
    updatePlatformPost,
    deleteRevenueEntry,
    setShowRevenueModal,
    setShowBadgesModal,
    revenueSources,
    userXp,
    xpStats,
    dailyLogs
  } = useApp();

  const [inputUrl, setInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  if (!activeDay) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Memuat data kalender...
      </div>
    );
  }

  const isDone = activeDay.status === 'Done';
  const isSocialPublished = activeDailyProduct ? activeDailyProduct.is_published : false;

  // Find any Sumber Belajar item matching today's date
  const todaySb = sumberBelajar.find(s => s.target_date === selectedDate);

  // Copy helper
  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin ke clipboard!`);
  };

  const handleSaveUrl = () => {
    if (!inputUrl) return;
    updateDailyProduct(selectedDate, true, inputUrl);
    setShowUrlInput(false);
    setInputUrl('');
  };

  const weekNum = activeDay.week_number;
  const currentFase = weekNum <= 4 ? 1 : (weekNum <= 8 ? 2 : 3);
  const phaseNetTarget = currentFase === 1 ? 'Rp 350.000' : (currentFase === 2 ? 'Rp 425.000' : 'Rp 500.000');
  const phaseGrossWeek = currentFase === 1 ? 'Rp 2.914.506' : (currentFase === 2 ? 'Rp 3.497.840' : 'Rp 4.081.173');

  // Today tactical revenue from activeDailyLog
  const todayRevenue = Number(activeDailyLog?.revenue) || 0;
  const todayEntries = activeDailyLog?.revenue_entries || [];
  const todayPosts = activeDailyLog?.posts || {};
  const totalPostsToday = Object.values(todayPosts).reduce((a, b) => a + (Number(b) || 0), 0);

  const dateClean = cleanDash(activeDay.date);
  const ytClean = cleanDash(activeDay.youtube_content);
  const isYtRest = !ytClean || ytClean === '-' || ytClean === '--';
  const sbClean = cleanDash(activeDay.sumber_belajar_repurpose);
  const isSbRest = !sbClean || sbClean === '-' || sbClean === '--';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* TODAY'S STRATEGIC BATTLECARD HERO WIDGET */}
      <div className="os-card" style={{ borderColor: isDone ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)', background: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)' }}>
        
        {/* BATTLECARD TOP BAR */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span className={`badge ${activeDay.priority === 'P0' ? 'badge-p0' : (activeDay.priority === 'P1' ? 'badge-p1' : 'badge-p2')}`}>
                {activeDay.priority} CRITICAL
              </span>
              <span className="badge badge-channel-membership font-mono">
                Week {activeDay.week_number}
              </span>
              <span className={`badge ${isDone ? 'badge-done' : 'badge-planned'}`}>
                {activeDay.status}
              </span>
              <span className="badge font-mono" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                {totalPostsToday} Post Harian
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              TODAY BATTLECARD: {activeDay.day_name}, {dateClean}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tema Pekan: <strong style={{ color: 'var(--text-primary)' }}>{cleanDash(activeDay.weekly_theme)}</strong> | Fokus: {cleanDash(activeDay.revenue_focus)}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRevenueModal(true)}
              className="btn-primary"
              style={{ padding: '9px 14px', fontSize: '13px' }}
            >
              <PlusCircle size={16} />
              <span>+ Catat Cuan</span>
            </button>

            <button
              onClick={() => updateCalendarStatus(selectedDate, isDone ? 'Planned' : 'Done')}
              className={isDone ? 'btn-secondary' : 'btn-secondary'}
              style={{ padding: '9px 14px', fontSize: '13px', borderColor: isDone ? 'var(--color-revenue)' : undefined }}
            >
              {isDone ? (
                <>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Selesai (Batalkan)</span>
                </>
              ) : (
                <>
                  <Circle size={16} />
                  <span>Tandai Selesai (+25 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 PILLARS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>

          {/* 1. DAILY SOCIAL (TIKTOK & THREADS) */}
          <div className="os-card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--color-social)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#C084FC' }}>
                  <Share2 size={16} />
                  <span>1. Daily Social (TikTok + Threads)</span>
                </span>
                <span className="badge badge-channel-social">
                  {activeDailyProduct ? activeDailyProduct.content_angle : 'Social'}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                <strong>Produk:</strong> {activeDailyProduct ? activeDailyProduct.recommended_product : 'ModulAjar / BuatSoal'}
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                Target minimum: &gt;= 1 post. Angle: <strong>{activeDailyProduct ? activeDailyProduct.content_angle : 'Pain point'}</strong>.
              </p>

              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
                CTA: {activeDailyProduct ? activeDailyProduct.cta : 'pakhusnul.id'}
              </div>

              {activeDailyProduct && activeDailyProduct.published_url && (
                <div style={{ fontSize: '11px', color: 'var(--color-revenue)', wordBreak: 'break-all', marginBottom: '10px' }}>
                  URL: <a href={activeDailyProduct.published_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-revenue)' }}>{activeDailyProduct.published_url}</a>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => updateDailyProduct(selectedDate, !isSocialPublished)}
                  className={isSocialPublished ? 'badge badge-done' : 'badge badge-planned'}
                  style={{ cursor: 'pointer', padding: '6px 10px', border: 'none', fontSize: '12px' }}
                >
                  {isSocialPublished ? 'Sudah Tayang (Published ✓)' : 'Belum Tayang (Centang)'}
                </button>

                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {showUrlInput ? 'Tutup Input' : '+ Input Link'}
                </button>
              </div>

              {showUrlInput && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  />
                  <button onClick={handleSaveUrl} className="btn-primary" style={{ padding: '6px 10px', fontSize: '11px' }}>
                    Simpan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. YOUTUBE CADENCE */}
          <div className="os-card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--color-youtube)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#F87171' }}>
                  <Youtube size={16} />
                  <span>2. YouTube Cadence</span>
                </span>
                <span className="badge badge-channel-yt font-mono">
                  Target {activeYt ? activeYt.watch_target : 25}h Watch
                </span>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isYtRest ? 'Hari Distribusi / Rest (Tanpa Video Baru)' : ytClean}
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                Fokus Pekan: {activeYt ? activeYt.focus : 'Repositioning'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={14} />
                <span>Aturan: Dilarang menambah upload video baru di luar jadwal.</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <button
                onClick={() => setCurrentView('youtube')}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '12px' }}
              >
                <span>Lihat Kalender YouTube</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 3. WHATSAPP DISTRIBUTION */}
          <div className="os-card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--color-wa)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#4ADE80' }}>
                  <MessageSquare size={16} />
                  <span>3. WhatsApp Distribution</span>
                </span>
                <span className="badge badge-channel-wa font-mono">
                  Dual Pool
                </span>
              </div>

              <div style={{ fontSize: '12px', marginBottom: '6px' }}>
                <strong style={{ color: 'var(--color-wa)' }}>Guru Mahir AI (Publik):</strong>
                <p style={{ color: 'var(--text-secondary)', margin: '2px 0 6px' }}>
                  {activeWaDay ? activeWaDay.public_pool_theme : activeDay.wa_distribution}
                </p>
              </div>

              <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                <strong style={{ color: '#FBBF24' }}>Aidukasi (Closed Member):</strong>
                <p style={{ color: 'var(--text-secondary)', margin: '2px 0' }}>
                  {activeWaDay ? activeWaDay.closed_pool_theme : 'Deeper problem framing'}
                </p>
              </div>

              <div style={{ fontSize: '11px', color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', padding: '5px 8px', borderRadius: 'var(--radius-sm)' }}>
                Do Not: {activeWaDay ? activeWaDay.do_not_rule : 'Jangan spam'}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleCopyText(activeWaDay ? activeWaDay.sample_template_public : 'Format template broadcast Guru Mahir AI', 'Broadcast Guru Mahir AI')}
                className="btn-outline-wa"
                style={{ flex: 1, fontSize: '11px', padding: '6px' }}
              >
                <Copy size={13} />
                <span>Salin Teks Publik</span>
              </button>
              <button
                onClick={() => handleCopyText(activeWaDay ? activeWaDay.sample_template_closed : 'Format template broadcast Aidukasi', 'Broadcast Aidukasi')}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '11px', padding: '6px' }}
              >
                <Copy size={13} />
                <span>Salin Teks Member</span>
              </button>
            </div>
          </div>

          {/* 4. SUMBER BELAJAR & APPS */}
          <div className="os-card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--color-membership)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#FBBF24' }}>
                  <Database size={16} />
                  <span>4. Sumber Belajar / Asset</span>
                </span>
                <span className="badge badge-channel-membership font-mono">
                  {todaySb ? todaySb.tier : 'FREE'}
                </span>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {todaySb ? todaySb.content_title : (isSbRest ? 'Tidak ada jadwal rilis baru hari ini' : sbClean)}
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Menu: {todaySb ? todaySb.menu : 'Derived from YT/Product'} | Effort: {todaySb ? todaySb.production_effort : 'Low'}
              </p>

              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
                Catatan: {todaySb ? todaySb.notes : 'Diturunkan dari tema mingguan'}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <button
                onClick={() => setCurrentView('sumber_belajar')}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '12px' }}
              >
                <span>Buka Vault Sumber Belajar</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* TACTICAL POST & CUAN ENGINE: PLATFORM COUNTERS + LIVE SALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>

        {/* LEFT: PLATFORM POST COUNTERS */}
        <div className="os-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color="var(--color-social)" />
                <span>Counter Postingan Harian</span>
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Tekan + saat konten selesai tayang (+10 XP per post)
              </p>
            </div>
            <span className="badge badge-channel-social font-mono">
              {totalPostsToday} Post Hari Ini
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {platforms.map(platform => {
              const Icon = getPlatformIcon(platform.name, platform.icon);
              const postCount = Number(todayPosts[platform.id]) || 0;
              const target = Number(platform.daily_target) || 1;
              const isTargetReached = postCount >= target;

              return (
                <div
                  key={platform.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isTargetReached ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                    border: `1px solid ${isTargetReached ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isTargetReached ? 'var(--color-revenue)' : 'var(--text-secondary)' }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {platform.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        Target: {target} / {platform.frequency || 'hari'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updatePlatformPost(platform.id, -1)}
                      disabled={postCount <= 0}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-secondary)',
                        cursor: postCount > 0 ? 'pointer' : 'not-allowed',
                        opacity: postCount > 0 ? 1 : 0.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Kurangi 1 post"
                    >
                      <Minus size={13} />
                    </button>

                    <span
                      className="font-mono"
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        minWidth: '22px',
                        textAlign: 'center',
                        color: isTargetReached ? 'var(--color-revenue)' : 'var(--text-primary)'
                      }}
                    >
                      {postCount}
                    </span>

                    <button
                      onClick={() => updatePlatformPost(platform.id, 1)}
                      className="btn-primary"
                      style={{
                        width: '28px',
                        height: '28px',
                        padding: 0,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Tambah 1 post (+10 XP)"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TODAY REALIZED REVENUE & SALES ENTRIES */}
        <div className="os-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="var(--color-revenue)" />
                <span>Realisasi Cuan Hari Ini</span>
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Target bersih: <span className="font-mono text-revenue">{phaseNetTarget}</span>
              </p>
            </div>
            
            <button
              onClick={() => setShowRevenueModal(true)}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <Plus size={14} />
              <span>Tambah Transaksi</span>
            </button>
          </div>

          {/* NET HERO METRIC */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.08)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Net Masuk Kantong
              </div>
              <div className="font-mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-revenue)' }}>
                {formatRp(todayRevenue)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-done font-mono">
                {todayEntries.length} Transaksi
              </span>
            </div>
          </div>

          {/* TRANSACTIONS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
            {todayEntries.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                Belum ada transaksi dicatat untuk tanggal ini. Klik <strong>+ Tambah Transaksi</strong> untuk mencatat penjualan.
              </div>
            ) : (
              todayEntries.map((entry, idx) => {
                const source = revenueSources.find(s => s.id === entry.sourceId);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{source?.emoji || '💰'}</span>
                        <span>{entry.product || source?.name || 'Penjualan'}</span>
                        {entry.plan && <span className="text-secondary font-mono">({entry.plan})</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {entry.saleRoute === 'affiliate' ? `Affiliate (${entry.affiliateName || 'Partner'} 40%)` : 'Direct'}
                        {entry.acquisitionChannel && ` • ${entry.acquisitionChannel}`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-mono text-revenue" style={{ fontWeight: 700, fontSize: '13px' }}>
                          {formatRp(entry.amount)}
                        </div>
                        {entry.grossAmount && entry.grossAmount !== entry.amount && (
                          <div className="font-mono" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                            Kotor: {formatRp(entry.grossAmount)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteRevenueEntry(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', opacity: 0.7 }}
                        title="Hapus transaksi"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* FINANCIAL NORTH STAR & RUN-RATE COCKPIT */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--color-revenue)" />
            <span>Target Finansial & Roadmap 500K Bersih / Hari</span>
          </h2>
          <span className="badge badge-done font-mono">
            Weighted AOV: Rp 169.000
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          
          <div className="os-card">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              TARGET BERSIH / HARI (NORTH STAR)
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-revenue)' }}>
              Rp 500.000
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Fase {currentFase} Target: <strong style={{ color: 'var(--text-primary)' }}>{phaseNetTarget} / hari</strong>
            </div>
          </div>

          <div className="os-card">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              TARGET BERSIH / BULAN (30 HARI)
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Rp 15.000.000
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Fixed cost: <strong style={{ color: '#F87171' }}>Rp 741.667 / bln</strong> (AI + Domain)
            </div>
          </div>

          <div className="os-card">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              ESTIMASI GROSS / MINGGU
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }}>
              {phaseGrossWeek}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Porsi affiliate: 25% gross (Komisi 40%)
            </div>
          </div>

          <div className="os-card">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              KEBUTUHAN PENJUALAN HARIAN
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#FBBF24' }}>
              ~3.5 Transaksi
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Setara 24 penjualan hero product per minggu
            </div>
          </div>

        </div>
      </div>

      {/* STRATEGIC RULES OF ENGAGEMENT BAR */}
      <div className="os-card" style={{ background: 'var(--bg-surface-elevated)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
          Aturan Strategis Fase {currentFase} (Week {weekNum}):
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {activeWeekCluster ? activeWeekCluster.key_revenue_action : 'Fokus edukasi dan konversi dari customer existing.'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          <span className="badge badge-channel-social">
            Affiliate: {activeWeekCluster ? activeWeekCluster.affiliate_action : 'Audit affiliate aktif'}
          </span>
          <span className="badge badge-channel-wa">
            WA Focus: {activeWeekCluster ? activeWeekCluster.wa_focus : 'Nurturing'}
          </span>
        </div>
      </div>

    </div>
  );
}
