import Link from 'next/link';
import { notFound } from 'next/navigation';
import { newsItems } from '@/data/news';
import PublicNewsDetailPage from '@/components/public-news-detail-page';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicNewsDetailPage slug={slug} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function LegacyNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = newsItems.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <Link
          href="/news"
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-cyan-400/30 hover:text-cyan-300"
        >
          ← Назад к новостям
        </Link>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
              {article.category}
            </span>

            {article.mainLevel !== null && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Уровень {article.mainLevel}
              </span>
            )}

            <span className="text-sm text-white/45">{formatDate(article.date)}</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/72">
            {article.excerpt}
          </p>

          <div className="mt-10 space-y-6">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-base leading-8 text-white/75">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
