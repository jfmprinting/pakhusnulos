import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import {
  calculateLevel,
  checkBadgeUnlock,
  computeStats,
  BADGES,
  XP_PER_POST,
  XP_PER_REVENUE
} from '../lib/gamification';

const AppContext = createContext();

const DEFAULT_USER_ID = 'f1b1244e-5fa1-4214-9cc7-fffa3973f644';

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Master Content tables
  const [config, setConfig] = useState(null);
  const [heroProducts, setHeroProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [phases, setPhases] = useState([]);
  const [weeklyClusters, setWeeklyClusters] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [dailyProducts, setDailyProducts] = useState([]);
  const [sumberBelajar, setSumberBelajar] = useState([]);
  const [youtubeSchedule, setYoutubeSchedule] = useState([]);
  const [waPlaybook, setWaPlaybook] = useState([]);
  const [kpiMetrics, setKpiMetrics] = useState([]);

  // Post & Cuan tables
  const [platforms, setPlatforms] = useState([]);
  const [userSettings, setUserSettings] = useState({
    daily_net_target: 500000,
    monthly_net_target: 15000000,
    affiliate_rate: 0.40,
    monthly_fixed_cost: 742000,
    weekly_gross_target: 3500000,
    lock_hour: 20
  });
  const [userXp, setUserXp] = useState({ total_xp: 3445, level: 35 });
  const [userBadges, setUserBadges] = useState([]);
  const [revenueSources, setRevenueSources] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);

  // Active Selected Date (default to today's local date)
  const getLocalDate = () => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Modals
  const [showSopModal, setShowSopModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#06B6D4', '#FBBF24']
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  // Fetch initial data from Supabase
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        cfgRes,
        prodRes,
        phaseRes,
        weekRes,
        calRes,
        dpRes,
        sbRes,
        ytRes,
        waRes,
        kpiRes,
        platRes,
        setRes,
        xpRes,
        badgRes,
        revRes,
        dlRes,
        focRes
      ] = await Promise.all([
        supabase.from('system_config').select('*').limit(1).single(),
        supabase.from('hero_products').select('*').order('price', { ascending: true }),
        supabase.from('revenue_phases').select('*').order('phase_number', { ascending: true }),
        supabase.from('weekly_clusters').select('*').order('week_number', { ascending: true }),
        supabase.from('master_calendar').select('*').order('date', { ascending: true }),
        supabase.from('daily_product_content').select('*').order('date', { ascending: true }),
        supabase.from('sumber_belajar').select('*').order('week_number', { ascending: true }),
        supabase.from('youtube_schedule').select('*').order('week_number', { ascending: true }),
        supabase.from('wa_distribution_playbook').select('*'),
        supabase.from('kpi_metrics').select('*').order('sort_order', { ascending: true }),
        supabase.from('platforms').select('*').order('created_at', { ascending: true }),
        supabase.from('user_settings').select('*').maybeSingle(),
        supabase.from('user_xp').select('*').maybeSingle(),
        supabase.from('user_badges').select('*').order('unlocked_at', { ascending: false }),
        supabase.from('revenue_sources').select('*').order('created_at', { ascending: true }),
        supabase.from('daily_logs').select('*').order('date', { ascending: true }),
        supabase.from('focus_sessions').select('*').order('created_at', { ascending: false })
      ]);

      if (cfgRes.data) setConfig(cfgRes.data);
      if (prodRes.data) setHeroProducts(prodRes.data);
      if (phaseRes.data) setPhases(phaseRes.data);
      if (weekRes.data) setWeeklyClusters(weekRes.data);
      if (calRes.data) setCalendar(calRes.data);
      if (dpRes.data) setDailyProducts(dpRes.data);
      if (sbRes.data) setSumberBelajar(sbRes.data);
      if (ytRes.data) setYoutubeSchedule(ytRes.data);
      if (waRes.data) setWaPlaybook(waRes.data);
      if (kpiRes.data) setKpiMetrics(kpiRes.data);

      if (platRes.data) setPlatforms(platRes.data);
      if (setRes.data) setUserSettings(setRes.data);
      if (xpRes.data) setUserXp(xpRes.data);
      if (badgRes.data) setUserBadges(badgRes.data);
      if (revRes.data) setRevenueSources(revRes.data);
      if (dlRes.data) setDailyLogs(dlRes.data);
      if (focRes.data) setFocusSessions(focRes.data);

      // Product variants: fetch terpisah agar app tetap jalan
      // sebelum migration 001 dijalankan di Supabase.
      try {
        const { data: variantData, error: variantError } = await supabase
          .from('product_variants')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!variantError && variantData) {
          setProductVariants(variantData);
        }
      } catch (variantErr) {
        console.warn('Tabel product_variants belum ada. Jalankan migrations/001_product_master_variants.sql');
      }

    } catch (err) {
      console.error('Error fetching Supabase data:', err);
      setError(err.message || 'Gagal memuat data dari Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ADD XP AND LEVEL UP HANDLER
  const addXP = async (amount) => {
    const currentTotal = Number(userXp?.total_xp) || 0;
    const oldLevel = Number(userXp?.level) || 1;
    const newTotal = currentTotal + amount;
    const { level: newLevel } = calculateLevel(newTotal);

    // Optimistic
    setUserXp({ total_xp: newTotal, level: newLevel });

    if (newLevel > oldLevel) {
      triggerConfetti();
      showToast(`Level Up! Selamat, kamu mencapai Level ${newLevel}!`, 'success');
    }

    try {
      const { error } = await supabase
        .from('user_xp')
        .upsert({
          user_id: DEFAULT_USER_ID,
          total_xp: newTotal,
          level: newLevel,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      if (error) console.error('Failed to update XP:', error);
    } catch (err) {
      console.error('XP error:', err);
    }
  };

  // CHECK AND UNLOCK BADGES
  const checkBadges = async () => {
    try {
      const stats = computeStats(dailyLogs, platforms);
      stats.totalXP = userXp?.total_xp || 0;
      const unlockedIds = userBadges.map(b => b.badge_id);
      const newBadgeIds = checkBadgeUnlock(stats, unlockedIds);

      if (newBadgeIds.length === 0) return;

      const inserts = newBadgeIds.map(badge_id => ({
        user_id: DEFAULT_USER_ID,
        badge_id,
        unlocked_at: new Date().toISOString()
      }));

      const { data, error } = await supabase.from('user_badges').insert(inserts).select();
      if (error) throw error;

      if (data) {
        setUserBadges(prev => [...data, ...prev]);
        triggerConfetti();
        for (const bId of newBadgeIds) {
          const badge = BADGES.find(b => b.id === bId);
          if (badge) {
            showToast(`${badge.emoji} Badge Unlocked: ${badge.name}!`, 'success');
          }
        }
      }
    } catch (err) {
      console.error('Badge check error:', err);
    }
  };

  // ==========================================
  // CRUD: HERO PRODUCTS & PRICING
  // ==========================================
  const addProduct = async (productData) => {
    try {
      const payload = {
        name: productData.name,
        type: productData.type || 'Produk',
        price: Number(productData.price) || 0,
        sales_mix: Number(productData.sales_mix) || 0.1,
        is_hero: productData.is_hero !== undefined ? productData.is_hero : true,
        description: productData.description || '',
        cta_link: productData.cta_link || ''
      };
      const { data, error } = await supabase.from('hero_products').insert([payload]).select();
      if (error) throw error;
      if (data) {
        setHeroProducts(prev => [...prev, data[0]]);
        showToast(`Produk "${productData.name}" berhasil ditambahkan!`);
        return data[0];
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      showToast('Gagal menambahkan produk ke Supabase', 'error');
      return null;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const { error } = await supabase.from('hero_products').update(updates).eq('id', id);
      if (error) throw error;
      setHeroProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      showToast('Data produk berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to update product:', err);
      showToast('Gagal memperbarui produk', 'error');
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from('hero_products').delete().eq('id', id);
      if (error) throw error;
      setHeroProducts(prev => prev.filter(p => p.id !== id));
      setProductVariants(prev => prev.filter(v => v.product_id !== id));
      showToast('Produk berhasil dihapus');
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast('Gagal menghapus produk', 'error');
    }
  };

  // ==========================================
  // CRUD: PRODUCT VARIANTS (PAKET & HARGA)
  // ==========================================
  const addProductVariant = async (variantData) => {
    try {
      const payload = {
        product_id: variantData.product_id,
        variant_name: variantData.variant_name,
        price: Number(variantData.price) || 0,
        description: variantData.description || '',
        sales_mix: Number(variantData.sales_mix) || 0.2,
        is_default: variantData.is_default || false,
        is_active: variantData.is_active !== undefined ? variantData.is_active : true,
        sort_order: Number(variantData.sort_order) || 0
      };
      const { data, error } = await supabase.from('product_variants').insert([payload]).select();
      if (error) throw error;
      if (data) {
        setProductVariants(prev => [...prev, data[0]]);
        // Sinkron harga produk utama jika varian ini ditandai default
        if (payload.is_default) {
          setHeroProducts(prev => prev.map(p => p.id === payload.product_id ? { ...p, price: payload.price } : p));
          supabase.from('hero_products').update({ price: payload.price }).eq('id', payload.product_id)
            .then(({ error: upErr }) => { if (upErr) console.warn('Gagal sinkron harga default:', upErr.message); });
        }
        showToast(`Varian "${variantData.variant_name}" berhasil ditambahkan!`);
        return data[0];
      }
    } catch (err) {
      console.error('Failed to add product variant:', err);
      showToast('Gagal menambahkan varian (jalankan migration 001 di Supabase)', 'error');
      return null;
    }
  };

  const updateProductVariant = async (id, updates) => {
    try {
      const { error } = await supabase.from('product_variants').update(updates).eq('id', id);
      if (error) throw error;
      setProductVariants(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
      if (updates.is_default && updates.price !== undefined) {
        const variant = productVariants.find(v => v.id === id);
        if (variant) {
          setHeroProducts(prev => prev.map(p => p.id === variant.product_id ? { ...p, price: Number(updates.price) } : p));
          supabase.from('hero_products').update({ price: Number(updates.price) }).eq('id', variant.product_id)
            .then(({ error: upErr }) => { if (upErr) console.warn('Gagal sinkron harga default:', upErr.message); });
        }
      }
      showToast('Varian berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to update product variant:', err);
      showToast('Gagal memperbarui varian', 'error');
    }
  };

  const deleteProductVariant = async (id) => {
    try {
      const { error } = await supabase.from('product_variants').delete().eq('id', id);
      if (error) throw error;
      setProductVariants(prev => prev.filter(v => v.id !== id));
      showToast('Varian berhasil dihapus');
    } catch (err) {
      console.error('Failed to delete product variant:', err);
      showToast('Gagal menghapus varian', 'error');
    }
  };

  // ==========================================
  // CRUD: USER SETTINGS (TARGETS & FINANCIAL)
  // ==========================================
  const updateUserSettings = async (updates) => {
    const newSettings = { ...userSettings, ...updates };
    setUserSettings(newSettings);
    showToast('Pengaturan target finansial berhasil disimpan!');

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: DEFAULT_USER_ID,
          ...newSettings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update user settings:', err);
      showToast('Gagal menyimpan pengaturan ke Supabase', 'error');
    }
  };

  // ==========================================
  // CRUD: PLATFORMS
  // ==========================================
  const addPlatform = async (platData) => {
    try {
      const payload = {
        user_id: DEFAULT_USER_ID,
        name: platData.name,
        icon: platData.icon || 'Video',
        daily_target: Number(platData.daily_target) || 1,
        frequency: platData.frequency || 'daily'
      };
      const { data, error } = await supabase.from('platforms').insert([payload]).select();
      if (error) throw error;
      if (data) {
        setPlatforms(prev => [...prev, data[0]]);
        showToast(`Platform "${platData.name}" berhasil ditambahkan!`);
      }
    } catch (err) {
      console.error('Failed to add platform:', err);
      showToast('Gagal menambahkan platform', 'error');
    }
  };

  const updatePlatform = async (id, updates) => {
    try {
      const { error } = await supabase.from('platforms').update(updates).eq('id', id);
      if (error) throw error;
      setPlatforms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      showToast('Platform berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to update platform:', err);
      showToast('Gagal memperbarui platform', 'error');
    }
  };

  const deletePlatform = async (id) => {
    try {
      const { error } = await supabase.from('platforms').delete().eq('id', id);
      if (error) throw error;
      setPlatforms(prev => prev.filter(p => p.id !== id));
      showToast('Platform berhasil dihapus');
    } catch (err) {
      console.error('Failed to delete platform:', err);
      showToast('Gagal menghapus platform', 'error');
    }
  };

  // ==========================================
  // CRUD: REVENUE SOURCES
  // ==========================================
  const addRevenueSource = async (sourceData) => {
    try {
      const payload = {
        user_id: DEFAULT_USER_ID,
        name: sourceData.name,
        emoji: sourceData.emoji || '💰',
        color: sourceData.color || '#10b981'
      };
      const { data, error } = await supabase.from('revenue_sources').insert([payload]).select();
      if (error) throw error;
      if (data) {
        setRevenueSources(prev => [...prev, data[0]]);
        showToast(`Sumber "${sourceData.name}" berhasil ditambahkan!`);
      }
    } catch (err) {
      console.error('Failed to add revenue source:', err);
      showToast('Gagal menambahkan sumber', 'error');
    }
  };

  const updateRevenueSource = async (id, updates) => {
    try {
      const { error } = await supabase.from('revenue_sources').update(updates).eq('id', id);
      if (error) throw error;
      setRevenueSources(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      showToast('Sumber cuan berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to update revenue source:', err);
      showToast('Gagal memperbarui sumber', 'error');
    }
  };

  const deleteRevenueSource = async (id) => {
    try {
      const { error } = await supabase.from('revenue_sources').delete().eq('id', id);
      if (error) throw error;
      setRevenueSources(prev => prev.filter(s => s.id !== id));
      showToast('Sumber cuan dihapus');
    } catch (err) {
      console.error('Failed to delete revenue source:', err);
      showToast('Gagal menghapus sumber', 'error');
    }
  };

  // ==========================================
  // CRUD: SUMBER BELAJAR ASSET VAULT
  // ==========================================
  const addSumberBelajar = async (itemData) => {
    try {
      const { data, error } = await supabase.from('sumber_belajar').insert([itemData]).select();
      if (error) throw error;
      if (data) {
        setSumberBelajar(prev => [...prev, data[0]]);
        showToast(`Aset "${itemData.content_title}" berhasil ditambahkan!`);
      }
    } catch (err) {
      console.error('Failed to add sumber belajar:', err);
      showToast('Gagal menambahkan aset ke Supabase', 'error');
    }
  };

  const updateSumberBelajar = async (id, updates) => {
    try {
      const { error } = await supabase.from('sumber_belajar').update(updates).eq('id', id);
      if (error) throw error;
      setSumberBelajar(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      showToast('Aset berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to update sumber belajar:', err);
      showToast('Gagal memperbarui aset', 'error');
    }
  };

  const deleteSumberBelajar = async (id) => {
    try {
      const { error } = await supabase.from('sumber_belajar').delete().eq('id', id);
      if (error) throw error;
      setSumberBelajar(prev => prev.filter(s => s.id !== id));
      showToast('Aset berhasil dihapus dari vault');
    } catch (err) {
      console.error('Failed to delete sumber belajar:', err);
      showToast('Gagal menghapus aset', 'error');
    }
  };

  // Update Master Calendar Item Status
  const updateCalendarStatus = async (date, newStatus) => {
    setCalendar(prev => prev.map(item => item.date === date ? { ...item, status: newStatus } : item));
    if (newStatus === 'Done') {
      triggerConfetti();
      addXP(25);
      showToast(`Hari ${date} ditandai selesai! (+25 XP)`);
    } else {
      showToast(`Status hari ${date} diperbarui ke ${newStatus}`);
    }

    try {
      const { error } = await supabase
        .from('master_calendar')
        .update({ status: newStatus })
        .eq('date', date);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update calendar status:', err);
      showToast('Gagal menyimpan ke database Supabase', 'error');
    }
  };

  // Update Daily Product Content (Published & URL)
  const updateDailyProduct = async (date, isPublished, publishedUrl = null, notes = null) => {
    setDailyProducts(prev => prev.map(item => {
      if (item.date === date) {
        return {
          ...item,
          is_published: isPublished,
          published_url: publishedUrl !== null ? publishedUrl : item.published_url,
          notes: notes !== null ? notes : item.notes,
          status: isPublished ? 'Done' : 'Planned'
        };
      }
      return item;
    }));

    if (isPublished) {
      triggerConfetti();
      addXP(XP_PER_POST);
      showToast('Konten harian ditandai tayang! (+10 XP)');
    }

    try {
      const updatePayload = {
        is_published: isPublished,
        status: isPublished ? 'Done' : 'Planned'
      };
      if (publishedUrl !== null) updatePayload.published_url = publishedUrl;
      if (notes !== null) updatePayload.notes = notes;

      const { error } = await supabase
        .from('daily_product_content')
        .update(updatePayload)
        .eq('date', date);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update daily product:', err);
      showToast('Gagal menyimpan ke database Supabase', 'error');
    }
  };

  // POST & CUAN: UPDATE PLATFORM POST COUNTER (+ / -)
  const updatePlatformPost = async (platformId, delta) => {
    const targetDate = selectedDate;
    const existingLog = dailyLogs.find(l => l.date === targetDate);
    const currentPosts = existingLog ? { ...(existingLog.posts || {}) } : {};
    const oldVal = Number(currentPosts[platformId]) || 0;
    const newVal = Math.max(0, oldVal + delta);
    currentPosts[platformId] = newVal;

    const updatedLog = {
      user_id: DEFAULT_USER_ID,
      date: targetDate,
      posts: currentPosts,
      revenue: existingLog ? Number(existingLog.revenue) || 0 : 0,
      revenue_entries: existingLog ? existingLog.revenue_entries || [] : [],
      missed: false,
      updated_at: new Date().toISOString()
    };

    // Optimistic state
    setDailyLogs(prev => {
      const index = prev.findIndex(l => l.date === targetDate);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...updatedLog };
        return copy;
      } else {
        return [...prev, updatedLog];
      }
    });

    if (delta > 0) {
      addXP(XP_PER_POST);
      showToast(`Post bertambah! (+${XP_PER_POST} XP)`);
      // If TikTok or Video platform, auto-mark today's social product as published
      const plat = platforms.find(p => p.id === platformId);
      if (plat && (plat.name.toLowerCase().includes('tiktok') || plat.icon === 'Video')) {
        updateDailyProduct(targetDate, true);
      }
    }

    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert(updatedLog, { onConflict: 'user_id,date' });
      if (error) throw error;
      checkBadges();
    } catch (err) {
      console.error('Failed to update platform post in Supabase:', err);
      showToast('Gagal menyimpan postingan ke Supabase', 'error');
    }
  };

  // POST & CUAN: ADD REVENUE ENTRY
  const addRevenueEntry = async (entry) => {
    const targetDate = selectedDate;
    const existingLog = dailyLogs.find(l => l.date === targetDate);
    const existingEntries = existingLog ? [...(existingLog.revenue_entries || [])] : [];
    const newEntries = [...existingEntries, entry];
    const totalNetRevenue = newEntries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const updatedLog = {
      user_id: DEFAULT_USER_ID,
      date: targetDate,
      posts: existingLog ? existingLog.posts || {} : {},
      revenue: totalNetRevenue,
      revenue_entries: newEntries,
      missed: false,
      updated_at: new Date().toISOString()
    };

    // Optimistic state
    setDailyLogs(prev => {
      const index = prev.findIndex(l => l.date === targetDate);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...updatedLog };
        return copy;
      } else {
        return [...prev, updatedLog];
      }
    });

    triggerConfetti();
    addXP(XP_PER_REVENUE);
    showToast(`Cuan berhasil dicatat! (+${XP_PER_REVENUE} XP)`);

    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert(updatedLog, { onConflict: 'user_id,date' });
      if (error) throw error;
      checkBadges();
    } catch (err) {
      console.error('Failed to save revenue entry to Supabase:', err);
      showToast('Gagal menyimpan cuan ke Supabase', 'error');
    }
  };

  // POST & CUAN: DELETE REVENUE ENTRY
  const deleteRevenueEntry = async (entryIndex) => {
    const targetDate = selectedDate;
    const existingLog = dailyLogs.find(l => l.date === targetDate);
    if (!existingLog) return;

    const existingEntries = [...(existingLog.revenue_entries || [])];
    existingEntries.splice(entryIndex, 1);
    const totalNetRevenue = existingEntries.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const updatedLog = {
      ...existingLog,
      revenue: totalNetRevenue,
      revenue_entries: existingEntries,
      updated_at: new Date().toISOString()
    };

    setDailyLogs(prev => prev.map(l => l.date === targetDate ? updatedLog : l));
    showToast('Transaksi dihapus');

    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert(updatedLog, { onConflict: 'user_id,date' });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete revenue entry in Supabase:', err);
    }
  };

  // POST & CUAN: COMPLETE FOCUS SESSION
  const saveFocusSession = async (durationMinutes, theme) => {
    const xpEarned = Math.max(1, Math.floor(durationMinutes / 5));

    try {
      const { data, error } = await supabase.from('focus_sessions').insert({
        user_id: DEFAULT_USER_ID,
        duration_minutes: durationMinutes,
        theme,
        completed: true,
        xp_earned: xpEarned,
        created_at: new Date().toISOString()
      }).select();

      if (error) throw error;

      if (data) {
        setFocusSessions(prev => [data[0], ...prev]);
      }

      triggerConfetti();
      addXP(xpEarned);
      showToast(`Sesi fokus ${durationMinutes}m selesai! (+${xpEarned} XP)`);
      setShowFocusTimer(false);
      checkBadges();
    } catch (err) {
      console.error('Failed to save focus session:', err);
      showToast('Gagal menyimpan sesi fokus', 'error');
    }
  };

  // Update Sumber Belajar Status
  const updateSumberBelajarStatus = async (id, newStatus) => {
    setSumberBelajar(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    showToast(`Aset ${id} status: ${newStatus}`);

    try {
      const { error } = await supabase
        .from('sumber_belajar')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to update sumber belajar status:', err);
    }
  };

  // Get active day object
  const activeDay = calendar.find(c => c.date === selectedDate) || calendar[0] || null;
  const activeDailyProduct = dailyProducts.find(d => d.date === selectedDate) || null;
  const activeWeekCluster = activeDay ? weeklyClusters.find(w => w.week_number === activeDay.week_number) : null;
  const activeYt = activeDay ? youtubeSchedule.find(y => y.week_number === activeDay.week_number) : null;
  const activeWaDay = activeDay ? waPlaybook.find(w => w.day_name.toLowerCase() === activeDay.day_name.toLowerCase()) : null;

  // Active Daily Log for Selected Date
  const activeDailyLog = dailyLogs.find(l => l.date === selectedDate) || {
    date: selectedDate,
    posts: {},
    revenue: 0,
    revenue_entries: []
  };

  const xpStats = calculateLevel(userXp?.total_xp || 0);

  return (
    <AppContext.Provider value={{
      loading,
      error,
      config,
      heroProducts,
      productVariants,
      phases,
      weeklyClusters,
      calendar,
      dailyProducts,
      sumberBelajar,
      youtubeSchedule,
      waPlaybook,
      kpiMetrics,

      // Post & Cuan states
      platforms,
      userSettings,
      userXp,
      userBadges,
      revenueSources,
      dailyLogs,
      focusSessions,
      activeDailyLog,
      xpStats,

      selectedDate,
      setSelectedDate,
      currentView,
      setCurrentView,

      // Modals
      showSopModal,
      setShowSopModal,
      showBadgesModal,
      setShowBadgesModal,
      showFocusTimer,
      setShowFocusTimer,
      showRevenueModal,
      setShowRevenueModal,
      showSettingsModal,
      setShowSettingsModal,

      toasts,
      showToast,
      triggerConfetti,
      fetchAllData,
      updateCalendarStatus,
      updateDailyProduct,
      updateSumberBelajarStatus,

      // CRUD Actions
      addProduct,
      updateProduct,
      deleteProduct,
      addProductVariant,
      updateProductVariant,
      deleteProductVariant,
      updateUserSettings,
      addPlatform,
      updatePlatform,
      deletePlatform,
      addRevenueSource,
      updateRevenueSource,
      deleteRevenueSource,
      addSumberBelajar,
      updateSumberBelajar,
      deleteSumberBelajar,

      // Post & Cuan actions
      updatePlatformPost,
      addRevenueEntry,
      deleteRevenueEntry,
      saveFocusSession,
      addXP,

      activeDay,
      activeDailyProduct,
      activeWeekCluster,
      activeYt,
      activeWaDay
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
