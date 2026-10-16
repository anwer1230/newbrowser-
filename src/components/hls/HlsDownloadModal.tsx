import React, { useState } from 'react';
import { videoInterceptor } from '../../services/videoInterceptor';
import { Radio, X, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialUrl?: string;
  onClose: () => void;
}

export const HlsDownloadModal: React.FC<Props> = ({ isOpen, initialUrl = '', onClose }) => {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isDone, setIsDone] = useState(false);

  React.useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    if (!url.trim()) return;
    setDownloading(true);
    setProgress(0);
    setIsDone(false);
    setStatusText('بدء تحليل قائمة تشغيل m3u8...');

    try {
      await videoInterceptor.startManualHlsDownload({
        url: url.trim(),
        title: title.trim() || 'HLS Live Stream (m3u8)',
        onProgress: (pct, stage) => {
          setProgress(pct);
          setStatusText(stage);
        },
      });
      setIsDone(true);
    } catch (e: any) {
      setStatusText('خطأ: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const setTestStream = () => {
    setUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    setTitle('بث تجريبي HLS متكيف الجودات (Mux Demo)');
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#202124] border border-[#3c4043] text-slate-100 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3c4043] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">تحميل فيديو HLS (m3u8)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#303134]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">رابط قائمة التشغيل (.m3u8 URL)</label>
              <button
                type="button"
                onClick={setTestStream}
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>تجربة رابط HLS جاهز</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="https://example.com/stream/index.m3u8"
              value={url}
              disabled={downloading}
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-[#161719] border border-[#3c4043] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">عنوان الفيديو (اختياري)</label>
            <input
              type="text"
              placeholder="مثال: تسجيل محاضرة أو بث مباشر..."
              value={title}
              disabled={downloading}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#161719] border border-[#3c4043] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Progress Display */}
        {(downloading || isDone) && (
          <div className="bg-[#18191c] p-4 rounded-xl border border-[#333] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{statusText}</span>
              <span className="font-bold text-amber-400">{progress}%</span>
            </div>
            <div className="w-full bg-[#121214] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isDone ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isDone && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم دمج المقاطع وحفظ الفيديو بنجاح في المكتبة وقائمة التنزيلات!</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white font-medium"
          >
            {isDone ? 'إغلاق' : 'إلغاء'}
          </button>
          {!isDone && (
            <button
              type="button"
              disabled={downloading || !url}
              onClick={handleStartDownload}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'جارٍ التحميل والدمج...' : 'بدء التحميل الآن'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
