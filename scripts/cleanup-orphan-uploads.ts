import 'dotenv/config';
import { readdir, rm } from 'fs/promises';
import path from 'path';
import { prisma } from '../lib/prisma';
import { isManagedUploadUrl } from '../lib/uploads';

type CleanupMode = 'dry-run' | 'apply';

function normalizeManagedUrl(url: string) {
  return url.split(/[?#]/, 1)[0];
}

function toManagedUrl(relativeToPublic: string) {
  return `/${relativeToPublic.replaceAll(path.sep, '/')}`;
}

async function walkFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(absolutePath);
      }

      if (entry.isFile()) {
        return [absolutePath];
      }

      return [];
    }),
  );

  return nested.flat();
}

async function pruneEmptyDirs(rootDir: string) {
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const absolutePath = path.join(rootDir, entry.name);
    await pruneEmptyDirs(absolutePath);

    const remaining = await readdir(absolutePath);
    if (remaining.length === 0) {
      await rm(absolutePath, { recursive: true, force: true });
    }
  }
}

async function getReferencedUploadUrls() {
  const [newsPosts, teachers, materials] = await Promise.all([
    prisma.newsPost.findMany({ select: { imageUrl: true } }),
    prisma.teacher.findMany({ select: { photoUrl: true } }),
    prisma.applicantMaterial.findMany({
      select: { imageUrl: true, videoUrl: true, fileUrl: true },
    }),
  ]);

  const candidates = [
    ...newsPosts.flatMap((post) => [post.imageUrl]),
    ...teachers.flatMap((teacher) => [teacher.photoUrl]),
    ...materials.flatMap((material) => [material.imageUrl, material.videoUrl, material.fileUrl]),
  ];

  return new Set(
    candidates
      .filter((value): value is string => Boolean(value))
      .filter((value) => isManagedUploadUrl(value))
      .map((value) => normalizeManagedUrl(value)),
  );
}

async function main() {
  const mode: CleanupMode = process.argv.includes('--apply') ? 'apply' : 'dry-run';
  const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const referencedUrls = await getReferencedUploadUrls();
  const filesOnDisk = await walkFiles(publicUploadsDir);

  const orphanFiles = filesOnDisk
    .map((absolutePath) => {
      const relativeToPublic = path.relative(path.join(process.cwd(), 'public'), absolutePath);
      const managedUrl = toManagedUrl(relativeToPublic);
      return { absolutePath, managedUrl };
    })
    .filter((file) => !referencedUrls.has(file.managedUrl));

  console.log(`Mode: ${mode}`);
  console.log(`Referenced managed uploads: ${referencedUrls.size}`);
  console.log(`Files on disk: ${filesOnDisk.length}`);
  console.log(`Orphan files found: ${orphanFiles.length}`);

  if (!orphanFiles.length) {
    return;
  }

  for (const file of orphanFiles) {
    console.log(`${mode === 'apply' ? 'Deleting' : 'Would delete'} ${file.managedUrl}`);
    if (mode === 'apply') {
      await rm(file.absolutePath, { force: true });
    }
  }

  if (mode === 'apply') {
    await pruneEmptyDirs(publicUploadsDir);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
