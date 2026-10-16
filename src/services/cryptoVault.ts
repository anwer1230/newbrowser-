import { PasswordEntry, VaultMetadata } from '../types';

const VAULT_STORAGE_KEY = 'chromium_clone_vault_v1';
const VAULT_META_KEY = 'chromium_clone_vault_meta';

// Helper to convert array buffer to base64 and back
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export class CryptoVaultService {
  private activeKey: CryptoKey | null = null;
  private memoryEntries: PasswordEntry[] = [];
  private lockTimer: any = null;

  constructor() {
    this.initDefaultEntriesIfEmpty();
  }

  private initDefaultEntriesIfEmpty() {
    const meta = this.getMetadata();
    if (!meta.hasVault) {
      // Don't auto-create yet, wait for user setup
    }
  }

  public getMetadata(): VaultMetadata {
    try {
      const raw = localStorage.getItem(VAULT_META_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      hasVault: false,
      unlocked: false,
      mode: null,
    };
  }

  public isUnlocked(): boolean {
    return this.activeKey !== null;
  }

  public isOSAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.crypto;
  }

  // Derive AES-GCM key from password and salt
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Setup Vault with Master Password
  public async createWithPassword(password: string): Promise<boolean> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await this.deriveKey(password, salt);
    this.activeKey = key;

    // Seed with a few initial sample logins for demonstration
    this.memoryEntries = [
      {
        id: 'pw_google',
        origin: 'https://accounts.google.com',
        username: 'user@gmail.com',
        password: 'GoogleSecurePass#2026',
        notes: 'حساب جوجل الرئيسي للمتصفح',
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now() - 3600000,
      },
      {
        id: 'pw_github',
        origin: 'https://github.com',
        username: 'developer-hub',
        password: 'ghp_secretToken_89Xz3kLp',
        notes: 'مفتاح وصول GitHub للأكواد',
        createdAt: Date.now() - 7200000,
        updatedAt: Date.now() - 7200000,
      },
    ];

    await this.persistEncrypted(salt, 'password');
    return true;
  }

  // Setup Vault with OS Key (simulating safeStorage)
  public async setupWithOS(): Promise<boolean> {
    const randomKey = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    this.activeKey = randomKey;

    // Store OS key in local mock keychain
    const exportedRaw = await window.crypto.subtle.exportKey('raw', randomKey);
    const osKeyB64 = bufferToBase64(exportedRaw);
    localStorage.setItem('chromium_clone_os_key', osKeyB64);

    this.memoryEntries = [
      {
        id: 'pw_os_seed',
        origin: 'https://youtube.com',
        username: 'stream_user',
        password: 'MseStreamPass99!',
        notes: 'حساب يوتيوب للأرشفة',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    await this.persistEncrypted(new Uint8Array(0), 'os');
    return true;
  }

  // Unlock with OS
  public async unlockWithOS(): Promise<boolean> {
    const osKeyB64 = localStorage.getItem('chromium_clone_os_key');
    if (!osKeyB64) {
      throw new Error('لم يتم العثور على مفتاح نظام التشغيل المحفوظ.');
    }
    const rawKey = base64ToBuffer(osKeyB64);
    this.activeKey = await window.crypto.subtle.importKey(
      'raw',
      rawKey as BufferSource,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );

    await this.loadDecrypted();
    return true;
  }

  // Unlock with password
  public async unlockWithPassword(password: string): Promise<boolean> {
    const meta = this.getMetadata();
    if (!meta.hasVault || meta.mode !== 'password' || !meta.salt) {
      throw new Error('لا توجد خزنة مشفرة بكلمة مرور.');
    }

    const salt = base64ToBuffer(meta.salt);
    const candidateKey = await this.deriveKey(password, salt);

    try {
      this.activeKey = candidateKey;
      await this.loadDecrypted();
      return true;
    } catch (err) {
      this.activeKey = null;
      throw new Error('كلمة المرور الرئيسية غير صحيحة، تعذر فك تشفير البيانات.');
    }
  }

  private async persistEncrypted(salt: Uint8Array, mode: 'os' | 'password') {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const jsonStr = JSON.stringify(this.memoryEntries);
    const enc = new TextEncoder();
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.activeKey,
      enc.encode(jsonStr)
    );

    const fullBlob = new Uint8Array(iv.length + ciphertext.byteLength);
    fullBlob.set(iv, 0);
    fullBlob.set(new Uint8Array(ciphertext), iv.length);

    const b64Blob = bufferToBase64(fullBlob);
    localStorage.setItem(VAULT_STORAGE_KEY, b64Blob);

    const meta: VaultMetadata = {
      hasVault: true,
      unlocked: true,
      mode,
      salt: salt.length > 0 ? bufferToBase64(salt) : undefined,
    };
    localStorage.setItem(VAULT_META_KEY, JSON.stringify(meta));
  }

  private async loadDecrypted() {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');
    const b64Blob = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!b64Blob) {
      this.memoryEntries = [];
      return;
    }

    const fullBlob = base64ToBuffer(b64Blob);
    const iv = fullBlob.slice(0, 12);
    const ciphertext = fullBlob.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.activeKey,
      ciphertext as BufferSource
    );

    const dec = new TextDecoder();
    this.memoryEntries = JSON.parse(dec.decode(decrypted));
  }

  public lock() {
    this.activeKey = null;
    this.memoryEntries = [];
    if (this.lockTimer) {
      clearTimeout(this.lockTimer);
      this.lockTimer = null;
    }
    const meta = this.getMetadata();
    meta.unlocked = false;
    localStorage.setItem(VAULT_META_KEY, JSON.stringify(meta));
  }

  public setAutoLock(timeoutMin: number) {
    if (this.lockTimer) clearTimeout(this.lockTimer);
    if (timeoutMin <= 0) return;
    this.lockTimer = setTimeout(() => {
      this.lock();
    }, timeoutMin * 60 * 1000);
  }

  public async list(): Promise<PasswordEntry[]> {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');
    return [...this.memoryEntries];
  }

  public async addEntry(entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');
    const id = 'pw_' + Math.random().toString(36).slice(2, 10);
    const newEntry: PasswordEntry = {
      ...entry,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.memoryEntries.push(newEntry);
    const meta = this.getMetadata();
    const salt = meta.salt ? base64ToBuffer(meta.salt) : new Uint8Array(0);
    await this.persistEncrypted(salt, meta.mode || 'password');
    return id;
  }

  public async updateEntry(id: string, patch: Partial<PasswordEntry>): Promise<boolean> {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');
    const idx = this.memoryEntries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.memoryEntries[idx] = {
      ...this.memoryEntries[idx],
      ...patch,
      updatedAt: Date.now(),
    };
    const meta = this.getMetadata();
    const salt = meta.salt ? base64ToBuffer(meta.salt) : new Uint8Array(0);
    await this.persistEncrypted(salt, meta.mode || 'password');
    return true;
  }

  public async deleteEntry(id: string): Promise<boolean> {
    if (!this.activeKey) throw new Error('الخزنة مقفلة.');
    this.memoryEntries = this.memoryEntries.filter(e => e.id !== id);
    const meta = this.getMetadata();
    const salt = meta.salt ? base64ToBuffer(meta.salt) : new Uint8Array(0);
    await this.persistEncrypted(salt, meta.mode || 'password');
    return true;
  }

  public findForOrigin(origin: string): PasswordEntry[] {
    if (!this.activeKey) return [];
    return this.memoryEntries.filter(e => e.origin.includes(origin) || origin.includes(e.origin));
  }
}

export const cryptoVault = new CryptoVaultService();
