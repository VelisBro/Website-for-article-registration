const cards = [
  'Фундаментальная инженерная база',
  'Информационные системы и управление',
  'Современные цифровые технологии',
  'Проектная и исследовательская работа',
  'Практико-ориентированное обучение',
  'Подготовка к индустриальной карьере',
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          О кафедре
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Кафедра ИУ-5 — системы обработки информации и управления
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/70">
          Раздел о кафедре может содержать историю, основные направления
          подготовки, научные интересы, лаборатории, индустриальные связи и
          ключевые преимущества для студентов и абитуриентов.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <p className="text-white/85">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">
            Что можно разместить на этой странице
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Историю кафедры',
              'Информацию о направлениях подготовки',
              'Описание лабораторий и проектов',
              'Научные интересы и достижения',
              'Партнеров кафедры',
              'Материалы для абитуриентов',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}