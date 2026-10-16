import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  video: {
    autoRecordMp4: true,
    autoRecordMse: true,
    autoDetectHls: true,
    idleTimeoutMs: 30000,
    recordQuality: 'best',
    autoMergeOnIdle: true,
    maxCacheGB: 50,
    cleanupDays: 30,
  },
  downloads: {
    concurrent: 3,
    maxSpeedMBps: 0,
    saveDir: '/home/user/Downloads/ChromiumClone',
    askWhereToSave: false,
  },
  vpn: {
    autoConnect: false,
    killSwitch: false,
    defaultConf: 'ProtonVPN-Free-NL.conf',
  },
  passwords: {
    enabled: true,
    autoFill: true,
    autoSave: true,
    lockTimeoutMin: 10,
  },
  sync: {
    enabled: false,
    provider: 'webdav',
    webdav: {
      url: 'https://cloud.nextcloud.com/remote.php/dav/files/user',
      username: 'cloud_user',
      password: '',
      remoteDir: '/chromium-clone',
      autoSyncMin: 30,
    },
  },
  ui: {
    theme: 'dark',
    locale: 'ar',
    blockAds: true,
    blockTrackers: true,
    doNotTrack: true,
  },
  extensions: {
    enabled: true,
    paths: ['/extensions/adblocker-pro', '/extensions/dark-reader'],
  },
};

const SETTINGS_KEY = 'chromium_clone_settings_v3';

function deepMerge(base: any, override: any): any {
  if (!override) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(override)) {
    if (override[k] && typeof override[k] === 'object' && !Array.isArray(override[k])) {
      out[k] = deepMerge(base[k] || {}, override[k]);
    } else if (override[k] !== undefined) {
      out[k] = override[k];
    }
  }
  return out;
}

class SettingsStore {
  private current: AppSettings;
  private listeners = new Set<(s: AppSettings) => void>();

  constructor() {
    this.current = this.load();
  }

  public load(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.current = deepMerge(DEFAULT_SETTINGS, parsed);
        return this.current;
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage, using defaults', e);
    }
    this.current = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.save();
    return this.current;
  }

  public save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.current));
      this.listeners.forEach(cb => cb(this.current));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  public getAll(): AppSettings {
    return { ...this.current };
  }

  public get<T = any>(keyPath: string): T {
    const parts = keyPath.split('.');
    let node: any = this.current;
    for (const p of parts) {
      if (node == null) return undefined as any;
      node = node[p];
    }
    return node;
  }

  public set(keyPath: string, value: any) {
    const parts = keyPath.split('.');
    let node: any = this.current;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof node[parts[i]] !== 'object' || node[parts[i]] == null) {
        node[parts[i]] = {};
      }
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
    this.save();
  }

  public reset(sectionKey?: keyof AppSettings): AppSettings {
    if (sectionKey) {
      this.current[sectionKey] = JSON.parse(JSON.stringify(DEFAULT_SETTINGS[sectionKey]));
    } else {
      this.current = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
    this.save();
    return this.getAll();
  }

  public subscribe(cb: (s: AppSettings) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const settingsStore = new SettingsStore();
