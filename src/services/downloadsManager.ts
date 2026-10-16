import { DownloadJob, DownloadType } from '../types';
import { settingsStore } from './settingsStore';

type DownloadListener = (event: { type: 'added' | 'updated' | 'removed'; job?: DownloadJob; id?: string }) => void;

class DownloadsManager {
  private jobs = new Map<string, DownloadJob>();
  private activeIntervals = new Map<string, any>();
  private listeners = new Set<DownloadListener>();

  constructor() {
    this.loadFromStorage();
    if (this.jobs.size === 0) {
      this.seedInitialJobs();
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem('chromium_clone_downloads_v3');
      if (raw) {
        const list: DownloadJob[] = JSON.parse(raw);
        list.forEach(j => {
          // Reset any dangling 'active' job to 'paused' on refresh
          if (j.status === 'active') j.status = 'paused';
          this.jobs.set(j.id, j);
        });
      }
    } catch (e) {
      console.warn('Failed to load downloads cache', e);
    }
  }

  private saveToStorage() {
    try {
      const list = Array.from(this.jobs.values());
      localStorage.setItem('chromium_clone_downloads_v3', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  private seedInitialJobs() {
    const job1: DownloadJob = {
      id: 'job_4k_nature_demo',
      type: 'mp4',
      title: 'Cinematic 4K Ocean Wildlife Documentary.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      filePath: '/home/user/Downloads/ChromiumClone/BigBuckBunny.mp4',
      totalBytes: 158008374,
      receivedBytes: 158008374,
      status: 'done',
      progress: 1,
      speed: 0,
      startedAt: Date.now() - 3600000,
      finishedAt: Date.now() - 3550000,
      createdAt: Date.now() - 3600000,
    };

    const job2: DownloadJob = {
      id: 'job_hls_live_stream',
      type: 'hls',
      title: 'HLS Live Broadcast Stream Archive (m3u8).mp4',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      filePath: '/home/user/Downloads/ChromiumClone/mux_stream_merged.mp4',
      totalBytes: 42000000,
      receivedBytes: 29400000,
      status: 'active',
      progress: 0.70,
      speed: 3840000, // ~3.8 MB/s
      startedAt: Date.now() - 120000,
      finishedAt: 0,
      createdAt: Date.now() - 120000,
    };

    const job3: DownloadJob = {
      id: 'job_mse_youtube_clip',
      type: 'mse',
      title: 'YouTube MSE Encrypted Buffer [Merged Video+Audio].mp4',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      filePath: '/home/user/Downloads/ChromiumClone/yt_mse_stream_2026.mp4',
      totalBytes: 25000000,
      receivedBytes: 12500000,
      status: 'paused',
      progress: 0.50,
      speed: 0,
      startedAt: Date.now() - 60000,
      finishedAt: 0,
      createdAt: Date.now() - 60000,
    };

    this.jobs.set(job1.id, job1);
    this.jobs.set(job2.id, job2);
    this.jobs.set(job3.id, job3);
    this.saveToStorage();

    // Start simulation for active job
    this.runJobSimulation(job2.id);
  }

  public get maxConcurrent(): number {
    return Math.max(1, settingsStore.get('downloads.concurrent') || 3);
  }

  public createJob(params: {
    id?: string;
    type: DownloadType;
    title?: string;
    url: string;
    filePath?: string;
    totalBytes?: number;
  }): DownloadJob {
    const jobId = params.id || 'job_' + Math.random().toString(36).slice(2, 10);
    const saveDir = settingsStore.get('downloads.saveDir') || '/home/user/Downloads/ChromiumClone';
    const filename = (params.title || 'download').replace(/[/\\?%*:|"<>]/g, '_') + (params.type === 'hls' || params.type === 'mse' ? '.mp4' : '');
    const defaultPath = params.filePath || `${saveDir}/${filename}`;

    const job: DownloadJob = {
      id: jobId,
      type: params.type,
      title: params.title || params.url || 'تنزيل جديد',
      url: params.url,
      filePath: defaultPath,
      totalBytes: params.totalBytes || 35000000,
      receivedBytes: 0,
      status: 'pending',
      progress: 0,
      speed: 0,
      startedAt: 0,
      finishedAt: 0,
      error: null,
      createdAt: Date.now(),
    };

    this.jobs.set(jobId, job);
    this.saveToStorage();
    this.emitChange({ type: 'added', job });

    // Check concurrency and trigger download
    this.checkQueue();
    return job;
  }

  public startJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'active';
    job.startedAt = job.startedAt || Date.now();
    this.updateJob(id, { status: 'active' });
    this.runJobSimulation(id);
  }

  private runJobSimulation(id: string) {
    if (this.activeIntervals.has(id)) return;

    const interval = setInterval(() => {
      const job = this.jobs.get(id);
      if (!job || job.status !== 'active') {
        clearInterval(interval);
        this.activeIntervals.delete(id);
        return;
      }

      // Max speed limit check
      const maxSpeedSetting = settingsStore.get('downloads.maxSpeedMBps') || 0; // 0 = unlimited
      const targetSpeed = maxSpeedSetting > 0 ? maxSpeedSetting * 1024 * 1024 : 4500000 + Math.random() * 2000000;
      const stepBytes = Math.floor(targetSpeed * 0.5); // per 500ms

      const nextReceived = Math.min(job.totalBytes, job.receivedBytes + stepBytes);
      const progress = job.totalBytes > 0 ? nextReceived / job.totalBytes : 0;

      if (nextReceived >= job.totalBytes) {
        clearInterval(interval);
        this.activeIntervals.delete(id);
        this.updateJob(id, {
          receivedBytes: job.totalBytes,
          progress: 1,
          speed: 0,
          status: 'done',
          finishedAt: Date.now(),
        });
        this.checkQueue();
      } else {
        this.updateJob(id, {
          receivedBytes: nextReceived,
          progress,
          speed: targetSpeed,
        });
      }
    }, 500);

    this.activeIntervals.set(id, interval);
  }

  private checkQueue() {
    const activeCount = Array.from(this.jobs.values()).filter(j => j.status === 'active').length;
    if (activeCount < this.maxConcurrent) {
      const nextPending = Array.from(this.jobs.values()).find(j => j.status === 'pending');
      if (nextPending) {
        this.startJob(nextPending.id);
      }
    }
  }

  public updateJob(id: string, patch: Partial<DownloadJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch);
    this.saveToStorage();
    this.emitChange({ type: 'updated', job });
  }

  public removeJob(id: string) {
    if (this.activeIntervals.has(id)) {
      clearInterval(this.activeIntervals.get(id));
      this.activeIntervals.delete(id);
    }
    this.jobs.delete(id);
    this.saveToStorage();
    this.emitChange({ type: 'removed', id });
  }

  public cancelJob(id: string) {
    if (this.activeIntervals.has(id)) {
      clearInterval(this.activeIntervals.get(id));
      this.activeIntervals.delete(id);
    }
    this.updateJob(id, { status: 'cancelled', finishedAt: Date.now(), speed: 0 });
    this.checkQueue();
  }

  public pauseJob(id: string) {
    if (this.activeIntervals.has(id)) {
      clearInterval(this.activeIntervals.get(id));
      this.activeIntervals.delete(id);
    }
    this.updateJob(id, { status: 'paused', speed: 0 });
    this.checkQueue();
  }

  public resumeJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;
    this.updateJob(id, { status: 'active' });
    this.runJobSimulation(id);
  }

  public clearCompleted() {
    for (const [id, job] of this.jobs) {
      if (['done', 'error', 'cancelled'].includes(job.status)) {
        this.removeJob(id);
      }
    }
  }

  public list(): DownloadJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  public getActiveCount(): number {
    return Array.from(this.jobs.values()).filter(j => j.status === 'active' || j.status === 'pending').length;
  }

  public subscribe(cb: DownloadListener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emitChange(payload: { type: 'added' | 'updated' | 'removed'; job?: DownloadJob; id?: string }) {
    this.listeners.forEach(cb => {
      try { cb(payload); } catch (e) { console.error(e); }
    });
  }
}

export const downloadsManager = new DownloadsManager();
