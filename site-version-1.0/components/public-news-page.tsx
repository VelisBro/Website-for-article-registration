import Link from 'next/link';
import { formatRuDate } from '@/lib/format';
import { getPublishedNews } from '@/lib/site-data';

export default async function PublicNewsPage() {
  const newsItems = await getPublishedNews();
  const mainNews = newsItems.filter((item) => item.featured).sort((a, b) => {
    const left = a.featuredRank ?? 999;
    const right = b.featuredRank ?? 999;
    return left - right;
  });
  const regularNews = newsItems.filter((item) => !item.featured);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Новости</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Новости кафедры
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Главные новости кафедры и текущие объявления для студентов, преподавателей и абитуриентов.
          </p>
        </div>

        {mainNews.length > 0 ? (
          <div className="mt-12 space-y-8">
            {mainNews.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:bg-white/[0.08]"
              >
                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[320px] bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(168,85,247,0.14))]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
                    <div className="absolute left-6 top-6 flex flex-wrap gap-3">
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Главная новость
                      </span>
                      {item.featuredRank ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/75">
                          Уровень {item.featuredRank}
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-sm text-white/55">{formatRuDate(item.publishedAt)}</p>
                      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-8">
                    <p className="text-base leading-8 text-white/72">{item.excerpt}</p>
                    <div className="mt-8">
                      <Link
                        href={`/news/${item.slug}`}
                        className="inline-flex items-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816] shadow-[0_0_25px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {regularNews.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {regularNews.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.08]"
              >
                <div className="relative h-52 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(168,85,247,0.12))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur">
                      {item.category}
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold text-white">{item.title}</h2>
                  </div>
                </div>

                <div className="flex min-h-[240px] flex-col p-6">
                  <p className="text-sm text-white/45">{formatRuDate(item.publishedAt)}</p>
                  <p className="mt-4 flex-1 text-sm leading-7 text-white/72">{item.excerpt}</p>
                  <div className="mt-6">
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
