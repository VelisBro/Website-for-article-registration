import YandexMap from '@/components/yandex-map';
import { getSiteSettings } from '@/lib/site-data';

export default async function PublicContactsPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Контакты</p>

        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{settings.contactsTitle}</h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/70">
          {settings.contactsDescription}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Контакты</h2>

            <div className="mt-6 space-y-4 text-white/75">
              <p>Телефон: {settings.contactsPhone}</p>
              <p>Email: {settings.contactsEmail}</p>
              <p>Адрес: {settings.contactsAddress}</p>
              <p>Часы работы: {settings.contactsWorkingHours}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Карта</h2>

            <div className="mt-6 flex justify-center">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <YandexMap />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
