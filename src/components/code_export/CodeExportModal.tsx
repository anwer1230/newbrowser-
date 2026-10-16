import React, { useState } from 'react';
import { NATIVE_ELECTRON_FILES, NativeFileDoc } from '../../data/nativeFiles';
import { Code2, Copy, Check, X, FileCode, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<NativeFileDoc>(NATIVE_ELECTRON_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-[#2e3035] text-slate-100 w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#28292d] bg-[#131316]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">الكود المصدري الأصلي لـ Electron (Phase 1, 2, 3)</h3>
              <p className="text-xs text-slate-400">تصفح ونسخ كود ملفات المشروع لتشغيلها على سطح المكتب بنظام Node.js</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25252a]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree */}
          <aside className="w-72 bg-[#121214] border-l border-[#24252a] p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-wider">
              ملفات المشروع الهيكلية
            </div>
            {NATIVE_ELECTRON_FILES.map(f => (
              <button
                key={f.path}
                onClick={() => setSelectedFile(f)}
                className={`w-full text-right px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                  selectedFile.path === f.path
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1b1f]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{f.path}</span>
              </button>
            ))}
          </aside>

          {/* Code Viewer */}
          <main className="flex-1 flex flex-col bg-[#161619] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#24252a] bg-[#1a1a1e]">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400">{selectedFile.path}</span>
                <span className="text-xs text-slate-400 mr-2">· {selectedFile.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25272c] hover:bg-[#31333a] rounded-lg text-xs font-medium text-slate-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل الملف</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed select-text">
              <pre dir="ltr" className="font-mono text-slate-300 whitespace-pre">
                {selectedFile.content}
              </pre>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
