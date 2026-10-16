import React from 'react';
import { BrowserTab } from '../../types';
import { Plus, X, Globe, Loader2 } from 'lucide-react';

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
    <div dir="rtl" className="flex items-center h-10 bg-[#202124] px-2 gap-1 overflow-x-auto select-none border-b border-[#292a2d]">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 h-8 px-3 min-w-[140px] max-w-[220px] rounded-t-lg text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#292a2d] text-white font-medium border-t-2 border-sky-400 shadow-sm'
                  : 'bg-[#202124] text-slate-400 hover:bg-[#28292d] hover:text-slate-200'
              }`}
            >
              {tab.loading ? (
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 shrink-0" />
              )}

              <span className="truncate flex-1" title={tab.title || tab.url}>
                {tab.title || tab.url || 'علامة تبويب جديدة'}
              </span>

              <button
                onClick={e => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-[#3c4043] hover:text-white p-0.5 rounded-full transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNewTab}
        className="w-7 h-7 rounded-full bg-[#292a2d] hover:bg-[#383a3d] text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
        title="علامة تبويب جديدة (Ctrl+T)"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
