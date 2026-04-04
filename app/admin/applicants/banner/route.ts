import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const applicantsBannerSchema = z.object({
  applicantsBadge: z.string().min(2),
  applicantsTitle: z.string().min(3),
  applicantsDescription: z.string().min(10),
});

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  }

  const formData = await request.formData();
  const parsed = applicantsBannerSchema.parse({
    applicantsBadge: String(formData.get('applicantsBadge') || '').trim(),
    applicantsTitle: String(formData.get('applicantsTitle') || '').trim(),
    applicantsDescription: String(formData.get('applicantsDescription') || '').trim(),
  });

  const current = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
  if (!current) {
    return NextResponse.redirect(new URL('/admin/settings', request.url), 303);
  }

  await prisma.siteSettings.update({
    where: { id: current.id },
    data: parsed,
  });

  revalidatePath('/');
  revalidatePath('/applicants');
  revalidatePath('/admin/settings');
  revalidatePath('/admin/applicants');
  return NextResponse.redirect(new URL('/admin/applicants?bannerSaved=1', request.url), 303);
}
