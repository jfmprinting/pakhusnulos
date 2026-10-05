import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  CheckCircle2,
  ExternalLink,
  Plus,
  Filter,
  Save,
  Clock,
  Sparkles,
  RefreshCw,
  Copy,
  Key
} from 'lucide-react';
import { generateWithGemini, loadGeminiKeys } from '../lib/geminiClient';

export default function DailySocialView() {
  const {
    dailyProducts,
    updateDailyProduct,
    selectedDate,
    setSelectedDate,
    showToast,
    setShowSettingsModal,
    heroProducts,
    weeklyClusters,
    userSettings
  } = useApp();

  const [selectedAngle, setSelectedAngle] = useState('ALL');
  const [editingDate, setEditingDate] = useState(null);
  const [urlDraft, setUrlDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');

  // AI Caption Generator State
  const [aiPanelDate, setAiPanelDate] = useState(null);
  const [genLoadingDate, setGenLoadingDate] = useState(null);
  const [genStatus, setGenStatus] = useState('');
  const [captions, setCaptions] = useState({});

  const hasGeminiKeys = userSettings?.gemini_keys?.length > 0;
  const productNames = heroProducts.map(p => p.name).join(', ') || 'ModulAjar Online, BuatSoal Online';

  const buildCaptionPrompt = (item) => {
    const theme = weeklyClusters.find(w => w.week_number === item.week_number)?.primary_campaign || '';
    return `Kamu adalah Pak Husnul, guru dan kreator konten edukasi Indonesia yang jual produk digital untuk guru.

Tulis SATU caption konten harian untuk TikTok DAN Threads dengan spesifikasi:
- Sudut konten (angle): ${item.content_angle}
- Produk yang dipromosikan: ${item.recommended_product}
- Fokus kampanye: ${item.campaign_focus}${theme ? `\n- Kampanye pekan ini: ${theme}` : ''}
- Call to Action: ${item.cta}
- Nada: Natural khas kreator edukasi Indonesia, relatable, tidak kaku
- Format: 1 hook kuat di baris pertama, lalu 2-4 baris isi, tutup dengan CTA. Boleh 2-4 emoji relevan. Maksimal 500 karakter.
- Jangan hard sell, jangan gunakan tanda hubung panjang.

Output HANYA isi caption saja, tanpa label, tanpa penjelasan, tanpa tanda kutip.`;
  };

  const handleGenerateCaption = async (item) => {
    if (!hasGeminiKeys) {
      showToast('Tambahkan Gemini API Key dulu di Pengaturan > API Keys', 'error');
      setShowSettingsModal(true);
      return;
    }

    setAiPanelDate(item.date);
    setGenLoadingDate(item.date);
    setGenStatus('Menyiapkan prompt...');

    try {
      const text = await generateWithGemini(buildCaptionPrompt(item), {
        temperature: 0.8,
        onStatus: (msg) => setGenStatus(msg)
      });
      setCaptions(prev => ({ ...prev, [item.date]: text }));
      showToast('Caption berhasil di-generate!');
    } catch (err) {
      setCaptions(prev => ({ ...prev, [item.date]: `Gagal generate: ${err.message}` }));
      showToast(`Gagal generate: ${err.message}`, 'error');
    } finally {
      setGenLoadingDate(null);
      setGenStatus('');
    }
  };

  const handleCopyCaption = (date) => {
    const text = captions[date];
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('Caption disalin ke clipboard!');
  };

  const angles = [
    'Pain point',
    'Education',
    'Demo',
    'Use case',
    'Feature',
    'Proof/Testimonial',
    'Offer/CTA'
  ];

  const filteredItems = dailyProducts.filter(item => {
    if (selectedAngle !== 'ALL' && item.content_angle !== selectedAngle) {
      return false;
    }
    return true;
  });

  const handleStartEdit = (item) => {
    setEditingDate(item.date);
    setUrlDraft(item.published_url || '');
    setNotesDraft(item.notes || '');
  };

  const handleSaveEdit = (date, isPublished) => {
    updateDailyProduct(date, isPublished, urlDraft, notesDraft);
    setEditingDate(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={20} color="var(--color-social)" />
              <span>Daily Social Studio: TikTok & Threads Tracker</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Rotasi 7 sudut konten harian untuk ModulAjar Online & BuatSoal Online (Min. 1 post/hari)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: hasGeminiKeys ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: hasGeminiKeys ? 'var(--color-revenue)' : '#EF4444',
                border: `1px solid ${hasGeminiKeys ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                cursor: 'pointer'
              }}
              onClick={() => setShowSettingsModal(true)}
              title="Klik untuk kelola API Keys"
            >
              <Key size={12} />
              {hasGeminiKeys ? `${loadGeminiKeys().length} Gemini Key Aktif` : 'Tambah Gemini API Key'}
            </span>
            <span className="badge badge-channel-social font-mono">
              Published: {dailyProducts.filter(d => d.is_published).length} / 91
            </span>
          </div>
        </div>

        {/* 7 ANGLE PILLS FILTER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
          <button
            onClick={() => setSelectedAngle('ALL')}
            className={`badge ${selectedAngle === 'ALL' ? 'badge-p2' : 'badge-planned'}`}
            style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
          >
            Semua Sudut ({dailyProducts.length})
          </button>
          {angles.map(angle => (
            <button
              key={angle}
              onClick={() => setSelectedAngle(angle)}
              className={`badge ${selectedAngle === angle ? 'badge-p2' : 'badge-planned'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
            >
              {angle}
            </button>
          ))}
        </div>
      </div>

      {/* LIST OF 91 DAYS PRODUCT CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filteredItems.map(item => {
          const isSelected = item.date === selectedDate;
          const isPublished = item.is_published;
          const isEditing = editingDate === item.date;

          return (
            <div
              key={item.id}
              className="os-card-elevated"
              style={{
                borderColor: isSelected ? 'var(--color-social)' : (isPublished ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.date}
                    </span>
                    <span className="badge badge-channel-membership font-mono" style={{ fontSize: '10px' }}>
                      W{item.week_number}
                    </span>
                  </div>

                  <span className="badge badge-channel-social" style={{ fontSize: '10px' }}>
                    {item.content_angle}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.recommended_product}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Kampanye: {item.campaign_focus}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)', padding: '5px 8px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
                  CTA: {item.cta}
                </div>

                {/* AI CAPTION PANEL */}
                {aiPanelDate === item.date && (
                  <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={10} color="var(--color-revenue)" /> Caption AI
                      </span>
                      {captions[item.date] && (
                        <button
                          onClick={() => handleCopyCaption(item.date)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--color-revenue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontWeight: 700, padding: '0' }}
                        >
                          <Copy size={10} /> Salin
                        </button>
                      )}
                    </div>
                    {genLoadingDate === item.date ? (
                      <div style={{ background: '#0D131F', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '20px', height: '20px', border: '2px solid rgba(16, 185, 129, 0.2)', borderTopColor: 'var(--color-revenue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                        <span style={{ fontSize: '11px', color: 'var(--color-revenue)' }}>{genStatus || 'Generating...'}</span>
                      </div>
                    ) : (
                      <textarea
                        value={captions[item.date] || ''}
                        onChange={e => setCaptions(prev => ({ ...prev, [item.date]: e.target.value }))}
                        placeholder="Klik Generate untuk membuat caption..."
                        style={{ background: '#0D131F', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, minHeight: '100px', width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                    )}
                  </div>
                )}

                {/* PUBLISHED LINK IF EXISTS */}
                {item.published_url && !isEditing && (
                  <div style={{ fontSize: '11px', color: 'var(--color-revenue)', wordBreak: 'break-all', marginBottom: '10px' }}>
                    <a href={item.published_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-revenue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Buka Video Terbit</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* EDITING FORM */}
                {isEditing && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="url"
                      placeholder="URL TikTok / Threads..."
                      value={urlDraft}
                      onChange={e => setUrlDraft(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                    />
                    <input
                      type="text"
                      placeholder="Catatan hook / evaluasi..."
                      value={notesDraft}
                      onChange={e => setNotesDraft(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleSaveEdit(item.date, true)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '6px', fontSize: '11px' }}
                      >
                        Simpan & Tandai Tayang
                      </button>
                      <button
                        onClick={() => setEditingDate(null)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => updateDailyProduct(item.date, !isPublished)}
                  className={`badge ${isPublished ? 'badge-done' : 'badge-planned'}`}
                  style={{ border: 'none', cursor: 'pointer', padding: '6px 10px', fontSize: '11px' }}
                >
                  {isPublished ? 'Sudah Tayang (Published ✓)' : 'Belum Tayang'}
                </button>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => setAiPanelDate(aiPanelDate === item.date ? null : item.date)}
                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--color-revenue)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Generate Caption dengan Gemini AI"
                  >
                    <Sparkles size={12} />
                    <span>AI</span>
                  </button>
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(item)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {item.published_url ? 'Ubah Link' : '+ Tambah Link'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </div>
  );
}
