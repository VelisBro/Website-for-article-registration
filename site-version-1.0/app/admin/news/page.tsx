import Link from 'next/link';
import AdminShell from '@/components/admin-shell-v2';
import { formatRuDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <AdminShell
      title="Новости"
      description="Раздел для управления новостями, анонсами и главными материалами на главной странице."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/news/new"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          Добавить новость
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/75">
                    {post.category}
                  </span>
                  <span className="text-sm text-white/45">{formatRuDate(post.publishedAt)}</span>
                  {post.featured ? (
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                      Главная новость
                    </span>
                  ) : null}
                  {!post.isPublished ? (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                      Черновик
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">{post.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{post.excerpt}</p>
                <p className="mt-3 text-xs text-white/40">/{post.slug}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/news/${post.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85"
                >
                  Открыть
                </Link>
                <Link
                  href={`/admin/news/${post.id}`}
                  className="rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#050816]"
                >
                  Редактировать
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
