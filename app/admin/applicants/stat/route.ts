import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const applicantAdmissionStatSchema = z.object({
  category: z.enum(['budget', 'paid']),
  year: z.number().int().min(2000).max(2100),
  passingScore: z.number().int().min(0).max(400),
  averageScore: z.number().int().min(0).max(400).nullable(),
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
      await prisma.applicantAdmissionStat.delete({ where: { id } });
      revalidatePath('/applicants');
      revalidatePath('/admin');
      revalidatePath('/admin/applicants');
    }

    return redirectTo(request, '?statDeleted=1');
  }

  const category = String(formData.get('category') || '').trim() as 'budget' | 'paid';
  const averageRaw = String(formData.get('averageScore') || '').trim();

  const parsed = applicantAdmissionStatSchema.parse({
    category,
    year: Number(formData.get('year') || 0),
    passingScore: Number(formData.get('passingScore') || 0),
    averageScore: category === 'budget' && averageRaw ? Number(averageRaw) : null,
  });

  const data = {
    category: parsed.category,
    year: parsed.year,
    passingScore: parsed.passingScore,
    averageScore: parsed.category === 'budget' ? parsed.averageScore : null,
  };

  if (id) {
    await prisma.applicantAdmissionStat.update({
      where: { id },
      data,
    });
  } else {
    await prisma.applicantAdmissionStat.upsert({
      where: {
        category_year: {
          category: data.category,
          year: data.year,
        },
      },
      update: data,
      create: data,
    });
  }

  revalidatePath('/applicants');
  revalidatePath('/admin');
  revalidatePath('/admin/applicants');
  return redirectTo(request, '?statSaved=1');
}
