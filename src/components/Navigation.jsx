import React from 'react';
import { useApp } from '../context/AppContext';
import XpBar from './XpBar';
import {
  LayoutDashboard,
  CalendarDays,
  Share2,
  MessageSquare,
  Youtube,
  Database,
  Kanban,
  Calculator,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Award,
  Timer,
  PlusCircle,
  DollarSign,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Today Cockpit', icon: LayoutDashboard },
  { id: 'calendar', label: 'Master Calendar 91D', icon: CalendarDays },
  { id: 'daily_social', label: 'Daily Social (TikTok)', icon: Share2 },
  { id: 'wa_station', label: 'WhatsApp Station', icon: MessageSquare },
  { id: 'youtube', label: 'YouTube Command', icon: Youtube },
  { id: 'sumber_belajar', label: 'Sumber Belajar (50)', icon: Database },
  { id: 'weekly_sprints', label: '13-Week Sprints', icon: Kanban },
  { id: 'simulator', label: 'Revenue Simulator', icon: Calculator },
  { id: 'kpi', label: 'Revenue Control & KPI', icon: TrendingUp }
];

export function Sidebar() {
  const {
    currentView,
    setCurrentView,
    setShowSopModal,
    setShowBadgesModal,
    setShowFocusTimer,
    setShowRevenueModal,
    setShowSettingsModal,
    userXp,
    userBadges,
    activeDay
  } = useApp();

  const weekNum = activeDay ? activeDay.week_number : 1;
  const currentFase = weekNum <= 4 ? 1 : (weekNum <= 8 ? 2 : 3);

  return (
    <aside className="desktop-sidebar">
      {/* BRAND HEADER */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-revenue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064E3B', fontWeight: 800, fontSize: '15px' }}>
            PH
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              PAK HUSNUL OS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-revenue)', fontWeight: 500 }}>
              Unified Post & Cuan System
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LOG ACTION */}
      <div style={{ padding: '12px 14px 4px' }}>
        <button
          onClick={() => setShowRevenueModal(true)}
          className="btn-primary"
          style={{ width: '100%', fontSize: '12px', padding: '8px 12px', justifyContent: 'center', gap: '6px' }}
        >
          <PlusCircle size={15} />
          <span>+ Catat Cuan / Transaksi</span>
        </button>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px 6px' }}>
          Operating Modules
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: isActive ? 'var(--color-revenue)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                textAlign: 'left',
                transition: 'background 0.12s ease, color 0.12s ease'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* PRODUCTIVITY & GAMIFICATION TOOLS */}
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '14px 8px 6px' }}>
          Kreator Tools
        </div>
        
        <button
          onClick={() => setShowFocusTimer(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          <Timer size={16} color="var(--color-revenue)" />
          <span>Focus Timer</span>
        </button>

        <button
          onClick={() => setShowBadgesModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={16} color="#FBBF24" />
            <span>Koleksi Badge</span>
          </div>
          <span className="font-mono text-tertiary" style={{ fontSize: '11px' }}>
            {userBadges?.length || 0}
          </span>
        </button>
      </nav>

      {/* FOOTER */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '12px', justifyContent: 'flex-start' }}
        >
          <Settings size={15} color="var(--color-revenue)" />
          <span>Pengaturan & Master Data</span>
        </button>

        <button
          onClick={() => setShowSopModal(true)}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '12px', justifyContent: 'flex-start' }}
        >
          <BookOpen size={15} color="var(--color-membership)" />
          <span>Aturan Emas SOP</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', padding: '0 4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            Supabase Live
          </span>
          <span className="font-mono">Fase {currentFase}</span>
        </div>
      </div>
    </aside>
  );
}

