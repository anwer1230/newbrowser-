/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserTab, ToastMessage } from './types';
import { BrowserTabs } from './components/browser/BrowserTabs';
import { BrowserToolbar } from './components/browser/BrowserToolbar';
import { BrowserViewport } from './components/browser/BrowserViewport';
import { DownloadsPanel } from './components/downloads/DownloadsPanel';
import { SettingsModal } from './components/settings/SettingsModal';
import { VideoLibraryModal } from './components/library/VideoLibraryModal';
import { VpnModal } from './components/vpn/VpnModal';
import { HlsDownloadModal } from './components/hls/HlsDownloadModal';
import { CodeExportModal } from './components/code_export/CodeExportModal';
import { ToastContainer } from './components/toasts/ToastContainer';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { downloadsManager } from './services/downloadsManager';
import { wireguardService } from './services/wireguardService';
import { videoInterceptor } from './services/videoInterceptor';

const INITIAL_TABS: BrowserTab[] = [
  {
    id: 'tab_yt_demo',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'YouTube Stream - MSE Auto-Capture',
    loading: false,
    canBack: false,
    canForward: false,
    history: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    historyIndex: 0,
  },
  {
    id: 'tab_hls_demo',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    title: 'Mux Broadcast HLS (m3u8)',
    loading: false,
    canBack: false,
    canForward: false,
    history: ['https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'],
    historyIndex: 0,
  },
  {
    id: 'tab_google',
    url: 'https://www.google.com',
    title: 'Google',
    loading: false,
    canBack: false,
    canForward: false,
    history: ['https://www.google.com'],
    historyIndex: 0,
  },
];

