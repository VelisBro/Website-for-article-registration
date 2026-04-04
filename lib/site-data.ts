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

export const getPublicApplicantQuestions = cache(async () => {
  return prisma.applicantFaq.findMany({
    orderBy: [{ answeredAt: 'desc' }, { createdAt: 'desc' }],
  });
});

export async function getFreshAnsweredQuestionsCount() {
  const freshAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return prisma.applicantFaq.count({
    where: {
      answeredAt: {
        gte: freshAfter,
      },
      answer: {
        not: null,
      },
    },
  });
}

export async function getFreshAnsweredQuestionIds() {
  const freshAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const items = await prisma.applicantFaq.findMany({
    where: {
      answeredAt: {
        gte: freshAfter,
      },
      answer: {
        not: null,
      },
    },
    select: {
      id: true,
    },
  });

  return items.map((item) => item.id);
}

export async function getPendingQuestionsCount() {
  return prisma.applicantFaq.count({
    where: {
      OR: [{ answer: null }, { answer: '' }, { answeredAt: null }],
    },
  });
}

export async function getPendingQuestionIds() {
  const items = await prisma.applicantFaq.findMany({
    where: {
      OR: [{ answer: null }, { answer: '' }, { answeredAt: null }],
    },
    select: {
      id: true,
    },
  });

  return items.map((item) => item.id);
}

export async function getLatestAnsweredQuestionAt() {
  const latest = await prisma.applicantFaq.findFirst({
    where: {
      answer: {
        not: null,
      },
      answeredAt: {
        not: null,
      },
    },
    orderBy: {
      answeredAt: 'desc',
    },
    select: {
      answeredAt: true,
    },
  });

  return latest?.answeredAt ?? null;
}

export const getApplicantAdmissionStats = cache(async () => {
  return prisma.applicantAdmissionStat.findMany({
    orderBy: [{ category: 'asc' }, { year: 'desc' }],
  });
});
