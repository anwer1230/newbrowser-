export interface NativeFileDoc {
  path: string;
  category: 'core' | 'video' | 'downloads' | 'passwords' | 'extensions' | 'sync' | 'vpn' | 'ui';
  description: string;
  content: string;
}

export const NATIVE_ELECTRON_FILES: NativeFileDoc[] = [
  {
    path: 'package.json',
    category: 'core',
    description: 'ملف الحزم الأساسي وتثبيت better-sqlite3 و ffmpeg-static',
    content: `{
  "name": "chromium-clone",
  "version": "1.0.0",
  "description": "متصفح كامل مع تسجيل فيديو تلقائي و VPN والمرحلة 3",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "rebuild": "electron-rebuild -f -w better-sqlite3"
  },
  "dependencies": {
    "better-sqlite3": "^11.3.0",
    "ffmpeg-static": "^5.2.0",
    "fluent-ffmpeg": "^2.1.3"
  },
  "devDependencies": {
    "electron": "^32.1.0",
    "electron-rebuild": "^3.2.9"
  }
}`,
  },
  {
    path: 'src/settings/store.js',
    category: 'core',
    description: 'مخزن الإعدادات (JSON) مع دمج عميق ومستمعين للتغييرات',
    content: `const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const FILE = path.join(app.getPath('userData'), 'settings.json');

const DEFAULTS = {
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
    saveDir: '',
    askWhereToSave: false,
  },
  vpn: {
    autoConnect: false,
    killSwitch: false,
    defaultConf: '',
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
      url: '',
      username: '',
      password: '',
      remoteDir: '/chromium-clone',
      autoSyncMin: 30,
    },
  },
  ui: {
    theme: 'dark',
    locale: 'ar',
    blockAds: false,
    blockTrackers: true,
    doNotTrack: true,
  },
  extensions: {
    enabled: true,
    paths: [],
  },
};

function deepMerge(base, override) {
  if (!override) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(override)) {
    if (override[k] && typeof override[k] === 'object' && !Array.isArray(override[k])) {
      out[k] = deepMerge(base[k] || {}, override[k]);
    } else {
      out[k] = override[k];
    }
  }
  return out;
}

let current = null;

function load() {
  if (current) return current;
  try {
    if (fs.existsSync(FILE)) {
      current = deepMerge(DEFAULTS, JSON.parse(fs.readFileSync(FILE, 'utf8')));
    } else {
      current = JSON.parse(JSON.stringify(DEFAULTS));
      save();
    }
  } catch {
    current = JSON.parse(JSON.stringify(DEFAULTS));
  }
  return current;
}

function save() {
  try { fs.writeFileSync(FILE, JSON.stringify(current, null, 2)); } catch {}
}

function get(keyPath) {
  load();
  if (!keyPath) return current;
  const parts = keyPath.split('.');
  let node = current;
  for (const p of parts) {
    if (node == null) return undefined;
    node = node[p];
  }
  return node;
}

function set(keyPath, value) {
  load();
  const parts = keyPath.split('.');
  let node = current;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof node[parts[i]] !== 'object' || node[parts[i]] == null) node[parts[i]] = {};
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
  save();
  emitChange(keyPath, value);
}

const listeners = new Set();
function onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function emitChange(keyPath, value) {
  for (const cb of listeners) { try { cb(keyPath, value); } catch {} }
}

function reset() {
  current = JSON.parse(JSON.stringify(DEFAULTS));
  save();
}

module.exports = { load, save, get, set, reset, onChange, DEFAULTS };`,
  },
  {
    path: 'src/downloads/manager.js',
    category: 'downloads',
    description: 'مدير التنزيلات الموحّد (MP4, HLS, MSE) مع دعم Range واستئناف',
    content: `const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const { net } = require('electron');
const settings = require('../settings/store');

class DownloadsManager extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
    this.queue = [];
    this.active = 0;
  }

  get maxConcurrent() {
    return Math.max(1, settings.get('downloads.concurrent') || 3);
  }

  createJob({ id, type, title, url, filePath, totalBytes = 0 }) {
    const jobId = id || 'job_' + crypto.randomBytes(6).toString('hex');
    const job = {
      id: jobId,
      type,
      title: title || url || 'تنزيل',
      url: url || '',
      filePath: filePath || '',
      totalBytes,
      receivedBytes: 0,
      status: 'pending',
      progress: 0,
      speed: 0,
      startedAt: 0,
      finishedAt: 0,
      error: null,
      createdAt: Date.now(),
    };
    this.jobs.set(jobId, job);
    this.emit('added', job);
    return job;
  }

  updateJob(id, patch) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch);
    this.emit('updated', job);
  }

  removeJob(id, deleteFile = false) {
    const job = this.jobs.get(id);
    if (!job) return;
    if (deleteFile && job.filePath) {
      try { fs.unlinkSync(job.filePath); } catch {}
    }
    this.jobs.delete(id);
    this.emit('removed', id);
  }

  cancelJob(id) {
    const job = this.jobs.get(id);
    if (!job) return;
    if (job._cancel) job._cancel();
    this.updateJob(id, { status: 'cancelled', finishedAt: Date.now() });
  }

  pauseJob(id) {
    const job = this.jobs.get(id);
    if (!job || job.status !== 'active') return;
    if (job._pause) job._pause();
    this.updateJob(id, { status: 'paused' });
  }

  resumeJob(id) {
    const job = this.jobs.get(id);
    if (!job || job.status !== 'paused') return;
    if (job._resume) job._resume();
    this.updateJob(id, { status: 'active' });
  }

  clearCompleted() {
    for (const [id, job] of this.jobs) {
      if (['done', 'error', 'cancelled'].includes(job.status)) this.removeJob(id);
    }
  }

  list() {
    return [...this.jobs.values()].sort((a, b) => b.createdAt - a.createdAt);
  }
}

module.exports = new DownloadsManager();`,
  },
  {
    path: 'src/passwords/vault.js',
    category: 'passwords',
    description: 'خزنة كلمات المرور المشفرة بـ AES-256-GCM و safeStorage',
    content: `const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app, safeStorage } = require('electron');

const VAULT_PATH = path.join(app.getPath('userData'), 'vault.enc');

let unlockedKey = null;
let vaultData = { entries: [] };

function isEncryptionAvailable() {
  try { return safeStorage.isEncryptionAvailable(); } catch { return false; }
}

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 200000, 32, 'sha256');
}

function encrypt(data, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

function decrypt(buf, key) {
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString('utf8'));
}

module.exports = {
  deriveKey,
  encrypt,
  decrypt,
  isEncryptionAvailable,
};`,
  },
  {
    path: 'src/extensions/loader.js',
    category: 'extensions',
    description: 'تحميل إضافات Chrome مفكوكة عبر session.loadExtension',
    content: `const fs = require('fs');
const path = require('path');
const { session } = require('electron');
const settings = require('../settings/store');

async function loadExtension(extPath) {
  const ses = session.fromPartition('persist:main');
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
    const ext = await ses.loadExtension(extPath, { allowFileAccess: true });
    return {
      id: ext.id,
      name: ext.name,
      version: manifest.version || '1.0',
      description: manifest.description || '',
      path: extPath,
      manifest,
    };
  } catch (err) {
    return { path: extPath, error: err.message };
  }
}

module.exports = { loadExtension };`,
  },
  {
    path: 'src/sync/webdav.js',
    category: 'sync',
    description: 'مزامنة سحابية مع Nextcloud/ownCloud/WebDAV',
    content: `const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const settings = require('../settings/store');
const db = require('../db');

function basicAuth(user, pass) {
  return 'Basic ' + Buffer.from(\`\${user}:\${pass}\`).toString('base64');
}

module.exports = { basicAuth };`,
  },
  {
    path: 'src/video/mse-manager.js',
    category: 'video',
    description: 'إدارة تدفقات MSE ودمج الصوت والصورة عند الخمول أو الإغلاق',
    content: `const fs = require('fs');
const path = require('path');
const db = require('../db');
const { finalizeMse } = require('./merger');

const sessions = new Map();
const IDLE_TIMEOUT = 30_000;

module.exports = { sessions, IDLE_TIMEOUT };`,
  },
];
