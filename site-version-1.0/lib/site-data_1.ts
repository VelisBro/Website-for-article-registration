import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (!settings) {
    throw new Error('Site settings are missing. Run the seed command first.');
  }

  return settings;
});

export const getPublishedNews = cache(async () => {
  return prisma.newsPost.findMany({
    where: { isPublished: true },
    orderBy: [{ featured: 'desc' }, { featuredRank: 'asc' }, { publishedAt: 'desc' }],
  });
});

export const getPublishedNewsBySlug = cache(async (slug: string) => {
  return prisma.newsPost.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });
});

export const getPublishedTeachers = cache(async () => {
  return prisma.teacher.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
});

export const getApplicantMaterials = cache(async () => {
  return prisma.applicantMaterial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
});

export const getPublishedApplicantFaqs = cache(async () => {
  return prisma.applicantFaq.findMany({
    where: {
      isPublished: true,
      answer: {
        not: null,
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
});
