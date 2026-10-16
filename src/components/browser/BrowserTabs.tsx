import React from 'react';
import { BrowserTab } from '../../types';
import { Plus, X, Globe, Loader2, ChevronDown, Minus, Square } from 'lucide-react';

interface Props {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}

export const BrowserTabs: React.FC<Props> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div dir="rtl" className="flex items-end h-10 bg-[#1e1f22] px-2 select-none border-b border-[#2b2d30] relative z-20">
      {/* Chrome Tab Search Button (Chevron Down) */}
      <button
        className="w-7 h-7 mb-1 rounded-full text-slate-400 hover:text-white hover:bg-[#323438] flex items-center justify-center shrink-0 ml-1 transition-colors"
        title="البحث في علامات التبويب (Ctrl+Shift+A)"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Tabs Container */}
      <div className="flex items-end gap-0.5 flex-1 overflow-x-auto scrollbar-none h-full">
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTabId;
          const isNextActive = tabs[idx + 1]?.id === activeTabId;
          const showDivider = !isActive && !isNextActive && idx < tabs.length - 1;

          return (
            <div key={tab.id} className="relative flex items-center group h-full">
              <div
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-2 h-9 px-3.5 min-w-[140px] max-w-[240px] rounded-t-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#2b2d30] text-white font-medium shadow-[0_-1px_4px_rgba(0,0,0,0.15)] z-10'
                    : 'bg-transparent text-slate-400 hover:bg-[#26282b] hover:text-slate-200'
                }`}
              >
                {/* Favicon or Loading Spinner */}
                {tab.loading ? (
                  <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                    <img
                      src="/icon.svg"
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                )}

                {/* Tab Title */}
                <span className="truncate flex-1 text-right text-[12px]" title={tab.title || tab.url}>
                  {tab.title || tab.url || 'علامة تبويب جديدة'}
                </span>

                {/* Close Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'text-slate-400 hover:text-white hover:bg-[#3c4043]'
                      : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white hover:bg-[#3c4043]'
                  }`}
                  title="إغلاق علامة التبويب (Ctrl+W)"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Inactive Tab Divider */}
              {showDivider && (
                <div className="w-px h-4 bg-[#3c4043] self-center shrink-0" />
              )}
            </div>
          );
        })}

        {/* Chrome Plus Button for New Tab */}
        <button
          onClick={onNewTab}
          className="w-7 h-7 mb-1 mr-1 rounded-full text-slate-400 hover:text-white hover:bg-[#323438] flex items-center justify-center shrink-0 transition-colors"
          title="علامة تبويب جديدة (Ctrl+T)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Chrome Window Action Buttons (Minimize, Maximize, Close simulation) */}
      <div className="hidden sm:flex items-center gap-1 mb-1.5 mr-auto pl-1">
        <button className="w-6 h-6 rounded hover:bg-[#323438] text-slate-400 hover:text-white flex items-center justify-center text-xs">
          <Minus className="w-3 h-3" />
        </button>
        <button className="w-6 h-6 rounded hover:bg-[#323438] text-slate-400 hover:text-white flex items-center justify-center text-xs">
          <Square className="w-2.5 h-2.5" />
        </button>
        <button className="w-6 h-6 rounded hover:bg-rose-600 hover:text-white text-slate-400 flex items-center justify-center text-xs">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
