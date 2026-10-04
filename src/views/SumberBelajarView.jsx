import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Search,
  Plus,
  Trash2,
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SumberBelajarView() {
  const {
    sumberBelajar,
    updateSumberBelajarStatus,
    addSumberBelajar,
    deleteSumberBelajar
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedEffort, setSelectedEffort] = useState('ALL');

  // Add Asset Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMenu, setNewMenu] = useState('Bank Prompt');
  const [newTier, setNewTier] = useState('PREMIUM');
  const [newWeek, setNewWeek] = useState('1');
  const [newDate, setNewDate] = useState('2026-10-06');
  const [newSource, setNewSource] = useState('');
  const [newEffort, setNewEffort] = useState('Medium');
  const [newCta, setNewCta] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const menus = ['Bank Prompt', 'AI Skills', 'Tutorial', 'Apps', 'Others'];
  const tiers = ['FREE', 'PREMIUM', 'PUBLIC/FREE'];
  const efforts = ['Low', 'Medium', 'High'];

  const filteredAssets = sumberBelajar.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (item.content_title || '').toLowerCase().includes(q) ||
        (item.source_asset || '').toLowerCase().includes(q) ||
        (item.notes || '').toLowerCase().includes(q) ||
        (item.id || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedMenu !== 'ALL' && item.menu !== selectedMenu) {
      return false;
    }

    if (selectedTier !== 'ALL' && item.tier !== selectedTier) {
      return false;
    }

    if (selectedEffort !== 'ALL' && item.production_effort !== selectedEffort) {
      return false;
    }

    return true;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Generate auto ID if needed
    const nextNum = sumberBelajar.length + 1;
    const generatedId = `SB-${String(nextNum).padStart(2, '0')}`;

    addSumberBelajar({
      id: generatedId,
      content_title: newTitle.trim(),
      menu: newMenu,
      tier: newTier,
      week_number: Number(newWeek) || 1,
      target_date: newDate || '2026-10-06',
      source_asset: newSource.trim() || 'Aset Mandiri / Digital Template',
      source_type: 'Original',
      production_effort: newEffort,
      cta: newCta.trim() || 'Dapatkan di Komunitas Aidukasi',
      status: 'Planned',
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewSource('');
    setNewCta('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--color-membership)" />
              <span>Sumber Belajar & Membership Asset Vault ({sumberBelajar.length} Aset)</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Bank Prompt, AI Skills, Tutorial, Apps, dan Template hasil alih fungsi (repurpose) dari YouTube & produk
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
            >
              <Plus size={15} />
              <span>+ Tambah Aset Belajar</span>
            </button>

            <span className="badge badge-channel-membership font-mono">
              Premium: {sumberBelajar.filter(s => s.tier === 'PREMIUM').length}
            </span>
            <span className="badge badge-channel-wa font-mono">
              Free: {sumberBelajar.filter(s => s.tier === 'FREE').length}
            </span>
            <span className="badge badge-done font-mono">
              Selesai: {sumberBelajar.filter(s => s.status === 'Done').length} / {sumberBelajar.length}
            </span>
          </div>
        </div>

        {/* FILTERS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Cari aset / judul..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            value={selectedMenu}
            onChange={e => setSelectedMenu(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Menu ({sumberBelajar.length})</option>
            {menus.map(m => (
              <option key={m} value={m}>{m} ({sumberBelajar.filter(s => s.menu === m).length})</option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Tier</option>
            {tiers.map(t => (
              <option key={t} value={t}>{t} ({sumberBelajar.filter(s => s.tier === t).length})</option>
            ))}
          </select>

          <select
            value={selectedEffort}
            onChange={e => setSelectedEffort(e.target.value)}
            className="select-field"
          >
            <option value="ALL">Semua Tingkat Effort</option>
            {efforts.map(ef => (
              <option key={ef} value={ef}>Effort: {ef} ({sumberBelajar.filter(s => s.production_effort === ef).length})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ASSET CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {filteredAssets.map(item => {
          const isDone = item.status === 'Done';
          return (
            <div
              key={item.id}
              className="os-card-elevated"
              style={{
                borderLeft: `4px solid ${item.tier === 'PREMIUM' ? 'var(--color-membership)' : 'var(--color-wa)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                      {item.id}
                    </span>
                    <span className="badge badge-channel-membership font-mono" style={{ fontSize: '10px' }}>
                      Week {item.week_number}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge ${item.tier === 'PREMIUM' ? 'badge-p1' : 'badge-channel-wa'}`} style={{ fontSize: '10px' }}>
                      {item.tier}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus aset "${item.content_title}" dari vault?`)) {
                          deleteSumberBelajar(item.id);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px' }}
                      title="Hapus Aset"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {item.content_title}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span className="badge badge-planned font-mono">
                    Menu: {item.menu}
                  </span>
                  <span className="badge badge-planned font-mono">
                    Effort: {item.production_effort}
                  </span>
                  <span className="badge badge-planned font-mono">
                    Tipe: {item.source_type}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  Sumber: {item.source_asset}
                </p>

                {item.notes && (
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
                    Catatan: {item.notes}
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Target: {item.target_date}
                </span>

                <button
                  onClick={() => updateSumberBelajarStatus(item.id, isDone ? 'Planned' : 'Done')}
                  className={`badge ${isDone ? 'badge-done' : 'badge-planned'}`}
                  style={{ border: 'none', cursor: 'pointer', padding: '6px 10px', fontSize: '11px' }}
                >
                  {isDone ? 'Rilis Selesai ✓' : 'Tandai Selesai'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ASSET MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Tambah Aset Belajar Baru
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Judul Konten / Aset
                </label>
                <input
                  type="text"
                  placeholder="mis. Prompt Generator Kisi-kisi Soal Ujian"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Menu Kategori
                  </label>
                  <select
                    value={newMenu}
                    onChange={e => setNewMenu(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    {menus.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Tier Akses
                  </label>
                  <select
                    value={newTier}
                    onChange={e => setNewTier(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    <option value="PREMIUM">PREMIUM (Member)</option>
                    <option value="FREE">FREE (Publik)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Pekan (Week 1 - 13)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="13"
                    value={newWeek}
                    onChange={e => setNewWeek(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '12px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Target Rilis (Tanggal)
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="input-field font-mono"
                    style={{ width: '100%', fontSize: '12px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Aset Sumber / Asal Repurpose
                </label>
                <input
                  type="text"
                  placeholder="mis. YouTube Video Pekan 1 atau ModulAjar"
                  value={newSource}
                  onChange={e => setNewSource(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Tingkat Effort Produksi
                  </label>
                  <select
                    value={newEffort}
                    onChange={e => setNewEffort(e.target.value)}
                    className="select-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Call To Action (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="mis. Gabung Aidukasi VIP"
                    value={newCta}
                    onChange={e => setNewCta(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Catatan / Instruksi
                </label>
                <textarea
                  rows="2"
                  placeholder="mis. Ekstrak prompt dari video tutorial menit 04:30"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  <Plus size={15} />
                  <span>Simpan ke Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
