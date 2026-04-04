import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const applicantFaqSchema = z.object({
  question: z.string().min(5),
  questionAuthor: z.string().max(120).optional(),
  answer: z.string().optional(),
  answerAuthor: z.string().max(120).optional(),
  sortOrder: z.number().int().min(0).max(999),
});

function redirectTo(request: Request, search: string) {
  const referer = request.headers.get('referer');

  if (referer) {
    const refererUrl = new URL(referer);
    if (refererUrl.pathname === '/admin/questions' || refererUrl.pathname === '/admin/applicants') {
      refererUrl.search = search.startsWith('?') ? search : `?${search}`;
      return NextResponse.redirect(refererUrl, 303);
    }
  }

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
      await prisma.applicantFaq.update({
        where: { id },
        data: {
          adminArchived: true,
        },
      });
      revalidatePath('/applicants');
      revalidatePath('/questions');
      revalidatePath('/admin');
      revalidatePath('/admin/applicants');
      revalidatePath('/admin/questions');
    }

    return redirectTo(request, '?faqDeleted=1');
  }

  const parsed = applicantFaqSchema.parse({
    question: String(formData.get('question') || '').trim(),
    questionAuthor: String(formData.get('questionAuthor') || '').trim() || undefined,
    answer: String(formData.get('answer') || '').trim() || undefined,
    answerAuthor: String(formData.get('answerAuthor') || '').trim() || undefined,
    sortOrder: Number(formData.get('sortOrder') || 0),
  });

  const existingFaq = id ? await prisma.applicantFaq.findUnique({ where: { id } }) : null;
  const hasAnswer = Boolean(parsed.answer?.trim());

  if (hasAnswer && !parsed.answerAuthor?.trim()) {
    return redirectTo(request, '?faqSaved=0&faqError=answerAuthorRequired');
  }

  const shouldRefreshAnsweredAt =
    hasAnswer &&
    (!existingFaq ||
      !existingFaq.answeredAt ||
      existingFaq.answer !== (parsed.answer || null) ||
      existingFaq.answerAuthor !== (parsed.answerAuthor || null));

  const data = {
    question: parsed.question,
    questionAuthor: parsed.questionAuthor || null,
    answer: parsed.answer || null,
    answerAuthor: hasAnswer ? parsed.answerAuthor || null : null,
    answeredAt: hasAnswer
      ? shouldRefreshAnsweredAt
        ? new Date()
        : existingFaq?.answeredAt || new Date()
      : null,
    sortOrder: parsed.sortOrder,
    isPublished: hasAnswer,
  };

  const savedFaq = id
    ? await prisma.applicantFaq.update({ where: { id }, data, select: { id: true } })
    : await prisma.applicantFaq.create({ data, select: { id: true } });

  revalidatePath('/applicants');
  revalidatePath('/questions');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  revalidatePath('/admin/questions');
  return redirectTo(request, `?faqSaved=1&faqId=${savedFaq.id}`);
}
