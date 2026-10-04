import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Copy,
  ExternalLink,
  Users,
  Sparkles,
  Key,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import { generateWithGemini, loadGeminiKeys } from '../lib/geminiClient';

export default function WhatsAppStationView() {
  const {
    waPlaybook,
    showToast,
    activeDay,
    selectedDate,
    setShowSettingsModal,
    heroProducts
  } = useApp();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = activeDay ? activeDay.day_name : 'Monday';

  const [activeDayName, setActiveDayName] = useState(todayDayName);
  const [mobileTab, setMobileTab] = useState('public');

  // AI Content Generation State
  const [genLoadingPublic, setGenLoadingPublic] = useState(false);
  const [genLoadingClosed, setGenLoadingClosed] = useState(false);
  const [genStatusPublic, setGenStatusPublic] = useState('');
  const [genStatusClosed, setGenStatusClosed] = useState('');
  const [generatedPublic, setGeneratedPublic] = useState('');
  const [generatedClosed, setGeneratedClosed] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiContext, setAiContext] = useState('');

  const activePlaybook = waPlaybook.find(w => w.day_name.toLowerCase() === activeDayName.toLowerCase()) || waPlaybook[0];

  const hasGeminiKeys = loadGeminiKeys().length > 0;

  // Product context for AI
  const productNames = heroProducts.map(p => p.name).join(', ');

  const handleCopy = (text, poolName) => {
    if (!text) {
      showToast('Tidak ada teks untuk disalin', 'error');
      return;
    }
    navigator.clipboard.writeText(text);
    showToast(`Draf pesan untuk ${poolName} berhasil disalin!`);
  };

  const buildPromptPublic = () => {
    const day = activeDayName;
    const theme = activePlaybook?.public_pool_theme || 'edukasi AI untuk guru';
    const cta = activePlaybook?.typical_cta || 'lihat resource';
    const doNot = activePlaybook?.do_not_rule || 'Jangan hard sell';
    const products = productNames || 'ModulAjar Online, BuatSoal Online';
    const extra = aiContext ? `\n\nKonteks tambahan dari Pak Husnul:\n${aiContext}` : '';

    return `Kamu adalah Pak Husnul, seorang guru/kreator konten pendidikan Indonesia yang aktif di WhatsApp.
    
Tulis SATU pesan broadcast WhatsApp untuk komunitas PUBLIK "Guru Mahir AI" dengan spesifikasi:
- Hari: ${day}
- Fokus tema: ${theme}
- Call to Action yang diinginkan: ${cta}
- Produk yang dipromosikan (jika relevan): ${products}
- LARANGAN KERAS: ${doNot}
- Nada: Hangat, edukatif, solutif, seperti teman sesama guru
- Format: Bisa pakai emoji tapi jangan berlebihan. Panjang 3-5 kalimat. Bahasa Indonesia natural.
- JANGAN hard sell, JANGAN spam emoji, JANGAN menyebut harga secara langsung di pesan ini.
${extra}

Output HANYA isi pesan saja, tanpa label, tanpa penjelasan.`;
  };

  const buildPromptClosed = () => {
    const day = activeDayName;
    const theme = activePlaybook?.closed_pool_theme || 'strategi mendalam untuk member';
    const cta = activePlaybook?.typical_cta || 'diskusi di grup';
    const doNot = activePlaybook?.do_not_rule || 'Jangan over-post';
    const products = productNames || 'ModulAjar Online, BuatSoal Online';
    const extra = aiContext ? `\n\nKonteks tambahan dari Pak Husnul:\n${aiContext}` : '';

    return `Kamu adalah Pak Husnul, seorang guru/kreator konten pendidikan Indonesia yang aktif di WhatsApp.

Tulis SATU pesan broadcast WhatsApp untuk komunitas MEMBER TERTUTUP "Aidukasi" dengan spesifikasi:
- Hari: ${day}
- Fokus tema LEBIH DALAM: ${theme}
- Call to Action: ${cta}
- Produk yang bisa disinggung (jika relevan): ${products}
- LARANGAN KERAS: ${doNot}
- Nada: Eksklusif, lebih personal, seperti ngobrol dengan orang dalam komunitas
- Format: 3-6 kalimat. Bahasa Indonesia natural. Boleh lebih teknis dari pesan publik.
- Boleh sedikit lebih direct (tapi tetap hangat, bukan hard sell kasar).
${extra}

Output HANYA isi pesan saja, tanpa label, tanpa penjelasan.`;
  };

  const handleGeneratePublic = async () => {
    if (!hasGeminiKeys) {
      showToast('Tambahkan Gemini API Key dulu di Pengaturan > API Keys', 'error');
      setShowSettingsModal(true);
      return;
    }

    setGenLoadingPublic(true);
    setGenStatusPublic('Menyiapkan prompt...');
    setGeneratedPublic('');

    try {
      const text = await generateWithGemini(buildPromptPublic(), {
        temperature: 0.75,
        onStatus: (msg) => setGenStatusPublic(msg),
      });
      setGeneratedPublic(text);
      showToast('Pesan Guru Mahir AI berhasil di-generate!');
    } catch (err) {
      showToast(`Gagal: ${err.message}`, 'error');
    } finally {
      setGenLoadingPublic(false);
      setGenStatusPublic('');
    }
  };

  const handleGenerateClosed = async () => {
    if (!hasGeminiKeys) {
      showToast('Tambahkan Gemini API Key dulu di Pengaturan > API Keys', 'error');
      setShowSettingsModal(true);
      return;
    }

    setGenLoadingClosed(true);
    setGenStatusClosed('Menyiapkan prompt...');
    setGeneratedClosed('');

    try {
      const text = await generateWithGemini(buildPromptClosed(), {
        temperature: 0.75,
        onStatus: (msg) => setGenStatusClosed(msg),
      });
      setGeneratedClosed(text);
      showToast('Pesan Aidukasi Member berhasil di-generate!');
    } catch (err) {
      showToast(`Gagal: ${err.message}`, 'error');
    } finally {
      setGenLoadingClosed(false);
      setGenStatusClosed('');
    }
  };

  const publicDraft = generatedPublic || (activePlaybook ? activePlaybook.sample_template_public : '');
  const closedDraft = generatedClosed || (activePlaybook ? activePlaybook.sample_template_closed : '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER & DAY SELECTOR */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="var(--color-wa)" />
              <span>WhatsApp Distribution Command Station</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Ritme harian terpisah untuk Guru Mahir AI (Publik/Warm) vs Aidukasi (Closed/Warmer Member)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* AI KEY STATUS */}
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

            <a
              href="https://web.whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-wa"
              style={{ textDecoration: 'none' }}
            >
              <span>Buka WhatsApp Web</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* 7 DAYS BUTTONS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {daysOfWeek.map(day => {
            const isDaySelected = activeDayName.toLowerCase() === day.toLowerCase();
            const isToday = activeDay && activeDay.day_name.toLowerCase() === day.toLowerCase();

            return (
              <button
                key={day}
                onClick={() => {
                  setActiveDayName(day);
                  setGeneratedPublic('');
                  setGeneratedClosed('');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isDaySelected ? 'var(--color-wa)' : 'var(--bg-surface-elevated)',
                  color: isDaySelected ? '#052E16' : 'var(--text-primary)',
                  fontWeight: isDaySelected ? 700 : 500,
                  fontSize: '12px',
                  border: isDaySelected ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <span>{day}</span>
                {isToday && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isDaySelected ? '#052E16' : '#22C55E' }}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI CONTEXT PANEL (COLLAPSIBLE) */}
        <button
          onClick={() => setShowAiPanel(!showAiPanel)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-revenue)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '0'
          }}
        >
          <Sparkles size={14} />
          <span>Konteks Tambahan untuk AI (Opsional)</span>
          {showAiPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAiPanel && (
          <div style={{ marginTop: '8px' }}>
            <textarea
              rows="2"
              value={aiContext}
              onChange={e => setAiContext(e.target.value)}
              placeholder="mis: Hari ini ada promo akhir bulan, atau ada update fitur baru di ModulAjar, atau sedang fokus ke konten bilangan..."
              className="input-field"
              style={{ width: '100%', fontSize: '12px', resize: 'vertical' }}
            />
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
              Konteks ini akan disertakan ke prompt AI saat generate. Kosongkan jika tidak perlu.
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SEGMENTED TAB SWITCHER */}
      <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }} className="mobile-tabs-container">
        <button
          onClick={() => setMobileTab('public')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: mobileTab === 'public' ? 'rgba(34, 197, 94, 0.18)' : 'transparent',
            color: mobileTab === 'public' ? '#4ADE80' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Guru Mahir AI (Publik)
        </button>
        <button
          onClick={() => setMobileTab('closed')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: mobileTab === 'closed' ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
            color: mobileTab === 'closed' ? '#FBBF24' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Aidukasi (Member)
        </button>
      </div>

      {/* DUAL POOL CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

        {/* POOL 1: GURU MAHIR AI (PUBLIC) */}
        <div
          className="os-card"
          style={{
            borderTop: '4px solid var(--color-wa)',
            display: (mobileTab === 'public' || window.innerWidth >= 768) ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-channel-wa font-mono" style={{ marginBottom: '4px' }}>
                  Public / Warm Pool
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Komunitas Guru Mahir AI
                </h2>
              </div>
              <Users size={20} color="var(--color-wa)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '14px' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Fokus Hari Ini:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {activePlaybook ? activePlaybook.public_pool_theme : ''}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Tujuan Pesan:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activePlaybook ? activePlaybook.purpose : ''}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Typical Call to Action:</strong>
                <p style={{ color: '#4ADE80', marginTop: '2px', fontWeight: 600 }}>
                  {activePlaybook ? activePlaybook.typical_cta : ''}
                </p>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', color: '#FCA5A5', fontSize: '12px' }}>
                <strong>Peringatan Tegas (Do Not):</strong> {activePlaybook ? activePlaybook.do_not_rule : 'Jangan hard sell'}
              </div>
            </div>

            {/* MESSAGE DRAFT BOX */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Draf Pesan Broadcast Siap Kirim:</span>
                {generatedPublic && (
                  <span style={{ fontSize: '10px', color: 'var(--color-revenue)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={10} /> Generated by AI
                  </span>
                )}
              </div>

              {genLoadingPublic ? (
                <div style={{ background: '#0D131F', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '16px', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(16, 185, 129, 0.2)', borderTopColor: 'var(--color-revenue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  <span style={{ fontSize: '12px', color: 'var(--color-revenue)' }}>{genStatusPublic || 'Generating...'}</span>
                </div>
              ) : (
                <textarea
                  value={publicDraft}
                  onChange={e => setGeneratedPublic(e.target.value)}
                  style={{
                    background: '#0D131F',
                    border: `1px solid ${generatedPublic ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    minHeight: '120px',
                    width: '100%',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            {/* AI GENERATE BUTTON */}
            <button
              onClick={handleGeneratePublic}
              disabled={genLoadingPublic}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--color-revenue)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: genLoadingPublic ? 'not-allowed' : 'pointer',
                opacity: genLoadingPublic ? 0.6 : 1
              }}
            >
              {genLoadingPublic ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={14} />}
              <span>{genLoadingPublic ? 'Generating...' : 'Generate Versi Baru dengan Gemini AI'}</span>
            </button>

            <button
              onClick={() => handleCopy(publicDraft, 'Guru Mahir AI')}
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              <Copy size={16} />
              <span>Salin Draf Pesan Guru Mahir AI</span>
            </button>
          </div>
        </div>

        {/* POOL 2: AIDUKASI (CLOSED MEMBER) */}
        <div
          className="os-card"
          style={{
            borderTop: '4px solid var(--color-membership)',
            display: (mobileTab === 'closed' || window.innerWidth >= 768) ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-channel-membership font-mono" style={{ marginBottom: '4px' }}>
                  Closed / Warmer Pool
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Komunitas Member Aidukasi
                </h2>
              </div>
              <Users size={20} color="var(--color-membership)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '14px' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Fokus Hari Ini:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {activePlaybook ? activePlaybook.closed_pool_theme : ''}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Tujuan Pesan:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activePlaybook ? activePlaybook.purpose : ''} (Deeper Context)
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Typical Call to Action:</strong>
                <p style={{ color: '#FBBF24', marginTop: '2px', fontWeight: 600 }}>
                  {activePlaybook ? activePlaybook.typical_cta : ''}
                </p>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', color: '#FDE68A', fontSize: '12px' }}>
                <strong>Peringatan Tegas (Do Not):</strong> {activePlaybook ? activePlaybook.do_not_rule : 'Jangan over-post'}
              </div>
            </div>

            {/* MESSAGE DRAFT BOX */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Draf Pesan Broadcast Siap Kirim:</span>
                {generatedClosed && (
                  <span style={{ fontSize: '10px', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={10} /> Generated by AI
                  </span>
                )}
              </div>

              {genLoadingClosed ? (
                <div style={{ background: '#0D131F', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', padding: '16px', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(245, 158, 11, 0.2)', borderTopColor: '#FBBF24', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  <span style={{ fontSize: '12px', color: '#FBBF24' }}>{genStatusClosed || 'Generating...'}</span>
                </div>
              ) : (
                <textarea
                  value={closedDraft}
                  onChange={e => setGeneratedClosed(e.target.value)}
                  style={{
                    background: '#0D131F',
                    border: `1px solid ${generatedClosed ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    minHeight: '120px',
                    width: '100%',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            {/* AI GENERATE BUTTON */}
            <button
              onClick={handleGenerateClosed}
              disabled={genLoadingClosed}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#FBBF24',
                fontWeight: 700,
                fontSize: '12px',
                cursor: genLoadingClosed ? 'not-allowed' : 'pointer',
                opacity: genLoadingClosed ? 0.6 : 1
              }}
            >
              {genLoadingClosed ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={14} />}
              <span>{genLoadingClosed ? 'Generating...' : 'Generate Versi Baru dengan Gemini AI'}</span>
            </button>

            <button
              onClick={() => handleCopy(closedDraft, 'Aidukasi Member')}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              <Copy size={16} color="var(--color-membership)" />
              <span>Salin Draf Pesan Member Aidukasi</span>
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </div>
  );
}
