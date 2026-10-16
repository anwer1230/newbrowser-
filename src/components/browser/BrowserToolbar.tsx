import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Download,
  Film,
  Shield,
  Settings,
  Radio,
  Code2,
  Terminal,
  Bookmark,
} from 'lucide-react';

interface Props {
  activeTab?: BrowserTab;
  downloadsBadgeCount: number;
  isVpnConnected: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onToggleDownloads: () => void;
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  onOpenVpn: () => void;
  onOpenHls: () => void;
  onOpenCode: () => void;
  onToggleDevTools: () => void;
  devToolsOpen: boolean;
  onOpenInstall: () => void;
}

export const BrowserToolbar: React.FC<Props> = ({
  activeTab,
  downloadsBadgeCount,
  isVpnConnected,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onToggleDownloads,
  onOpenSettings,
  onOpenLibrary,
  onOpenVpn,
  onOpenHls,
  onOpenCode,
  onToggleDevTools,
  devToolsOpen,
  onOpenInstall,
}) => {
  const [addressInput, setAddressInput] = useState(activeTab?.url || '');

  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url);
    }
  }, [activeTab?.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onNavigate(addressInput.trim());
    }
  };

  return (
    <div dir="rtl" className="h-12 bg-[#202124] px-3 flex items-center gap-2 border-b border-[#303338] select-none text-slate-200">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!activeTab?.canBack}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
          title="رجوع"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onForward}
          disabled={!activeTab?.canForward}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
          title="تقدم"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center transition-colors"
          title="تحديث الصفحة"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Address Omnibox */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-3xl">
        <div className="relative flex items-center bg-[#292a2d] hover:bg-[#303236] focus-within:bg-[#202124] focus-within:ring-2 focus-within:ring-sky-500/50 rounded-full h-8 px-3 transition-all border border-[#3c4043]/50">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
          <input
            dir="ltr"
            type="text"
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            placeholder="ابحث على Google أو أدخل رابط موقع ويب..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <Bookmark className="w-3.5 h-3.5 text-slate-500 hover:text-amber-400 cursor-pointer mr-1" />
        </div>
      </form>

      {/* Action Toolbar Icons */}
      <div className="flex items-center gap-1 mr-auto">
        {/* Unified Downloads Button with Live Badge */}
        <button
          onClick={onToggleDownloads}
          className="relative w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center transition-colors"
          title="لوحة التنزيلات الموحدة (HLS + MSE + MP4)"
        >
          <Download className="w-4 h-4 text-sky-400" />
          {downloadsBadgeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {downloadsBadgeCount}
            </span>
          )}
        </button>

        {/* HLS Manual Downloader */}
        <button
          onClick={onOpenHls}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center text-amber-400 transition-colors"
          title="تحميل فيديو HLS (m3u8)"
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* Video Library */}
        <button
          onClick={onOpenLibrary}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center text-sky-400 transition-colors"
          title="مكتبة الفيديوهات المسجلة"
        >
          <Film className="w-4 h-4" />
        </button>

        {/* WireGuard VPN Button */}
        <button
          onClick={onOpenVpn}
          className="relative w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center transition-colors"
          title="إدارة WireGuard VPN"
        >
          <Shield className={`w-4 h-4 ${isVpnConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
          {isVpnConnected && (
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
          )}
        </button>

        {/* Code / Electron Exporter */}
        <button
          onClick={onOpenCode}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center text-emerald-400 transition-colors"
          title="الكود المصدري لـ Electron (Native Code)"
        >
          <Code2 className="w-4 h-4" />
        </button>

        {/* Install PWA Button */}
        <button
          onClick={onOpenInstall}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          title="تثبيت Chromium Clone كتطبيق فعلي على الجهاز"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تثبيت التطبيق</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="الإعدادات الشاملة (Stage 3)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* DevTools Menu */}
        <button
          onClick={onToggleDevTools}
          className={`w-8 h-8 rounded-full hover:bg-[#32363b] flex items-center justify-center transition-colors ${devToolsOpen ? 'text-sky-400 bg-[#32363b]' : 'text-slate-400'}`}
          title="أدوات المطور ومفتش الشبكة (DevTools)"
        >
          <Terminal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
