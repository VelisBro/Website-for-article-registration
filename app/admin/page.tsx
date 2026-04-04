import Link from 'next/link';
import AdminShell from '@/components/admin-shell-v2';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [postsCount, featuredCount, publishedCount] = await Promise.all([
    prisma.newsPost.count(),
    prisma.newsPost.count({ where: { featured: true, isPublished: true } }),
    prisma.newsPost.count({ where: { isPublished: true } }),
  ]);

  return (
    <AdminShell
      title="Управление сайтом"
      description="Здесь можно редактировать тексты сайта, публиковать новости и управлять визуальным наполнением без правки кода."
      activeHref="/admin"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Всего новостей', value: postsCount },
          { label: 'Опубликовано', value: publishedCount },
          { label: 'Главных новостей', value: featuredCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">{item.label}</p>
            <p className="mt-4 text-4xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Новости и анонсы</h2>
          <p className="mt-4 text-base leading-8 text-white/70">
            Создавайте новости, загружайте изображения, управляйте датой публикации и отмечайте главные материалы.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admin/news"
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
            >
              Открыть раздел новостей
            </Link>
            <Link
              href="/admin/news/new"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85"
            >
              Добавить новость
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Тексты сайта</h2>
          <p className="mt-4 text-base leading-8 text-white/70">
            Меняйте основной текст главной страницы, блока о кафедре и контактной информации прямо из браузера.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/settings"
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
            >
              Редактировать настройки
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
