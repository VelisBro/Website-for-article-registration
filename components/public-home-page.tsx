import Link from 'next/link';
import { splitLines } from '@/lib/format';
import { getSiteSettings } from '@/lib/site-data';

export default async function PublicHomePage() {
  const settings = await getSiteSettings();
  const directions = splitLines(settings.homeDirections);

  return (
    <main>
      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              {settings.heroBadge}
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {settings.heroTitle}
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                {settings.heroSubtitle}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-white/70">
              {settings.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:scale-[1.02]"
              >
                О кафедре
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Основные направления
            </p>

            <div className="mt-6 grid gap-4">
              {directions.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="whitespace-pre-line text-base leading-7 text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-fuchsia-500/10 p-8 shadow-2xl backdrop-blur-xl lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {settings.applicantsBadge}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {settings.applicantsTitle}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-white/70">{settings.applicantsDescription}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/applicants"
                className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] transition hover:scale-[1.02]"
              >
                Материалы для поступления
              </Link>
              <Link
                href="/teachers"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Смотреть преподавателей
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
