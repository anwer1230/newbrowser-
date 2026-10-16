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
  Layers,
  Terminal,
  Activity,
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
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

  // Video demo state inside page
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoTime, setDemoTime] = useState(0);

  // Hook into videoInterceptor for simulating network events when user interacts
  useEffect(() => {
    if (!tab) return;
    const url = tab.url;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Trigger MSE detection
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
  const isHlsDemo = currentUrl.includes('mux.dev') || currentUrl.includes('hls');
  const isDirectMp4 = currentUrl.endsWith('.mp4') || currentUrl.includes('sample');

  const bookmarks = [
    { title: 'YouTube Stream', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', icon: Youtube, color: 'text-red-500' },
    { title: 'HLS Live Demo (m3u8)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', icon: Radio, color: 'text-amber-400' },
    { title: 'Big Buck Bunny (MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', icon: Play, color: 'text-emerald-400' },
    { title: 'Blender Studio (MSE)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', icon: Sparkles, color: 'text-purple-400' },
    { title: 'Google Search', url: 'https://www.google.com', icon: Globe, color: 'text-sky-400' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#202124]">
      {/* Bookmarks bar */}
      <div dir="rtl" className="h-7 bg-[#292a2d] px-3 flex items-center gap-2 border-b border-[#35373a] text-xs select-none overflow-x-auto">
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

      {/* Main Viewport Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Rendered Web Canvas */}
        <div className="flex-1 flex flex-col bg-[#141517] overflow-auto relative">
          {/* Simulated Web Page Content */}
          <div className="p-6 max-w-5xl mx-auto w-full space-y-6 text-slate-200">
            {/* Active URL Card header */}
            <div className="flex items-center justify-between p-4 bg-[#1f2023] rounded-2xl border border-[#2f3136]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{tab?.title || 'الصفحة الحالية'}</h3>
                  <p className="text-xs text-sky-400 font-mono">{currentUrl}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] bg-emerald-500/15 text-emerald-400 font-medium px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>اتصال مشفر وآمن</span>
                </span>
              </div>
            </div>

            {/* If YouTube Page Simulation */}
            {isYoutube ? (
              <div className="space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden border border-[#2e3035] shadow-2xl">
                  <div className="aspect-video relative bg-black flex items-center justify-center">
                    <video
                      controls
                      autoPlay
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      className="w-full h-full object-contain"
                      onPlay={() => {
                        setIsPlayingDemo(true);
                        videoInterceptor.triggerMseChunk(currentUrl, tab?.title || 'YouTube Video');
                      }}
                      onTimeUpdate={e => {
                        setDemoTime(e.currentTarget.currentTime);
                        if (Math.floor(e.currentTarget.currentTime) % 4 === 0) {
                          videoInterceptor.triggerMseChunk(currentUrl, tab?.title || 'YouTube Video');
                        }
                      }}
                      onEnded={() => {
                        videoInterceptor.finalizeActiveMse('ended');
                      }}
                    />
                  </div>
                </div>

                <div className="p-5 bg-[#1f2023] rounded-2xl border border-[#2f3136] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-base font-bold text-white">
                        {tab?.title || 'YouTube High Fidelity Video - Auto MSE Sniffing'}
                      </h1>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>1,420,950 مشاهدة</span>
                        <span>·</span>
                        <span>تم النشر قبل يومين</span>
                        <span>·</span>
                        <span className="text-purple-400 font-medium">تم اكتشاف تدفق MSE النشط ومسارات الصوت والصورة</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        videoInterceptor.finalizeActiveMse('idle');
                        alert('تم إنهاء جلسة MSE ودمج الفيديو بـ ffmpeg وحفظه في المكتبة!');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                    >
                      دمج المسارات الآن فوراً (Finalize MSE)
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    يعترض المتصفح تلقائياً استدعاءات <code className="text-amber-400 font-mono">MediaSource.prototype.addSourceBuffer</code> ويلتقط كل قطعة (Chunk) متدفقة للصوت والفيديو، ويحفظها في مجلد مؤقت، ثم يقوم بدمجها عند الخمول أو انتهاء الفيديو دون أي خسارة في الجودة.
                  </p>
                </div>
              </div>
            ) : isHlsDemo ? (
              /* HLS Stream View */
              <div className="space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden border border-[#2e3035] shadow-2xl">
                  <div className="aspect-video relative bg-black flex items-center justify-center">
                    <video
                      controls
                      autoPlay
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="p-5 bg-[#1f2023] rounded-2xl border border-[#2f3136] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">بث HLS المتكيف (HTTP Live Streaming - m3u8)</h2>
                      <p className="text-xs text-amber-400 mt-1 font-mono">{currentUrl}</p>
                    </div>

                    <button
                      onClick={() => {
                        videoInterceptor.startManualHlsDownload({
                          url: currentUrl,
                          title: 'HLS Live Demo Stream Broadcast',
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
              /* Direct MP4 view */
              <div className="space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden border border-[#2e3035]">
                  <div className="aspect-video relative bg-black flex items-center justify-center">
                    <video
                      controls
                      autoPlay
                      src={currentUrl}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="p-4 bg-[#1f2023] rounded-2xl border border-[#2f3136] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">ملف فيديو MP4 مباشر</h3>
                    <p className="text-xs text-slate-400">تم الكشف عنه وبدء التسجيل التلقائي بمكتبة التنزيلات</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-full">
                    MP4 Progressive Stream
                  </span>
                </div>
              </div>
            ) : (
              /* General Web Page Layout Simulator */
              <div className="space-y-6">
                <div className="bg-[#1c1d20] border border-[#2c2e33] p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-lg">
                      G
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Google Search & Web Navigator</h2>
                      <p className="text-xs text-slate-400">تصفح الويب بكامل ميزات Chromium وواجهة التبويبات المتعددة</p>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {bookmarks.map(b => (
                      <div
                        key={b.title}
                        onClick={() => onNavigateTab(b.url)}
                        className="p-3 bg-[#23252a] hover:bg-[#2b2d33] border border-[#30333a] rounded-xl cursor-pointer transition-all flex items-center gap-3"
                      >
                        <b.icon className={`w-5 h-5 ${b.color}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{b.title}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{b.url}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-sky-950/20 to-purple-950/20 border border-sky-500/20 rounded-2xl flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-sky-400">الميزات المدمجة المفعلة في هذه الصفحة:</span>
                    <p className="text-slate-400">
                      حاجب الإعلانات (AdBlock Pro) · مانع المتتبعات · التقاط الفيديو التلقائي · مدير كلمات المرور (AutoFill) · نفق WireGuard المشفر
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DevTools Drawer (Bottom or Right) */}
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
