import React, { useState, useEffect } from 'react';
import { X, DollarSign, Plus, ChevronDown, ChevronUp, Package, Settings, Sparkles } from 'lucide-react';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const DEFAULT_CHANNELS = [
  'TikTok Organic',
  'TikTok Live',
  'Instagram DM/Story',
  'WhatsApp Group',
  'WhatsApp Personal',
  'YouTube Description',
  'Threads Organic',
  'Word of Mouth / Referral',
  'Lainnya / Custom'
];

export default function RevenueEntryModal({
  isOpen,
  onClose,
  onSubmit,
  revenueSources = [],
  heroProducts = [],
  productVariants = [],
  selectedDate,
  onOpenSettings
}) {
  const [sourceId, setSourceId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [gross, setGross] = useState('');
  const [product, setProduct] = useState('');
  const [plan, setPlan] = useState('');
  const [customerType, setCustomerType] = useState('new');
  const [channel, setChannel] = useState(DEFAULT_CHANNELS[0]);
  const [customChannel, setCustomChannel] = useState('');
  const [campaign, setCampaign] = useState('');
  const [saleRoute, setSaleRoute] = useState('direct');
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateRate, setAffiliateRate] = useState('40');
  const [expanded, setExpanded] = useState(true);

  // Sync initial sourceId when revenueSources loads
  useEffect(() => {
    if (revenueSources.length > 0 && !sourceId) {
      setSourceId(revenueSources[0].id);
    }
  }, [revenueSources, sourceId]);

  if (!isOpen) return null;

  const grossNum = Number(gross) || 0;
  const rateNum = Math.min(100, Math.max(0, Number(affiliateRate) || 0)) / 100;
  const commission = saleRoute === 'affiliate' ? Math.round(grossNum * rateNum) : 0;
  const net = Math.max(0, grossNum - commission);

  const canSubmit = grossNum > 0 && !!sourceId;

  // Handle Product Dropdown Change
  const handleProductSelect = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    setSelectedVariantId('');

    if (!val || val === 'custom') {
      return;
    }

    const found = heroProducts.find(p => p.id === val);
    if (found) {
      setProduct(found.name);

      // Auto pilih varian default (atau varian pertama) milik produk ini
      const variants = productVariants.filter(v => v.product_id === val && v.is_active !== false);
      const defaultVariant = variants.find(v => v.is_default) || variants[0];
      if (defaultVariant) {
        setSelectedVariantId(defaultVariant.id);
        setGross(String(defaultVariant.price || found.price || 0));
        setPlan(defaultVariant.variant_name);
      } else {
        setGross(String(found.price || 0));
        setPlan('Standar');
      }
    }
  };

  // Handle Variant Dropdown Change (auto-isi harga varian)
  const handleVariantSelect = (e) => {
    const val = e.target.value;
    setSelectedVariantId(val);
    const found = productVariants.find(v => v.id === val);
    if (found) {
      setGross(String(found.price || 0));
      setPlan(found.variant_name);
    }
  };

  const variantsOfSelected = productVariants.filter(v => v.product_id === selectedProductId && v.is_active !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const finalChannel = channel === 'Lainnya / Custom' ? (customChannel.trim() || 'Custom') : channel;

    onSubmit({
      amount: net,
      grossAmount: grossNum,
      sourceId,
      product: product.trim() || undefined,
      plan: plan.trim() || undefined,
      customerType,
      acquisitionChannel: finalChannel || undefined,
      campaign: campaign.trim() || undefined,
      saleRoute,
      affiliateName: saleRoute === 'affiliate' ? affiliateName.trim() || undefined : undefined,
      affiliateRate: saleRoute === 'affiliate' ? rateNum : undefined,
      affiliateCommission: saleRoute === 'affiliate' ? commission : undefined,
      ts: new Date().toISOString()
    });

    // Reset and close
    setSelectedProductId('');
    setSelectedVariantId('');
    setGross('');
    setProduct('');
    setPlan('');
    setCampaign('');
    setAffiliateName('');
    setCustomChannel('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '540px', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '90dvh', overflowY: 'auto' }}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-revenue)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Catat Transaksi / Cuan
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Tanggal: <span className="font-mono text-revenue">{selectedDate}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* PRODUCT DROPDOWN & SHORTCUT */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Package size={15} color="var(--color-revenue)" />
                <span>Pilih Produk & Paket (Auto-Isi Harga)</span>
              </label>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings('products');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-revenue)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Settings size={13} />
                  <span>Kelola Master Produk</span>
                </button>
              )}
            </div>

            <select
              value={selectedProductId}
              onChange={handleProductSelect}
              className="select-field"
              style={{ width: '100%', fontSize: '13px', fontWeight: 600 }}
            >
              <option value="">-- Pilih dari Katalog Produk/Jasa/Layanan --</option>
              {heroProducts.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.type || 'Produk'}] {p.name}
                </option>
              ))}
              <option value="custom">+ Input Manual / Layanan Kustom</option>
            </select>

            {selectedProductId && selectedProductId !== 'custom' && variantsOfSelected.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Varian / Paket (Auto-Isi Harga)
                </label>
                <select
                  value={selectedVariantId}
                  onChange={handleVariantSelect}
                  className="select-field"
                  style={{ width: '100%', fontSize: '13px', fontWeight: 600 }}
                >
                  <option value="">-- Pilih Varian --</option>
                  {variantsOfSelected.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.variant_name} ({formatRp(v.price)}){v.is_default ? ' ★' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '5px' }}>
              Pilih produk lalu varian untuk otomatis mengisi nama, paket, dan harga standar. Anda tetap bisa mengedit harga di bawah jika ada diskon.
            </div>
          </div>

          {/* SOURCE & GROSS AMOUNT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Sumber Penjualan
              </label>
              <select
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                className="select-field"
                style={{ width: '100%', fontSize: '13px' }}
                required
              >
                {revenueSources.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.emoji || '💰'} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Nominal Kotor (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={gross}
                onChange={e => setGross(e.target.value)}
                placeholder="mis. 149000"
                className="input-field font-mono"
                style={{ width: '100%', fontSize: '13px', fontWeight: 700, color: 'var(--color-revenue)' }}
                required
              />
            </div>
          </div>

          {/* TOGGLE EXPANDED DETAILS */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-revenue)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 0'
            }}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            <span>{expanded ? 'Sembunyikan rincian produk & channel' : 'Tampilkan rincian produk, channel & affiliate'}</span>
          </button>

          {expanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              
              {/* PRODUCT & PLAN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    placeholder="mis. ModulAjar Online"
                    className="input-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Paket / Varian
                  </label>
                  <input
                    type="text"
                    value={plan}
                    onChange={e => setPlan(e.target.value)}
                    placeholder="mis. Paket Pro / Standar"
                    className="input-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* BUYER TYPE & ROUTE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Tipe Pembeli
                  </label>
                  <select
                    value={customerType}
                    onChange={e => setCustomerType(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    <option value="new">Pembeli Baru</option>
                    <option value="repeat">Repeat Order</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Jalur Penjualan
                  </label>
                  <select
                    value={saleRoute}
                    onChange={e => setSaleRoute(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    <option value="direct">Direct (Tanpa Komisi)</option>
                    <option value="affiliate">Affiliate (Ada Komisi)</option>
                  </select>
                </div>
              </div>

              {/* AFFILIATE DETAILS (IF AFFILIATE) */}
              {saleRoute === 'affiliate' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#FBBF24', marginBottom: '4px' }}>
                      Nama Affiliate
                    </label>
                    <input
                      type="text"
                      value={affiliateName}
                      onChange={e => setAffiliateName(e.target.value)}
                      placeholder="mis. Pak Budi / Bu Ani"
                      className="input-field"
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#FBBF24', marginBottom: '4px' }}>
                      Komisi (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={affiliateRate}
                      onChange={e => setAffiliateRate(e.target.value)}
                      className="input-field font-mono"
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>
                </div>
              )}

              {/* CHANNEL & CAMPAIGN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Channel Akuisisi
                  </label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    {DEFAULT_CHANNELS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {channel === 'Lainnya / Custom' && (
                    <input
                      type="text"
                      value={customChannel}
                      onChange={e => setCustomChannel(e.target.value)}
                      placeholder="Ketik nama channel kustom..."
                      className="input-field"
                      style={{ width: '100%', fontSize: '11px', marginTop: '6px' }}
                    />
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Campaign (Opsional)
                  </label>
                  <input
                    type="text"
                    value={campaign}
                    onChange={e => setCampaign(e.target.value)}
                    placeholder="mis. Flash Sale Awal Bulan"
                    className="input-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>

            </div>
          )}

          {/* NET SUMMARY PREVIEW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Kotor: <span className="font-mono">{formatRp(grossNum)}</span>
                {commission > 0 && <span> - Komisi: {formatRp(commission)}</span>}
              </div>
              <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-revenue)' }}>
                Net: {formatRp(net)}
              </div>
            </div>
            <span className="badge badge-done font-mono" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} />
              +5 XP
            </span>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              <Plus size={16} />
              <span>Simpan Transaksi</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
