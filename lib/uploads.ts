import { mkdir, rm, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const allowedImageTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const allowedDocumentTypes = new Map([
  ['application/pdf', '.pdf'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
  ['application/vnd.ms-excel', '.xls'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xlsx'],
  ['application/vnd.ms-powerpoint', '.ppt'],
  ['application/vnd.openxmlformats-officedocument.presentationml.presentation', '.pptx'],
  ['text/plain', '.txt'],
  ['application/zip', '.zip'],
  ['application/x-zip-compressed', '.zip'],
  ['application/vnd.rar', '.rar'],
]);

const allowedVideoTypes = new Map([
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['video/quicktime', '.mov'],
]);

async function saveUpload(file: File, targetDir: string, extension: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const now = new Date();
  const relativeDir = path.join(
    'uploads',
    targetDir,
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, '0'),
  );
  const absoluteDir = path.join(process.cwd(), 'public', relativeDir);

  await mkdir(absoluteDir, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  const absolutePath = path.join(absoluteDir, fileName);

  await writeFile(absolutePath, bytes);

  return `/${relativeDir.replaceAll(path.sep, '/')}/${fileName}`;
}

function normalizeManagedUploadUrl(url: string) {
  return url.split(/[?#]/, 1)[0];
}

export function isManagedUploadUrl(url: string | null | undefined) {
  return Boolean(url && normalizeManagedUploadUrl(url).startsWith('/uploads/'));
}

function resolveManagedUploadPath(url: string) {
  const normalizedUrl = normalizeManagedUploadUrl(url);
  const relativePath = normalizedUrl.replace(/^\//, '').replaceAll('/', path.sep);
  const publicDir = path.resolve(process.cwd(), 'public');
  const uploadsDir = path.resolve(publicDir, 'uploads');
  const absolutePath = path.resolve(publicDir, relativePath);

  if (!absolutePath.startsWith(uploadsDir)) {
    throw new Error(`Refusing to delete file outside managed uploads: ${normalizedUrl}`);
  }

  return absolutePath;
}

export async function deleteManagedUpload(url: string | null | undefined) {
  if (!isManagedUploadUrl(url)) {
    return;
  }

  const managedUrl = url as string;

  try {
    await rm(resolveManagedUploadPath(managedUrl), { force: true });
  } catch (error) {
    console.error('Failed to delete managed upload', { url: managedUrl, error });
  }
}

export async function deleteReplacedManagedUpload(previous: string | null | undefined, next: string | null | undefined) {
  if (!previous || previous === next) {
    return;
  }

  await deleteManagedUpload(previous);
}

export async function saveImageUpload(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = allowedImageTypes.get(file.type);

  if (!extension) {
    throw new Error('Допустимы только JPG, PNG и WEBP');
  }

  return saveUpload(file, 'images', extension);
}

export async function saveFileUpload(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = allowedDocumentTypes.get(file.type);

  if (!extension) {
    throw new Error('Допустимы PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP и RAR');
  }

  return saveUpload(file, 'files', extension);
}

export async function saveVideoUpload(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = allowedVideoTypes.get(file.type);

  if (!extension) {
    throw new Error('Допустимы MP4, WEBM и MOV');
  }

  return saveUpload(file, 'videos', extension);
}
