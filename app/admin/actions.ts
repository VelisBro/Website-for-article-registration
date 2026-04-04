'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { destroyAdminSession, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import {
  deleteManagedUpload,
  deleteReplacedManagedUpload,
  saveFileUpload,
  saveImageUpload,
  saveVideoUpload,
} from '@/lib/uploads';

const settingsSchema = z.object({
  siteTitle: z.string().min(3),
  siteDescription: z.string().min(3),
  heroBadge: z.string().min(3),
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().min(2),
  heroDescription: z.string().min(10),
  homeDirections: z.string().min(5),
  aboutTitle: z.string().min(3),
  aboutDescription: z.string().min(10),
  aboutIntro: z.string(),
  aboutFoundationTitle: z.string(),
  aboutFoundationText: z.string(),
  aboutLeadershipTitle: z.string(),
  aboutLeaders: z.string(),
  aboutDevelopmentTitle: z.string(),
  aboutDevelopmentItems: z.string(),
  aboutAchievementsTitle: z.string(),
  aboutAchievementsItems: z.string(),
  aboutTodayTitle: z.string(),
  aboutTodayText: z.string(),
  aboutImagePrimaryUrl: z.string(),
  aboutImagePrimaryCaption: z.string(),
  aboutImageSecondaryUrl: z.string(),
  aboutImageSecondaryCaption: z.string(),
  contactsTitle: z.string().min(3),
  contactsDescription: z.string().min(10),
  contactsPhone: z.string().min(3),
  contactsEmail: z.email(),
  contactsAddress: z.string().min(5),
  contactsWorkingHours: z.string().min(3),
  applicantsBadge: z.string().min(2),
  applicantsTitle: z.string().min(3),
  applicantsDescription: z.string().min(10),
});

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  publishedAt: z.iso.datetime({ local: true }),
  featured: z.boolean(),
  featuredRank: z.number().int().min(1).max(20).nullable(),
  isPublished: z.boolean(),
});

const teacherSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  bio: z.string().min(10),
  tags: z.string().default(''),
  photoUrl: z.string().optional(),
  sortOrder: z.number().int().min(0).max(999),
  isPublished: z.boolean(),
});

const applicantMaterialSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(3),
  imageUrl: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  fileUrl: z.string().optional(),
  linkUrl: z.string().url().optional().or(z.literal('')),
  buttonLabel: z.string().optional(),
  sortOrder: z.number().int().min(0).max(999),
  isPublished: z.boolean(),
});

const applicantFaqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().optional(),
  sortOrder: z.number().int().min(0).max(999),
  isPublished: z.boolean(),
});

