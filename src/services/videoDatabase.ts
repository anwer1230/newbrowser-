import { VideoItem, VideoKind, VideoStatus } from '../types';

const VIDEO_DB_KEY = 'chromium_clone_videodb_v2';

const SEED_VIDEOS: VideoItem[] = [
  {
    id: 'vid_big_buck_bunny',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    pageUrl: 'https://archive.org/details/big-buck-bunny',
    title: 'Big Buck Bunny (4K Ultra HD Open Movie)',
    mime: 'video/mp4',
    kind: 'progressive',
    duration: 596,
    watched_seconds: 245,
    bytes_cached: 158008374,
    total_bytes: 158008374,
    file_path: '/userData/videos/vid_big_buck_bunny.mp4',
    status: 'complete',
    created_at: Date.now() - 86400000 * 2,
    updated_at: Date.now() - 3600000,
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'vid_elephants_dream',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    pageUrl: 'https://orange.blender.org',
    title: 'Elephants Dream (Blender Studio Master)',
    mime: 'video/mp4',
    kind: 'mse',
    duration: 653,
    watched_seconds: 180,
    bytes_cached: 140000000,
    total_bytes: 140000000,
    file_path: '/userData/videos/vid_elephants_dream.mp4',
    status: 'complete',
    created_at: Date.now() - 86400000,
    updated_at: Date.now() - 7200000,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'vid_hls_mux_stream',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    pageUrl: 'https://mux.com/demo-stream',
    title: 'Big Buck Bunny (HLS Multi-Bitrate Stream)',
    mime: 'application/vnd.apple.mpegurl',
    kind: 'hls',
    duration: 634,
    watched_seconds: 0,
    bytes_cached: 84000000,
    total_bytes: 84000000,
    file_path: '/userData/videos/vid_hls_mux_stream.mp4',
    status: 'complete',
    created_at: Date.now() - 43200000,
    updated_at: Date.now() - 14400000,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'vid_for_bigger_escapes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    pageUrl: 'https://youtube.com/watch?v=escapes',
    title: 'Chromecast Nature Escapes (MSE Auto-Merged)',
    mime: 'video/mp4',
    kind: 'mse',
    duration: 15,
    watched_seconds: 10,
    bytes_cached: 15000000,
    total_bytes: 15000000,
    file_path: '/userData/videos/vid_for_bigger_escapes.mp4',
    status: 'complete',
    created_at: Date.now() - 1800000,
    updated_at: Date.now() - 600000,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
];

class VideoDatabase {
  private videos = new Map<string, VideoItem>();
  private listeners = new Set<() => void>();

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(VIDEO_DB_KEY);
      if (raw) {
        const list: VideoItem[] = JSON.parse(raw);
        list.forEach(v => this.videos.set(v.id, v));
        return;
      }
    } catch (e) {
      console.warn('Failed to load video DB', e);
    }
    SEED_VIDEOS.forEach(v => this.videos.set(v.id, v));
    this.save();
  }

  private save() {
    try {
      const list = Array.from(this.videos.values());
      localStorage.setItem(VIDEO_DB_KEY, JSON.stringify(list));
      this.listeners.forEach(cb => cb());
    } catch (e) {
      console.error(e);
    }
  }

  public upsertVideo(params: {
    id: string;
    url: string;
    pageUrl?: string;
    title?: string;
    mime?: string;
    kind?: VideoKind;
    streamUrl?: string;
  }): string {
    const existing = this.videos.get(params.id);
    const now = Date.now();
    if (existing) {
      existing.title = params.title || existing.title;
      existing.pageUrl = params.pageUrl || existing.pageUrl;
      existing.updated_at = now;
      if (params.streamUrl) existing.streamUrl = params.streamUrl;
      this.save();
      return params.id;
    }

    const item: VideoItem = {
      id: params.id,
      url: params.url,
      pageUrl: params.pageUrl || '',
      title: params.title || params.url,
      mime: params.mime || 'video/mp4',
      kind: params.kind || 'progressive',
      duration: 0,
      watched_seconds: 0,
      bytes_cached: 0,
      total_bytes: 0,
      file_path: `/userData/videos/${params.id}.mp4`,
      status: 'recording',
      created_at: now,
      updated_at: now,
      streamUrl: params.streamUrl || (params.url.startsWith('http') ? params.url : undefined),
    };

    this.videos.set(params.id, item);
    this.save();
    return params.id;
  }

  public updateProgress(id: string, patch: {
    watched_seconds?: number;
    duration?: number;
    bytes_cached?: number;
    total_bytes?: number;
    status?: VideoStatus;
  }) {
    const item = this.videos.get(id);
    if (!item) return;

    if (patch.watched_seconds !== undefined) item.watched_seconds = patch.watched_seconds;
    if (patch.duration !== undefined) item.duration = patch.duration;
    if (patch.bytes_cached !== undefined) item.bytes_cached = patch.bytes_cached;
    if (patch.total_bytes !== undefined) item.total_bytes = patch.total_bytes;
    if (patch.status !== undefined) item.status = patch.status;
    item.updated_at = Date.now();

    this.save();
  }

  public listVideos(): VideoItem[] {
    return Array.from(this.videos.values()).sort((a, b) => b.updated_at - a.updated_at);
  }

  public getVideo(id: string): VideoItem | undefined {
    return this.videos.get(id);
  }

  public deleteVideo(id: string): boolean {
    const ok = this.videos.delete(id);
    if (ok) this.save();
    return ok;
  }

  public getContinueWatchingList(): VideoItem[] {
    return this.listVideos().filter(v =>
      v.status === 'complete' &&
      v.duration > 30 &&
      v.watched_seconds > 5 &&
      v.watched_seconds < v.duration - 15
    ).slice(0, 10);
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const videoDatabase = new VideoDatabase();
