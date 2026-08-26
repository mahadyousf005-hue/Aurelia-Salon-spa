import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './src/server/app';

const PORT = process.env.PORT || 3000;

// In production, serve the built Vite SPA from dist/
const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');
app.use(express.static(distPath));

// For SPA client-side routing, serve index.html for any unmatched route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Aurelia Salon & Spa Full-Stack Server running on port ${PORT}`);
  console.log(`🌿 API routes available at http://localhost:${PORT}/api/`);
});
