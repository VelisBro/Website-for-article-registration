import { getSiteSettings } from '@/lib/site-data';

export default async function PublicAboutPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          О кафедре
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{settings.aboutTitle}</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/70">
          {settings.aboutDescription}
        </p>
      </section>
    </main>
  );
}