export async function logoutAction() {
  await destroyAdminSession();
  redirect('/login');
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  const primaryImageFile = formData.get('aboutImagePrimaryFile');
  const secondaryImageFile = formData.get('aboutImageSecondaryFile');

  const parsed = settingsSchema.parse({
    siteTitle: String(formData.get('siteTitle') || ''),
    siteDescription: String(formData.get('siteDescription') || ''),
    heroBadge: String(formData.get('heroBadge') || ''),
    heroTitle: String(formData.get('heroTitle') || ''),
    heroSubtitle: String(formData.get('heroSubtitle') || ''),
    heroDescription: String(formData.get('heroDescription') || ''),
    homeDirections: String(formData.get('homeDirections') || ''),
    aboutTitle: String(formData.get('aboutTitle') || ''),
    aboutDescription: String(formData.get('aboutDescription') || ''),
    aboutIntro: String(formData.get('aboutIntro') || ''),
    aboutFoundationTitle: String(formData.get('aboutFoundationTitle') || ''),
    aboutFoundationText: String(formData.get('aboutFoundationText') || ''),
    aboutLeadershipTitle: String(formData.get('aboutLeadershipTitle') || ''),
    aboutLeaders: String(formData.get('aboutLeaders') || ''),
    aboutDevelopmentTitle: String(formData.get('aboutDevelopmentTitle') || ''),
    aboutDevelopmentItems: String(formData.get('aboutDevelopmentItems') || ''),
    aboutAchievementsTitle: String(formData.get('aboutAchievementsTitle') || ''),
    aboutAchievementsItems: String(formData.get('aboutAchievementsItems') || ''),
    aboutTodayTitle: String(formData.get('aboutTodayTitle') || ''),
    aboutTodayText: String(formData.get('aboutTodayText') || ''),
    aboutImagePrimaryUrl: String(formData.get('aboutImagePrimaryUrl') || '').trim(),
    aboutImagePrimaryCaption: String(formData.get('aboutImagePrimaryCaption') || ''),
    aboutImageSecondaryUrl: String(formData.get('aboutImageSecondaryUrl') || '').trim(),
    aboutImageSecondaryCaption: String(formData.get('aboutImageSecondaryCaption') || ''),
    contactsTitle: String(formData.get('contactsTitle') || ''),
    contactsDescription: String(formData.get('contactsDescription') || ''),
    contactsPhone: String(formData.get('contactsPhone') || ''),
    contactsEmail: String(formData.get('contactsEmail') || ''),
    contactsAddress: String(formData.get('contactsAddress') || ''),
    contactsWorkingHours: String(formData.get('contactsWorkingHours') || ''),
    applicantsBadge: String(formData.get('applicantsBadge') || ''),
    applicantsTitle: String(formData.get('applicantsTitle') || ''),
    applicantsDescription: String(formData.get('applicantsDescription') || ''),
  });

  const current = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  const uploadedPrimaryImage =
    primaryImageFile instanceof File && primaryImageFile.size > 0
      ? await saveImageUpload(primaryImageFile)
      : null;
  const uploadedSecondaryImage =
    secondaryImageFile instanceof File && secondaryImageFile.size > 0
      ? await saveImageUpload(secondaryImageFile)
      : null;

  const data = {
    ...parsed,
    aboutImagePrimaryUrl: uploadedPrimaryImage || parsed.aboutImagePrimaryUrl,
    aboutImageSecondaryUrl: uploadedSecondaryImage || parsed.aboutImageSecondaryUrl,
  };

  if (!current) {
    await prisma.siteSettings.create({ data });
  } else {
    await prisma.siteSettings.update({
      where: { id: current.id },
      data,
    });
    await Promise.all([
      deleteReplacedManagedUpload(current.aboutImagePrimaryUrl, data.aboutImagePrimaryUrl),
      deleteReplacedManagedUpload(current.aboutImageSecondaryUrl, data.aboutImageSecondaryUrl),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contacts');
  revalidatePath('/applicants');
  revalidatePath('/admin/settings');
  redirect('/admin/settings?saved=1');
}

export async function saveNewsPostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const requestedSlug = String(formData.get('slug') || '').trim();
  const imageFile = formData.get('imageFile');

  const parsed = postSchema.parse({
    title: String(formData.get('title') || '').trim(),
    slug: requestedSlug || undefined,
    category: String(formData.get('category') || '').trim(),
    excerpt: String(formData.get('excerpt') || '').trim(),
    content: String(formData.get('content') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim() || undefined,
    publishedAt: String(formData.get('publishedAt') || ''),
    featured: formData.get('featured') === 'on',
    featuredRank:
      formData.get('featured') === 'on' && String(formData.get('featuredRank') || '').trim()
        ? Number(formData.get('featuredRank'))
        : null,
    isPublished: formData.get('isPublished') === 'on',
  });

  const slug = slugify(parsed.slug || parsed.title);

  if (!slug) {
    throw new Error('Не удалось сформировать slug');
  }

  const existing = id ? await prisma.newsPost.findUnique({ where: { id } }) : null;
  const upload =
    imageFile instanceof File && imageFile.size > 0 ? await saveImageUpload(imageFile) : null;
  const imageUrl = upload || parsed.imageUrl || null;

  const data = {
    title: parsed.title,
    slug,
    category: parsed.category,
    excerpt: parsed.excerpt,
    content: parsed.content,
    imageUrl,
    publishedAt: new Date(parsed.publishedAt),
    featured: parsed.featured,
    featuredRank: parsed.featured ? parsed.featuredRank : null,
    isPublished: parsed.isPublished,
  };

  if (existing) {
    await prisma.newsPost.update({ where: { id: existing.id }, data });
    await deleteReplacedManagedUpload(existing.imageUrl, imageUrl);
  } else {
    await prisma.newsPost.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/admin');
  revalidatePath('/admin/news');
  revalidatePath(`/news/${slug}`);

  if (existing && existing.slug !== slug) {
    revalidatePath(`/news/${existing.slug}`);
  }

  redirect('/admin/news?saved=1');
}

export async function deleteNewsPostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();

  if (!id) {
    redirect('/admin/news');
  }

  const existing = await prisma.newsPost.findUnique({
    where: { id },
  });

  if (existing) {
    await prisma.newsPost.delete({ where: { id } });
    await deleteManagedUpload(existing.imageUrl);
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin');
    revalidatePath('/admin/news');
    revalidatePath(`/news/${existing.slug}`);
  }

  redirect('/admin/news?deleted=1');
}

export async function saveTeacherAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const photoFile = formData.get('photoFile');

  const parsed = teacherSchema.parse({
    name: String(formData.get('name') || '').trim(),
    role: String(formData.get('role') || '').trim(),
    bio: String(formData.get('bio') || '').trim(),
    tags: String(formData.get('tags') || '').trim(),
    photoUrl: String(formData.get('photoUrl') || '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') || 0),
    isPublished: formData.get('isPublished') === 'on',
  });

  const existing = id ? await prisma.teacher.findUnique({ where: { id } }) : null;
  const upload =
    photoFile instanceof File && photoFile.size > 0 ? await saveImageUpload(photoFile) : null;
  const photoUrl = upload || parsed.photoUrl || null;

  const data = {
    name: parsed.name,
    role: parsed.role,
    bio: parsed.bio,
    tags: parsed.tags,
    photoUrl,
    sortOrder: parsed.sortOrder,
    isPublished: parsed.isPublished,
  };

  if (existing) {
    await prisma.teacher.update({
      where: { id: existing.id },
      data,
    });
    await deleteReplacedManagedUpload(existing.photoUrl, photoUrl);
  } else {
    await prisma.teacher.create({ data });
  }

  revalidatePath('/teachers');
  revalidatePath('/admin');
  revalidatePath('/admin/teachers');
  redirect('/admin/teachers?saved=1');
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();

  if (id) {
    const existing = await prisma.teacher.findUnique({ where: { id } });

    await prisma.teacher.delete({ where: { id } });
    await deleteManagedUpload(existing?.photoUrl);
    revalidatePath('/teachers');
    revalidatePath('/admin');
    revalidatePath('/admin/teachers');
  }

  redirect('/admin/teachers?deleted=1');
}

export async function saveApplicantMaterialAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const imageFile = formData.get('imageFile');
  const videoFile = formData.get('videoFile');
  const attachmentFile = formData.get('attachmentFile');

  const parsed = applicantMaterialSchema.parse({
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim() || undefined,
    videoUrl: String(formData.get('videoUrl') || '').trim(),
    fileUrl: String(formData.get('fileUrl') || '').trim() || undefined,
    linkUrl: String(formData.get('linkUrl') || '').trim(),
    buttonLabel: String(formData.get('buttonLabel') || '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') || 0),
    isPublished: formData.get('isPublished') === 'on',
  });

  const existing = id ? await prisma.applicantMaterial.findUnique({ where: { id } }) : null;
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0 ? await saveImageUpload(imageFile) : null;
  const uploadedVideo =
    videoFile instanceof File && videoFile.size > 0 ? await saveVideoUpload(videoFile) : null;
  const uploadedFile =
    attachmentFile instanceof File && attachmentFile.size > 0
      ? await saveFileUpload(attachmentFile)
      : null;

  const data = {
    title: parsed.title,
    description: parsed.description,
    imageUrl: uploadedImage || parsed.imageUrl || null,
    videoUrl: uploadedVideo || parsed.videoUrl || null,
    fileUrl: uploadedFile || parsed.fileUrl || null,
    linkUrl: parsed.linkUrl || null,
    buttonLabel: parsed.buttonLabel || null,
    sortOrder: parsed.sortOrder,
    isPublished: parsed.isPublished,
  };

  if (existing) {
    await prisma.applicantMaterial.update({
      where: { id: existing.id },
      data,
    });
    await Promise.all([
      deleteReplacedManagedUpload(existing.imageUrl, data.imageUrl),
      deleteReplacedManagedUpload(existing.videoUrl, data.videoUrl),
      deleteReplacedManagedUpload(existing.fileUrl, data.fileUrl),
    ]);
  } else {
    await prisma.applicantMaterial.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/applicants');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  redirect('/admin/applicants?saved=1');
}

