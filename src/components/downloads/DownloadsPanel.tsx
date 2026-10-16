import React, { useState, useEffect } from 'react';
import { DownloadJob } from '../../types';
import { downloadsManager } from '../../services/downloadsManager';
import { Play, Pause, X, Trash2, CheckCircle2, AlertCircle, Clock, DownloadCloud } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadsPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    setJobs(downloadsManager.list());
    const unsub = downloadsManager.subscribe(() => {
      setJobs(downloadsManager.list());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const fmtBytes = (n: number) => {
    if (!n) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let val = n;
    while (val >= 1024 && i < u.length - 1) {
      val /= 1024;
      i++;
    }
    return val.toFixed(1) + ' ' + u[i];
  };

  const fmtSpeed = (bps: number) => {
    if (!bps) return '—';
    return fmtBytes(bps) + '/ث';
  };

  const filteredJobs = jobs.filter(j => {
    if (filter === 'active') return j.status === 'active' || j.status === 'pending' || j.status === 'paused';
    if (filter === 'done') return j.status === 'done';
    return true;
  });

  const activeCount = jobs.filter(j => j.status === 'active' || j.status === 'pending').length;

  return (
    <div
      dir="rtl"
      className="fixed top-14 left-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-[#202124] border border-[#3c4043] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-100 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#3c4043] bg-[#292a2d]">
        <div className="flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-bold tracking-wide">لوحة التنزيلات الموحّدة</h2>
          {activeCount > 0 && (
            <span className="text-xs bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full">
              {activeCount} نشط
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => downloadsManager.clearCompleted()}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-[#3c4043] transition-colors"
            title="مسح التنزيلات المكتملة"
          >
            مسح المكتمل
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#3c4043] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[#1a1b1e] border-b border-[#2d3034] text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-[#35373b] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          الكل ({jobs.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'active' ? 'bg-[#35373b] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          النشطة ({activeCount})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'done' ? 'bg-[#35373b] text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
        >
          المكتملة ({jobs.filter(j => j.status === 'done').length})
        </button>
      </div>

      {/* Downloads List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-[#2a2c30]/50">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            لا توجد تنزيلات في هذه القائمة حالياً.
          </div>
        ) : (
          filteredJobs.map(job => {
            const pct = Math.round((job.progress || 0) * 100);
            return (
              <div key={job.id} className="pt-2.5 first:pt-0 bg-[#25272a] p-3 rounded-lg border border-[#32363a]">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                        job.type === 'hls' ? 'bg-amber-500/20 text-amber-300' :
                        job.type === 'mse' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {job.type.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200 truncate" title={job.title}>
                        {job.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate" title={job.filePath}>
                      {job.filePath}
                    </p>
                  </div>
                  {job.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {job.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  {job.status === 'paused' && <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1b1c1e] h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'done' ? 'bg-emerald-500' :
                      job.status === 'error' ? 'bg-rose-500' :
                      job.status === 'paused' ? 'bg-amber-500' : 'bg-sky-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{pct}%</span>
                    <span>·</span>
                    <span>{fmtBytes(job.receivedBytes)} / {fmtBytes(job.totalBytes)}</span>
                    {job.status === 'active' && (
                      <>
                        <span>·</span>
                        <span className="text-sky-300 font-medium tabular-nums">{fmtSpeed(job.speed)}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {job.status === 'active' && (
                      <button
                        onClick={() => downloadsManager.pauseJob(job.id)}
                        className="p-1 text-slate-300 hover:text-white hover:bg-[#383a3e] rounded"
                        title="إيقاف مؤقت"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {job.status === 'paused' && (
                      <button
                        onClick={() => downloadsManager.resumeJob(job.id)}
                        className="p-1 text-sky-400 hover:text-sky-300 hover:bg-[#383a3e] rounded"
                        title="استئناف"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(job.status === 'active' || job.status === 'pending' || job.status === 'paused') && (
                      <button
                        onClick={() => downloadsManager.cancelJob(job.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 hover:bg-[#383a3e] rounded"
                        title="إلغاء التنزيل"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(job.status === 'done' || job.status === 'error' || job.status === 'cancelled') && (
                      <button
                        onClick={() => downloadsManager.removeJob(job.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-[#383a3e] rounded"
                        title="حذف من السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
