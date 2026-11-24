/**
 * AssoMultiplayer TGS 2026 - Unified Sync & State Engine (v2)
 * Works 100% locally (offline/same-browser via BroadcastChannel + localStorage)
 * AND syncs across devices/networks when internet is available via Google Apps Script!
 */

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycby6GdH-SOFNLFZPr09gXnguqajQazjOoJnOwParsjnlk0kwEuVm2gzS0q-uXgvHbhfE9g/exec';
const ASSO_FALLBACK_LOGO = 'assets/NewLogoMP_Seri1coul_Noir.png';

const TGSSync = {
  channel: ('BroadcastChannel' in window) ? new BroadcastChannel('assomultiplayer_tgs_2026') : null,

  parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const normalized = String(timeStr).trim().toLowerCase().replace('h', ':');
    const parts = normalized.split(':').map(Number);
    const h = Number.isFinite(parts[0]) ? parts[0] : 0;
    const m = Number.isFinite(parts[1]) ? parts[1] : 0;
    return h * 60 + m;
  },

  resolveEventLogo(ev) {
    if (ev && typeof ev.logo === 'string' && ev.logo.trim() !== '') {
      return ev.logo.trim();
    }
    if (ev && ev.hosts && typeof defaultHostLogos !== 'undefined') {
      const hostStr = String(ev.hosts).toLowerCase();
      for (const [hostKey, logoPath] of Object.entries(defaultHostLogos)) {
        if (logoPath && hostStr.includes(hostKey.toLowerCase())) {
          return logoPath.trim();
        }
      }
    }
    return ASSO_FALLBACK_LOGO;
  },

  getScriptUrl() {
    return localStorage.getItem('tgs_gas_url') || DEFAULT_GAS_URL;
  },

  setScriptUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem('tgs_gas_url', url.trim());
    } else {
      localStorage.removeItem('tgs_gas_url');
    }
  },

  getPublicBaseUrl() {
    const saved = localStorage.getItem('tgs_public_base_url');
    if (saved && saved.trim()) return saved.trim().replace(/\/$/, '');
    if (window.location.protocol.startsWith('http')) {
      return window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    }
    return '';
  },

  setPublicBaseUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem('tgs_public_base_url', url.trim().replace(/\/$/, ''));
    } else {
      localStorage.removeItem('tgs_public_base_url');
    }
  },

  broadcast(type, payload = {}) {
    if (this.channel) {
      this.channel.postMessage({ type, payload, ts: Date.now() });
    }
    localStorage.setItem('tgs_last_ping', JSON.stringify({ type, ts: Date.now() }));
  },

  onUpdate(callback) {
    if (this.channel) {
      this.channel.onmessage = (e) => callback(e.data.type, e.data.payload);
    }
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('tgs_')) {
        callback(e.key, null);
      }
    });
  },

  getEvents() {
    const saved = localStorage.getItem('tgs_custom_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (typeof events !== 'undefined') ? events.map(e => ({ ...e })) : [];
  },

  saveEvents(list) {
    const sorted = [...list].sort((a, b) => {
      if (a.day !== b.day) return a.day === 'Saturday' ? -1 : 1;
      return this.parseTimeToMinutes(a.startTime) - this.parseTimeToMinutes(b.startTime);
    });
    localStorage.setItem('tgs_custom_events', JSON.stringify(sorted));
    this.broadcast('events_updated', sorted);
    this.pushCloudState({ action: 'save_schedule', events: sorted });
    return sorted;
  },

  getOverlayState() {
    const defaultState = {
      mode: 'AUTO',
      manualEventId: null,
      showTicker: true,
      announcement: typeof defaultAnnouncement !== 'undefined' ? defaultAnnouncement : '',
      showQR: false
    };
    try {
      const saved = JSON.parse(localStorage.getItem('tgs_overlay_state') || '{}');
      return { ...defaultState, ...saved };
    } catch (e) {
      return defaultState;
    }
  },

  setOverlayState(patch) {
    const current = this.getOverlayState();
    const next = { ...current, ...patch };
    localStorage.setItem('tgs_overlay_state', JSON.stringify(next));
    localStorage.setItem('tgs_broadcast_announcement', next.announcement || '');
    this.broadcast('overlay_updated', next);
    this.pushCloudState({ action: 'save_overlay', overlay: next });
    return next;
  },

  triggerSound(soundId, volume = 0.85) {
    const cmd = { id: Date.now() + Math.random(), soundId, volume, ts: Date.now() };
    localStorage.setItem('tgs_sound_trigger', JSON.stringify(cmd));
    this.broadcast('play_sound', cmd);
  },

  triggerTimer(seconds) {
    const cmd = { id: Date.now(), action: 'START', seconds, ts: Date.now() };
    localStorage.setItem('tgs_timer_trigger', JSON.stringify(cmd));
    this.broadcast('timer_cmd', cmd);
  },

  stopTimer() {
    const cmd = { id: Date.now(), action: 'STOP', ts: Date.now() };
    localStorage.setItem('tgs_timer_trigger', JSON.stringify(cmd));
    this.broadcast('timer_cmd', cmd);
  },

  getLocalPhotos() {
    try {
      return JSON.parse(localStorage.getItem('tgsOfflineQueue') || '[]');
    } catch (e) {
      return [];
    }
  },

  getStatsCache() {
    try {
      return JSON.parse(localStorage.getItem('tgs_photo_stats_cache') || 'null');
    } catch (e) {
      return null;
    }
  },

  async pushCloudState(payload) {
    const url = this.getScriptUrl();
    if (!url || !navigator.onLine) return false;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  async fetchCloudData(type = 'all') {
    const url = this.getScriptUrl();
    if (!url || !navigator.onLine) return null;
    try {
      const res = await fetch(`${url}?action=${encodeURIComponent(type)}&_t=${Date.now()}`, {
        method: 'GET',
        redirect: 'follow'
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.photoStats) {
        localStorage.setItem('tgs_photo_stats_cache', JSON.stringify(data.photoStats));
      }
      if (data && Array.isArray(data.registrations)) {
        const localRegs = JSON.parse(localStorage.getItem('tgsRegistrations') || '[]');
        const map = new Map();
        [...localRegs, ...data.registrations].forEach(r => {
          const key = r.id || `${r.event}_${r.pseudo}_${r.timestamp}`;
          map.set(key, r);
        });
        localStorage.setItem('tgsRegistrations', JSON.stringify(Array.from(map.values())));
      }
      if (data && Array.isArray(data.events) && data.events.length > 0 && !localStorage.getItem('tgs_custom_events_dirty')) {
        localStorage.setItem('tgs_custom_events', JSON.stringify(data.events));
      }
      return data;
    } catch (e) {
      return null;
    }
  }
};
