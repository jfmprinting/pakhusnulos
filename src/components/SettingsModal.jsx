import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Settings,
  Package,
  Target,
  Share2,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { loadGeminiKeys, saveGeminiKeys, testGeminiKey } from '../lib/geminiClient';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const PRODUCT_TYPES = ['Produk', 'Jasa', 'Layanan'];

export default function SettingsModal({ isOpen, onClose, initialTab = 'products' }) {
  const {
    heroProducts,
    productVariants,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
    userSettings,
    updateUserSettings,
    platforms,
    addPlatform,
    updatePlatform,
    deletePlatform,
    revenueSources,
    addRevenueSource,
    updateRevenueSource,
    deleteRevenueSource
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState('Produk');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMix, setNewProdMix] = useState('20');
  const [newProdIsHero, setNewProdIsHero] = useState(true);
  const [editingProdId, setEditingProdId] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdType, setEditProdType] = useState('Produk');
  const [editProdPrice, setEditProdPrice] = useState('');

  // Variant Panel State
  const [expandedProdId, setExpandedProdId] = useState(null);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [editingVarId, setEditingVarId] = useState(null);
  const [editVarName, setEditVarName] = useState('');
  const [editVarPrice, setEditVarPrice] = useState('');

  // Financial Settings State
  const [finDailyNet, setFinDailyNet] = useState('');
  const [finMonthlyNet, setFinMonthlyNet] = useState('');
  const [finFixedCost, setFinFixedCost] = useState('');
  const [finWeeklyGross, setFinWeeklyGross] = useState('');
  const [finAffiliateRate, setFinAffiliateRate] = useState('');
  const [finLockHour, setFinLockHour] = useState('');

  // Sync Financial Settings from userSettings
  useEffect(() => {
    if (userSettings) {
      setFinDailyNet(String(userSettings.daily_net_target || 500000));
      setFinMonthlyNet(String(userSettings.monthly_net_target || 15000000));
      setFinFixedCost(String(userSettings.monthly_fixed_cost || 742000));
      setFinWeeklyGross(String(userSettings.weekly_gross_target || 3500000));
      setFinAffiliateRate(String(Math.round((userSettings.affiliate_rate || 0.4) * 100)));
      setFinLockHour(String(userSettings.lock_hour || 20));
    }
  }, [userSettings, isOpen]);

  // Platform Form State
  const [newPlatName, setNewPlatName] = useState('');
  const [newPlatTarget, setNewPlatTarget] = useState('1');
  const [newPlatIcon, setNewPlatIcon] = useState('Video');
  const [editingPlatId, setEditingPlatId] = useState(null);
  const [editPlatTarget, setEditPlatTarget] = useState('1');

  // Revenue Source Form State
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceEmoji, setNewSourceEmoji] = useState('💰');
  const [newSourceColor, setNewSourceColor] = useState('#10B981');
  const [editingSourceId, setEditingSourceId] = useState(null);
  const [editSourceName, setEditSourceName] = useState('');

  // Gemini API Keys State
  const [geminiKeys, setGeminiKeys] = useState([]);
  const [newGeminiKey, setNewGeminiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [testingKeyIdx, setTestingKeyIdx] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});

  // Load Gemini keys when tab opens
  useEffect(() => {
    if (activeTab === 'api_keys' || isOpen) {
      loadGeminiKeys().then(keys => setGeminiKeys(keys));
    }
  }, [activeTab, isOpen]);

  const handleAddGeminiKey = async () => {
    const trimmed = newGeminiKey.trim();
    if (!trimmed) return;
    if (geminiKeys.includes(trimmed)) {
      return;
    }
    const updated = [...geminiKeys, trimmed];
    setGeminiKeys(updated);
    await saveGeminiKeys(updated);
    setNewGeminiKey('');
    setShowKeyInput(false);
  };

  const handleDeleteGeminiKey = async (idx) => {
    const updated = geminiKeys.filter((_, i) => i !== idx);
    setGeminiKeys(updated);
    await saveGeminiKeys(updated);
    const newResults = { ...testResults };
    delete newResults[idx];
    setTestResults(newResults);
  };

  const handleTestKey = async (key, idx) => {
    setTestingKeyIdx(idx);
    setTestResults(prev => ({ ...prev, [idx]: null }));
    const result = await testGeminiKey(key);
    setTestResults(prev => ({ ...prev, [idx]: result }));
    setTestingKeyIdx(null);
  };

  const toggleKeyVisibility = (idx) => {
    setVisibleKeys(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const maskKey = (key) => {
    if (key.length <= 10) return '***';
    return key.slice(0, 6) + '...' + key.slice(-4);
  };

  if (!isOpen) return null;

  // Handle Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    addProduct({
      name: newProdName.trim(),
      type: newProdType,
      price: Number(newProdPrice) || 0,
      sales_mix: (Number(newProdMix) || 20) / 100,
      is_hero: newProdIsHero
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdMix('20');
    setNewProdType('Produk');
  };

  // Handle Save Edit Product
  const handleSaveEditProduct = (id) => {
    if (!editProdName.trim() || !editProdPrice) return;
    updateProduct(id, {
      name: editProdName.trim(),
      type: editProdType,
      price: Number(editProdPrice) || 0
    });
    setEditingProdId(null);
  };

  // Handle Add Variant
  const handleAddVariant = (productId) => {
    if (!newVarName.trim() || !newVarPrice) return;
    addProductVariant({
      product_id: productId,
      variant_name: newVarName.trim(),
      price: Number(newVarPrice) || 0
    });
    setNewVarName('');
    setNewVarPrice('');
  };

  // Handle Save Financial Settings
  const handleSaveFinancial = (e) => {
    e.preventDefault();
    updateUserSettings({
      daily_net_target: Number(finDailyNet) || 500000,
      monthly_net_target: Number(finMonthlyNet) || 15000000,
      monthly_fixed_cost: Number(finFixedCost) || 742000,
      weekly_gross_target: Number(finWeeklyGross) || 3500000,
      affiliate_rate: (Number(finAffiliateRate) || 40) / 100,
      lock_hour: Number(finLockHour) || 20
    });
  };

  // Handle Add Platform
  const handleAddPlatform = (e) => {
    e.preventDefault();
    if (!newPlatName.trim()) return;

    addPlatform({
      name: newPlatName.trim(),
      daily_target: Number(newPlatTarget) || 1,
      icon: newPlatIcon,
      frequency: 'daily'
    });

    setNewPlatName('');
    setNewPlatTarget('1');
  };

  // Handle Add Revenue Source
  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    addRevenueSource({
      name: newSourceName.trim(),
      emoji: newSourceEmoji || '💰',
      color: newSourceColor || '#10B981'
    });

    setNewSourceName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-revenue)' }}>
              <Settings size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pusat Pengaturan & Master Data (CRUD)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Kelola katalog produk, harga paket, target finansial, platform, dan sumber cuan
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-app)', padding: '0 16px', overflowX: 'auto', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid var(--color-revenue)' : '2px solid transparent',
              color: activeTab === 'products' ? 'var(--color-revenue)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'products' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Package size={15} />
            <span>Katalog Produk ({heroProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            style={{
              padding: '12px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'financial' ? '2px solid var(--color-revenue)' : '2px solid transparent',
              color: activeTab === 'financial' ? 'var(--color-revenue)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'financial' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Target size={15} />
            <span>Target Finansial</span>
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            style={{
              padding: '12px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'platforms' ? '2px solid var(--color-revenue)' : '2px solid transparent',
              color: activeTab === 'platforms' ? 'var(--color-revenue)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'platforms' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Share2 size={15} />
            <span>Platform Konten ({platforms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue_sources')}
            style={{
              padding: '12px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'revenue_sources' ? '2px solid var(--color-revenue)' : '2px solid transparent',
              color: activeTab === 'revenue_sources' ? 'var(--color-revenue)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'revenue_sources' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <DollarSign size={15} />
            <span>Sumber Cuan ({revenueSources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api_keys')}
            style={{
              padding: '12px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'api_keys' ? '2px solid #8B5CF6' : '2px solid transparent',
              color: activeTab === 'api_keys' ? '#A78BFA' : 'var(--text-secondary)',
              fontWeight: activeTab === 'api_keys' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              position: 'relative'
            }}
          >
            <Key size={15} />
            <span>API Keys Gemini</span>
            {geminiKeys.length > 0 && (
              <span style={{ fontSize: '10px', background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA', borderRadius: '10px', padding: '1px 6px' }}>{geminiKeys.length}</span>
            )}
          </button>
        </div>

        {/* TAB BODY */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* TAB 1: HERO PRODUCTS & PRICING */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* ADD PRODUCT FORM */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} color="var(--color-revenue)" />
                  <span>Tambah Produk / Paket Baru</span>
                </div>

                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Tipe
                    </label>
                    <select
                      value={newProdType}
                      onChange={e => setNewProdType(e.target.value)}
                      className="select-field"
                      style={{ width: '100%', fontSize: '12px' }}
                    >
                      {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Nama Produk / Jasa / Layanan
                    </label>
                    <input
                      type="text"
                      placeholder="mis. ModulAjar / Jasa Editing"
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '12px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Harga Satuan (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="mis. 197000"
                      value={newProdPrice}
                      onChange={e => setNewProdPrice(e.target.value)}
                      className="input-field font-mono"
                      style={{ width: '100%', fontSize: '12px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Porsi Penjualan (%)
                    </label>
                    <input
                      type="number"
                      placeholder="mis. 20"
                      value={newProdMix}
                      onChange={e => setNewProdMix(e.target.value)}
                      className="input-field font-mono"
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '12px', padding: '9px 12px', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                      <span>Simpan Produk</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* PRODUCTS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Daftar Produk Aktif ({heroProducts.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {heroProducts.map((p) => {
                    const isEditing = editingProdId === p.id;
                    const isExpanded = expandedProdId === p.id;
                    const variants = productVariants.filter(v => v.product_id === p.id);

                    return (
                      <div
                        key={p.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: isExpanded ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: isExpanded ? '12px' : '0'
                        }}
                      >
                        {/* BARIS UTAMA PRODUK */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center' }}>
                            <select
                              value={editProdType}
                              onChange={e => setEditProdType(e.target.value)}
                              className="select-field"
                              style={{ width: '110px', fontSize: '12px' }}
                            >
                              {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input
                              type="text"
                              value={editProdName}
                              onChange={e => setEditProdName(e.target.value)}
                              className="input-field"
                              style={{ flex: 1, minWidth: '180px', fontSize: '12px' }}
                            />
                            <input
                              type="number"
                              value={editProdPrice}
                              onChange={e => setEditProdPrice(e.target.value)}
                              className="input-field font-mono"
                              style={{ width: '120px', fontSize: '12px' }}
                            />
                            <button
                              onClick={() => handleSaveEditProduct(p.id)}
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              <Check size={14} />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingProdId(null)}
                              className="btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-revenue)' }}>
                                <Package size={16} />
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {p.name}
                                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', background: p.type === 'Jasa' ? 'rgba(245, 158, 11, 0.15)' : p.type === 'Layanan' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.12)', color: p.type === 'Jasa' ? '#FBBF24' : p.type === 'Layanan' ? '#60A5FA' : '#34D399', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                    {p.type || 'Produk'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                  {variants.length > 0 ? `${variants.length} varian` : 'Tanpa varian'} {p.is_hero && <span className="badge badge-done" style={{ fontSize: '9px', padding: '1px 5px', marginLeft: '6px' }}>Hero</span>}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <span className="font-mono text-revenue" style={{ fontSize: '14px', fontWeight: 800 }}>
                                {formatRp(p.price)}
                              </span>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => setExpandedProdId(isExpanded ? null : p.id)}
                                  style={{ background: 'transparent', border: 'none', color: isExpanded ? 'var(--color-revenue)' : 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                  title="Kelola Varian & Harga"
                                >
                                  {isExpanded ? <ChevronUp size={15} /> : <Layers size={15} />}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingProdId(p.id);
                                    setEditProdName(p.name);
                                    setEditProdType(p.type || 'Produk');
                                    setEditProdPrice(String(p.price));
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                  title="Edit Produk"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus produk "${p.name}" beserta semua variannya?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                                  title="Hapus Produk"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        </div>

                        {/* PANEL VARIAN */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Layers size={13} color="var(--color-revenue)" />
                              <span>Varian & Harga: {p.name}</span>
                            </div>

                            {/* DAFTAR VARIAN */}
                            {variants.length === 0 ? (
                              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                                Belum ada varian. Tambahkan paket/tier di bawah (mis. Basic, Pro, Max, VIP) beserta harganya.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {variants.map(v => {
                                  const isVarEditing = editingVarId === v.id;
                                  return (
                                    <div key={v.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'var(--bg-surface-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                      {isVarEditing ? (
                                        <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                          <input
                                            type="text"
                                            value={editVarName}
                                            onChange={e => setEditVarName(e.target.value)}
                                            className="input-field"
                                            style={{ flex: 1, minWidth: '140px', fontSize: '12px' }}
                                          />
                                          <input
                                            type="number"
                                            value={editVarPrice}
                                            onChange={e => setEditVarPrice(e.target.value)}
                                            className="input-field font-mono"
                                            style={{ width: '120px', fontSize: '12px' }}
                                          />
                                          <button
                                            onClick={() => {
                                              updateProductVariant(v.id, {
                                                variant_name: editVarName.trim(),
                                                price: Number(editVarPrice) || 0
                                              });
                                              setEditingVarId(null);
                                            }}
                                            className="btn-primary"
                                            style={{ padding: '5px 10px', fontSize: '11px' }}
                                          >
                                            <Check size={13} />
                                          </button>
                                          <button
                                            onClick={() => setEditingVarId(null)}
                                            className="btn-secondary"
                                            style={{ padding: '5px 8px', fontSize: '11px' }}
                                          >
                                            Batal
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{v.variant_name}</span>
                                            {v.is_default && (
                                              <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>DEFAULT</span>
                                            )}
                                            {v.is_active === false && (
                                              <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.12)', color: '#F87171' }}>NONAKTIF</span>
                                            )}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-revenue)' }}>{formatRp(v.price)}</span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              {!v.is_default && (
                                                <button
                                                  onClick={() => updateProductVariant(v.id, { is_default: true, price: v.price })}
                                                  title="Jadikan Varian Default"
                                                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '3px 7px', fontSize: '10px', fontWeight: 700 }}
                                                >
                                  Set Default
                                                </button>
                                              )}
                                              <button
                                                onClick={() => {
                                                  setEditingVarId(v.id);
                                                  setEditVarName(v.variant_name);
                                                  setEditVarPrice(String(v.price));
                                                }}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px' }}
                                                title="Edit Varian"
                                              >
                                                <Edit2 size={13} />
                                              </button>
                                              <button
                                                onClick={() => window.confirm(`Hapus varian "${v.variant_name}"?`) && deleteProductVariant(v.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '3px' }}
                                                title="Hapus Varian"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* FORM TAMBAH VARIAN */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <input
                                type="text"
                                placeholder="Nama varian (mis. Pro / Max / Sesi 1x)"
                                value={expandedProdId === p.id ? newVarName : ''}
                                onChange={e => setNewVarName(e.target.value)}
                                className="input-field"
                                style={{ flex: 1, minWidth: '180px', fontSize: '12px' }}
                              />
                              <input
                                type="number"
                                placeholder="Harga (Rp)"
                                value={expandedProdId === p.id ? newVarPrice : ''}
                                onChange={e => setNewVarPrice(e.target.value)}
                                className="input-field font-mono"
                                style={{ width: '140px', fontSize: '12px' }}
                              />
                              <button
                                onClick={() => handleAddVariant(p.id)}
                                className="btn-primary"
                                style={{ padding: '7px 14px', fontSize: '12px', justifyContent: 'center' }}
                              >
                                <Plus size={13} />
                                <span>Tambah Varian</span>
                              </button>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                              Varian dengan status DEFAULT otomatis menjadi harga standar produk ini saat pencatatan transaksi.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FINANCIAL SETTINGS */}
          {activeTab === 'financial' && (
            <form onSubmit={handleSaveFinancial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-revenue)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>Formula Finansial Pak Husnul Master Content</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Target net harian Rp 500.000 x 30 hari = Rp 15.000.000/bulan. Nilai di bawah ini digunakan secara otomatis di seluruh dashboard kontrol, gap pacing, dan simulator profit.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Target Net Harian (Rp)
                  </label>
                  <input
                    type="number"
                    value={finDailyNet}
                    onChange={e => setFinDailyNet(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px', fontWeight: 700 }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Default: Rp 500.000 / hari</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Target Net Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={finMonthlyNet}
                    onChange={e => setFinMonthlyNet(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px', fontWeight: 700 }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Default: Rp 15.000.000 / bulan</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Fixed Cost Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={finFixedCost}
                    onChange={e => setFinFixedCost(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>AI Subscriptions + Domain: Rp 742.000</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Target Gross Pekan Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={finWeeklyGross}
                    onChange={e => setFinWeeklyGross(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Default: Rp 3.500.000 / pekan</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Komisi Affiliate Standar (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={finAffiliateRate}
                    onChange={e => setFinAffiliateRate(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Default: 40%</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Jam Cutoff / Kunci Harian (WIB)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={finLockHour}
                    onChange={e => setFinLockHour(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Pukul 20:00 WIB</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  <Check size={16} />
                  <span>Simpan Parameter Finansial</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PLATFORMS */}
          {activeTab === 'platforms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* ADD PLATFORM FORM */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} color="var(--color-revenue)" />
                  <span>Tambah Platform Konten Baru</span>
                </div>

                <form onSubmit={handleAddPlatform} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Nama Platform
                    </label>
                    <input
                      type="text"
                      placeholder="mis. LinkedIn / Threads"
                      value={newPlatName}
                      onChange={e => setNewPlatName(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '12px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Target Post Harian
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newPlatTarget}
                      onChange={e => setNewPlatTarget(e.target.value)}
                      className="input-field font-mono"
                      style={{ width: '100%', fontSize: '12px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Icon Tipe
                    </label>
                    <select
                      value={newPlatIcon}
                      onChange={e => setNewPlatIcon(e.target.value)}
                      className="select-field"
                      style={{ width: '100%', fontSize: '12px' }}
                    >
                      <option value="Video">Video / TikTok</option>
                      <option value="MessageCircle">Chat / WhatsApp</option>
                      <option value="Youtube">YouTube</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Share2">Social General</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '12px', padding: '9px 12px', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                      <span>Tambah Platform</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* PLATFORMS LIST */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {platforms.map(plat => {
                  const isEditing = editingPlatId === plat.id;
                  return (
                    <div
                      key={plat.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {plat.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          Target: <span className="font-mono text-revenue">{plat.daily_target} post/hari</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="number"
                              min="1"
                              value={editPlatTarget}
                              onChange={e => setEditPlatTarget(e.target.value)}
                              className="input-field font-mono"
                              style={{ width: '50px', fontSize: '11px', padding: '4px' }}
                            />
                            <button
                              onClick={() => {
                                updatePlatform(plat.id, { daily_target: Number(editPlatTarget) || 1 });
                                setEditingPlatId(null);
                              }}
                              className="btn-primary"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingPlatId(plat.id);
                                setEditPlatTarget(String(plat.daily_target || 1));
                              }}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                              title="Ubah Target"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus platform "${plat.name}"?`)) {
                                  deletePlatform(plat.id);
                                }
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                              title="Hapus Platform"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: REVENUE SOURCES */}
          {activeTab === 'revenue_sources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* ADD SOURCE FORM */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} color="var(--color-revenue)" />
                  <span>Tambah Sumber Penjualan Baru</span>
                </div>

                <form onSubmit={handleAddSource} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Nama Sumber
                    </label>
                    <input
                      type="text"
                      placeholder="mis. Konsultasi / Workshop"
                      value={newSourceName}
                      onChange={e => setNewSourceName(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '12px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Emoji Icon
                    </label>
                    <select
                      value={newSourceEmoji}
                      onChange={e => setNewSourceEmoji(e.target.value)}
                      className="select-field"
                      style={{ width: '100%', fontSize: '12px' }}
                    >
                      <option value="💰">💰 Kantong Uang</option>
                      <option value="🌐">🌐 Website / Direct</option>
                      <option value="🤝">🤝 Affiliate / Reseller</option>
                      <option value="📲">📲 WhatsApp Closing</option>
                      <option value="🎓">🎓 Workshop / Pelatihan</option>
                      <option value="📦">📦 Produk Digital</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '12px', padding: '9px 12px', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                      <span>Tambah Sumber</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SOURCES LIST */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {revenueSources.map(s => {
                  return (
                    <div
                      key={s.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{s.emoji || '💰'}</span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {s.name}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus sumber "${s.name}"?`)) {
                            deleteRevenueSource(s.id);
                          }
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        title="Hapus Sumber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: GEMINI API KEYS */}
          {activeTab === 'api_keys' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* DESCRIPTION */}
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: '#A78BFA', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} />
                  <span>Multiple Gemini API Key dengan Auto-Failover</span>
                </div>
                <p>Tambahkan beberapa API Key Gemini. Jika satu key terkena rate-limit (429) atau quota habis, sistem otomatis beralih ke key berikutnya. Dapatkan API key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#8B5CF6' }}>Google AI Studio</a>.</p>
              </div>

              {/* ADD NEW KEY FORM */}
              {!showKeyInput ? (
                <button
                  onClick={() => setShowKeyInput(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(139, 92, 246, 0.1)', border: '1px dashed rgba(139, 92, 246, 0.4)', borderRadius: 'var(--radius-md)', color: '#A78BFA', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                  <span>Tambah Gemini API Key Baru</span>
                </button>
              ) : (
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#A78BFA' }}>Paste API Key Baru</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newGeminiKey}
                      onChange={e => setNewGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="input-field"
                      style={{ flex: 1, fontSize: '12px', fontFamily: 'monospace' }}
                      onKeyDown={e => e.key === 'Enter' && handleAddGeminiKey()}
                    />
                    <button onClick={handleAddGeminiKey} style={{ padding: '8px 16px', background: '#7C3AED', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Simpan</button>
                    <button onClick={() => { setShowKeyInput(false); setNewGeminiKey(''); }} style={{ padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Batal</button>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Key disimpan di Supabase, tersinkron antar perangkat.</div>
                </div>
              )}

              {/* KEY LIST */}
              {geminiKeys.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                  <Key size={32} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                  <div>Belum ada API Key tersimpan.</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Tambahkan minimal 1 key untuk menggunakan fitur AI.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    {geminiKeys.length} API Key Tersimpan - Urutan = Prioritas Failover
                  </div>
                  {geminiKeys.map((key, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-surface-elevated)', border: `1px solid ${testResults[idx]?.ok === true ? 'rgba(16,185,129,0.4)' : testResults[idx]?.ok === false ? 'rgba(239,68,68,0.4)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, minWidth: '20px' }}>#{idx + 1}</span>
                      
                      <code style={{ flex: 1, fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                        {visibleKeys[idx] ? key : maskKey(key)}
                      </code>

                      {/* Test Result Badge */}
                      {testResults[idx] !== undefined && testResults[idx] !== null && (
                        testResults[idx].ok
                          ? <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}><CheckCircle2 size={12} />Aktif</span>
                          : <span style={{ fontSize: '11px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '3px' }} title={testResults[idx].error}><XCircle size={12} />Error</span>
                      )}

                      <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                        {/* Toggle Visibility */}
                        <button
                          onClick={() => toggleKeyVisibility(idx)}
                          title={visibleKeys[idx] ? 'Sembunyikan' : 'Tampilkan Key'}
                          style={{ padding: '5px 8px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                        >
                          {visibleKeys[idx] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>

                        {/* Test Key */}
                        <button
                          onClick={() => handleTestKey(key, idx)}
                          disabled={testingKeyIdx === idx}
                          title="Test API Key"
                          style={{ padding: '5px 10px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: '#A78BFA', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {testingKeyIdx === idx ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={12} />}
                          <span>Test</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteGeminiKey(idx)}
                          title="Hapus Key"
                          style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: '#EF4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HOW TO GET KEY */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Cara mendapatkan Gemini API Key (GRATIS):</div>
                <ol style={{ paddingLeft: '16px', margin: 0 }}>
                  <li>Buka <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#8B5CF6' }}>aistudio.google.com/app/apikey</a></li>
                  <li>Login dengan akun Google</li>
                  <li>Klik "Create API Key" - pilih project atau buat baru</li>
                  <li>Copy key dan paste di atas</li>
                  <li>Tambahkan beberapa key dari akun Google berbeda untuk failover maksimal</li>
                </ol>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span>Tersinkronisasi Realtime dengan Supabase</span>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
