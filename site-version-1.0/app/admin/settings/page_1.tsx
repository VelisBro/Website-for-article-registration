import AdminShell from '@/components/admin-shell-v2';
import { saveSiteSettingsAction } from '@/app/admin/actions';
import { getSiteSettings } from '@/lib/site-data';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="Настройки сайта"
      description="Здесь редактируются основные тексты, которые видят посетители на главной странице, в разделе о кафедре и в контактах."
    >
      <form
        action={saveSiteSettingsAction}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        <div className="grid gap-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Название сайта</label>
              <input
                name="siteTitle"
                defaultValue={settings.siteTitle}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Описание сайта</label>
              <input
                name="siteDescription"
                defaultValue={settings.siteDescription}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-semibold text-white">Главная страница</h2>
            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm text-white/70">Бейдж</label>
                <input
                  name="heroBadge"
                  defaultValue={settings.heroBadge}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Главный заголовок</label>
                  <input
                    name="heroTitle"
                    defaultValue={settings.heroTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Подзаголовок</label>
                  <input
                    name="heroSubtitle"
                    defaultValue={settings.heroSubtitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Описание</label>
                <textarea
                  name="heroDescription"
                  defaultValue={settings.heroDescription}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Основные направления, по одному на строку
                </label>
                <textarea
                  name="homeDirections"
                  defaultValue={settings.homeDirections}
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-semibold text-white">О кафедре</h2>
              <div className="mt-6 grid gap-6">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок</label>
                  <input
                    name="aboutTitle"
                    defaultValue={settings.aboutTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Описание</label>
                  <textarea
                    name="aboutDescription"
                    defaultValue={settings.aboutDescription}
                    rows={8}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-semibold text-white">Контакты</h2>
              <div className="mt-6 grid gap-6">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок</label>
                  <input
                    name="contactsTitle"
                    defaultValue={settings.contactsTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Описание</label>
                  <textarea
                    name="contactsDescription"
                    defaultValue={settings.contactsDescription}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Телефон</label>
                  <input
                    name="contactsPhone"
                    defaultValue={settings.contactsPhone}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Email</label>
                  <input
                    type="email"
                    name="contactsEmail"
                    defaultValue={settings.contactsEmail}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Адрес</label>
                  <input
                    name="contactsAddress"
                    defaultValue={settings.contactsAddress}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Часы работы</label>
                  <input
                    name="contactsWorkingHours"
                    defaultValue={settings.contactsWorkingHours}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-semibold text-white">Абитуриентам</h2>
            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm text-white/70">Бейдж</label>
                <input
                  name="applicantsBadge"
                  defaultValue={settings.applicantsBadge}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Заголовок</label>
                <input
                  name="applicantsTitle"
                  defaultValue={settings.applicantsTitle}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Описание</label>
                <textarea
                  name="applicantsDescription"
                  defaultValue={settings.applicantsDescription}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816]"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
