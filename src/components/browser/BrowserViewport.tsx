import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../types';
import { videoInterceptor } from '../../services/videoInterceptor';
import {
  Globe,
  Youtube,
  Radio,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Database,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  AlertCircle,
  Search,
} from 'lucide-react';

interface Props {
  tab?: BrowserTab;
  devToolsOpen: boolean;
  onNavigateTab: (url: string) => void;
}

export const BrowserViewport: React.FC<Props> = ({
  tab,
  devToolsOpen,
  onNavigateTab,
}) => {
  const [activeDevTab, setActiveDevTab] = useState<'console' | 'network' | 'storage'>('network');
  const [iframeError, setIframeError] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[Chromium Engine] Initialized WebContents with partition: persist:main',
    '[MSE Manager] MediaSource prototype intercepted for automatic track sniffer',
    '[Interceptor] WebRequest onHeadersReceived attached for video mime types',
    '[WireGuard] VPN tunnel interface ready with kill-switch protection',
  ]);

  const [networkRequests, setNetworkRequests] = useState<Array<{
    id: string;
    url: string;
    mime: string;
    status: number;
    size: string;
    type: 'video' | 'hls' | 'script' | 'xhr';
    time: string;
  }>>([
    {
      id: 'req_1',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      mime: 'application/vnd.apple.mpegurl',
      status: 200,
      size: '14.2 KB',
      type: 'hls',
      time: '12:04:10',
    },
    {
      id: 'req_2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mime: 'video/mp4',
      status: 206,
      size: '150.7 MB',
      type: 'video',
      time: '12:04:12',
    },
    {
      id: 'req_3',
      url: 'https://youtube.com/api/timedtext?v=dQw4w9WgXcQ',
      mime: 'application/json',
      status: 200,
      size: '42.8 KB',
      type: 'xhr',
      time: '12:04:15',
    },
  ]);

  const [searchInputValue, setSearchInputValue] = useState('');

  // Hook into videoInterceptor for simulating network events when user interacts
  useEffect(() => {
    setIframeError(false);
    if (!tab) return;
    const url = tab.url;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      videoInterceptor.detectMediaUrl(
        'https://rr2---sn-4g5lzney.googlevideo.com/videoplayback?expire=174208&mime=video/mp4',
        url,
        tab.title || 'YouTube High Def Video'
      );
      videoInterceptor.triggerMseChunk(url, tab.title || 'YouTube High Def Video');
      addLog(`[MSE Sniffer] Detected YouTube MediaSource track in tab: ${url}`);
    } else if (url.includes('mux.dev') || url.includes('.m3u8')) {
      videoInterceptor.detectMediaUrl(url, url, tab.title || 'HLS Live Stream Broadcast');
      addLog(`[HLS Interceptor] Detected m3u8 playlist manifest: ${url}`);
    } else if (url.endsWith('.mp4') || url.includes('.mp4')) {
      videoInterceptor.detectMediaUrl(url, url, tab.title || 'MP4 Direct Stream');
      addLog(`[Progressive Downloader] Detected MP4 stream request: ${url}`);
    }
  }, [tab?.url]);

  const addLog = (log: string) => {
    setConsoleLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const currentUrl = tab?.url || 'about:blank';
  const isYoutube = currentUrl.includes('youtube.com');
  const isHlsDemo = currentUrl.includes('mux.dev') || currentUrl.includes('.m3u8');
  const isDirectMp4 = currentUrl.endsWith('.mp4') || currentUrl.includes('sample');
  const isBlankOrHome = currentUrl === 'about:blank' || currentUrl === 'https://www.google.com';

  const bookmarks = [
    { title: 'YouTube Stream', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', icon: Youtube, color: 'text-red-500' },
    { title: 'HLS Live Demo (m3u8)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', icon: Radio, color: 'text-amber-400' },
    { title: 'Big Buck Bunny (MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', icon: Play, color: 'text-emerald-400' },
    { title: 'Wikipedia العربية', url: 'https://ar.wikipedia.org', icon: Globe, color: 'text-sky-400' },
    { title: 'Internet Archive', url: 'https://archive.org', icon: Sparkles, color: 'text-amber-400' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;
    onNavigateTab(`https://www.google.com/search?q=${encodeURIComponent(searchInputValue.trim())}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#202124]">
      {/* Bookmarks bar */}
      <div dir="rtl" className="h-7 bg-[#292a2d] px-3 flex items-center justify-between border-b border-[#35373a] text-xs select-none">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium ml-1">إشارات مرجعية سريعة:</span>
          {bookmarks.map(b => {
            const Icon = b.icon;
            return (
              <button
                key={b.title}
                onClick={() => onNavigateTab(b.url)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#35373a] text-slate-300 hover:text-white transition-colors shrink-0 text-[11px]"
              >
                <Icon className={`w-3 h-3 ${b.color}`} />
                <span>{b.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live URL info badge */}
        {!isBlankOrHome && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>آمن</span>
            </span>
            <button
              onClick={() => window.open(currentUrl, '_blank')}
              className="flex items-center gap-1 px-2 py-0.5 bg-[#383a3f] hover:bg-[#45474e] text-slate-200 rounded text-[10px] transition-colors"
              title="فتح في نافذة كاملة جديدة"
            >
              <ExternalLink className="w-3 h-3" />
              <span>نافذة كاملة</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Rendered Web Canvas (Takes Full 100% Width & Height) */}
        <div className="flex-1 flex flex-col bg-[#141517] overflow-hidden relative w-full h-full">
          {/* Case 1: Custom YouTube Stream Simulation with MSE Interceptor */}
          {isYoutube ? (
            <div className="w-full h-full flex flex-col bg-black overflow-y-auto">
              <div className="w-full bg-black flex items-center justify-center relative min-h-[55vh] max-h-[75vh]">
                <video
                  controls
                  autoPlay
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  className="w-full h-full object-contain"
                  onPlay={() => {
                    videoInterceptor.triggerMseChunk(currentUrl, tab?.title || 'YouTube Video');
                  }}
                  onTimeUpdate={e => {
                    if (Math.floor(e.currentTarget.currentTime) % 4 === 0) {
                      videoInterceptor.triggerMseChunk(currentUrl, tab?.title || 'YouTube Video');
                    }
                  }}
                  onEnded={() => {
                    videoInterceptor.finalizeActiveMse('ended');
                  }}
                />
              </div>

              <div dir="rtl" className="p-6 bg-[#18191c] border-t border-[#2a2c30] flex-1">
                <div className="max-w-5xl mx-auto space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-lg font-bold text-white">
                        {tab?.title || 'YouTube Video Player - MediaSource MSE Capturing'}
                      </h1>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>1,420,950 مشاهدة</span>
                        <span>·</span>
                        <span className="text-purple-400 font-semibold">يتم اعتراض مسارات MSE الصوتية والمرئية تلقائياً</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        videoInterceptor.finalizeActiveMse('idle');
                        alert('تم إنهاء جلسة MSE ودمج الفيديو بـ ffmpeg وحفظه في المكتبة!');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors shrink-0"
                    >
                      دمج المسارات الآن فوراً (Finalize MSE)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : isHlsDemo ? (
            /* Case 2: HLS Stream Player */
            <div className="w-full h-full flex flex-col bg-black overflow-y-auto">
              <div className="w-full bg-black flex items-center justify-center relative min-h-[55vh] max-h-[75vh]">
                <video
                  controls
                  autoPlay
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  className="w-full h-full object-contain"
                />
              </div>

              <div dir="rtl" className="p-6 bg-[#18191c] border-t border-[#2a2c30] flex-1">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">بث HLS المتكيف (m3u8 Live Stream)</h2>
                    <p className="text-xs text-amber-400 mt-1 font-mono">{currentUrl}</p>
                  </div>
                  <button
                    onClick={() => {
                      videoInterceptor.startManualHlsDownload({
                        url: currentUrl,
                        title: 'HLS Live Stream Broadcast',
                      });
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors"
                  >
                    تحميل كل مقاطع HLS ودمجها بـ ffmpeg
                  </button>
                </div>
              </div>
            </div>
          ) : isDirectMp4 ? (
            /* Case 3: Direct MP4 Video Fullscreen Player */
            <div className="w-full h-full flex flex-col bg-black">
              <video
                controls
                autoPlay
                src={currentUrl}
                className="w-full h-full object-contain"
              />
            </div>
          ) : isBlankOrHome ? (
            /* Case 4: Google & Web Navigation Portal (Home Screen) */
            <div dir="rtl" className="w-full h-full flex flex-col items-center justify-center p-6 overflow-y-auto bg-gradient-to-b from-[#202124] to-[#141517]">
              <div className="w-full max-w-2xl space-y-8 text-center">
                {/* Logo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-3 shadow-2xl flex items-center justify-center">
                    <img src="/icon.svg" alt="Chromium" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-wide">متصفح Chromium Clone</h1>
                  <p className="text-xs text-slate-400">
                    أدخل أي رابط موقع ويب في شريط العناوين بالأعلى أو ابحث مباشرة
                  </p>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    placeholder="ابحث في الويب أو أدخل رابطاً..."
                    value={searchInputValue}
                    onChange={e => setSearchInputValue(e.target.value)}
                    className="w-full h-12 pr-12 pl-24 rounded-full bg-[#292a2d] border border-[#3c4043] focus:border-sky-500 focus:outline-none text-sm text-white shadow-xl placeholder-slate-400"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-full transition-colors"
                  >
                    بحث
                  </button>
                </form>

                {/* Quick Launch Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {bookmarks.slice(0, 4).map(b => (
                    <button
                      key={b.title}
                      onClick={() => onNavigateTab(b.url)}
                      className="p-3.5 bg-[#25272a] hover:bg-[#2f3237] border border-[#35383e] rounded-xl flex flex-col items-center gap-2 text-center transition-all group"
                    >
                      <b.icon className={`w-6 h-6 ${b.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-xs font-semibold text-slate-200">{b.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Case 5: Real Full-Screen Web Page Frame */
            <div className="w-full h-full flex-1 flex flex-col relative bg-white">
              <iframe
                title={tab?.title || 'Web Viewport'}
                src={currentUrl}
                className="w-full h-full flex-1 border-0 bg-white"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                onError={() => setIframeError(true)}
              />

              {/* Informative fallback bar if external site enforces strict X-Frame-Options */}
              <div
                dir="rtl"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-[#1e2024]/95 border border-[#3a3d44] text-slate-200 px-4 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-slate-300 text-[11px] truncate max-w-xs">{currentUrl}</span>
                </div>
                <div className="flex items-center gap-1.5 border-r border-[#3a3d44] pr-2">
                  <button
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>فتح كنافذة كاملة</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DevTools Drawer */}
        {devToolsOpen && (
          <aside className="w-96 bg-[#18191c] border-r border-[#2b2d31] flex flex-col overflow-hidden text-xs text-slate-200">
            {/* DevTools Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#202124] border-b border-[#2b2d31]">
              <div className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-sky-400 ml-1" />
                <button
                  onClick={() => setActiveDevTab('network')}
                  className={`px-2 py-1 rounded ${activeDevTab === 'network' ? 'bg-[#32363b] text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Network
                </button>
                <button
                  onClick={() => setActiveDevTab('console')}
                  className={`px-2 py-1 rounded ${activeDevTab === 'console' ? 'bg-[#32363b] text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Console
                </button>
                <button
                  onClick={() => setActiveDevTab('storage')}
                  className={`px-2 py-1 rounded ${activeDevTab === 'storage' ? 'bg-[#32363b] text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Application
                </button>
              </div>

              <span className="text-[10px] text-emerald-400 font-mono">DevTools Ready</span>
            </div>

            {/* DevTools Content */}
            <div className="flex-1 overflow-auto p-3 font-mono text-[11px] space-y-2">
              {activeDevTab === 'network' && (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 grid grid-cols-12 gap-1 pb-1 border-b border-[#2d2f34]">
                    <span className="col-span-6">Name / URL</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-2">Type</span>
                    <span className="col-span-2">Size</span>
                  </div>
                  {networkRequests.map(req => (
                    <div key={req.id} className="grid grid-cols-12 gap-1 items-center py-1 hover:bg-[#202226] rounded px-1">
                      <span className="col-span-6 truncate text-slate-300" title={req.url}>
                        {req.url.split('/').pop()?.slice(0, 24) || req.url}
                      </span>
                      <span className={`col-span-2 font-bold ${req.status === 200 || req.status === 206 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {req.status}
                      </span>
                      <span className="col-span-2 text-slate-400 uppercase text-[10px]">{req.type}</span>
                      <span className="col-span-2 text-slate-300">{req.size}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeDevTab === 'console' && (
                <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-300 border-b border-[#25272c]/40 pb-0.5">
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {activeDevTab === 'storage' && (
                <div className="space-y-3 font-sans">
                  <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    <span>قواعد البيانات المحلية النشطة:</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-[#202226] rounded border border-[#2d2f34]">
                      <div className="font-bold text-white">browser.db (SQLite WAL)</div>
                      <div className="text-[11px] text-slate-400">جداول videos, progress, bookmarks</div>
                    </div>
                    <div className="p-2 bg-[#202226] rounded border border-[#2d2f34]">
                      <div className="font-bold text-white">vault.enc (AES-256-GCM)</div>
                      <div className="text-[11px] text-slate-400">سجل كلمات المرور المشفر بالخزنة</div>
                    </div>
                    <div className="p-2 bg-[#202226] rounded border border-[#2d2f34]">
                      <div className="font-bold text-white">settings.json</div>
                      <div className="text-[11px] text-slate-400">مخزن تفضيلات الفيديو والتنزيلات والواجهة</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
