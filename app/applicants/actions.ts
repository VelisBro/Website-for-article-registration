'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const questionSchema = z.object({
  questionAuthor: z.string().max(120).optional(),
  question: z.string().min(5).max(1000),
});

export async function submitApplicantQuestionAction(formData: FormData) {
  const parsed = questionSchema.safeParse({
    questionAuthor: String(formData.get('questionAuthor') || '').trim() || undefined,
    question: String(formData.get('question') || '').trim(),
  });

  if (!parsed.success) {
    redirect('/applicants?questionError=tooShort');
  }

  await prisma.applicantFaq.create({
    data: {
      question: parsed.data.question,
      questionAuthor: parsed.data.questionAuthor || null,
      answer: null,
      answerAuthor: null,
      answeredAt: null,
      isPublished: false,
      sortOrder: 0,
    },
  });

  revalidatePath('/applicants');
  revalidatePath('/questions');
  revalidatePath('/admin/applicants');
  revalidatePath('/admin/questions');
  redirect('/applicants?questionSent=1');
}