export default function App() {
  const [tabs, setTabs] = useState<BrowserTab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab_yt_demo');

  // Modals & Panels
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isVpnOpen, setIsVpnOpen] = useState(false);
  const [isHlsOpen, setIsHlsOpen] = useState(false);
  const [hlsInitialUrl, setHlsInitialUrl] = useState('');
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Statuses
  const [downloadsBadgeCount, setDownloadsBadgeCount] = useState(downloadsManager.getActiveCount());
  const [isVpnConnected, setIsVpnConnected] = useState(wireguardService.status().connected);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Hook downloads count listener
    const unsubDl = downloadsManager.subscribe(() => {
      setDownloadsBadgeCount(downloadsManager.getActiveCount());
    });

    // Hook VPN status listener
    const unsubVpn = wireguardService.subscribe(() => {
      setIsVpnConnected(wireguardService.status().connected);
    });

    // Hook VideoInterceptor toasts
    videoInterceptor.setToastEmitter(msg => {
      const id = 'toast_' + Math.random().toString(36).slice(2, 9);
      const newToast: ToastMessage = { ...msg, id };
      setToasts(prev => [...prev.slice(-4), newToast]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    });

    return () => {
      unsubDl();
      unsubVpn();
    };
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Tab Handlers
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) {
      // Keep at least one tab
      const newTab: BrowserTab = {
        id: 'tab_' + Math.random().toString(36).slice(2, 8),
        url: 'https://www.google.com',
        title: 'علامة تبويب جديدة',
        loading: false,
        canBack: false,
        canForward: false,
        history: ['https://www.google.com'],
        historyIndex: 0,
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      return;
    }

    const filtered = tabs.filter(t => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      setActiveTabId(filtered[0].id);
    }
  };

  const handleNewTab = (url: string = 'https://www.google.com') => {
    const id = 'tab_' + Math.random().toString(36).slice(2, 8);
    const newTab: BrowserTab = {
      id,
      url,
      title: url.includes('google') ? 'Google' : 'علامة تبويب جديدة',
      loading: false,
      canBack: false,
      canForward: false,
      history: [url],
      historyIndex: 0,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
  };

  const handleNavigate = (rawUrl: string) => {
    let target = rawUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(target)) {
        target = 'https://' + target;
      } else {
        target = 'https://www.google.com/search?q=' + encodeURIComponent(target);
      }
    }

    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTabId) {
          const nextHist = t.history.slice(0, t.historyIndex + 1);
          nextHist.push(target);
          return {
            ...t,
            url: target,
            title: target.split('/')[2] || target,
            loading: true,
            history: nextHist,
            historyIndex: nextHist.length - 1,
            canBack: nextHist.length > 1,
            canForward: false,
          };
        }
        return t;
      })
    );

    // Simulate load completion after 300ms
    setTimeout(() => {
      setTabs(prev =>
        prev.map(t => {
          if (t.id === activeTabId) {
            return { ...t, loading: false };
          }
          return t;
        })
      );
    }, 300);
  };

  const handleBack = () => {
    if (!activeTab || !activeTab.canBack) return;
    const newIdx = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[newIdx];
    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: prevUrl,
            historyIndex: newIdx,
            canBack: newIdx > 0,
            canForward: true,
          };
        }
        return t;
      })
    );
  };

  const handleForward = () => {
    if (!activeTab || !activeTab.canForward) return;
    const newIdx = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[newIdx];
    setTabs(prev =>
      prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: nextUrl,
            historyIndex: newIdx,
            canBack: true,
            canForward: newIdx < t.history.length - 1,
          };
        }
        return t;
      })
    );
  };

  const handleReload = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, loading: true } : t))
    );
    setTimeout(() => {
      setTabs(prev =>
        prev.map(t => (t.id === activeTabId ? { ...t, loading: false } : t))
      );
    }, 400);
  };

  const handleOpenHlsUrl = (url: string) => {
    setHlsInitialUrl(url);
    setIsHlsOpen(true);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#202124] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Chrome Tab Strip */}
      <BrowserTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleNewTab('https://www.google.com')}
      />

      {/* 2. Chrome Navigation Toolbar */}
      <BrowserToolbar
        activeTab={activeTab}
        downloadsBadgeCount={downloadsBadgeCount}
        isVpnConnected={isVpnConnected}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onToggleDownloads={() => setIsDownloadsOpen(prev => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenVpn={() => setIsVpnOpen(true)}
        onOpenHls={() => {
          setHlsInitialUrl('');
          setIsHlsOpen(true);
        }}
        onOpenCode={() => setIsCodeExportOpen(true)}
        onToggleDevTools={() => setDevToolsOpen(prev => !prev)}
        devToolsOpen={devToolsOpen}
        onOpenInstall={() => setShowInstallBanner(true)}
      />

      {/* PWA App Install Banner (Prompt like AI Studio) */}
      <PWAInstallBanner forceShow={showInstallBanner} />

      {/* 3. Browser Viewport and DevTools */}
      <BrowserViewport
        tab={activeTab}
        devToolsOpen={devToolsOpen}
        onNavigateTab={handleNavigate}
      />

      {/* 4. Unified Downloads Floating Panel (Stage 3) */}
      <DownloadsPanel
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
      />

      {/* 5. Complete 8-section Settings Modal (Stage 3) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenLibrary={() => {
          setIsSettingsOpen(false);
          setIsLibraryOpen(true);
        }}
      />

      {/* 6. Offline Video Library & Player Modal (Stage 1 & 2) */}
      <VideoLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      {/* 7. WireGuard VPN Control Modal (Stage 1) */}
      <VpnModal
        isOpen={isVpnOpen}
        onClose={() => setIsVpnOpen(false)}
      />

      {/* 8. Manual HLS Downloader Modal (Stage 2) */}
      <HlsDownloadModal
        isOpen={isHlsOpen}
        initialUrl={hlsInitialUrl}
        onClose={() => setIsHlsOpen(false)}
      />

      {/* 9. Native Electron Code & Exporter Modal */}
      <CodeExportModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
      />

      {/* 10. Real-time Video Detection Toasts Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        onOpenHlsUrl={handleOpenHlsUrl}
      />
    </div>
  );
}