export async function deleteApplicantMaterialAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();

  if (id) {
    const existing = await prisma.applicantMaterial.findUnique({ where: { id } });

    await prisma.applicantMaterial.delete({ where: { id } });
    await Promise.all([
      deleteManagedUpload(existing?.imageUrl),
      deleteManagedUpload(existing?.videoUrl),
      deleteManagedUpload(existing?.fileUrl),
    ]);
    revalidatePath('/');
    revalidatePath('/applicants');
    revalidatePath('/admin');
    revalidatePath('/admin/applicants');
  }

  redirect('/admin/applicants?deleted=1');
}

export async function saveApplicantFaqAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();

  const parsed = applicantFaqSchema.parse({
    question: String(formData.get('question') || '').trim(),
    answer: String(formData.get('answer') || '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') || 0),
    isPublished: formData.get('isPublished') === 'on',
  });

  const data = {
    question: parsed.question,
    answer: parsed.answer || null,
    sortOrder: parsed.sortOrder,
    isPublished: parsed.isPublished && Boolean(parsed.answer?.trim()),
  };

  if (id) {
    await prisma.applicantFaq.update({
      where: { id },
      data,
    });
  } else {
    await prisma.applicantFaq.create({ data });
  }

  revalidatePath('/applicants');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  redirect('/admin/applicants?faqSaved=1');
}

export async function deleteApplicantFaqAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();

  if (id) {
    await prisma.applicantFaq.delete({ where: { id } });
    revalidatePath('/applicants');
    revalidatePath('/admin');
    revalidatePath('/admin/applicants');
  }

  redirect('/admin/applicants?faqDeleted=1');
}
