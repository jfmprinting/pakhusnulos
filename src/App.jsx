import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, TopHeader, MobileBottomDock, MobileNavDrawer } from './components/Navigation';
import Toast from './components/Toast';
import SopModal from './components/SopModal';
import BadgesModal from './components/BadgesModal';
import FocusTimerModal from './components/FocusTimerModal';
import RevenueEntryModal from './components/RevenueEntryModal';
import SettingsModal from './components/SettingsModal';

import DashboardView from './views/DashboardView';
import MasterCalendarView from './views/MasterCalendarView';
import DailySocialView from './views/DailySocialView';
import WhatsAppStationView from './views/WhatsAppStationView';
import YouTubeCommandView from './views/YouTubeCommandView';
import SumberBelajarView from './views/SumberBelajarView';
import WeeklySprintsView from './views/WeeklySprintsView';
import RevenueSimulatorView from './views/RevenueSimulatorView';
import KpiDashboardView from './views/KpiDashboardView';

function AppContent() {
  const {
    currentView,
    loading,
    error,
    fetchAllData,
    showBadgesModal,
    setShowBadgesModal,
    showFocusTimer,
    setShowFocusTimer,
    showRevenueModal,
    setShowRevenueModal,
    showSettingsModal,
    setShowSettingsModal,
    userXp,
    userBadges,
    saveFocusSession,
    addRevenueEntry,
    revenueSources,
    heroProducts,
    productVariants,
    selectedDate
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('products');

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', gap: '16px', background: 'var(--bg-app)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: 'var(--color-revenue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Menghubungkan ke Supabase Cloud...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', gap: '16px', padding: '20px', background: 'var(--bg-app)', textAlign: 'center' }}>
        <div style={{ color: '#EF4444', fontWeight: 700, fontSize: '18px' }}>
          Gagal Terhubung ke Database Supabase
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '13px' }}>
          {error}
        </p>
        <button onClick={fetchAllData} className="btn-primary">
          Coba Muat Ulang Data
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* DESKTOP FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN VIEWPORT AREA */}
      <div className="content-container">
        <TopHeader />
        <main className="main-wrapper">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendar' && <MasterCalendarView />}
          {currentView === 'daily_social' && <DailySocialView />}
          {currentView === 'wa_station' && <WhatsAppStationView />}
          {currentView === 'youtube' && <YouTubeCommandView />}
          {currentView === 'sumber_belajar' && <SumberBelajarView />}
          {currentView === 'weekly_sprints' && <WeeklySprintsView />}
          {currentView === 'simulator' && <RevenueSimulatorView />}
          {currentView === 'kpi' && <KpiDashboardView />}
        </main>
      </div>

      {/* MOBILE INTERACTION LAYERS */}
      <MobileBottomDock onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileNavDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* SHARED MODALS */}
      <Toast />
      <SopModal />
      <BadgesModal
        isOpen={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
        userXp={userXp}
        userBadges={userBadges}
      />
      <FocusTimerModal
        isOpen={showFocusTimer}
        onClose={() => setShowFocusTimer(false)}
        onSessionComplete={saveFocusSession}
      />
      <RevenueEntryModal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        onSubmit={addRevenueEntry}
        revenueSources={revenueSources}
        heroProducts={heroProducts}
        productVariants={productVariants}
        selectedDate={selectedDate}
        onOpenSettings={(tab) => {
          setSettingsInitialTab(tab || 'products');
          setShowSettingsModal(true);
        }}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        initialTab={settingsInitialTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
