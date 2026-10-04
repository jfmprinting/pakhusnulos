// Gamification logic for Pak Husnul Master Content OS + Post & Cuan
export const XP_PER_POST = 10;
export const XP_PER_REVENUE = 5;
export const XP_PER_STREAK_DAY = 20;
export const XP_PER_LEVEL = 100;
export const XP_PER_FOCUS_5MIN = 1;

export function calculateLevel(totalXP) {
  const safeXP = Math.max(0, Number(totalXP) || 0);
  const level = Math.floor(safeXP / XP_PER_LEVEL) + 1;
  const currentXP = safeXP % XP_PER_LEVEL;
  const xpForNext = XP_PER_LEVEL;
  const progress = Math.min(100, Math.round((currentXP / xpForNext) * 100));
  return { level, currentXP, xpForNext, progress };
}

export const BADGES = [
  // Posting
  { id: 'first_post', name: 'Post Pertama', emoji: '🚀', description: 'Buat posting pertama kamu', category: 'posting' },
  { id: 'post_10', name: '10 Postingan', emoji: '🎯', description: 'Total 10 postingan', category: 'posting' },
  { id: 'post_50', name: '50 Postingan', emoji: '🔥', description: 'Total 50 postingan', category: 'posting' },
  { id: 'post_100', name: 'Century Post', emoji: '💯', description: 'Total 100 postingan', category: 'posting' },
  { id: 'post_500', name: 'Kreator Sejati', emoji: '👑', description: 'Total 500 postingan', category: 'posting' },
  { id: 'daily_target', name: 'Target Harian', emoji: '⭐', description: 'Capai target semua platform dalam 1 hari', category: 'posting' },
  // Streak
  { id: 'streak_3', name: '3 Hari Berturut', emoji: '⚡', description: 'Posting 3 hari berturut-turut', category: 'streak' },
  { id: 'streak_7', name: 'Seminggu Konsisten', emoji: '🏆', description: 'Posting 7 hari berturut-turut', category: 'streak' },
  { id: 'streak_14', name: '2 Minggu Nonstop', emoji: '🎖️', description: 'Posting 14 hari berturut-turut', category: 'streak' },
  { id: 'streak_30', name: 'Sebulan Penuh', emoji: '💎', description: 'Posting 30 hari berturut-turut', category: 'streak' },
  // Revenue
  { id: 'first_revenue', name: 'Cuan Pertama', emoji: '💰', description: 'Catat pendapatan pertama', category: 'revenue' },
  { id: 'revenue_100k', name: '100 Ribu', emoji: '💵', description: 'Total pendapatan 100 ribu', category: 'revenue' },
  { id: 'revenue_1m', name: 'Sejuta!', emoji: '💸', description: 'Total pendapatan 1 juta', category: 'revenue' },
  { id: 'revenue_10m', name: '10 Juta!', emoji: '🪙', description: 'Total pendapatan 10 juta', category: 'revenue' },
  // Special
  { id: 'level_5', name: 'Level 5', emoji: '🥉', description: 'Capai level 5', category: 'special' },
  { id: 'level_10', name: 'Level 10', emoji: '🥈', description: 'Capai level 10', category: 'special' },
  { id: 'level_25', name: 'Level 25', emoji: '🥇', description: 'Capai level 25', category: 'special' },
  { id: 'multi_platform', name: 'Multi Platform', emoji: '🌐', description: 'Punya 3+ platform aktif', category: 'special' },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Posting setelah jam 22:00', category: 'special' },
  { id: 'early_bird', name: 'Early Bird', emoji: '🌅', description: 'Posting sebelum jam 06:00', category: 'special' },
  { id: 'focus_first', name: 'Fokus Pertama', emoji: '⏱️', description: 'Selesaikan sesi fokus pertama', category: 'special' },
  { id: 'focus_10', name: '10 Sesi Fokus', emoji: '🧘', description: 'Selesaikan 10 sesi fokus', category: 'special' },
  { id: 'focus_master', name: 'Master Fokus', emoji: '🧠', description: 'Total 500 menit fokus', category: 'special' },
];

export function computeStats(logs = [], platforms = []) {
  const totalPosts = logs.reduce((sum, l) => {
    const p = l.posts || {};
    return sum + Object.values(p).reduce((s, v) => s + (Number(v) || 0), 0);
  }, 0);

  const totalRevenue = logs.reduce((sum, l) => sum + (Number(l.revenue) || 0), 0);

  // Calculate streak
  const sorted = [...logs]
    .filter(l => {
      const p = l.posts || {};
      return Object.values(p).reduce((s, v) => s + (Number(v) || 0), 0) > 0;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  let currentStreak = 0;
  if (sorted.length > 0) {
    const today = new Date();
    let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (const log of sorted) {
      const logDate = new Date(log.date + 'T00:00:00');
      const diff = Math.round((checkDate.getTime() - logDate.getTime()) / 86400000);
      if (diff <= 1) {
        currentStreak++;
        checkDate = logDate;
      } else {
        break;
      }
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr);
  const allTargetsMet = platforms.length > 0 && platforms.every(p => ((todayLog?.posts || {})[p.id] || 0) >= (p.daily_target || 1));

  return { totalPosts, totalRevenue, currentStreak, platformCount: platforms.length, allTargetsMet };
}

export function checkBadgeUnlock(stats, unlockedIds = []) {
  const newBadges = [];
  const check = (id, condition) => {
    if (condition && !unlockedIds.includes(id)) newBadges.push(id);
  };

  // Posting badges
  check('first_post', stats.totalPosts >= 1);
  check('post_10', stats.totalPosts >= 10);
  check('post_50', stats.totalPosts >= 50);
  check('post_100', stats.totalPosts >= 100);
  check('post_500', stats.totalPosts >= 500);
  check('daily_target', stats.allTargetsMet);

  // Streak badges
  check('streak_3', stats.currentStreak >= 3);
  check('streak_7', stats.currentStreak >= 7);
  check('streak_14', stats.currentStreak >= 14);
  check('streak_30', stats.currentStreak >= 30);

  // Revenue badges
  check('first_revenue', stats.totalRevenue > 0);
  check('revenue_100k', stats.totalRevenue >= 100000);
  check('revenue_1m', stats.totalRevenue >= 1000000);
  check('revenue_10m', stats.totalRevenue >= 10000000);

  // Special badges
  const { level } = calculateLevel(stats.totalXP || 0);
  check('level_5', level >= 5);
  check('level_10', level >= 10);
  check('level_25', level >= 25);
  check('multi_platform', stats.platformCount >= 3);

  return newBadges;
}
