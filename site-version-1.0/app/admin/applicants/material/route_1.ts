import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveFileUpload, saveImageUpload, saveVideoUpload } from '@/lib/uploads';

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

function redirectTo(request: Request, search: string) {
  return NextResponse.redirect(new URL(`/admin/applicants${search}`, request.url), 303);
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  const formData = await request.formData();
  const intent = String(formData.get('intent') || 'save');
  const id = String(formData.get('id') || '').trim();

  if (intent === 'delete') {
    if (id) {
      await prisma.applicantMaterial.delete({ where: { id } });
      revalidatePath('/');
      revalidatePath('/applicants');
      revalidatePath('/admin');
      revalidatePath('/admin/applicants');
    }

    return redirectTo(request, '?deleted=1');
  }

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
  const uploadedImage = imageFile instanceof File && imageFile.size > 0 ? await saveImageUpload(imageFile) : null;
  const uploadedVideo = videoFile instanceof File && videoFile.size > 0 ? await saveVideoUpload(videoFile) : null;
  const uploadedFile = attachmentFile instanceof File && attachmentFile.size > 0 ? await saveFileUpload(attachmentFile) : null;

  const data = {
    title: parsed.title,
    description: parsed.description,
    imageUrl: uploadedImage || parsed.imageUrl || existing?.imageUrl || null,
    videoUrl: uploadedVideo || parsed.videoUrl || existing?.videoUrl || null,
    fileUrl: uploadedFile || parsed.fileUrl || existing?.fileUrl || null,
    linkUrl: parsed.linkUrl || null,
    buttonLabel: parsed.buttonLabel || null,
    sortOrder: parsed.sortOrder,
    isPublished: parsed.isPublished,
  };

  if (existing) {
    await prisma.applicantMaterial.update({ where: { id: existing.id }, data });
  } else {
    await prisma.applicantMaterial.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/applicants');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  return redirectTo(request, '?saved=1');
}
