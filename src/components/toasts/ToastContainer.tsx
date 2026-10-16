import React from 'react';
import { ToastMessage } from '../../types';
import { X, Film, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onOpenHlsUrl?: (url: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss, onOpenHlsUrl }) => {
  return (
    <div dir="rtl" className="fixed bottom-5 right-5 z-60 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#2b2d31] border border-[#3c4046] text-slate-100 p-3.5 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          {t.type === 'video:detected' && <Film className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          {t.type === 'video:done' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'video:hls' && <Radio className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {t.type === 'video:error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {(t.type === 'info' || t.type === 'success' || t.type === 'warn') && (
            <Film className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            {t.title && <h5 className="text-xs font-bold text-white mb-0.5">{t.title}</h5>}
            <p className="text-xs text-slate-300 leading-snug">{t.message}</p>

            {t.type === 'video:hls' && t.data?.url && (
              <button
                onClick={() => {
                  onOpenHlsUrl?.(t.data.url);
                  onDismiss(t.id);
                }}
                className="mt-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg transition-colors"
              >
                تحميل HLS الآن
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
