import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../types';
import { ChromeMenuDropdown } from './ChromeMenuDropdown';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Download,
  Film,
  Shield,
  Radio,
  Star,
  MoreVertical,
  Laptop,
  Puzzle,
  User,
  SlidersHorizontal,
  ArrowDownToLine,
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div dir="rtl" className="h-11 bg-[#2b2d30] px-3 flex items-center gap-2 border-b border-[#3c4043] select-none text-slate-200 relative z-30">
      {/* 1. Navigation Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onBack}
          disabled={!activeTab?.canBack}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="انقر للرجوع للخلف"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onForward}
          disabled={!activeTab?.canForward}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="انقر للتقدم للأمام"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onReload}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="إعادة تحميل هذه الصفحة"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Chrome Omnibox (Address Bar) */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-4xl mx-1">
        <div className="relative flex items-center bg-[#1e1f22] hover:bg-[#232529] focus-within:bg-[#1e1f22] focus-within:ring-2 focus-within:ring-[#8ab4f8] rounded-full h-8 px-3.5 transition-all border border-[#3c4043]/40 shadow-inner">
          {/* Tune / Site Security Button */}
          <button
            type="button"
            className="p-1 -mr-1 text-slate-400 hover:text-white rounded-full hover:bg-[#32343a] flex items-center gap-1 transition-colors"
            title="معلومات الموقع والأمان"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* URL Input */}
          <input
            dir="ltr"
            type="text"
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            onFocus={e => e.target.select()}
            placeholder="ابحث في Google أو اكتب عنوان URL"
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none px-2 font-sans tracking-wide"
          />

          {/* Omnibox Action Icons */}
          <div className="flex items-center gap-1 shrink-0 -ml-1">
            {/* Native Install Button inside Omnibox (like Chrome Desktop) */}
            <button
              type="button"
              onClick={onOpenInstall}
              className="p-1 rounded-full text-slate-400 hover:text-sky-400 hover:bg-[#32343a] transition-colors"
              title="تثبيت التطبيق"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark Star Button */}
            <button
              type="button"
              onClick={() => setIsBookmarked(prev => !prev)}
              className={`p-1 rounded-full hover:bg-[#32343a] transition-colors ${isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
              title={isBookmarked ? 'تمت إضافة الصفحة للإشارات المرجعية' : 'إضافة هذه الصفحة للإشارات المرجعية'}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </form>

      {/* 3. Chrome Extension Icons & Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Extensions Icon (Chrome Puzzle Piece) */}
        <button
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          title="الإضافات (Extensions)"
        >
          <Puzzle className="w-4 h-4" />
        </button>

        {/* Video Sniffer / Library Button */}
        <button
          onClick={onOpenLibrary}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] text-amber-400 flex items-center justify-center transition-colors"
          title="مكتبة الفيديوهات المسجلة"
        >
          <Film className="w-4 h-4" />
        </button>

        {/* HLS Downloader */}
        <button
          onClick={onOpenHls}
          className="w-7 h-7 rounded-full hover:bg-[#393c40] text-sky-400 flex items-center justify-center transition-colors"
          title="تحميل مقاطع HLS (m3u8)"
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* WireGuard VPN Toggle Badge */}
        <button
          onClick={onOpenVpn}
          className="relative w-7 h-7 rounded-full hover:bg-[#393c40] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title={isVpnConnected ? 'WireGuard VPN: متصل' : 'WireGuard VPN: غير متصل'}
        >
          <Shield className={`w-4 h-4 ${isVpnConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
          {isVpnConnected && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
          )}
        </button>

        {/* Unified Downloads Button with Badge */}
        <button
          onClick={onToggleDownloads}
          className="relative w-7 h-7 rounded-full hover:bg-[#393c40] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="التنزيلات"
        >
          <Download className="w-4 h-4 text-sky-400" />
          {downloadsBadgeCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">
              {downloadsBadgeCount}
            </span>
          )}
        </button>

        {/* Chrome Profile Circle Avatar */}
        <div
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-500 hover:ring-2 hover:ring-sky-400 cursor-pointer flex items-center justify-center text-white text-[10px] font-bold shadow-sm mr-1 transition-all"
          title="ملف المستخدم والإعدادات"
        >
          <User className="w-3.5 h-3.5" />
        </div>

        {/* Chrome Three Dots Menu Button (⋮) */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className={`w-7 h-7 rounded-full hover:bg-[#393c40] flex items-center justify-center transition-colors ${isMenuOpen ? 'bg-[#393c40] text-white' : 'text-slate-300 hover:text-white'}`}
            title="تخصيص والتحكم في Chromium Clone"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Chrome Real Dropdown Menu */}
          <ChromeMenuDropdown
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onNewTab={() => onNavigate('https://www.google.com')}
            onOpenDownloads={onToggleDownloads}
            onOpenLibrary={onOpenLibrary}
            onOpenSettings={onOpenSettings}
            onOpenVpn={onOpenVpn}
            onOpenDevTools={onToggleDevTools}
            onOpenInstall={onOpenInstall}
            onOpenCode={onOpenCode}
          />
        </div>
      </div>
    </div>
  );
};
