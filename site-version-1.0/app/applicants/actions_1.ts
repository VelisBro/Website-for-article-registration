'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const questionSchema = z.object({
  question: z.string().min(5).max(1000),
});

export async function submitApplicantQuestionAction(formData: FormData) {
  const parsed = questionSchema.parse({
    question: String(formData.get('question') || '').trim(),
  });

  await prisma.applicantFaq.create({
    data: {
      question: parsed.question,
      answer: null,
      isPublished: false,
      sortOrder: 0,
    },
  });

  revalidatePath('/applicants');
  revalidatePath('/admin/applicants');
  redirect('/applicants?questionSent=1');
}
