import AdminShell from '@/components/admin-shell-v2';
import { saveSiteSettingsAction } from '@/app/admin/actions';
import { getSiteSettings } from '@/lib/site-data';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="Настройки сайта"
      description="Здесь редактируются основные тексты, которые видят посетители на главной странице, в разделе о кафедре и в контактах."
      activeHref="/admin/settings"
    >
      <form
        action={saveSiteSettingsAction}
        encType="multipart/form-data"
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
                  <label className="mb-2 block text-sm text-white/70">Вступительный текст</label>
                  <textarea
                    name="aboutIntro"
                    defaultValue={settings.aboutIntro}
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-cyan-300">Основное изображение</p>
                  <input
                    name="aboutImagePrimaryUrl"
                    defaultValue={settings.aboutImagePrimaryUrl}
                    placeholder="URL изображения или /uploads/..."
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="aboutImagePrimaryCaption"
                    defaultValue={settings.aboutImagePrimaryCaption}
                    placeholder="Подпись к изображению"
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                  <input
                    type="file"
                    name="aboutImagePrimaryFile"
                    accept="image/*"
                    className="w-full rounded-2xl border border-dashed border-white/20 bg-[#050816] px-4 py-3 text-sm text-white/80 file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
                  />
                </div>
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-cyan-300">Дополнительное изображение</p>
                  <input
                    name="aboutImageSecondaryUrl"
                    defaultValue={settings.aboutImageSecondaryUrl}
                    placeholder="URL изображения или /uploads/..."
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="aboutImageSecondaryCaption"
                    defaultValue={settings.aboutImageSecondaryCaption}
                    placeholder="Подпись к изображению"
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                  <input
                    type="file"
                    name="aboutImageSecondaryFile"
                    accept="image/*"
                    className="w-full rounded-2xl border border-dashed border-white/20 bg-[#050816] px-4 py-3 text-sm text-white/80 file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок блока «Основание»</label>
                  <input
                    name="aboutFoundationTitle"
                    defaultValue={settings.aboutFoundationTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Текст блока «Основание»</label>
                  <textarea
                    name="aboutFoundationText"
                    defaultValue={settings.aboutFoundationText}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок блока «Руководство»</label>
                  <input
                    name="aboutLeadershipTitle"
                    defaultValue={settings.aboutLeadershipTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Руководители (каждая строка: Имя | Период)
                  </label>
                  <textarea
                    name="aboutLeaders"
                    defaultValue={settings.aboutLeaders}
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок блока «Развитие»</label>
                  <input
                    name="aboutDevelopmentTitle"
                    defaultValue={settings.aboutDevelopmentTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Пункты развития (каждый пункт с новой строки)
                  </label>
                  <textarea
                    name="aboutDevelopmentItems"
                    defaultValue={settings.aboutDevelopmentItems}
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок блока «Достижения»</label>
                  <input
                    name="aboutAchievementsTitle"
                    defaultValue={settings.aboutAchievementsTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Пункты достижений (каждый пункт с новой строки)
                  </label>
                  <textarea
                    name="aboutAchievementsItems"
                    defaultValue={settings.aboutAchievementsItems}
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Заголовок блока «Сегодня»</label>
                  <input
                    name="aboutTodayTitle"
                    defaultValue={settings.aboutTodayTitle}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Текст блока «Сегодня»</label>
                  <textarea
                    name="aboutTodayText"
                    defaultValue={settings.aboutTodayText}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Дополнительное описание</label>
                  <textarea
                    name="aboutDescription"
                    defaultValue={settings.aboutDescription}
                    rows={5}
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
