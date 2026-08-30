import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './server/app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const distPath = path.join(projectRoot, 'dist');

app.use(express.static(distPath));
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (error: Error | null) => {
    if (error) next();
  });
});

const server = app.listen(PORT, () => {
  console.log(`🌸 Aurelia Salon Backend API running independently on http://localhost:${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Backend is already running on port ${PORT}. Use the existing server.`);
    return;
  }
  console.error(error);
  process.exitCode = 1;
});
