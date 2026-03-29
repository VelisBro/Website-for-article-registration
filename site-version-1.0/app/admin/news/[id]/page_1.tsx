import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin-shell-v2';
import NewsEditorForm from '@/components/news-editor-form';
import { prisma } from '@/lib/prisma';

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      title="Редактирование новости"
      description="Изменяйте текст, дату публикации, статус и изображение материала."
    >
      <NewsEditorForm post={post} />
    </AdminShell>
  );
}
