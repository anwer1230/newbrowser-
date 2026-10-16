import React, { useRef, useEffect } from 'react';
import {
  Plus,
  Shield,
  Download,
  Film,
  KeyRound,
  Puzzle,
  Settings,
  Terminal,
  Info,
  ExternalLink,
  Laptop,
  Bookmark,
  History,
  Maximize,
  ArrowDownToLine,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onOpenDownloads: () => void;
  onOpenLibrary: () => void;
  onOpenSettings: () => void;
  onOpenVpn: () => void;
  onOpenDevTools: () => void;
  onOpenInstall: () => void;
  onOpenCode: () => void;
}

export const ChromeMenuDropdown: React.FC<Props> = ({
  isOpen,
  onClose,
  onNewTab,
  onOpenDownloads,
  onOpenLibrary,
  onOpenSettings,
  onOpenVpn,
  onOpenDevTools,
  onOpenInstall,
  onOpenCode,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      dir="rtl"
      className="absolute top-12 left-2 z-50 w-72 bg-[#28292c] border border-[#3c4043] rounded-xl shadow-2xl py-1.5 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Group 1: Tabs & Windows */}
      <div className="px-1 py-1 space-y-0.5">
        <button
          onClick={() => {
            onNewTab();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Plus className="w-4 h-4 text-slate-400" />
            <span>علامة تبويب جديدة</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Ctrl+T</span>
        </button>

        <button
          onClick={() => {
            window.open(window.location.href, '_blank');
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>نافذة جديدة</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Ctrl+N</span>
        </button>
      </div>

      <div className="h-px bg-[#3c4043] my-1" />

      {/* Group 2: Browser Features */}
      <div className="px-1 py-1 space-y-0.5">
        <button
          onClick={() => {
            onOpenDownloads();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-sky-400" />
            <span>التنزيلات (Downloads)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Ctrl+J</span>
        </button>

        <button
          onClick={() => {
            onOpenLibrary();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Film className="w-4 h-4 text-amber-400" />
            <span>مكتبة الفيديوهات المسجلة</span>
          </div>
        </button>

        <button
          onClick={() => {
            onOpenVpn();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>WireGuard VPN نفق الحماية</span>
          </div>
        </button>
      </div>

      <div className="h-px bg-[#3c4043] my-1" />

      {/* Group 3: Installation & DevTools */}
      <div className="px-1 py-1 space-y-0.5">
        <button
          onClick={() => {
            onOpenInstall();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-medium transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <ArrowDownToLine className="w-4 h-4 text-sky-400" />
            <span>تثبيت Chromium Clone كتطبيق مستقل...</span>
          </div>
        </button>

        <button
          onClick={() => {
            onOpenDevTools();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>أدوات المطور (DevTools)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">F12</span>
        </button>

        <button
          onClick={() => {
            onOpenCode();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Laptop className="w-4 h-4 text-indigo-400" />
            <span>أكواد Electron الأصلية للمشروع</span>
          </div>
        </button>
      </div>

      <div className="h-px bg-[#3c4043] my-1" />

      {/* Group 4: Settings & About */}
      <div className="px-1 py-1 space-y-0.5">
        <button
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#35373b] hover:text-white transition-colors text-right"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-300" />
            <span>الإعدادات الشاملة (Settings)</span>
          </div>
        </button>
      </div>
    </div>
  );
};
