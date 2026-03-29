import Link from 'next/link';
import PublicHomePage from '@/components/public-home-page';

const stats = [
  { value: '09.03.01', label: 'бакалавриат — Информатика и вычислительная техника' },
  { value: '09.04.01', label: 'магистратура — Информатика и вычислительная техника' },
  { value: 'ИУ-5', label: 'системы обработки информации и управления' },
];

const features = [
  'Инженерная школа и современные IT-подходы',
  'Проектное обучение и прикладные исследования',
  'Аналитика данных и интеллектуальные системы',
  'Подготовка к карьере в разработке и системном проектировании',
];

const directions = [
  'Интеллектуальные системы',
  'Обработка информации',
  'Системы управления',
  'Инженерное программное обеспечение',
  'Аналитика данных',
  'Цифровые проекты',
];

export default function HomePage() {
  return <PublicHomePage />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyHomePage() {
  return (
    <main>
      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              Кафедра ИУ-5 · цифровая инженерия и интеллектуальные системы
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Сильная IT-кафедра
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                для технологий будущего
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Кафедра ИУ-5 объединяет фундаментальную инженерную подготовку,
              современные цифровые технологии, обработку информации, системы
              управления и практико-ориентированное обучение.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:scale-[1.02]"
              >
                О кафедре
              </Link>
              <Link
                href="/teachers"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Сотрудники
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Ключевые параметры
            </p>

            <div className="mt-6 space-y-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-base leading-7 text-white/85">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Навигация по сайту
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Отдельные страницы для ключевых разделов кафедры
            </h2>
            <p className="mt-6 text-base leading-8 text-white/70">
              Сайт построен как полноценный современный портал: новости,
              описание кафедры, преподаватели и контакты вынесены на отдельные
              страницы. Это удобно и выглядит профессионально.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/news"
                className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
              >
                Новости
              </Link>
              <Link
                href="/contacts"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Контакты
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold text-white">
              Основные направления
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {directions.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/85"
                >
                  {item}
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
                Для абитуриентов и студентов
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Следите за жизнью кафедры и знакомьтесь с преподавателями
              </h2>
              <p className="mt-4 leading-8 text-white/70">
                На сайте можно публиковать новости, анонсы мероприятий,
                достижения студентов, информацию о поступлении и материалы
                о научной и образовательной деятельности.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/news"
                className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] transition hover:scale-[1.02]"
              >
                Открыть новости
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
