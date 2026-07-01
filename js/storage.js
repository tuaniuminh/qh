// ============================================================
// STORAGE.JS - Quản lý dữ liệu LocalStorage
// ============================================================

const Storage = {
  KEY_STATS: 'mc_stats',
  KEY_LOG: 'mc_log',
  KEY_SETTINGS: 'mc_settings',
  KEY_PROGRESS: 'mc_progress',

  getStats() {
    return JSON.parse(localStorage.getItem(this.KEY_STATS) || JSON.stringify({
      totalSessions: 0,
      totalMinutes: 0,
      avgControlLevel: 0,
      streak: 0,
      lastDate: null,
      kegelDays: 0,
      bestSession: 0
    }));
  },

  saveStats(stats) {
    localStorage.setItem(this.KEY_STATS, JSON.stringify(stats));
  },

  addSession(data) {
    const stats = this.getStats();
    const today = new Date().toDateString();

    stats.totalSessions++;
    stats.totalMinutes += Math.round(data.duration / 60);
    if (data.duration > stats.bestSession) stats.bestSession = data.duration;

    if (stats.lastDate !== today) {
      if (stats.lastDate === new Date(Date.now() - 86400000).toDateString()) {
        stats.streak++;
      } else {
        stats.streak = 1;
      }
      stats.lastDate = today;
    }

    this.saveStats(stats);
    this.addLog(data);
  },

  getLog() {
    return JSON.parse(localStorage.getItem(this.KEY_LOG) || '[]');
  },

  addLog(entry) {
    const log = this.getLog();
    log.unshift({ ...entry, date: new Date().toISOString() });
    if (log.length > 30) log.pop();
    localStorage.setItem(this.KEY_LOG, JSON.stringify(log));
  },

  getSettings() {
    return JSON.parse(localStorage.getItem(this.KEY_SETTINGS) || JSON.stringify({
      haptic: true,
      sound: true,
      darkMode: true,
      level: 'beginner'
    }));
  },

  saveSettings(s) {
    localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(s));
  },

  getProgress() {
    return JSON.parse(localStorage.getItem(this.KEY_PROGRESS) || JSON.stringify({
      theoryRead: [],
      kegelSessions: 0,
      kegelMinutes: 0
    }));
  },

  markTheoryRead(id) {
    const p = this.getProgress();
    if (!p.theoryRead.includes(id)) p.theoryRead.push(id);
    localStorage.setItem(this.KEY_PROGRESS, JSON.stringify(p));
  },

  addKegelSession(minutes) {
    const p = this.getProgress();
    p.kegelSessions++;
    p.kegelMinutes += minutes;
    localStorage.setItem(this.KEY_PROGRESS, JSON.stringify(p));
  }
};
