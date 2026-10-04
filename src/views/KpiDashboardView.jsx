import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { cleanDash } from '../lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Edit2,
  Check,
  X,
  Award,
  DollarSign,
  Wallet,
  Calendar,
  Layers,
  ChevronRight,
  BarChart2,
  BarChart3,
  Video,
  Camera,
  MessageSquare,
  Share2,
  Flame,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n) || 0);

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const getPlatformIcon = (name, icon) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('tiktok') || icon === 'Video') return Video;
  if (lower.includes('instagram') || icon === 'Camera') return Camera;
  if (lower.includes('youtube') || lower.includes('yt')) return Video;
  if (lower.includes('whatsapp') || lower.includes('wa') || icon === 'MessageCircle') return MessageSquare;
  return Share2;
};

export default function KpiDashboardView() {
  const {
    kpiMetrics,
    showToast,
    fetchAllData,
    dailyLogs,
    userSettings,
    platforms,
    revenueSources
  } = useApp();

  const [topTab, setTopTab] = useState('statistik'); // 'statistik' | '11_kpi'
  const [periodFilter, setPeriodFilter] = useState('all'); // '7d' | '30d' | 'month' | 'all'
  const [chartView, setChartView] = useState('all'); // 'all' | 'posts' | 'revenue'
  const [detailTab, setDetailTab] = useState('platform'); // 'platform' | 'insight' | 'riwayat'
  const [platformFilter, setPlatformFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(15);

  // 11 KPI editing state
  const [editingId, setEditingId] = useState(null);
  const [actualDraft, setActualDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState('On Track');

  // Filter logs by period
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayDate = new Date(todayStr + 'T00:00:00');

    return dailyLogs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      switch (periodFilter) {
        case '7d': {
          const diff = (todayDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 7;
        }
        case '30d': {
          const diff = (todayDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff < 30;
        }
        case 'month': {
          return logDate.getFullYear() === todayDate.getFullYear() && logDate.getMonth() === todayDate.getMonth();
        }
        case 'all':
        default:
          return true;
      }
    });
  }, [dailyLogs, periodFilter]);

  const totalRevenue = useMemo(
    () => filteredLogs.reduce((sum, log) => sum + (Number(log.revenue) || 0), 0),
    [filteredLogs]
  );

  const totalPosts = useMemo(
    () => filteredLogs.reduce((sum, log) => {
      return sum + Object.values(log.posts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    }, 0),
    [filteredLogs]
  );

  const avgPosts = filteredLogs.length > 0 ? (totalPosts / filteredLogs.length).toFixed(1) : '0';
  const avgRevenue = filteredLogs.length > 0 ? Math.round(totalRevenue / filteredLogs.length) : 0;

  // Chart data from filtered logs
  const chartData = useMemo(() => {
    const sorted = [...filteredLogs].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.map(log => {
      const d = new Date(log.date + 'T00:00:00');
      return {
        date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
        rawDate: log.date,
        posts: Object.values(log.posts || {}).reduce((s, v) => s + (Number(v) || 0), 0),
        revenue: Number(log.revenue) || 0
      };
    });
  }, [filteredLogs]);

  // Streak (from all logs)
  const streak = useMemo(() => {
    const sorted = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    for (const log of sorted) {
      const tp = Object.values(log.posts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      if (tp > 0) count++;
      else break;
    }
    return count;
  }, [dailyLogs]);

  // Revenue Control Center metrics (exact Post & Cuan formula)
  const control = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayDate = new Date(todayStr + 'T00:00:00');

    let netToday = 0;
    let netMonth = 0;
    let gross = 0;
    let net = 0;
    let commission = 0;
    let direct = 0;
    let directGross = 0;
    let affiliate = 0;
    let affiliateGross = 0;
    let newCust = 0;
    let repeatCust = 0;
    let netNew = 0;
    let netRepeat = 0;
    let netRolling30 = 0;
    let grossWeek = 0;

    const productMap = new Map();
    const channelMap = new Map();
    const affiliateSet = new Set();

    // Monday of current week
    const dow = todayDate.getDay();
    const weekStart = new Date(todayDate);
    weekStart.setDate(todayDate.getDate() - ((dow + 6) % 7));
    const rollingStart = new Date(todayDate);
    rollingStart.setDate(todayDate.getDate() - 29);

    for (const log of dailyLogs) {
      const d = new Date(log.date + 'T00:00:00');
      const inMonth = d.getFullYear() === todayDate.getFullYear() && d.getMonth() === todayDate.getMonth();
      const rev = Number(log.revenue) || 0;
      if (log.date === todayStr) netToday += rev;
      if (inMonth) netMonth += rev;
      if (d >= rollingStart && d <= todayDate) netRolling30 += rev;
      if (d >= weekStart && d <= todayDate) {
        for (const e of log.revenue_entries || []) {
          grossWeek += Number(e.grossAmount ?? e.amount) || 0;
        }
      }
    }

    for (const log of filteredLogs) {
      for (const e of log.revenue_entries || []) {
        const g = Number(e.grossAmount ?? e.amount) || 0;
        const amt = Number(e.amount) || 0;
        gross += g;
        net += amt;
        commission += Number(e.affiliateCommission) || 0;

        if (e.saleRoute === 'affiliate') {
          affiliate += amt;
          affiliateGross += g;
          const an = e.affiliateName?.trim();
          if (an) affiliateSet.add(an);
        } else {
          direct += amt;
          directGross += g;
        }

        if (e.customerType === 'repeat') {
          repeatCust += 1;
          netRepeat += amt;
        } else if (e.customerType === 'new') {
          newCust += 1;
          netNew += amt;
        }

        const p = e.product?.trim() || 'Lainnya';
        productMap.set(p, (productMap.get(p) || 0) + amt);

        const c = e.acquisitionChannel?.trim();
        if (c) channelMap.set(c, (channelMap.get(c) || 0) + amt);
      }
    }

    // Top Products list
    const productList = Array.from(productMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        pct: net > 0 ? Math.round((amount / net) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Top Channels list
    const channelList = Array.from(channelMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const monthlyTarget = Number(userSettings?.monthly_net_target) || 15000000;
    const dailyTarget = Number(userSettings?.daily_net_target) || 500000;
    const fixedCost = Number(userSettings?.monthly_fixed_cost) || 742000;

    const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
    const dayOfMonth = todayDate.getDate();
    const paceTarget = (monthlyTarget / daysInMonth) * dayOfMonth;
    const isUnderPace = netMonth < paceTarget;
    const idealPaceToday = Math.round((monthlyTarget / daysInMonth) * dayOfMonth);
    const profitAfterFixed = netMonth - fixedCost;

    const rolling30Pct = Math.min(100, Math.round((netRolling30 / monthlyTarget) * 100));
    const daysLeftInMonth = Math.max(1, daysInMonth - dayOfMonth + 1);
    const gapToGoal = Math.max(0, monthlyTarget - netMonth);
    const neededPerDay = Math.round(gapToGoal / daysLeftInMonth);

    const weeklyTarget = Number(userSettings?.weekly_gross_target) > 0
      ? Number(userSettings?.weekly_gross_target)
      : dailyTarget * 7;
    const weeklyPct = Math.round((grossWeek / weeklyTarget) * 100);

    const txCust = newCust + repeatCust;
    const newCustPct = txCust > 0 ? Math.round((newCust / txCust) * 100) : 0;
    const repeatCustPct = txCust > 0 ? Math.round((repeatCust / txCust) * 100) : 0;

    return {
      netToday,
      netMonth,
      gross,
      net,
      commission,
      direct,
      directGross,
      affiliate,
      affiliateGross,
      affiliateCount: affiliateSet.size,
      newCust,
      repeatCust,
      newCustPct,
      repeatCustPct,
      netNew,
      netRepeat,
      netRolling30,
      rolling30Pct,
      grossWeek,
      weeklyTarget,
      weeklyPct,
      productList,
      channelList,
      monthlyTarget,
      dailyTarget,
      isUnderPace,
      idealPaceToday,
      profitAfterFixed,
      daysLeftInMonth,
      gapToGoal,
      neededPerDay,
      fixedCost
    };
  }, [dailyLogs, filteredLogs, userSettings]);

  // Platform Performance stats
  const platformStats = useMemo(() => {
    if (!platforms.length || !filteredLogs.length) return [];
    const totalDays = filteredLogs.length;

    return platforms
      .map(p => {
        const totalPosted = filteredLogs.reduce((sum, log) => sum + (Number(log.posts?.[p.id]) || 0), 0);
        let expectedTotal = p.daily_target * totalDays;
        if (p.frequency === 'weekly') expectedTotal = p.daily_target * Math.ceil(totalDays / 7);
        if (p.frequency === 'monthly') expectedTotal = p.daily_target * Math.ceil(totalDays / 30);
        const pct = expectedTotal > 0 ? Math.round((totalPosted / expectedTotal) * 100) : 0;
        const avg = totalDays > 0 ? (totalPosted / totalDays).toFixed(1) : '0';
        return { ...p, totalPosted, expectedTotal, pct, avg };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [platforms, filteredLogs]);

  // Insight Analytics
  const insights = useMemo(() => {
    if (filteredLogs.length < 2) return null;

    const dayGroups = {};
    for (const log of filteredLogs) {
      const d = new Date(log.date + 'T00:00:00').getDay();
      if (!dayGroups[d]) dayGroups[d] = [];
      const tp = Object.values(log.posts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      dayGroups[d].push(tp);
    }

    let bestDay = { day: 0, avg: 0 };
    let worstDay = { day: 0, avg: Infinity };
    for (const [day, posts] of Object.entries(dayGroups)) {
      const avg = posts.reduce((s, v) => s + v, 0) / posts.length;
      const dayNum = Number(day);
      if (avg > bestDay.avg) bestDay = { day: dayNum, avg };
      if (avg < worstDay.avg) worstDay = { day: dayNum, avg };
    }

    const topRevLog = filteredLogs.reduce((best, log) => ((Number(log.revenue) || 0) > (Number(best.revenue) || 0) ? log : best), filteredLogs[0]);

    const totalDailyTarget = platforms.reduce((sum, p) => {
      if (p.frequency === 'daily') return sum + p.daily_target;
      if (p.frequency === 'weekly') return sum + p.daily_target / 7;
      return sum + p.daily_target / 30;
    }, 0);

    const consistentDays = filteredLogs.filter(log => {
      const tp = Object.values(log.posts || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      return tp >= totalDailyTarget;
    }).length;
    const consistencyScore = Math.round((consistentDays / filteredLogs.length) * 100);

    const sorted = [...filteredLogs].sort((a, b) => a.date.localeCompare(b.date));
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid).reduce((s, l) => s + Object.values(l.posts || {}).reduce((a, b) => a + (Number(b) || 0), 0), 0);
    const secondHalf = sorted.slice(mid).reduce((s, l) => s + Object.values(l.posts || {}).reduce((a, b) => a + (Number(b) || 0), 0), 0);
    const growthPct = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : (secondHalf > 0 ? 100 : 0);

    return { bestDay, worstDay, topRevLog, consistencyScore, growthPct };
  }, [filteredLogs, platforms]);

  // Filtered History list
  const filteredHistory = useMemo(() => {
    const sorted = [...filteredLogs].sort((a, b) => b.date.localeCompare(a.date));
    if (platformFilter === 'all') return sorted;
    return sorted.filter(l => (Number(l.posts?.[platformFilter]) || 0) > 0);
  }, [filteredLogs, platformFilter]);

  // Save KPI edits
  const handleStartEdit = (metric) => {
    setEditingId(metric.id);
    setActualDraft(metric.actual_value || '');
    setStatusDraft(metric.status || 'On Track');
  };

  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('kpi_metrics')
        .update({
          actual_value: actualDraft,
          status: statusDraft,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      showToast('Metrik KPI berhasil diperbarui di Supabase');
      setEditingId(null);
      fetchAllData();
    } catch (err) {
      console.error('Failed to update KPI metric:', err);
      showToast('Gagal memperbarui metrik', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* TOP NAVIGATION TABS (STATISTIK VS 11 KPI) */}
      <div className="os-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-revenue)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Statistik & Revenue Control Center
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Pusat kendali ritme postingan, realisasi cuan 15M, dan metrik lintas-mesin 90 hari
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTopTab('statistik')}
              className={topTab === 'statistik' ? 'badge badge-done' : 'badge badge-planned'}
              style={{ padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}
            >
              Statistik Post & Cuan
            </button>
            <button
              onClick={() => setTopTab('11_kpi')}
              className={topTab === '11_kpi' ? 'badge badge-done' : 'badge badge-planned'}
              style={{ padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}
            >
              11 KPI Strategis Excel
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FULL POST & CUAN STATISTIK & REVENUE CONTROL CENTER */}
      {topTab === 'statistik' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* PERIOD FILTER PILLS (7 HARI, 30 HARI, BULAN INI, SEMUA) */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
            {[
              { id: '7d', label: '7 Hari' },
              { id: '30d', label: '30 Hari' },
              { id: 'month', label: 'Bulan Ini' },
              { id: 'all', label: 'Semua' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPeriodFilter(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: periodFilter === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: periodFilter === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: periodFilter === tab.id ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. REVENUE CONTROL CENTER CARD (MATCHING USER SCREENSHOT EXACTLY) */}
          <div className="os-card" style={{ background: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            
            {/* CARD TITLE & PACE BADGE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={18} color="var(--color-revenue)" />
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Revenue Control Center
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: control.isUnderPace ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: control.isUnderPace ? '#F87171' : '#34D399',
                  border: `1px solid ${control.isUnderPace ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}
              >
                {control.isUnderPace ? 'Di bawah pace' : 'On pace'}
              </span>
            </div>

            {/* TARGET NET HARI INI & BULAN INI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target net hari ini</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatRp(control.netToday)} / {formatRp(control.dailyTarget)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target net bulan ini</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatRp(control.netMonth)} / {formatRp(control.monthlyTarget)}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
              Pace ideal hari ini: <span className="font-mono">{formatRp(control.idealPaceToday)}</span> - Profit setelah biaya tetap:{' '}
              <span className="font-mono" style={{ color: control.profitAfterFixed < 0 ? '#F87171' : 'var(--color-revenue)' }}>
                {formatRp(control.profitAfterFixed)}
              </span>
            </div>

            {/* NET REVENUE - ROLLING 30 HARI PROGRESS METER */}
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Net Revenue - Rolling 30 Hari
                </span>
                <span className="font-mono text-revenue" style={{ fontWeight: 800, fontSize: '13px' }}>
                  {control.rolling30Pct}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${control.rolling30Pct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                    borderRadius: '99px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                {formatRp(control.netRolling30)} dari {formatRp(control.monthlyTarget)}
              </div>
            </div>

            {/* GAP TO GOAL & GROSS PEKAN INI (TWO SUB-CARDS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Gap to Goal ({control.daysLeftInMonth} hari lagi)
                </div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {formatRp(control.gapToGoal)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-revenue)' }}>
                  butuh +{formatRp(control.neededPerDay)}/hari
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Gross Pekan Ini
                </div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {formatRp(control.grossWeek)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  target {formatRp(control.weeklyTarget)} - {control.weeklyPct}%
                </div>
              </div>
            </div>

            {/* 3-COLUMN SUMMARY (KOTOR, KOMISI, NET) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kotor</div>
                <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formatRp(control.gross)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Komisi</div>
                <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#F87171', marginTop: '2px' }}>
                  {formatRp(control.commission)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Net</div>
                <div className="font-mono text-revenue" style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>
                  {formatRp(control.net)}
                </div>
              </div>
            </div>

            {/* DIRECT VS AFFILIATE CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Direct</div>
                <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Kotor {formatRp(control.directGross)}
                </div>
                <div className="font-mono text-revenue" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Net {formatRp(control.direct)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Affiliate</div>
                <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Kotor {formatRp(control.affiliateGross)}
                </div>
                <div className="font-mono text-revenue" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Net {formatRp(control.affiliate)}
                </div>
              </div>
            </div>

            {/* PEMBELI BARU VS REPEAT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pembeli Baru</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                  {control.newCustPct}% <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>({control.newCust} tx)</span>
                </div>
                <div className="font-mono text-revenue" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Net {formatRp(control.netNew)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pembeli Repeat</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }}>
                  {control.repeatCustPct}% <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>({control.repeatCust} tx)</span>
                </div>
                <div className="font-mono text-revenue" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Net {formatRp(control.netRepeat)}
                </div>
              </div>
            </div>

            {/* AFFILIATE AKTIF COUNT */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginBottom: '14px' }}>
              <span>Affiliate Aktif (menghasilkan sale)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {control.affiliateCount}
              </span>
            </div>

            {/* REVENUE BY PRODUCT (NET) */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Revenue by Product (net)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {control.productList.map((prod, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{prod.name}</span>
                      <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {formatRp(prod.amount)} - {prod.pct}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, prod.pct)}%`,
                          height: '100%',
                          background: '#10B981',
                          borderRadius: '99px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP CHANNEL AKUISISI */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Top Channel Akuisisi
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {control.channelList.map((ch, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{ch.name}</span>
                    <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {formatRp(ch.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 2. EXECUTIVE KPI CARDS (TOTAL CUAN, TOTAL POST, AVG POST, AVG CUAN, STREAK) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            
            {/* TOTAL CUAN (EMERALD HERO) */}
            <div style={{ background: '#064E3B', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <div style={{ fontSize: '12px', color: '#A7F3D0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={15} />
                <span>Total Cuan</span>
              </div>
              <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                {formatRp(totalRevenue)}
              </div>
            </div>

            {/* TOTAL POST */}
            <div style={{ background: '#0F2942', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
              <div style={{ fontSize: '12px', color: '#BAE6FD', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} />
                <span>Total Post</span>
              </div>
              <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
                {totalPosts}
              </div>
            </div>

            {/* RATA-RATA POST / HARI */}
            <div className="os-card">
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart3 size={15} color="var(--color-social)" />
                <span>Rata-rata Post/Hari</span>
              </div>
              <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                {avgPosts}
              </div>
            </div>

            {/* RATA-RATA CUAN / HARI */}
            <div className="os-card">
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={15} color="var(--color-revenue)" />
                <span>Rata-rata Cuan/Hari</span>
              </div>
              <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                {formatRp(avgRevenue)}
              </div>
            </div>

          </div>

          {/* STREAK CARD */}
          <div className="os-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24', fontSize: '20px' }}>
              🔥
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {streak} hari streak!
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Berturut-turut posting tanpa miss
              </div>
            </div>
          </div>

          {/* 3. DUAL-AXIS COMPOSED CHART (DAILY POSTS & REVENUE OVER TIME) */}
          <div className="os-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Aktivitas & Tren Pendapatan
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Batang hijau = Post harian (kiri) | Garis oranye = Pendapatan (kanan)
                </p>
              </div>

              {/* CHART VIEW SWITCHER */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'posts', label: 'Post' },
                  { id: 'revenue', label: 'Cuan' }
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setChartView(v.id)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      border: 'none',
                      borderRadius: '4px',
                      background: chartView === v.id ? 'var(--color-revenue)' : 'transparent',
                      color: chartView === v.id ? '#064E3B' : 'var(--text-secondary)',
                      fontWeight: chartView === v.id ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={10}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#6B7280"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 'auto']}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${Math.round(v / 1000)}k`)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return [formatRp(value), 'Pendapatan'];
                      return [value, 'Postingan'];
                    }}
                  />
                  {(chartView === 'all' || chartView === 'posts') && (
                    <Bar
                      yAxisId="left"
                      dataKey="posts"
                      fill="url(#colorPosts)"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    />
                  )}
                  {(chartView === 'all' || chartView === 'revenue') && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#F59E0B', stroke: '#111827', strokeWidth: 1.5 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. DETAIL SUB-TABS (PLATFORM, INSIGHT, RIWAYAT) */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', gap: '4px' }}>
            {[
              { id: 'platform', label: 'Platform' },
              { id: 'insight', label: 'Insight' },
              { id: 'riwayat', label: 'Riwayat' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: detailTab === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: detailTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: detailTab === tab.id ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SUB-TAB A: PLATFORM BREAKDOWN WITH PROGRESS BARS */}
          {detailTab === 'platform' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {platformStats.map(p => {
                const Icon = getPlatformIcon(p.name, p.icon);
                const badgeLabel = p.pct >= 100 ? 'On Track' : (p.pct >= 50 ? 'Kurang' : 'Rendah');
                const badgeClass = p.pct >= 100 ? 'badge-done' : (p.pct >= 50 ? 'badge-p1' : 'badge-p0');

                return (
                  <div key={p.id} className="os-card" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={16} color="var(--color-revenue)" />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.name}
                        </span>
                      </div>
                      <span className={`badge ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: `${Math.min(100, p.pct)}%`,
                          height: '100%',
                          background: p.pct >= 100 ? '#10B981' : (p.pct >= 50 ? '#FBBF24' : '#EF4444'),
                          borderRadius: '99px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      <span>
                        {p.totalPosted}/{p.expectedTotal} post ({p.pct}%)
                      </span>
                      <span>Avg {p.avg}/hari</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUB-TAB B: INSIGHT ANALYTICS */}
          {detailTab === 'insight' && insights && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div className="os-card">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="#34D399" />
                  <span>Hari Terbaik</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {dayNames[insights.bestDay.day]}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Avg {insights.bestDay.avg.toFixed(1)} post
                </div>
              </div>

              <div className="os-card">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#FBBF24" />
                  <span>Hari Terburuk</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {dayNames[insights.worstDay.day]}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Avg {insights.worstDay.avg === Infinity ? '0' : insights.worstDay.avg.toFixed(1)} post
                </div>
              </div>

              <div className="os-card">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart3 size={14} color="var(--color-revenue)" />
                  <span>Revenue Tertinggi</span>
                </div>
                <div className="font-mono text-revenue" style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>
                  {formatRp(insights.topRevLog?.revenue)}
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {insights.topRevLog?.date}
                </div>
              </div>

              <div className="os-card">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={14} color="#38BDF8" />
                  <span>Konsistensi</span>
                </div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {insights.consistencyScore}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Hari on-target
                </div>
              </div>

              <div className="os-card">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {insights.growthPct >= 0 ? <TrendingUp size={14} color="#34D399" /> : <TrendingDown size={14} color="#EF4444" />}
                  <span>Tren Pertumbuhan</span>
                </div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: insights.growthPct >= 0 ? '#34D399' : '#EF4444', marginTop: '4px' }}>
                  {insights.growthPct >= 0 ? '+' : ''}{insights.growthPct}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  vs paruh awal
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB C: RIWAYAT HARIAN */}
          {detailTab === 'riwayat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Riwayat Harian ({filteredHistory.length})
                </span>
                <select
                  value={platformFilter}
                  onChange={e => setPlatformFilter(e.target.value)}
                  className="select-field"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  <option value="all">Semua Platform</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredHistory.slice(0, visibleCount).map(log => {
                  const postsObj = log.posts || {};
                  const tp = Object.values(postsObj).reduce((s, v) => s + (Number(v) || 0), 0);
                  const rev = Number(log.revenue) || 0;

                  return (
                    <div
                      key={log.date}
                      className="os-card"
                      style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {log.date}
                          </span>
                          <span className={`badge ${tp > 0 ? 'badge-done' : 'badge-planned'} font-mono`} style={{ fontSize: '10px' }}>
                            {tp} Post
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {platforms.map(p => {
                            const count = Number(postsObj[p.id]) || 0;
                            if (count === 0 && platformFilter === 'all') return null;
                            const Icon = getPlatformIcon(p.name, p.icon);
                            return (
                              <span key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Icon size={12} />
                                <span>{p.name} <strong>{count}</strong></span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="font-mono" style={{ fontWeight: 800, fontSize: '14px', color: rev > 0 ? 'var(--color-revenue)' : 'var(--text-tertiary)' }}>
                        {formatRp(rev)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < filteredHistory.length && (
                <button
                  onClick={() => setVisibleCount(c => c + 15)}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '12px', padding: '10px' }}
                >
                  Tampilkan Lebih Banyak ({filteredHistory.length - visibleCount} lagi)
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: 11 STRATEGIC KPI METRICS (EXCEL DASHBOARD ROLL-UP) */}
      {topTab === '11_kpi' && (
        <div className="table-container">
          <table className="os-table">
            <thead>
              <tr>
                <th>Metrik</th>
                <th>Target / Aturan</th>
                <th>Realisasi Aktual</th>
                <th>Status</th>
                <th>Catatan Strategis</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kpiMetrics.map(item => {
                const isEditing = editingId === item.id;
                const isNorthStar = item.metric_name.includes('Net Revenue');

                return (
                  <tr
                    key={item.id}
                    style={{
                      background: isNorthStar ? 'rgba(16, 185, 129, 0.06)' : undefined
                    }}
                  >
                    <td style={{ fontWeight: 700, color: isNorthStar ? 'var(--color-revenue)' : 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isNorthStar && <Award size={15} color="var(--color-revenue)" />}
                        <span>{item.metric_name}</span>
                      </div>
                    </td>

                    <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {cleanDash(item.target_rule)}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={actualDraft}
                          onChange={e => setActualDraft(e.target.value)}
                          className="input-field"
                          style={{ fontSize: '12px', padding: '4px 8px', maxWidth: '140px' }}
                        />
                      ) : (
                        <span className="font-mono" style={{ fontWeight: 600, color: item.actual_value && item.actual_value !== '-' ? 'var(--color-revenue)' : 'var(--text-tertiary)' }}>
                          {cleanDash(item.actual_value) || '-'}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          value={statusDraft}
                          onChange={e => setStatusDraft(e.target.value)}
                          className="select-field"
                          style={{ fontSize: '11px', padding: '4px 6px' }}
                        >
                          <option value="On Track">On Track</option>
                          <option value="At Risk">At Risk</option>
                          <option value="Normal">Normal</option>
                          <option value="Done">Done</option>
                        </select>
                      ) : (
                        <span className={`badge ${item.status === 'On Track' || item.status === 'Done' ? 'badge-done' : (item.status === 'At Risk' ? 'badge-p0' : 'badge-planned')}`}>
                          {item.status || 'Normal'}
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      {cleanDash(item.notes)}
                    </td>

                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Simpan"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Batal"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          title="Ubah Nilai Aktual"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
