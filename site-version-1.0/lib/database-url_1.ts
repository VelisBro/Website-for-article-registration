import { copyFileSync, existsSync, mkdirSync } from 'fs';
import os from 'os';
import path from 'path';

function toFileUrl(absolutePath: string) {
  return `file:${absolutePath.replaceAll('\\', '/')}`;
}

export function normalizeDatabaseUrl() {
  const current = process.env.DATABASE_URL;

  if (!current) {
    return;
  }

  if (current.startsWith('file:./')) {
    const relativePath = current.slice('file:'.length);
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const normalizedAbsolutePath = relocateSqliteFromOneDrive(absolutePath);
    process.env.DATABASE_URL = toFileUrl(normalizedAbsolutePath);
  }
}

function relocateSqliteFromOneDrive(absolutePath: string) {
  const isWindows = process.platform === 'win32';
  const isInsideOneDrive = absolutePath.toLowerCase().includes('\\onedrive\\');
  const isSqlite = absolutePath.toLowerCase().endsWith('.db');

  if (!isWindows || !isInsideOneDrive || !isSqlite) {
    return absolutePath;
  }

  const appName = 'iu5-site';
  const targetDir = path.join(os.tmpdir(), appName);
  const targetPath = path.join(targetDir, path.basename(absolutePath));

  mkdirSync(targetDir, { recursive: true });

  if (!existsSync(targetPath) && existsSync(absolutePath)) {
    copyFileSync(absolutePath, targetPath);
  }

  return targetPath;
}
