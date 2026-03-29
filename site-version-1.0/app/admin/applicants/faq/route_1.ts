import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const applicantFaqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().optional(),
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
      await prisma.applicantFaq.delete({ where: { id } });
      revalidatePath('/applicants');
      revalidatePath('/admin');
      revalidatePath('/admin/applicants');
    }

    return redirectTo(request, '?faqDeleted=1');
  }

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
    await prisma.applicantFaq.update({ where: { id }, data });
  } else {
    await prisma.applicantFaq.create({ data });
  }

  revalidatePath('/applicants');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  return redirectTo(request, '?faqSaved=1');
}
