import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  RotateCcw,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function RevenueSimulatorView() {
  const { showToast } = useApp();

  // Excel Default Parameters
  const defaultParams = {
    targetNetPerDay: 500000,
    daysPerMonth: 30,
    aiSubPerProd: 350000,
    numHeroProducts: 2,
    domainPerProdYear: 250000,
    affiliateCommRate: 0.40,
    affiliateGrossShare: 0.25,
    p1Price: 149000,
    p1Mix: 0.40,
    p2Price: 149000,
    p2Mix: 0.40,
    p3Price: 249000,
    p3Mix: 0.20
  };

  const [params, setParams] = useState(defaultParams);

  const handleReset = () => {
    setParams(defaultParams);
    showToast('Parameter dikembalikan ke nilai default Excel');
  };

  // Live Formula Calculations
  const targetNetMonth = params.targetNetPerDay * params.daysPerMonth;
  const fixedCostMonth = Math.round(
    params.aiSubPerProd * params.numHeroProducts +
    (params.domainPerProdYear * params.numHeroProducts / 12)
  );
  const retainedFactor = 1 - (params.affiliateCommRate * params.affiliateGrossShare);
  const targetGrossMonth = Math.round((targetNetMonth + fixedCostMonth) / retainedFactor);
  const targetGrossWeek = Math.round((targetGrossMonth / params.daysPerMonth) * 7);

  const weightedAov = Math.round(
    (params.p1Price * params.p1Mix) +
    (params.p2Price * params.p2Mix) +
    (params.p3Price * params.p3Mix)
  );

  const txPerMonth = weightedAov > 0 ? (targetGrossMonth / weightedAov).toFixed(1) : 0;
  const txPerDay = (txPerMonth / params.daysPerMonth).toFixed(2);
  const txPerWeek = (txPerDay * 7).toFixed(1);

  // Targets per Phase calculations
  const calcPhaseGrossWeek = (netDay) => {
    const netWeek = netDay * 7;
    const fixedWeek = (fixedCostMonth / params.daysPerMonth) * 7;
    return Math.round((netWeek + fixedWeek) / retainedFactor);
  };

  const p1GrossWeek = calcPhaseGrossWeek(350000);
  const p2GrossWeek = calcPhaseGrossWeek(425000);
  const p3GrossWeek = calcPhaseGrossWeek(500000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div className="os-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} color="var(--color-revenue)" />
              <span>Interactive Revenue & Economic Simulator (Roadmap 500K)</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Eksperimen dinamis: uji perubahan harga, bauran produk, komisi affiliate, dan target net
            </p>
          </div>

          <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '12px' }}>
            <RotateCcw size={14} />
            <span>Reset Nilai Default</span>
          </button>
        </div>
      </div>

      {/* SPLIT SCREEN: INPUTS VS RESULTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

        {/* LEFT COLUMN: PARAMETER CONTROLS */}
        <div className="os-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            Input & Asumsi Finansial
          </h2>

          {/* TARGET BERSIH / HARI */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target Bersih / Hari:</span>
              <strong className="font-mono" style={{ color: 'var(--color-revenue)' }}>
                Rp {params.targetNetPerDay.toLocaleString('id-ID')}
              </strong>
            </div>
            <input
              type="range"
              min="200000"
              max="1500000"
              step="25000"
              value={params.targetNetPerDay}
              onChange={e => setParams({ ...params, targetNetPerDay: parseInt(e.target.value) })}
            />
          </div>

          {/* KOMISI AFFILIATE */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Komisi Affiliate (%):</span>
              <strong className="font-mono">
                {Math.round(params.affiliateCommRate * 100)} %
              </strong>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.60"
              step="0.05"
              value={params.affiliateCommRate}
              onChange={e => setParams({ ...params, affiliateCommRate: parseFloat(e.target.value) })}
            />
          </div>

          {/* PORSI GROSS DARI AFFILIATE */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Porsi Penjualan dr Affiliate:</span>
              <strong className="font-mono">
                {Math.round(params.affiliateGrossShare * 100)} %
              </strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={params.affiliateGrossShare}
              onChange={e => setParams({ ...params, affiliateGrossShare: parseFloat(e.target.value) })}
            />
          </div>

          {/* LANGGANAN AI PER BULAN */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Langganan AI / Produk / Bulan:</span>
              <strong className="font-mono">
                Rp {params.aiSubPerProd.toLocaleString('id-ID')}
              </strong>
            </div>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={params.aiSubPerProd}
              onChange={e => setParams({ ...params, aiSubPerProd: parseInt(e.target.value) })}
            />
          </div>

          {/* HERO PRODUCTS PRICING & MIX */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bauran Hero Product (Product Mix)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div className="os-card-elevated" style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>ModulAjar Online (Rp {params.p1Price.toLocaleString('id-ID')})</span>
                  <span className="font-mono">{Math.round(params.p1Mix * 100)}%</span>
                </div>
                <div style={{ color: 'var(--color-revenue)', fontSize: '11px', textAlign: 'right' }}>
                  Kontribusi AOV: Rp {Math.round(params.p1Price * params.p1Mix).toLocaleString('id-ID')}
                </div>
              </div>

              <div className="os-card-elevated" style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>BuatSoal Online Pro (Rp {params.p2Price.toLocaleString('id-ID')})</span>
                  <span className="font-mono">{Math.round(params.p2Mix * 100)}%</span>
                </div>
                <div style={{ color: 'var(--color-revenue)', fontSize: '11px', textAlign: 'right' }}>
                  Kontribusi AOV: Rp {Math.round(params.p2Price * params.p2Mix).toLocaleString('id-ID')}
                </div>
              </div>

              <div className="os-card-elevated" style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>BuatSoal Online Max (Rp {params.p3Price.toLocaleString('id-ID')})</span>
                  <span className="font-mono">{Math.round(params.p3Mix * 100)}%</span>
                </div>
                <div style={{ color: 'var(--color-revenue)', fontSize: '11px', textAlign: 'right' }}>
                  Kontribusi AOV: Rp {Math.round(params.p3Price * params.p3Mix).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME CALCULATED RESULTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* MAIN RESULTS CARD */}
          <div className="os-card" style={{ borderTop: '4px solid var(--color-revenue)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color="var(--color-revenue)" />
              <span>Hasil Kalkulasi Ekonomi Otomatis</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              
              <div className="os-card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TARGET BERSIH / BULAN</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-revenue)' }}>
                  Rp {targetNetMonth.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>30 Hari Operasional</div>
              </div>

              <div className="os-card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TOTAL FIXED COST / BULAN</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#F87171' }}>
                  Rp {fixedCostMonth.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>AI Sub + Domain</div>
              </div>

              <div className="os-card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TARGET GROSS / BULAN</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>
                  Rp {targetGrossMonth.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Retained Factor: {(retainedFactor * 100).toFixed(1)}%</div>
              </div>

              <div className="os-card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TARGET GROSS / MINGGU</div>
                <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#FBBF24' }}>
                  Rp {targetGrossWeek.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Pekan Penuh</div>
              </div>

            </div>

            {/* TRANSACTIONS NEEDED BREAKDOWN */}
            <div className="os-card-elevated" style={{ background: '#0D131F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Analisis Kebutuhan Penjualan (AOV: Rp {weightedAov.toLocaleString('id-ID')}):
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', textAlign: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-revenue)' }}>{txPerDay}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Transaksi / Hari</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-revenue)' }}>{txPerWeek}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Transaksi / Pekan</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-revenue)' }}>{txPerMonth}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Transaksi / Bulan</div>
                </div>
              </div>
            </div>
          </div>

          {/* TARGET PER FASE TABLE */}
          <div className="os-card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Target Berdasarkan Fase Operasional:
            </h3>

            <div className="table-container">
              <table className="os-table">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Hari</th>
                    <th>Net / Hari</th>
                    <th>Net 30 Hari</th>
                    <th>Gross / Minggu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Fase 1</strong></td>
                    <td>Hari 1-30</td>
                    <td className="font-mono">Rp 350.000</td>
                    <td className="font-mono">Rp 10.500.000</td>
                    <td className="font-mono" style={{ color: 'var(--color-revenue)', fontWeight: 700 }}>
                      Rp {p1GrossWeek.toLocaleString('id-ID')}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Fase 2</strong></td>
                    <td>Hari 31-60</td>
                    <td className="font-mono">Rp 425.000</td>
                    <td className="font-mono">Rp 12.750.000</td>
                    <td className="font-mono" style={{ color: 'var(--color-revenue)', fontWeight: 700 }}>
                      Rp {p2GrossWeek.toLocaleString('id-ID')}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Fase 3</strong></td>
                    <td>Hari 61-90</td>
                    <td className="font-mono">Rp 500.000</td>
                    <td className="font-mono">Rp 15.000.000</td>
                    <td className="font-mono" style={{ color: 'var(--color-revenue)', fontWeight: 700 }}>
                      Rp {p3GrossWeek.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
