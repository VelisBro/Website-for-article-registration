import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
              Кафедра ИУ-5
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Современная IT-кафедра
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              Сайт кафедры с информацией о направлениях подготовки,
              преподавателях, новостях, образовательной деятельности и
              возможностях для абитуриентов и студентов.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
              Разделы
            </h4>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <p><Link href="/" className="transition hover:text-cyan-300">Главная</Link></p>
              <p><Link href="/applicants" className="transition hover:text-cyan-300">Абитуриентам</Link></p>
              <p><Link href="/about" className="transition hover:text-cyan-300">О кафедре</Link></p>
              <p><Link href="/news" className="transition hover:text-cyan-300">Новости</Link></p>
              <p><Link href="/teachers" className="transition hover:text-cyan-300">Сотрудники</Link></p>
              <p><Link href="/contacts" className="transition hover:text-cyan-300">Контакты</Link></p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
              Контакты
            </h4>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <p>Телефон: 8(499)267-54-34</p>
              <p>Email: iu5@bmstu.ru</p>
              <p>Адрес: 105005, г. Москва, 2-я Бауманская ул., д. 5, стр. 1, ГУК, 9 этаж.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/40">
          © 2026 Кафедра ИУ-5 «Системы обработки информации и управления» МГТУ им. Н.Э. Баумана.
        </div>
      </div>
    </footer>
  );
}