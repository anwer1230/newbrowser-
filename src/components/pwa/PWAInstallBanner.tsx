import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle2, X, Sparkles, Smartphone, Monitor, Loader2, ArrowDownToLine } from 'lucide-react';

interface Props {
  forceShow?: boolean;
}

export const PWAInstallBanner: React.FC<Props> = ({ forceShow = false }) => {
  const { isInstalled, isIOS, installing, justInstalled, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  if ((isInstalled && !justInstalled && !forceShow) || (dismissed && !forceShow)) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    await triggerInstall();
  };

  return (
    <>
      <div
        dir="rtl"
        className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
      >
        <div className="bg-[#1f2125] border border-sky-500/40 text-slate-100 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
          {/* App Icon & Details */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-1.5 flex items-center justify-center shrink-0 shadow-md">
              <img src="/icon.svg" alt="Chromium Logo" className="w-full h-full object-contain" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold">
                ✓
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                  تثبيت Chromium Clone كتطبيق فعلي
                </h4>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full shrink-0">
                  PWA رسمي
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-1 sm:line-clamp-none">
                تشغيل بكامل الشاشة وبدون إطار المتصفح مع دعم كامل للعمل بدون إنترنت وفتح فوري من سطح المكتب.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {justInstalled ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تم التثبيت كتطبيق فعلي!</span>
              </div>
            ) : installing ? (
              <div className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التثبيت...</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg hover:shadow-sky-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4 text-slate-950" />
                <span>تثبيت التطبيق</span>
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2b2d33] transition-colors"
              title="إخفاء الإشعار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Installing Progress Animation */}
        {installing && (
          <div className="w-full bg-[#161719] h-1 rounded-b-xl overflow-hidden -mt-1 mx-auto max-w-[calc(100%-1rem)]">
            <div className="h-full bg-sky-400 animate-pulse w-full transition-all duration-1000" />
          </div>
        )}
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div dir="rtl" className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f2125] border border-slate-700 text-slate-100 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">التثبيت على iPhone أو iPad</h3>
              </div>
              <button onClick={() => setShowIOSModal(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>اضغط على زر <strong>المشاركة (Share)</strong> في شريط أدوات متصفح Safari بالأسفل.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>مرر للأسفل واختر <strong>إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>اضغط <strong>إضافة (Add)</strong> وسيظهر التطبيق كأيقونة مستقلة على جهازك.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-[#2a2c32] hover:bg-[#34373e] text-white font-semibold text-xs rounded-xl"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
