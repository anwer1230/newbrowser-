export type VideoKind = 'progressive' | 'mse' | 'hls' | 'sync';
export type VideoStatus = 'recording' | 'complete' | 'pending-download' | 'error';

export interface VideoItem {
  id: string;
  url: string;
  pageUrl: string;
  title: string;
  mime: string;
  kind: VideoKind;
  duration: number;
  watched_seconds: number;
  bytes_cached: number;
  total_bytes: number;
  file_path: string;
  status: VideoStatus;
  created_at: number;
  updated_at: number;
  thumb?: string;
  streamUrl?: string;
}

export type DownloadType = 'mp4' | 'hls' | 'mse';
export type DownloadStatus = 'pending' | 'active' | 'paused' | 'done' | 'error' | 'cancelled';

export interface DownloadJob {
  id: string;
  type: DownloadType;
  title: string;
  url: string;
  filePath: string;
  totalBytes: number;
  receivedBytes: number;
  status: DownloadStatus;
  progress: number; // 0 to 1
  speed: number;    // bytes per sec
  startedAt: number;
  finishedAt: number;
  error?: string | null;
  createdAt: number;
}

export interface PasswordEntry {
  id: string;
  origin: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface VaultMetadata {
  hasVault: boolean;
  unlocked: boolean;
  mode: 'os' | 'password' | null;
  salt?: string;
  encryptedBlob?: string;
}

export interface ChromeExtension {
  id: string;
  name: string;
  version: string;
  description: string;
  path: string;
  enabled: boolean;
  error?: string;
  permissions?: string[];
  manifest?: Record<string, any>;
  icon?: string;
}

export interface AppSettings {
  video: {
    autoRecordMp4: boolean;
    autoRecordMse: boolean;
    autoDetectHls: boolean;
    idleTimeoutMs: number;
    recordQuality: 'best' | 'medium' | 'worst';
    autoMergeOnIdle: boolean;
    maxCacheGB: number;
    cleanupDays: number;
  };
  downloads: {
    concurrent: number;
    maxSpeedMBps: number;
    saveDir: string;
    askWhereToSave: boolean;
  };
  vpn: {
    autoConnect: boolean;
    killSwitch: boolean;
    defaultConf: string;
  };
  passwords: {
    enabled: boolean;
    autoFill: boolean;
    autoSave: boolean;
    lockTimeoutMin: number;
  };
  sync: {
    enabled: boolean;
    provider: 'webdav';
    webdav: {
      url: string;
      username: string;
      password: string;
      remoteDir: string;
      autoSyncMin: number;
    };
  };
  ui: {
    theme: 'dark' | 'light' | 'auto';
    locale: 'ar' | 'en';
    blockAds: boolean;
    blockTrackers: boolean;
    doNotTrack: boolean;
  };
  extensions: {
    enabled: boolean;
    paths: string[];
  };
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  loading: boolean;
  canBack: boolean;
  canForward: boolean;
  favicon?: string;
  history: string[];
  historyIndex: number;
}

export interface VpnConfigItem {
  id: string;
  name: string;
  content: string;
  endpoint?: string;
  country?: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'video:detected' | 'video:done' | 'video:error' | 'video:hls' | 'success' | 'warn';
  title?: string;
  message: string;
  data?: any;
}
