import React, { useState, useEffect } from 'react';
import { BrowserTab } from '../../types';
import { videoInterceptor } from '../../services/videoInterceptor';
import { MOVIES_DATABASE, MovieItem } from '../../data/moviesData';
import { getDynamicDiscoverArticles, DiscoverArticle } from '../../data/discoverData';
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
  Mic,
  Camera,
  Film,
  Compass,
  RefreshCw,
  Plus,
  Share2,
  Bookmark,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Download,
  Info,
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
  const [renderMode, setRenderMode] = useState<'proxy' | 'direct'>('proxy');
  const [iframeError, setIframeError] = useState(false);
  
  // Discover Feed State (Dynamic)
  const [discoverCategory, setDiscoverCategory] = useState<string>('all');
  const [discoverSeed, setDiscoverSeed] = useState<number>(0);
  const [discoverArticles, setDiscoverArticles] = useState<DiscoverArticle[]>(() =>
    getDynamicDiscoverArticles('all', 0)
  );
  const [isRefreshingDiscover, setIsRefreshingDiscover] = useState(false);

  // Movies Hub State
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [selectedMovieCategory, setSelectedMovieCategory] = useState<string>('all');
  const [activeMovieModal, setActiveMovieModal] = useState<MovieItem | null>(null);

  // Search Bar Input in New Tab
  const [searchInputValue, setSearchInputValue] = useState('');

  // Console & Network Logs for DevTools
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[Chromium Engine] WebContents session started: partition=persist:main',
    '[MSE Manager] MediaSource sniffer activated for video/audio streams',
    '[Video Interceptor] WebRequest hooks active (MP4 / HLS / MSE)',
    '[Web Proxy] Dynamic proxy enabled to bypass X-Frame-Options & CORS',
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

  // Dynamic Discover Refresh
  const handleRefreshDiscover = () => {
    setIsRefreshingDiscover(true);
    const nextSeed = discoverSeed + 1;
    setDiscoverSeed(nextSeed);
    setTimeout(() => {
      setDiscoverArticles(getDynamicDiscoverArticles(discoverCategory, nextSeed));
      setIsRefreshingDiscover(false);
    }, 350);
  };

  const handleCategoryChange = (category: string) => {
    setDiscoverCategory(category);
    setDiscoverArticles(getDynamicDiscoverArticles(category, discoverSeed));
  };

  const currentUrl = tab?.url || 'about:blank';
  const isYoutube = currentUrl.includes('youtube.com');
  const isHlsDemo = currentUrl.includes('mux.dev') || currentUrl.includes('.m3u8');
  const isDirectMp4 = currentUrl.endsWith('.mp4') || currentUrl.includes('sample');
  const isBlankOrHome = currentUrl === 'about:blank' || currentUrl === 'https://www.google.com';

  const chromeShortcuts = [
    { title: 'YouTube', url: 'https://www.youtube.com', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'مكتبة الأفلام المترجمة', url: '#cinema-hub', icon: Film, color: 'text-amber-400', bg: 'bg-amber-500/10', isScrollToCinema: true },
    { title: 'بث HLS تجريبي', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', icon: Radio, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { title: 'ويكيبيديا العربية', url: 'https://ar.wikipedia.org', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'أرشيف الإنترنت Archive', url: 'https://archive.org', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'بحث الترجمات Subscene', url: 'https://subscene.com', icon: Film, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;
    const query = searchInputValue.trim();
    if (query.startsWith('http://') || query.startsWith('https://')) {
      onNavigateTab(query);
    } else {
      onNavigateTab(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Filter movies
  const filteredMovies = MOVIES_DATABASE.filter(movie => {
    const matchesCategory = selectedMovieCategory === 'all' || movie.category === selectedMovieCategory;
    const q = movieSearchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      movie.title.toLowerCase().includes(q) ||
      movie.arabicTitle.toLowerCase().includes(q) ||
      movie.query.toLowerCase().includes(q) ||
      (movie.year && movie.year.includes(q)) ||
      movie.synopsis.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#202124]">
      {/* Chrome Bookmarks & Quick Access Bar */}
      <div dir="rtl" className="h-7 bg-[#292a2d] px-3 flex items-center justify-between border-b border-[#35373a] text-xs select-none">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium ml-1">إشارات مرجعية سريعة:</span>
          {chromeShortcuts.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.title}
                onClick={() => {
                  if (s.isScrollToCinema) {
                    const el = document.getElementById('cinema-hub');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigateTab('https://www.google.com');
                  } else {
                    onNavigateTab(s.url);
                  }
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#35373a] text-slate-300 hover:text-white transition-colors shrink-0 text-[11px]"
              >
                <Icon className={`w-3 h-3 ${s.color}`} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live URL info badge */}
        {!isBlankOrHome && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>اتصال آمن</span>
            </span>

            {/* View Mode Toggle: Proxy vs Direct */}
            <div className="flex items-center bg-[#1e2024] rounded-lg p-0.5 border border-[#3c4043]">
              <button
                onClick={() => setRenderMode('proxy')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  renderMode === 'proxy' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="تجاوز قيود X-Frame-Options وعرض الموقع بالكامل عبر وكيل الويب"
              >
                وكيل الويب الذكي
              </button>
              <button
                onClick={() => setRenderMode('direct')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  renderMode === 'direct' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="العرض المباشر للموقع داخل الإطار"
              >
                عرض مباشر
              </button>
            </div>

            <button
              onClick={() => window.open(currentUrl, '_blank')}
              className="flex items-center gap-1 px-2 py-0.5 bg-[#383a3f] hover:bg-[#45474e] text-slate-200 rounded text-[10px] transition-colors"
              title="فتح في نافذة كاملة مستقلة"
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
            /* Case 4: Authentic Google Chrome New Tab Page (With Dynamic Discover & Arabic Movies Engine) */
            <div dir="rtl" className="w-full h-full overflow-y-auto bg-[#202124] text-slate-100 pb-16">
              {/* Google Brand Header & Search Section */}
              <div className="pt-16 pb-8 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto">
                {/* Authentic Google Logo */}
                <div className="select-none mb-8">
                  <h1 className="text-6xl sm:text-7xl font-bold tracking-tight flex items-center justify-center font-sans">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </h1>
                </div>

                {/* Google Omnibox Search Bar */}
                <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative mb-8">
                  <div className="flex items-center bg-[#303134] hover:bg-[#3a3b3e] focus-within:bg-[#303134] rounded-full px-5 py-3.5 shadow-2xl border border-transparent focus-within:border-transparent focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
                    <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={searchInputValue}
                      onChange={e => setSearchInputValue(e.target.value)}
                      placeholder="ابحث في Google أو اكتب عنوان URL للموقع..."
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                    />
                    <div className="flex items-center gap-2.5 mr-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => alert('ميزة البحث الصوتي جاهزة ونشطة')}
                        className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                        title="البحث الصوتي"
                      >
                        <Mic className="w-4 h-4 text-sky-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('ميزة Google Lens جاهزة لتحليل الصور وروابط الفيديو')}
                        className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                        title="البحث باستخدام Google Lens"
                      >
                        <Camera className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Chrome Shortcuts Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full max-w-2xl mb-12">
                  {chromeShortcuts.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.title}
                        onClick={() => {
                          if (s.isScrollToCinema) {
                            const el = document.getElementById('cinema-hub');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            onNavigateTab(s.url);
                          }
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-[#303134] transition-all group"
                      >
                        <div className={`w-12 h-12 rounded-full ${s.bg} border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md`}>
                          <Icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <span className="text-xs text-slate-300 font-medium text-center truncate max-w-[90px]">
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Google Discover Section */}
              <div className="max-w-4xl mx-auto px-4 mb-16">
                <div className="flex items-center justify-between pb-4 border-b border-[#35373a] mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Compass className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>خلاصة استكشاف</span>
                        <span className="text-xs font-normal text-slate-400 font-mono">(Google Discover)</span>
                      </h2>
                      <p className="text-[11px] text-slate-400">مواضيع حية وديناميكية تتجدد باستمرار بحسب اهتماماتك</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Dynamic Refresh Button */}
                    <button
                      onClick={handleRefreshDiscover}
                      disabled={isRefreshingDiscover}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#303134] hover:bg-[#3c3e42] text-slate-200 text-xs font-semibold rounded-xl border border-[#3c4043] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      title="تحديث مواضيع Discover ديناميكياً"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshingDiscover ? 'animate-spin' : ''}`} />
                      <span>تحديث المواضيع</span>
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'cinema', label: 'سينما وأفلام مترجمة' },
                    { id: 'tech', label: 'تكنولوجيا وأمان' },
                    { id: 'science', label: 'علوم واستكشاف' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                        discoverCategory === cat.id
                          ? 'bg-sky-500 text-slate-950 shadow-md'
                          : 'bg-[#303134] text-slate-300 hover:bg-[#3c3e42]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Discover Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverArticles.map(article => (
                    <article
                      key={article.id}
                      onClick={() => onNavigateTab(article.url)}
                      className="bg-[#2a2b2e] hover:bg-[#323337] border border-[#35373a] hover:border-slate-600 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-sky-400">{article.source}</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {article.timeAgo}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {article.snippet}
                        </p>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-2 right-3 left-3 flex items-center justify-between text-[11px] text-slate-200">
                          <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px]">
                            {article.categoryLabel}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Eye className="w-3 h-3" />
                            {article.views}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Dedicated Arabic Cinema & Movies Hub */}
              <div id="cinema-hub" className="max-w-4xl mx-auto px-4 pt-4 border-t border-[#35373a]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Film className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-white">
                        محرك البحث المتقدم للأفلام والترجمات العربية
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      يدعم البحث المباشر عن كافة الأفلام الكلاسيكية والأكواد السينمائية مع الترجمة العربية والمصادر الموثقة
                    </p>
                  </div>

                  <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl shrink-0">
                    {filteredMovies.length} فيلماً وعملاً معتمداً
                  </span>
                </div>

                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={movieSearchQuery}
                      onChange={e => setMovieSearchQuery(e.target.value)}
                      placeholder="ابحث باسم الفيلم أو الكود (مثال: Dirty Grandpa, 1976, NSPS, JUL, Orpheline)..."
                      className="w-full h-11 pr-10 pl-4 bg-[#2a2b2e] border border-[#3c4043] focus:border-amber-500 focus:outline-none rounded-xl text-xs text-white placeholder-slate-400 shadow-md"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={selectedMovieCategory}
                    onChange={e => setSelectedMovieCategory(e.target.value)}
                    className="h-11 px-3 bg-[#2a2b2e] border border-[#3c4043] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">جميع التصنيفات</option>
                    <option value="كلاسيكي السبعينات">كلاسيكي السبعينات</option>
                    <option value="أفلام روائية ودراما">أفلام روائية ودراما</option>
                    <option value="سينما أوروبية وفرنسية">سينما أوروبية وفرنسية</option>
                    <option value="أكواد وأعمال سينمائية خاصة">أكواد سينمائية خاصة (NSPS/JUL/ADN)</option>
                    <option value="أفلام معاصرة">أفلام معاصرة</option>
                  </select>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMovies.map(movie => (
                    <div
                      key={movie.id}
                      className="bg-[#2a2b2e] border border-[#383a3e] hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                              {movie.category}
                            </span>
                            {movie.year && (
                              <span className="text-[10px] text-slate-400 mr-2 font-mono">
                                ({movie.year})
                              </span>
                            )}
                          </div>
                          {movie.rating && (
                            <span className="text-[11px] text-amber-400 font-bold">
                              ★ {movie.rating}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium">
                          {movie.arabicTitle}
                        </p>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {movie.synopsis}
                        </p>

                        {/* Search Query Pill */}
                        <div className="p-2 bg-[#1e2024] rounded-lg border border-[#323438] text-[10px] font-mono text-slate-300 flex items-center justify-between">
                          <span className="truncate">{movie.query}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(movie.query);
                              alert('تم نسخ عبارة البحث المترجمة للحافظة!');
                            }}
                            className="text-amber-400 hover:text-amber-300 mr-1 shrink-0"
                            title="نسخ للبحث"
                          >
                            نسخ
                          </button>
                        </div>
                      </div>

                      {/* Movie Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-[#35373a] flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            // Trigger media detection and play
                            onNavigateTab(movie.sampleVideoUrl);
                            videoInterceptor.detectMediaUrl(
                              movie.sampleVideoUrl,
                              movie.verifiedLinks[0]?.url || 'https://google.com',
                              movie.title
                            );
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>معاينة واعتراض</span>
                        </button>

                        <button
                          onClick={() => setActiveMovieModal(movie)}
                          className="p-1.5 bg-[#34363b] hover:bg-[#3f4147] text-slate-200 rounded-xl transition-colors"
                          title="عرض كافة الروابط الموثقة"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Case 5: Real Full-Screen Web Page Frame with Safe Proxy Engine */
            <div className="w-full h-full flex-1 flex flex-col relative bg-white">
              <iframe
                title={tab?.title || 'Web Viewport'}
                src={
                  renderMode === 'proxy'
                    ? `/api/proxy?url=${encodeURIComponent(currentUrl)}`
                    : currentUrl
                }
                className="w-full h-full flex-1 border-0 bg-white"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                onError={() => {
                  setIframeError(true);
                  setRenderMode('proxy');
                }}
              />

              {/* Informative Floating Status Bar */}
              <div
                dir="rtl"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-[#1e2024]/95 border border-[#3a3d44] text-slate-200 px-4 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-slate-300 text-[11px] truncate max-w-xs">{currentUrl}</span>
                </div>

                <div className="flex items-center gap-2 border-r border-[#3a3d44] pr-2">
                  <button
                    onClick={() => setRenderMode(prev => (prev === 'proxy' ? 'direct' : 'proxy'))}
                    className="px-2 py-1 bg-[#32353b] hover:bg-[#3d4047] text-slate-200 rounded text-[11px] font-semibold transition-colors"
                  >
                    {renderMode === 'proxy' ? 'وضع الوكيل الآمن (نشط)' : 'الوضع المباشر'}
                  </button>

                  <button
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>نافذة كاملة</span>
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

      {/* Movie Details Modal */}
      {activeMovieModal && (
        <div dir="rtl" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f2125] border border-[#3c4043] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                  {activeMovieModal.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{activeMovieModal.title}</h3>
                <p className="text-xs text-slate-400">{activeMovieModal.arabicTitle}</p>
              </div>
              <button
                onClick={() => setActiveMovieModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2b2d33]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#161719] p-3 rounded-xl border border-white/5">
              {activeMovieModal.synopsis}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">الروابط المباشرة الموثقة للفيلم:</h4>
              <div className="space-y-1.5">
                {activeMovieModal.verifiedLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveMovieModal(null);
                      onNavigateTab(link.url);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-[#26282c] hover:bg-[#303238] rounded-xl text-xs text-slate-200 transition-colors border border-white/5"
                  >
                    <span className="font-medium">{link.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  const url = activeMovieModal.sampleVideoUrl;
                  const title = activeMovieModal.title;
                  setActiveMovieModal(null);
                  onNavigateTab(url);
                  videoInterceptor.detectMediaUrl(url, url, title);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>تشغيل الفيديو واعتراضه الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
