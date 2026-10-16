import React, { useState, useEffect } from 'react';
import { AppSettings, ChromeExtension, PasswordEntry, VaultMetadata } from '../../types';
import { settingsStore } from '../../services/settingsStore';
import { cryptoVault } from '../../services/cryptoVault';
import { extensionsLoader } from '../../services/extensionsLoader';
import { webdavSync, SyncStatus } from '../../services/webdavSync';
import { wireguardService } from '../../services/wireguardService';
import {
  Film,
  Download,
  KeyRound,
  Puzzle,
  Cloud,
  Shield,
  Palette,
  Info,
  X,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Lock,
  Unlock,
  FolderOpen,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenLibrary: () => void;
}

type TabKey = 'video' | 'downloads' | 'passwords' | 'extensions' | 'sync' | 'vpn' | 'ui' | 'about';

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onOpenLibrary }) => {
  const [currentTab, setCurrentTab] = useState<TabKey>('video');
  const [settings, setSettings] = useState<AppSettings>(settingsStore.getAll());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Passwords Vault State
  const [vaultMeta, setVaultMeta] = useState<VaultMetadata>(cryptoVault.getMetadata());
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [newEntryData, setNewEntryData] = useState({ origin: '', username: '', password: '', notes: '' });
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Extensions State
  const [extensions, setExtensions] = useState<ChromeExtension[]>(extensionsLoader.list());
  const [showAddExtModal, setShowAddExtModal] = useState(false);
  const [newExtJson, setNewExtJson] = useState(`{
  "manifest_version": 3,
  "name": "Custom Unpacked Script",
  "version": "1.0.0",
  "description": "نص مخصص لأتمتة المتصفح",
  "permissions": ["storage"]
}`);

  // Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(webdavSync.getLastStatus());
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // VPN State
  const [vpnStatus, setVpnStatus] = useState(wireguardService.status());
  const [vpnConfigs, setVpnConfigs] = useState(wireguardService.listConfigs());

  useEffect(() => {
    if (!isOpen) return;
    setSettings(settingsStore.getAll());
    setVaultMeta(cryptoVault.getMetadata());
    setExtensions(extensionsLoader.list());
    setSyncStatus(webdavSync.getLastStatus());
    setVpnStatus(wireguardService.status());
    setVpnConfigs(wireguardService.listConfigs());

    if (cryptoVault.isUnlocked()) {
      cryptoVault.list().then(setPasswords).catch(console.error);
    }

    const unsubSettings = settingsStore.subscribe(setSettings);
    const unsubExt = extensionsLoader.subscribe(() => setExtensions(extensionsLoader.list()));
    const unsubVpn = wireguardService.subscribe(() => {
      setVpnStatus(wireguardService.status());
      setVpnConfigs(wireguardService.listConfigs());
    });

    return () => {
      unsubSettings();
      unsubExt();
      unsubVpn();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSettingChange = (path: string, val: any) => {
    settingsStore.set(path, val);
    setSettings(settingsStore.getAll());
  };

  const handleResetSection = (sec: keyof AppSettings) => {
    if (confirm(`استعادة إعدادات ${sec} إلى الوضع الافتراضي؟`)) {
      settingsStore.reset(sec);
      setSettings(settingsStore.getAll());
    }
  };

  // Vault handlers
  const handleSetupOS = async () => {
    try {
      setVaultError(null);
      await cryptoVault.setupWithOS();
      setVaultMeta(cryptoVault.getMetadata());
      setPasswords(await cryptoVault.list());
    } catch (e: any) {
      setVaultError(e.message);
    }
  };

  const handleSetupPassword = async () => {
    if (!newMasterPassword || newMasterPassword.length < 6) {
      setVaultError('يجب أن تتكون كلمة المرور الرئيسية من 6 خانات على الأقل.');
      return;
    }
    try {
      setVaultError(null);
      await cryptoVault.createWithPassword(newMasterPassword);
      setNewMasterPassword('');
      setVaultMeta(cryptoVault.getMetadata());
      setPasswords(await cryptoVault.list());
    } catch (e: any) {
      setVaultError(e.message);
    }
  };

  const handleUnlockPassword = async () => {
    try {
      setVaultError(null);
      await cryptoVault.unlockWithPassword(masterPasswordInput);
      setMasterPasswordInput('');
      setVaultMeta(cryptoVault.getMetadata());
      setPasswords(await cryptoVault.list());
    } catch (e: any) {
      setVaultError(e.message);
    }
  };

  const handleUnlockOS = async () => {
    try {
      setVaultError(null);
      await cryptoVault.unlockWithOS();
      setVaultMeta(cryptoVault.getMetadata());
      setPasswords(await cryptoVault.list());
    } catch (e: any) {
      setVaultError(e.message);
    }
  };

  const handleLockVault = () => {
    cryptoVault.lock();
    setVaultMeta(cryptoVault.getMetadata());
    setPasswords([]);
  };

  const handleAddPasswordEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryData.origin || !newEntryData.username || !newEntryData.password) return;
    try {
      await cryptoVault.addEntry(newEntryData);
      setNewEntryData({ origin: '', username: '', password: '', notes: '' });
      setShowNewEntryForm(false);
      setPasswords(await cryptoVault.list());
    } catch (e: any) {
      setVaultError(e.message);
    }
  };

  const handleDeletePassword = async (id: string) => {
    if (!confirm('حذف بيانات الدخول هذه؟')) return;
    await cryptoVault.deleteEntry(id);
    setPasswords(await cryptoVault.list());
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Extensions handlers
  const handleAddExtensionFromManifest = async () => {
    try {
      const parsed = JSON.parse(newExtJson);
      await extensionsLoader.addFromManifest(parsed);
      setShowAddExtModal(false);
      setExtensions(extensionsLoader.list());
    } catch (err: any) {
      alert('خطأ في معالجة JSON: ' + err.message);
    }
  };

  // Sync handlers
  const handleTestSync = async () => {
    setSyncLoading(true);
    setSyncMsg('جارٍ اختبار الاتصال بخادم WebDAV...');
    const res = await webdavSync.testConnection();
    setSyncLoading(false);
    if (res.ok) {
      setSyncMsg('✅ الاتصال ناجح ومصادقة WebDAV مقبولة.');
    } else {
      setSyncMsg(`❌ تعذر الاتصال: ${res.error || 'خطأ في الاستجابة'}`);
    }
  };

  const handlePushSync = async () => {
    setSyncLoading(true);
    setSyncMsg('جارٍ رفع وتشفير بيانات الفيديوهات إلى WebDAV...');
    try {
      const r = await webdavSync.push();
      setSyncMsg(`✅ تم رفع ${r.uploaded} عنصر إلى الخادم السحابي بنجاح.`);
      setSyncStatus(webdavSync.getLastStatus());
    } catch (e: any) {
      setSyncMsg(`❌ فشل الرفع: ${e.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const handlePullSync = async () => {
    setSyncLoading(true);
    setSyncMsg('جارٍ استيراد بيانات الفيديوهات من WebDAV...');
    try {
      const r = await webdavSync.pull();
      setSyncMsg(`✅ تم استيراد ومزامنة ${r.imported} عنصر إلى المكتبة المحلية.`);
      setSyncStatus(webdavSync.getLastStatus());
    } catch (e: any) {
      setSyncMsg(`❌ فشل الجلب: ${e.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#e8eaed] w-full max-w-5xl h-[85vh] rounded-2xl flex overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <aside className="w-60 bg-[#121212] border-l border-[#2a2a2a] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 px-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Palette className="w-5 h-5" />
              </div>
              <h1 className="text-base font-bold text-sky-400">الإعدادات</h1>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setCurrentTab('video')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'video' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Film className="w-4 h-4 text-sky-400" />
                <span>🎬 الفيديو والتسجيل</span>
              </button>
              <button
                onClick={() => setCurrentTab('downloads')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'downloads' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>⬇ التنزيلات</span>
              </button>
              <button
                onClick={() => setCurrentTab('passwords')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'passwords' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>🔑 كلمات المرور</span>
              </button>
              <button
                onClick={() => setCurrentTab('extensions')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'extensions' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Puzzle className="w-4 h-4 text-purple-400" />
                <span>🧩 الإضافات</span>
              </button>
              <button
                onClick={() => setCurrentTab('sync')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'sync' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>☁ المزامنة السحابية</span>
              </button>
              <button
                onClick={() => setCurrentTab('vpn')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'vpn' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Shield className="w-4 h-4 text-rose-400" />
                <span>🔒 WireGuard VPN</span>
              </button>
              <button
                onClick={() => setCurrentTab('ui')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'ui' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>🎨 الواجهة والخصوصية</span>
              </button>
              <button
                onClick={() => setCurrentTab('about')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-right transition-colors ${currentTab === 'about' ? 'bg-[#1e1e1e] text-white font-medium border-r-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#181818]'}`}
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>ℹ حول المتصفح</span>
              </button>
            </nav>
          </div>

          <div className="p-2 border-t border-[#222]">
            <p className="text-[11px] text-slate-500 text-center">Chromium Clone v3.0</p>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#1a1a1a]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <h2 className="text-lg font-bold text-slate-100">
              {currentTab === 'video' && '🎬 إعدادات الفيديو والالتقاط التلقائي'}
              {currentTab === 'downloads' && '⬇ إعدادات التنزيلات والمسارات'}
              {currentTab === 'passwords' && '🔑 مدير كلمات المرور المشفر (AES-256)'}
              {currentTab === 'extensions' && '🧩 إدارة إضافات Chrome (Unpacked)'}
              {currentTab === 'sync' && '☁ المزامنة السحابية WebDAV'}
              {currentTab === 'vpn' && '🔒 شبكة WireGuard VPN المدمجة'}
              {currentTab === 'ui' && '🎨 تخصيص الواجهة والخصوصية ومكافحة التتبع'}
              {currentTab === 'about' && 'ℹ معلومات الإصدار والنظام والمخزن'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252525] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Views */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. VIDEO TAB */}
            {currentTab === 'video' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-5 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">تسجيل MP4 تلقائياً</div>
                      <div className="text-xs text-slate-400">اعتراض وتحميل ملفات MP4 المباشرة في الخلفية</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.video.autoRecordMp4}
                      onChange={e => handleSettingChange('video.autoRecordMp4', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">تسجيل MSE تلقائياً</div>
                      <div className="text-xs text-slate-400">التقاط تدفقات MediaSource (يوتيوب، تويتر، تويتش)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.video.autoRecordMse}
                      onChange={e => handleSettingChange('video.autoRecordMse', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">كشف تدفقات HLS تلقائياً</div>
                      <div className="text-xs text-slate-400">إظهار اقتراح تحميل فوري عند العثور على قوائم m3u8</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.video.autoDetectHls}
                      onChange={e => handleSettingChange('video.autoDetectHls', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">مهلة الخمول (Idle Timeout)</div>
                      <div className="text-xs text-slate-400">المدة بالثواني قبل اعتبار الفيديو منتهياً ودمجه بـ ffmpeg</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={Math.round(settings.video.idleTimeoutMs / 1000)}
                        onChange={e => handleSettingChange('video.idleTimeoutMs', Number(e.target.value) * 1000)}
                        className="w-20 bg-[#161616] border border-[#333] rounded px-2.5 py-1 text-sm text-center"
                      />
                      <span className="text-xs text-slate-400">ثانية</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">جودة التسجيل المفضلة</div>
                      <div className="text-xs text-slate-400">عند توفر جودات متعددة في قوائم البث المتكيفة</div>
                    </div>
                    <select
                      value={settings.video.recordQuality}
                      onChange={e => handleSettingChange('video.recordQuality', e.target.value)}
                      className="bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="best">الأعلى (Best / 1080p+)</option>
                      <option value="medium">متوسطة (Medium / 720p)</option>
                      <option value="worst">منخفضة (Economy / 480p)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">دمج تلقائي عند الخمول</div>
                      <div className="text-xs text-slate-400">دمج مسارات الصوت والصورة فور انتهاء أو خمول التشغيل</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.video.autoMergeOnIdle}
                      onChange={e => handleSettingChange('video.autoMergeOnIdle', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">الحد الأقصى للتخزين المحلي للمكتبة</div>
                      <div className="text-xs text-slate-400">حجم الذاكرة المخصصة للفيديوهات المخزنة محلياً</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={settings.video.maxCacheGB}
                        onChange={e => handleSettingChange('video.maxCacheGB', Number(e.target.value))}
                        className="w-20 bg-[#161616] border border-[#333] rounded px-2.5 py-1 text-sm text-center"
                      />
                      <span className="text-xs text-slate-400">جيجابايت (GB)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleResetSection('video')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#303030] text-xs font-medium text-slate-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>
                  <button
                    onClick={onOpenLibrary}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-900 transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>فتح مكتبة الفيديوهات الحالية</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. DOWNLOADS TAB */}
            {currentTab === 'downloads' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-5 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">عدد التنزيلات المتزامنة (Concurrent)</div>
                      <div className="text-xs text-slate-400">الحد الأقصى لعدد المهام النشطة في وقت واحد</div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.downloads.concurrent}
                      onChange={e => handleSettingChange('downloads.concurrent', Number(e.target.value))}
                      className="w-20 bg-[#161616] border border-[#333] rounded px-2.5 py-1 text-sm text-center"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">تحديد السرعة القصوى (Max Speed)</div>
                      <div className="text-xs text-slate-400">0 تعني سرعة قصوى مفتوحة بدون تقييد</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={settings.downloads.maxSpeedMBps}
                        onChange={e => handleSettingChange('downloads.maxSpeedMBps', Number(e.target.value))}
                        className="w-24 bg-[#161616] border border-[#333] rounded px-2.5 py-1 text-sm text-center"
                      />
                      <span className="text-xs text-slate-400">ميجابايت/ثانية</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a2a] space-y-2">
                    <div className="text-sm font-semibold text-slate-200">مجلد حفظ التنزيلات الافتراضي</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={settings.downloads.saveDir}
                        onChange={e => handleSettingChange('downloads.saveDir', e.target.value)}
                        className="flex-1 bg-[#161616] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-slate-300"
                      />
                      <button
                        onClick={() => {
                          const custom = prompt('حدد مسار المجلد الجديد:', settings.downloads.saveDir);
                          if (custom) handleSettingChange('downloads.saveDir', custom);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-xs font-medium"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>تغيير</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">السؤال دائماً عن مكان الحفظ</div>
                      <div className="text-xs text-slate-400">طلب تحديد المجلد في كل مرة يبدأ فيها تنزيل جديد</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.downloads.askWhereToSave}
                      onChange={e => handleSettingChange('downloads.askWhereToSave', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleResetSection('downloads')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#303030] text-xs font-medium text-slate-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PASSWORDS TAB */}
            {currentTab === 'passwords' && (
              <div className="space-y-6 max-w-3xl">
                {/* General Settings */}
                <div className="bg-[#1f1f1f] p-4 rounded-xl border border-[#2d2d2d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">تفعيل مدير كلمات المرور</div>
                      <div className="text-xs text-slate-400">حفظ وحماية بيانات تسجيل الدخول وتشفيرها محلياً</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.passwords.enabled}
                      onChange={e => handleSettingChange('passwords.enabled', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">الملء التلقائي (Auto-Fill)</div>
                      <div className="text-xs text-slate-400">اقتراح ملء الحسابات تلقائياً في حقول تسجيل الدخول بالمواقع</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.passwords.autoFill}
                      onChange={e => handleSettingChange('passwords.autoFill', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">قفل تلقائي للخزنة بعد الخمول</div>
                      <div className="text-xs text-slate-400">إعادة إغلاق الخزنة وتطهير المفتاح من الذاكرة</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="240"
                        value={settings.passwords.lockTimeoutMin}
                        onChange={e => handleSettingChange('passwords.lockTimeoutMin', Number(e.target.value))}
                        className="w-16 bg-[#161616] border border-[#333] rounded px-2 py-1 text-sm text-center"
                      />
                      <span className="text-xs text-slate-400">دقيقة</span>
                    </div>
                  </div>
                </div>

                {/* Vault Management */}
                {vaultError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
                    {vaultError}
                  </div>
                )}

                {!vaultMeta.hasVault ? (
                  <div className="bg-[#241a1a] border border-[#522] p-6 rounded-xl text-center space-y-4">
                    <KeyRound className="w-10 h-10 text-amber-400 mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">لم يتم إنشاء خزنة كلمات المرور بعد</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        اختر طريقة التشفير الآمنة: مفتاح النظام المحمي (Keychain/OS) أو تعيين كلمة مرور رئيسية مشفرة بـ PBKDF2 و AES-256-GCM.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleSetupOS}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-lg font-semibold text-xs transition-colors"
                      >
                        إنشاء بمفتاح النظام (Keychain / OS)
                      </button>
                      <span className="text-xs text-slate-500">أو</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          placeholder="كلمة المرور الرئيسية..."
                          value={newMasterPassword}
                          onChange={e => setNewMasterPassword(e.target.value)}
                          className="bg-[#181818] border border-[#444] rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          onClick={handleSetupPassword}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-semibold text-xs"
                        >
                          إنشاء بكلمة مرور
                        </button>
                      </div>
                    </div>
                  </div>
                ) : !vaultMeta.unlocked ? (
                  <div className="bg-[#221c1c] border border-amber-500/30 p-6 rounded-xl text-center space-y-4">
                    <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">الخزنة مقفلة حالياً</h3>
                      <p className="text-xs text-slate-400">
                        نمط التشفير المستخدم: {vaultMeta.mode === 'os' ? 'مفتاح النظام الآمن (OS Keychain)' : 'كلمة المرور الرئيسية (AES-256-GCM)'}
                      </p>
                    </div>

                    {vaultMeta.mode === 'os' ? (
                      <button
                        onClick={handleUnlockOS}
                        className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold rounded-lg text-xs"
                      >
                        فتح الخزنة بمفتاح النظام
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                        <input
                          type="password"
                          placeholder="أدخل كلمة المرور الرئيسية..."
                          value={masterPasswordInput}
                          onChange={e => setMasterPasswordInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleUnlockPassword()}
                          className="flex-1 bg-[#161616] border border-[#3c4043] rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <button
                          onClick={handleUnlockPassword}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          فتح
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-300 font-medium">الخزنة مفتوحة ومتاحة</span>
                        <span className="text-xs text-slate-500">({passwords.length} حساب محفوظ)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowNewEntryForm(true)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-lg text-xs font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة حساب جديد</span>
                        </button>
                        <button
                          onClick={handleLockVault}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#2c1d1d] hover:bg-[#3d2424] text-rose-300 rounded-lg text-xs font-medium border border-rose-500/30"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>قفل الخزنة</span>
                        </button>
                      </div>
                    </div>

                    {/* New entry form */}
                    {showNewEntryForm && (
                      <form onSubmit={handleAddPasswordEntry} className="bg-[#242424] p-4 rounded-xl border border-[#383838] space-y-3">
                        <div className="text-xs font-bold text-sky-400">إضافة إدخال حساب جديد للخزنة</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">الموقع أو الخدمة (Origin URL)</label>
                            <input
                              type="text"
                              required
                              placeholder="https://example.com"
                              value={newEntryData.origin}
                              onChange={e => setNewEntryData({ ...newEntryData, origin: e.target.value })}
                              className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">اسم المستخدم / البريد</label>
                            <input
                              type="text"
                              required
                              placeholder="user@example.com"
                              value={newEntryData.username}
                              onChange={e => setNewEntryData({ ...newEntryData, username: e.target.value })}
                              className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">كلمة المرور</label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={newEntryData.password}
                              onChange={e => setNewEntryData({ ...newEntryData, password: e.target.value })}
                              className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">ملاحظات إضافية</label>
                            <input
                              type="text"
                              placeholder="حساب عمل، سؤال أمان..."
                              value={newEntryData.notes}
                              onChange={e => setNewEntryData({ ...newEntryData, notes: e.target.value })}
                              className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowNewEntryForm(false)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs"
                          >
                            حفظ وتشفير
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Passwords list */}
                    <div className="space-y-2">
                      {passwords.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs bg-[#1d1d1d] rounded-xl border border-[#2a2a2a]">
                          لا توجد حسابات مسجلة في الخزنة حتى الآن.
                        </div>
                      ) : (
                        passwords.map(p => {
                          const isRevealed = visiblePasswords[p.id];
                          return (
                            <div key={p.id} className="flex items-center justify-between p-3.5 bg-[#202020] rounded-xl border border-[#2e2e2e]">
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-slate-100">{p.origin}</div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                  <span>{p.username}</span>
                                  <span>·</span>
                                  <span className="font-mono text-slate-300">
                                    {isRevealed ? p.password : '••••••••••••'}
                                  </span>
                                  {p.notes && <span className="text-slate-500">({p.notes})</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setVisiblePasswords(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#2c2c2c]"
                                  title={isRevealed ? 'إخفاء' : 'إظهار كلمة المرور'}
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(p.username, `user_${p.id}`)}
                                  className="px-2 py-1 bg-[#2b2b2b] hover:bg-[#383838] rounded text-[11px] text-slate-300 flex items-center gap-1"
                                >
                                  {copiedId === `user_${p.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>المستخدم</span>
                                </button>
                                <button
                                  onClick={() => copyToClipboard(p.password, `pass_${p.id}`)}
                                  className="px-2 py-1 bg-[#2b2b2b] hover:bg-[#383838] rounded text-[11px] text-slate-300 flex items-center gap-1"
                                >
                                  {copiedId === `pass_${p.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>كلمة المرور</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePassword(p.id)}
                                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. EXTENSIONS TAB */}
            {currentTab === 'extensions' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-4 rounded-xl border border-[#2d2d2d] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">تفعيل نظام الإضافات المفكوكة</div>
                    <div className="text-xs text-slate-400">دعم تحميل وتشغيل إضافات Chrome Unpacked مباشرة عبر manifest.json</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.extensions.enabled}
                    onChange={e => handleSettingChange('extensions.enabled', e.target.checked)}
                    className="w-5 h-5 accent-sky-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200">الإضافات المثبتة حالياً ({extensions.length})</h3>
                  <button
                    onClick={() => setShowAddExtModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-lg text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>تحميل إضافة مفكوكة (Manifest JSON)</span>
                  </button>
                </div>

                {showAddExtModal && (
                  <div className="bg-[#232323] p-4 rounded-xl border border-sky-500/30 space-y-3">
                    <div className="text-xs font-bold text-sky-400">الصق محتوى manifest.json للإضافة المفكوكة:</div>
                    <textarea
                      rows={7}
                      value={newExtJson}
                      onChange={e => setNewExtJson(e.target.value)}
                      className="w-full bg-[#161616] border border-[#333] rounded-lg p-3 text-xs font-mono text-slate-200"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowAddExtModal(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleAddExtensionFromManifest}
                        className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs rounded-lg"
                      >
                        تحميل وتثبيت الإضافة
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {extensions.map(ext => (
                    <div key={ext.id} className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100">{ext.name}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                            v{ext.version}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${ext.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                            {ext.enabled ? 'مفعلة' : 'معطلة'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{ext.description}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{ext.path}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => extensionsLoader.toggle(ext.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${ext.enabled ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}`}
                        >
                          {ext.enabled ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => extensionsLoader.remove(ext.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                          title="إزالة الإضافة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SYNC TAB */}
            {currentTab === 'sync' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-4 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">تفعيل المزامنة السحابية</div>
                      <div className="text-xs text-slate-400">مزامنة سجل الفيديوهات، التقدم، وقاعدة البيانات مع خادم WebDAV خارجي</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sync.enabled}
                      onChange={e => handleSettingChange('sync.enabled', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#2a2a2a] space-y-3">
                    <div className="text-xs font-bold text-sky-400">إعدادات خادم WebDAV (Nextcloud / ownCloud / Apache)</div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">عنوان الرابط (Server URL)</label>
                      <input
                        type="text"
                        placeholder="https://cloud.example.com/remote.php/dav/files/username"
                        value={settings.sync.webdav.url}
                        onChange={e => handleSettingChange('sync.webdav.url', e.target.value)}
                        className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">اسم المستخدم</label>
                        <input
                          type="text"
                          value={settings.sync.webdav.username}
                          onChange={e => handleSettingChange('sync.webdav.username', e.target.value)}
                          className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">كلمة المرور / App Password</label>
                        <input
                          type="password"
                          value={settings.sync.webdav.password}
                          onChange={e => handleSettingChange('sync.webdav.password', e.target.value)}
                          className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">المجلد البعيد (Remote Dir)</label>
                        <input
                          type="text"
                          value={settings.sync.webdav.remoteDir}
                          onChange={e => handleSettingChange('sync.webdav.remoteDir', e.target.value)}
                          className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">المزامنة التلقائية كل</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="5"
                            max="1440"
                            value={settings.sync.webdav.autoSyncMin}
                            onChange={e => handleSettingChange('sync.webdav.autoSyncMin', Number(e.target.value))}
                            className="w-20 bg-[#161616] border border-[#333] rounded px-2 py-1 text-sm text-center"
                          />
                          <span className="text-xs text-slate-400">دقيقة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sync Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={syncLoading}
                    onClick={handleTestSync}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#252525] hover:bg-[#303030] rounded-lg text-xs font-medium text-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                    <span>اختبار الاتصال</span>
                  </button>
                  <button
                    disabled={syncLoading}
                    onClick={handlePushSync}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>رفع الآن إلى السحابة ⬆</span>
                  </button>
                  <button
                    disabled={syncLoading}
                    onClick={handlePullSync}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>جلب واستيراد من السحابة ⬇</span>
                  </button>
                </div>

                {syncMsg && (
                  <div className="p-3 bg-[#1e2023] border border-[#383a3f] rounded-lg text-xs text-sky-300">
                    {syncMsg}
                  </div>
                )}

                {syncStatus && (
                  <div className="text-xs text-slate-400 pt-2">
                    آخر مزامنة: {new Date(syncStatus.time).toLocaleString('ar-SA')} — {syncStatus.message}
                  </div>
                )}
              </div>
            )}

            {/* 6. VPN TAB */}
            {currentTab === 'vpn' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-5 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">حالة محرك WireGuard</div>
                      <div className="text-xs text-emerald-400 font-mono">
                        ● {wireguardService.wgAvailable()}
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vpnStatus.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {vpnStatus.connected ? `متصل (${vpnStatus.interface})` : 'غير متصل'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">الاتصال التلقائي عند بدء المتصفح</div>
                      <div className="text-xs text-slate-400">تأمين مسار الإنترنت فور تشغيل التطبيق عبر السيرفر الافتراضي</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.vpn.autoConnect}
                      onChange={e => handleSettingChange('vpn.autoConnect', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">زر قطع الإنترنت الآمن (Kill Switch)</div>
                      <div className="text-xs text-slate-400">قطع حركة المرور فوراً إذا انقطع اتصال النفق لمنع تسريب IP</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.vpn.killSwitch}
                      onChange={e => handleSettingChange('vpn.killSwitch', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#2a2a2a] space-y-2">
                    <div className="text-sm font-semibold text-slate-200">ملف الإعدادات الافتراضي (.conf)</div>
                    <select
                      value={settings.vpn.defaultConf}
                      onChange={e => handleSettingChange('vpn.defaultConf', e.target.value)}
                      className="w-full bg-[#161616] border border-[#333] rounded-lg px-3 py-2 text-sm text-white font-mono"
                    >
                      <option value="">لا يوجد سيرفر افتراضي</option>
                      {vpnConfigs.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={!settings.vpn.defaultConf || vpnStatus.connected}
                    onClick={() => wireguardService.connect(settings.vpn.defaultConf)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    اتصال بالخادم الافتراضي
                  </button>
                  <button
                    disabled={!vpnStatus.connected}
                    onClick={() => wireguardService.disconnect()}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    قطع الاتصال
                  </button>
                </div>
              </div>
            )}

            {/* 7. UI & PRIVACY TAB */}
            {currentTab === 'ui' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-5 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">السمة اللونية (Theme)</div>
                      <div className="text-xs text-slate-400">واجهة داكنة مريحة للعينين أو فاتحة كلاسيكية</div>
                    </div>
                    <select
                      value={settings.ui.theme}
                      onChange={e => handleSettingChange('ui.theme', e.target.value)}
                      className="bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="dark">داكن (Dark Mode)</option>
                      <option value="light">فاتح (Light Mode)</option>
                      <option value="auto">تلقائي حسب النظام</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">اللغة الافتراضية للواجهة</div>
                      <div className="text-xs text-slate-400">تدعم العربية بالكامل من اليمين لليسار (RTL)</div>
                    </div>
                    <select
                      value={settings.ui.locale}
                      onChange={e => handleSettingChange('ui.locale', e.target.value)}
                      className="bg-[#161616] border border-[#333] rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="ar">العربية (RTL)</option>
                      <option value="en">English (LTR)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">حجب الإعلانات المزعجة (AdBlock)</div>
                      <div className="text-xs text-slate-400">منع لافتات الإعلانات وإعلانات الفيديو المنبثقة</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ui.blockAds}
                      onChange={e => handleSettingChange('ui.blockAds', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">حجب متتبعات الخصوصية (Trackers)</div>
                      <div className="text-xs text-slate-400">حظر ملفات تعريف الارتباط التابعة لجهات خارجية ونصوص التتبع</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ui.blockTrackers}
                      onChange={e => handleSettingChange('ui.blockTrackers', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-semibold text-slate-200">إرسال رأس "عدم التتبع" (Do Not Track)</div>
                      <div className="text-xs text-slate-400">تضمين ترويسة DNT: 1 في جميع طلبات HTTP الصادرة</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ui.doNotTrack}
                      onChange={e => handleSettingChange('ui.doNotTrack', e.target.checked)}
                      className="w-5 h-5 accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. ABOUT TAB */}
            {currentTab === 'about' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-[#1f1f1f] p-5 rounded-xl border border-[#2d2d2d] space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Chromium Clone Browser Studio</h3>
                    <p className="text-xs text-slate-400">
                      متصفح أرشفة متقدم مبني على تقنيات Electron 32 و Chromium Engine مع محرك التقاط فيديو هجين (MP4 + MSE + HLS).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                    <div className="bg-[#171717] p-3 rounded-lg border border-[#262626]">
                      <div className="text-slate-500 mb-0.5">الإصدار (Version)</div>
                      <div className="font-mono font-bold text-sky-400">3.0.0-PRO</div>
                    </div>
                    <div className="bg-[#171717] p-3 rounded-lg border border-[#262626]">
                      <div className="text-slate-500 mb-0.5">محرك Chromium</div>
                      <div className="font-mono font-bold text-slate-200">128.0.6613.120</div>
                    </div>
                    <div className="bg-[#171717] p-3 rounded-lg border border-[#262626]">
                      <div className="text-slate-500 mb-0.5">بيئة Node.js</div>
                      <div className="font-mono font-bold text-slate-200">v22.14.0</div>
                    </div>
                    <div className="bg-[#171717] p-3 rounded-lg border border-[#262626]">
                      <div className="text-slate-500 mb-0.5">محرك V8</div>
                      <div className="font-mono font-bold text-slate-200">12.8.374.38</div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 space-y-1">
                    <div>مجلد البيانات والمكتبة: <code className="bg-[#171717] px-2 py-0.5 rounded text-sky-300 font-mono">/home/user/.config/ChromiumClone</code></div>
                    <div>قاعدة البيانات النشطة: <code className="bg-[#171717] px-2 py-0.5 rounded text-slate-300 font-mono">browser.db (SQLite WAL Mode)</code></div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenLibrary}
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-xs font-semibold rounded-lg text-slate-200 transition-colors"
                  >
                    افتح مكتبة الفيديوهات
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من رغبتك في حذف جميع الإعدادات وسجل التنزيلات والعودة للوضع المبدئي؟')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/30 transition-colors"
                  >
                    إعادة تعيين كامل لبيانات التطبيق
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