export function TopHeader() {
  const {
    selectedDate,
    setSelectedDate,
    calendar,
    setShowSopModal,
    setShowBadgesModal,
    setShowRevenueModal,
    setShowSettingsModal,
    activeDay,
    xpStats
  } = useApp();

  const handleDateChange = (direction) => {
    if (!calendar || calendar.length === 0) return;
    const currentIndex = calendar.findIndex(c => c.date === selectedDate);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedDate(calendar[currentIndex - 1].date);
    } else if (direction === 'next' && currentIndex < calendar.length - 1) {
      setSelectedDate(calendar[currentIndex + 1].date);
    }
  };

  const weekNum = activeDay ? activeDay.week_number : 1;
  const currentFase = weekNum <= 4 ? 1 : (weekNum <= 8 ? 2 : 3);

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* DATE SELECTOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-surface)', padding: '3px 4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => handleDateChange('prev')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
            title="Hari Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }} title="Pilih Tanggal dari Kalender">
            <CalendarDays size={14} color="var(--color-revenue)" style={{ marginRight: '6px' }} />
            <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-revenue)' }}>
              {selectedDate} {activeDay ? `(${activeDay.day_name.slice(0, 3)})` : ''}
            </span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>

          <button
            onClick={() => handleDateChange('next')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer', borderRadius: '4px' }}
            title="Hari Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            const d = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
          }}
          className="btn-secondary desktop-only"
          style={{ fontSize: '11px', padding: '5px 8px' }}
        >
          Hari Ini
        </button>
      </div>

      {/* HEADER RIGHT: XP BAR + QUICK CUAN + FASE BADGE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* XP BAR INTEGRATION */}
        <XpBar
          level={xpStats.level}
          currentXP={xpStats.currentXP}
          xpForNext={xpStats.xpForNext}
          progress={xpStats.progress}
          onClick={() => setShowBadgesModal(true)}
        />

        <button
          onClick={() => setShowRevenueModal(true)}
          className="btn-primary"
          style={{ padding: '5px 10px', fontSize: '11px' }}
          title="Catat Cuan Hari Ini"
        >
          <PlusCircle size={13} />
          <span className="desktop-only">+ Cuan</span>
        </button>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="btn-secondary"
          style={{ padding: '5px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Pengaturan & Master Data"
        >
          <Settings size={13} color="var(--color-revenue)" />
          <span className="desktop-only">Master Data</span>
        </button>

        <span className="badge badge-channel-membership font-mono desktop-only" style={{ fontSize: '11px', padding: '4px 8px' }}>
          Fase {currentFase}: W{weekNum}
        </span>
      </div>
    </header>
  );
}

export function MobileBottomDock({ onOpenMobileMenu }) {
  const { currentView, setCurrentView } = useApp();

  return (
    <nav className="mobile-bottom-dock">
      <button
        className={`dock-item ${currentView === 'dashboard' ? 'active' : ''}`}
        onClick={() => setCurrentView('dashboard')}
      >
        <LayoutDashboard size={19} />
        <span>Today</span>
      </button>

      <button
        className={`dock-item ${currentView === 'calendar' ? 'active' : ''}`}
        onClick={() => setCurrentView('calendar')}
      >
        <CalendarDays size={19} />
        <span>Kalender</span>
      </button>

      <button
        className={`dock-item ${currentView === 'daily_social' ? 'active' : ''}`}
        onClick={() => setCurrentView('daily_social')}
      >
        <Share2 size={19} />
        <span>Social</span>
      </button>

      <button
        className={`dock-item ${currentView === 'wa_station' ? 'active' : ''}`}
        onClick={() => setCurrentView('wa_station')}
      >
        <MessageSquare size={19} />
        <span>WA</span>
      </button>

      <button
        className="dock-item"
        onClick={onOpenMobileMenu}
      >
        <Menu size={19} />
        <span>Menu</span>
      </button>
    </nav>
  );
}

export function MobileNavDrawer({ isOpen, onClose }) {
  const {
    currentView,
    setCurrentView,
    setShowSopModal,
    setShowBadgesModal,
    setShowFocusTimer,
    setShowRevenueModal,
    setShowSettingsModal,
    userBadges,
    xpStats
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="drawer-bottom"
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>PAK HUSNUL 90-DAY OS</div>
            <div style={{ fontSize: '12px', color: 'var(--color-revenue)' }}>Pilih Navigasi & Alat Kreator</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px' }}>
            <X size={22} />
          </button>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => {
              onClose();
              setShowRevenueModal(true);
            }}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '9px 10px', justifyContent: 'center' }}
          >
            <PlusCircle size={15} />
            <span>+ Catat Cuan</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setShowFocusTimer(true);
            }}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '9px 10px', justifyContent: 'center' }}
          >
            <Timer size={15} color="var(--color-revenue)" />
            <span>Focus Timer</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', maxHeight: '44dvh', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isActive ? 'var(--color-revenue)' : 'var(--text-primary)',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  textAlign: 'left'
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* SETTINGS, BADGES & SOP LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
          <button
            onClick={() => {
              onClose();
              setShowSettingsModal(true);
            }}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 12px', justifyContent: 'center', gap: '6px' }}
          >
            <Settings size={15} color="var(--color-revenue)" />
            <span>Pengaturan & Kelola Master Data (CRUD)</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                setShowBadgesModal(true);
              }}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 10px', justifyContent: 'center' }}
            >
              <Award size={15} color="#FBBF24" />
              <span>Badge ({userBadges?.length || 0})</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setShowSopModal(true);
              }}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 10px', justifyContent: 'center' }}
            >
              <BookOpen size={15} color="var(--color-membership)" />
              <span>SOP Emas</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
