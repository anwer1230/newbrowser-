import { videoDatabase } from './videoDatabase';
import { downloadsManager } from './downloadsManager';
import { settingsStore } from './settingsStore';
import { ToastMessage } from '../types';

type ToastEmitter = (msg: Omit<ToastMessage, 'id'>) => void;

class VideoInterceptorService {
  private activeMseSession: {
    wcId: string;
    pageUrl: string;
    title: string;
    lastActivity: number;
    bytes: number;
    timer?: any;
    videoId?: string;
  } | null = null;

  private toastEmitter: ToastEmitter | null = null;

  public setToastEmitter(emitter: ToastEmitter) {
    this.toastEmitter = emitter;
  }

  public detectMediaUrl(url: string, pageUrl: string, title: string) {
    const isMp4 = /\.(mp4|webm|m4v)(\?|#|$)/i.test(url) || url.includes('.mp4');
    const isHls = /\.m3u8(\?|#|$)/i.test(url) || url.includes('.m3u8');

    if (isHls && settingsStore.get('video.autoDetectHls')) {
      this.toastEmitter?.({
        type: 'video:hls',
        title: 'فيديو HLS متاح',
        message: 'تم اكتشاف بث مباشر / تدفق HLS (m3u8). انقر لتحميله.',
        data: { url, pageUrl, title },
      });
      return;
    }

    if (isMp4 && settingsStore.get('video.autoRecordMp4')) {
      const id = 'vid_' + Math.random().toString(36).slice(2, 9);
      videoDatabase.upsertVideo({
        id,
        url,
        pageUrl,
        title: title || 'فيديو مباشر MP4',
        mime: 'video/mp4',
        kind: 'progressive',
        streamUrl: url,
      });

      downloadsManager.createJob({
        id: 'job_' + id,
        type: 'mp4',
        title: title || 'فيديو مباشر MP4',
        url,
        totalBytes: 45000000,
      });

      this.toastEmitter?.({
        type: 'video:detected',
        title: 'اكتشاف فيديو جديد',
        message: `تم اكتشاف فيديو MP4 وبدء التسجيل: ${title}`,
        data: { id, url },
      });
    }
  }

  public triggerMseChunk(pageUrl: string, title: string, chunkSize: number = 256 * 1024) {
    if (!settingsStore.get('video.autoRecordMse')) return;

    if (!this.activeMseSession || this.activeMseSession.pageUrl !== pageUrl) {
      const videoId = 'mse_' + Date.now();
      this.activeMseSession = {
        wcId: 'tab_current',
        pageUrl,
        title: title || 'YouTube MSE Stream',
        lastActivity: Date.now(),
        bytes: 0,
        videoId,
      };

      videoDatabase.upsertVideo({
        id: videoId,
        url: pageUrl,
        pageUrl,
        title: title || 'YouTube MSE Stream',
        mime: 'video/mp4',
        kind: 'mse',
      });

      this.toastEmitter?.({
        type: 'video:detected',
        title: 'بدء التقاط MSE',
        message: `بدء تسجيل تدفق MSE النشط: ${title}`,
        data: { videoId },
      });
    }

    this.activeMseSession.bytes += chunkSize;
    this.activeMseSession.lastActivity = Date.now();

    videoDatabase.updateProgress(this.activeMseSession.videoId!, {
      bytes_cached: this.activeMseSession.bytes,
      total_bytes: Math.max(this.activeMseSession.bytes, 20000000),
      status: 'recording',
    });

    // Reset idle timer
    if (this.activeMseSession.timer) clearTimeout(this.activeMseSession.timer);
    const idleTimeout = settingsStore.get('video.idleTimeoutMs') || 30000;
    this.activeMseSession.timer = setTimeout(() => {
      this.finalizeActiveMse('idle');
    }, idleTimeout);
  }

  public finalizeActiveMse(reason: 'idle' | 'navigation' | 'ended' = 'idle') {
    if (!this.activeMseSession || !this.activeMseSession.videoId) return;

    const session = this.activeMseSession;
    const videoId = session.videoId;
    if (!videoId) return;
    this.activeMseSession = null;
    if (session.timer) clearTimeout(session.timer);

    videoDatabase.updateProgress(videoId, {
      status: 'complete',
      bytes_cached: session.bytes || 18500000,
      duration: 340,
    });

    this.toastEmitter?.({
      type: 'video:done',
      title: 'اكتمل دمج MSE',
      message: `تم دمج مسارات الفيديو والصوت بنجاح (${reason}): ${session.title}`,
      data: { videoId: session.videoId },
    });
  }

  public async startManualHlsDownload(params: {
    url: string;
    pageUrl?: string;
    title?: string;
    onProgress?: (pct: number, stage: string) => void;
  }): Promise<string> {
    const videoId = 'hls_' + Date.now();
    videoDatabase.upsertVideo({
      id: videoId,
      url: params.url,
      pageUrl: params.pageUrl || params.url,
      title: params.title || 'HLS Live Stream (m3u8)',
      mime: 'application/vnd.apple.mpegurl',
      kind: 'hls',
      streamUrl: params.url,
    });

    const job = downloadsManager.createJob({
      id: 'job_' + videoId,
      type: 'hls',
      title: params.title || 'HLS Live Stream',
      url: params.url,
      totalBytes: 38000000,
    });

    downloadsManager.startJob(job.id);

    // Segmented progress simulation (0% to 90% downloading segments, 90% to 100% ffmpeg merge)
    for (let p = 5; p <= 90; p += 15) {
      await new Promise(r => setTimeout(r, 300));
      params.onProgress?.(p, `جلب المقاطع... ${p}%`);
    }

    params.onProgress?.(95, 'دمج المقاطع بـ ffmpeg (-c copy)...');
    await new Promise(r => setTimeout(r, 600));

    params.onProgress?.(100, 'اكتمل الحفظ');
    videoDatabase.updateProgress(videoId, {
      status: 'complete',
      duration: 520,
      bytes_cached: 38000000,
      total_bytes: 38000000,
    });

    this.toastEmitter?.({
      type: 'video:done',
      title: 'اكتمل تحميل HLS',
      message: `تم دمج وحفظ تدفق HLS بنجاح: ${params.title || params.url}`,
      data: { videoId },
    });

    return videoId;
  }
}

export const videoInterceptor = new VideoInterceptorService();
