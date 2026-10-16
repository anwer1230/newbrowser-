import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-web-proxy-plugin',
        configureServer(server) {
          server.middlewares.use('/api/proxy', async (req, res) => {
            try {
              const urlObj = new URL(req.url || '', 'http://localhost:3000');
              const targetUrl = urlObj.searchParams.get('url');
              if (!targetUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('Missing url parameter');
                return;
              }

              const normalized = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') 
                ? targetUrl 
                : `https://${targetUrl}`;

              const target = new URL(normalized);
              const response = await fetch(target.toString(), {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
                },
                redirect: 'follow',
              });

              const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
              res.setHeader('Content-Type', contentType);
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

              if (contentType.includes('text/html')) {
                let html = await response.text();
                const baseTag = `<base href="${target.origin}${target.pathname}">`;
                if (html.includes('<head>')) {
                  html = html.replace('<head>', `<head>${baseTag}`);
                } else if (html.includes('<HEAD>')) {
                  html = html.replace('<HEAD>', `<HEAD>${baseTag}`);
                } else {
                  html = baseTag + html;
                }
                res.end(html);
              } else {
                const arrayBuffer = await response.arrayBuffer();
                res.end(Buffer.from(arrayBuffer));
              }
            } catch (err: any) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(`
                <div style="font-family:sans-serif;padding:2rem;text-align:center;direction:rtl;background:#1e2024;color:#f1f5f9;min-height:100vh;">
                  <h2>تعذر تحميل الصفحة عبر وكيل الويب</h2>
                  <p style="color:#94a3b8;">${err.message}</p>
                </div>
              `);
            }
          });
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Chromium Clone Browser',
          short_name: 'Chromium',
          description: 'متصفح متكامل مع تسجيل الفيديو والتنزيلات المشفرة ومزامنة WebDAV و VPN',
          theme_color: '#202124',
          background_color: '#202124',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
