import AdminQuestionsPanel from '@/components/admin-questions-panel';
import AdminShell from '@/components/admin-shell-v2';
import { prisma } from '@/lib/prisma';

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const faqs = await prisma.applicantFaq.findMany({
    where: {
      adminArchived: false,
    },
    orderBy: [{ answer: 'asc' }, { isPublished: 'asc' }, { createdAt: 'desc' }],
  });

  const pendingCount = faqs.filter((faq) => !faq.answer || !faq.answerAuthor || !faq.answeredAt).length;

  return (
    <AdminShell
      title="Вопросы"
      description="Управляйте вопросами с сайта в одном месте: просматривайте новые обращения, отвечайте на них и публикуйте ответы."
      activeHref="/admin/questions"
    >
      <AdminQuestionsPanel
        faqs={faqs}
        pendingCount={pendingCount}
        totalCount={faqs.length}
        recentlySavedFaqId={typeof resolvedSearchParams.faqId === 'string' ? resolvedSearchParams.faqId : null}
      />
    </AdminShell>
  );
}
