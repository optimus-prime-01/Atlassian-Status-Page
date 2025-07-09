import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let wss;
let broadcastUpdate;

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: process.cwd(),
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Handle all routes
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      // Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      
      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);
      
      // Load server entry
      const { render } = await vite.ssrLoadModule('/src/server/entry.tsx');
      
      // Render the app
      const appHtml = render(url);
      
      // Replace the placeholder with the rendered HTML
      const html = template.replace('<!--ssr-outlet-->', appHtml);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('SSR Error:', e);
      vite.ssrFixStacktrace(e as Error);
      
      // Fallback to client-side rendering
      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        const html = template.replace('<!--ssr-outlet-->', '<div id="root"></div>');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        res.status(500).end('Internal Server Error');
      }
    }
  });
  
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  wss = new WebSocketServer({ server });
  broadcastUpdate = (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(JSON.stringify(data));
    });
  };
}

export { broadcastUpdate };

createServer().catch(console.error);