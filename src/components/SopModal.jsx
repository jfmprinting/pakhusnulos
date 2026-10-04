import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, CheckCircle, Zap, Target, BookOpen } from 'lucide-react';

export default function SopModal() {
  const { showSopModal, setShowSopModal } = useApp();

  if (!showSopModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowSopModal(false)}>
      <div className="os-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90dvh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--color-revenue)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Panduan Operasional & Aturan Emas 90 Hari</h2>
          </div>
          <button onClick={() => setShowSopModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
          <div className="os-card-elevated" style={{ borderLeft: '3px solid var(--color-revenue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-revenue)', marginBottom: '4px' }}>
              <Target size={16} />
              <span>PRINSIP TUNGGAL: JANGAN MENAMBAH PEKERJAAN</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              1 Weekly Theme mengalir serentak ke Revenue + YouTube + Social + WA + Sumber Belajar + Apps. Jangan pernah membuat kalender produksi terpisah.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Hirarki Prioritas Eksekusi
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <div style={{ background: 'var(--p0-bg)', border: '1px solid var(--p0-border)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <span className="badge badge-p0" style={{ marginBottom: '6px' }}>P0 - CRITICAL</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>Revenue Harian + YouTube Jadwal Tetap</p>
              </div>
              <div style={{ background: 'var(--p1-bg)', border: '1px solid var(--p1-border)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <span className="badge badge-p1" style={{ marginBottom: '6px' }}>P1 - HIGH</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>WA Nurturing + Repurpose Konten</p>
              </div>
              <div style={{ background: 'var(--p2-bg)', border: '1px solid var(--p2-border)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <span className="badge badge-p2" style={{ marginBottom: '6px' }}>P2 - MEDIUM</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>Signature Membership Asset</p>
              </div>
            </div>
          </div>

          <div className="os-card-elevated">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-youtube)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} />
              <span>Cadence Ketat YouTube (Tanpa Penambahan Slot)</span>
            </h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Selasa:</strong> Long-form #1 (Tutorial / Build in public)</li>
              <li><strong>Rabu:</strong> Shorts #1 (Potongan dari Long-form #1)</li>
              <li><strong>Jumat:</strong> Long-form #2 (Deep workflow / Studi kasus)</li>
              <li><strong>Sabtu:</strong> Shorts #2 (Potongan dari Long-form #2)</li>
              <li><strong>Minggu:</strong> Live Session interaktif</li>
              <li><strong>Senin & Kamis:</strong> Dilarang jadwalkan video YouTube baru. Fokus distribusi.</li>
            </ul>
          </div>

          <div className="os-card-elevated" style={{ borderLeft: '3px solid #EF4444' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#F87171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} />
              <span>Aturan Tegas "Do Not Do"</span>
            </h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Jangan membuat kalender YouTube di luar jadwal source plan.</li>
              <li>Jangan membuat Sumber Belajar sebagai beban produksi baru (80%+ harus repurpose).</li>
              <li>Default campaign adalah harga normal + value bonus (hindari diskon sembarangan).</li>
              <li>Jangan spam broadcast WhatsApp; sesuaikan ritme pool publik vs tertutup.</li>
            </ul>
          </div>

          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <button className="btn-primary" onClick={() => setShowSopModal(false)}>
              Saya Paham & Siap Eksekusi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
