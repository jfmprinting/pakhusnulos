// Utility functions for string sanitation and anti-slop rules
export function cleanDash(str) {
  if (!str) return '';
  return String(str).replace(/[\u2013\u2014\u2015]/g, '-').trim();
}

export function formatRp(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(n) || 0);
}
