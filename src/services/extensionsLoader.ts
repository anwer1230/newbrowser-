import { ChromeExtension } from '../types';
import { settingsStore } from './settingsStore';

const EXTENSIONS_STORAGE_KEY = 'chromium_clone_extensions_v3';

export const DEFAULT_EXTENSIONS: ChromeExtension[] = [
  {
    id: 'ext_adblock_pro',
    name: 'AdBlock Pro Ultra',
    version: '4.2.1',
    description: 'حجب الإعلانات المنبثقة، إعلانات الفيديو قبل التشغيل ومتتبعات الخصوصية.',
    path: '/extensions/adblock-pro',
    enabled: true,
    permissions: ['webRequest', 'webRequestBlocking', 'storage', '<all_urls>'],
    manifest: {
      manifest_version: 3,
      name: 'AdBlock Pro Ultra',
      version: '4.2.1',
      description: 'حجب الإعلانات المنبثقة وإعلانات الفيديو',
      permissions: ['webRequest', 'declarativeNetRequest'],
      background: { service_worker: 'background.js' },
    },
  },
  {
    id: 'ext_dark_reader',
    name: 'Dark Reader Extreme',
    version: '5.0.0',
    description: 'وضع داكن فوري لكل المواقع مع التحكم في التباين والسطوع.',
    path: '/extensions/dark-reader',
    enabled: true,
    permissions: ['activeTab', 'storage'],
    manifest: {
      manifest_version: 3,
      name: 'Dark Reader Extreme',
      version: '5.0.0',
      action: { default_popup: 'popup.html' },
    },
  },
  {
    id: 'ext_video_speed',
    name: 'Video Speed & MSE Sniffer',
    version: '2.4.8',
    description: 'التحكم بسرعة تشغيل الفيديو (0.5x - 4x) والتقاط تدفقات MSE و HLS المباشرة.',
    path: '/extensions/video-speed',
    enabled: true,
    permissions: ['videoCapture', 'storage', '<all_urls>'],
    manifest: {
      manifest_version: 3,
      name: 'Video Speed & MSE Sniffer',
      version: '2.4.8',
      content_scripts: [{ matches: ['<all_urls>'], js: ['content.js'] }],
    },
  },
];

class ExtensionsLoader {
  private extensions: ChromeExtension[] = [];
  private listeners = new Set<() => void>();

  constructor() {
    this.load();
  }

  public load(): ChromeExtension[] {
    try {
      const raw = localStorage.getItem(EXTENSIONS_STORAGE_KEY);
      if (raw) {
        this.extensions = JSON.parse(raw);
        return this.extensions;
      }
    } catch (e) {
      console.warn('Failed to load extensions', e);
    }
    this.extensions = [...DEFAULT_EXTENSIONS];
    this.save();
    return this.extensions;
  }

  public save() {
    try {
      localStorage.setItem(EXTENSIONS_STORAGE_KEY, JSON.stringify(this.extensions));
      // sync with settingsStore
      const paths = this.extensions.map(e => e.path);
      settingsStore.set('extensions.paths', paths);
      this.listeners.forEach(cb => cb());
    } catch (e) {
      console.error(e);
    }
  }

  public list(): ChromeExtension[] {
    return [...this.extensions];
  }

  public async addFromManifest(manifestObj: Record<string, any>, dirPath?: string): Promise<ChromeExtension> {
    if (!manifestObj.name) {
      throw new Error('ملف manifest.json غير صالح: اسم الإضافة مفقود.');
    }
    const id = 'ext_' + Math.random().toString(36).slice(2, 10);
    const path = dirPath || `/extensions/${manifestObj.name.toLowerCase().replace(/\s+/g, '-')}`;
    const newExt: ChromeExtension = {
      id,
      name: manifestObj.name,
      version: manifestObj.version || '1.0.0',
      description: manifestObj.description || 'إضافة تم تحميلها يدوياً من مجلد مفكوك.',
      path,
      enabled: true,
      permissions: manifestObj.permissions || [],
      manifest: manifestObj,
    };

    this.extensions.push(newExt);
    this.save();
    return newExt;
  }

  public toggle(id: string): boolean {
    const ext = this.extensions.find(e => e.id === id);
    if (!ext) return false;
    ext.enabled = !ext.enabled;
    this.save();
    return ext.enabled;
  }

  public remove(idOrPath: string): boolean {
    const prevLen = this.extensions.length;
    this.extensions = this.extensions.filter(e => e.id !== idOrPath && e.path !== idOrPath);
    if (this.extensions.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const extensionsLoader = new ExtensionsLoader();
