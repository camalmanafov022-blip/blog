import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function hostingStoragePlugin(): Plugin {
  return {
    name: 'hosting-storage-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api.php') || url.startsWith('/api/data')) {
          const dataFilePath = path.resolve(__dirname, 'data.json');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');

          if (req.method === 'GET') {
            try {
              if (fs.existsSync(dataFilePath)) {
                const content = fs.readFileSync(dataFilePath, 'utf-8');
                res.end(JSON.stringify({ success: true, storage: 'hosting_data_json', data: JSON.parse(content) }));
              } else {
                res.end(JSON.stringify({ success: true, storage: 'hosting_data_json', data: { articles: [], videos: [] } }));
              }
            } catch (e) {
              res.end(JSON.stringify({ success: false, error: String(e) }));
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                let current = fs.existsSync(dataFilePath) ? JSON.parse(fs.readFileSync(dataFilePath, 'utf-8')) : { articles: [], videos: [] };

                if (parsed.articles || parsed.action === 'save_all') {
                  current = { ...current, ...parsed };
                } else if (parsed.article) {
                  const art = parsed.article;
                  const idx = (current.articles || []).findIndex((a: any) => a.id === art.id);
                  if (idx > -1) {
                    current.articles[idx] = art;
                  } else {
                    current.articles = [art, ...(current.articles || [])];
                  }
                } else if (parsed.id && url.includes('delete_article')) {
                  current.articles = (current.articles || []).filter((a: any) => a.id !== parsed.id);
                } else if (parsed.video) {
                  const vid = parsed.video;
                  const idx = (current.videos || []).findIndex((v: any) => v.id === vid.id);
                  if (idx > -1) {
                    current.videos[idx] = vid;
                  } else {
                    current.videos = [vid, ...(current.videos || [])];
                  }
                } else if (parsed.id && url.includes('delete_video')) {
                  current.videos = (current.videos || []).filter((v: any) => v.id !== parsed.id);
                }

                current.updatedAt = Date.now();
                fs.writeFileSync(dataFilePath, JSON.stringify(current, null, 2), 'utf-8');
                res.end(JSON.stringify({ success: true, message: 'Hosting data.json yeniləndi' }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: String(err) }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), hostingStoragePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
