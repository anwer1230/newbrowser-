import React, { useState, useEffect, useRef } from 'react';
import { VideoItem } from '../../types';
import { videoDatabase } from '../../services/videoDatabase';
import {
  Film,
  Search,
  Play,
  Trash2,
  X,
  Clock,
  HardDrive,
  CheckCircle2,
  RotateCcw,
  Maximize2,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoLibraryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setVideos(videoDatabase.listVideos());
    const unsub = videoDatabase.subscribe(() => {
      setVideos(videoDatabase.listVideos());
    });
    return unsub;
  }, [isOpen]);

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

  const fmtDuration = (sec: number) => {
    if (!sec || !isFinite(sec)) return '—';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const continueItems = videoDatabase.getContinueWatchingList();

  const filteredVideos = videos.filter(v =>
    !searchQuery ||
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (video: VideoItem) => {
    setActiveVideo(video);
  };

  const handleDelete = (id: string) => {
    if (confirm('حذف هذا الفيديو المحفوظ من الذاكرة المحلية؟')) {
      videoDatabase.deleteVideo(id);
      if (activeVideo?.id === id) setActiveVideo(null);
    }
  };

  // Video player position saving
  const handleTimeUpdate = () => {
    if (!videoPlayerRef.current || !activeVideo) return;
    const curTime = videoPlayerRef.current.currentTime;
    const dur = videoPlayerRef.current.duration;
    if (dur && isFinite(dur)) {
      videoDatabase.updateProgress(activeVideo.id, {
        watched_seconds: curTime,
        duration: dur,
      });
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoPlayerRef.current || !activeVideo) return;
    const resumeSec = activeVideo.watched_seconds || 0;
    if (resumeSec > 3 && resumeSec < (videoPlayerRef.current.duration - 3)) {
      videoPlayerRef.current.currentTime = resumeSec;
    }
    videoPlayerRef.current.playbackRate = playbackSpeed;
    videoPlayerRef.current.play().catch(() => {});
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-[#2b2b2b] text-[#e8eaed] w-full max-w-6xl h-[88vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282828] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مكتبة الفيديوهات المحفوظة (Offline Cache)</h2>
              <p className="text-xs text-slate-400">
                تشغيل محلي بدون إنترنت عبر بروتوكول <code className="text-sky-300 font-mono">cache://local/</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث في الفيديوهات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#202020] border border-[#333] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252525] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Continue Watching Section (Phase 2 feature) */}
          {continueItems.length > 0 && !searchQuery && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-sky-400">متابعة المشاهدة</h3>
                <span className="text-xs text-slate-500">استئناف مباشر من الموضع الأخير</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {continueItems.map(item => {
                  const pct = Math.min(100, Math.round((item.watched_seconds / item.duration) * 100));
                  return (
                    <div
                      key={item.id}
                      onClick={() => handlePlay(item)}
                      className="min-w-[260px] max-w-[260px] bg-[#202020] border border-[#2e2e2e] hover:border-sky-500/60 rounded-xl overflow-hidden cursor-pointer group transition-all"
                    >
                      <div className="h-28 bg-gradient-to-br from-[#2a2d32] to-[#121316] relative flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        {/* Progress bar inside card */}
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/50">
                          <div className="h-full bg-sky-400 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-semibold text-white truncate" title={item.title}>
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{pct}% مكتمل</span>
                          <span>بقي {fmtDuration(item.duration - item.watched_seconds)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Full Grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">
                جميع الفيديوهات المخزنة ({filteredVideos.length})
              </h3>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a]">
                لا توجد فيديوهات مسجلة مطابقة للبحث.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredVideos.map(video => {
                  const watched = video.duration
                    ? Math.round(((video.watched_seconds || 0) / video.duration) * 100)
                    : 0;
                  const isDone = video.status === 'complete';

                  return (
                    <div
                      key={video.id}
                      className="bg-[#202020] border border-[#2d2d2d] hover:border-[#3d3d3d] rounded-xl overflow-hidden flex flex-col justify-between transition-all"
                    >
                      <div className="h-32 bg-gradient-to-br from-[#27292d] to-[#121316] relative flex items-center justify-center">
                        <div className="text-4xl text-slate-700 select-none">🎞</div>
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                          video.kind === 'hls' ? 'bg-amber-500/20 text-amber-300' :
                          video.kind === 'mse' ? 'bg-purple-500/20 text-purple-300' : 'bg-sky-500/20 text-sky-300'
                        }`}>
                          {video.kind.toUpperCase()}
                        </span>
                        {isDone && (
                          <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-medium px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>محفوظ</span>
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-white line-clamp-2" title={video.title}>
                            {video.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate" title={video.url}>
                            {video.pageUrl || video.url}
                          </p>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-[#2a2a2a] text-[11px] text-slate-400">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <HardDrive className="w-3 h-3 text-slate-500" />
                              <span>{fmtBytes(video.bytes_cached || video.total_bytes)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{fmtDuration(video.duration)}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span>المشاهدة: {watched}%</span>
                            <span className="text-slate-500">
                              {new Date(video.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handlePlay(video)}
                            className="flex-1 py-1.5 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>تشغيل</span>
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="حذف من المكتبة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Built-in Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-[#333] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#222]">
              <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
                <span className="text-sky-400 font-bold">مشغل الفيديو:</span>
                <span className="truncate">{activeVideo.title}</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoPlayerRef}
                src={activeVideo.streamUrl || activeVideo.url}
                controls
                className="w-full h-full max-h-[70vh] object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>

            {/* Player Toolbar Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-t border-[#222] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">السرعة:</span>
                {[0.75, 1, 1.25, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => handleChangeSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[11px] ${playbackSpeed === s ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#222] text-slate-400 hover:text-white'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>الموضع المحفوظ: {fmtDuration(activeVideo.watched_seconds)}</span>
                <span>·</span>
                <span className="font-mono text-sky-400">cache://local/{activeVideo.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
