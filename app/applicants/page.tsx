import Image from 'next/image';
import Link from 'next/link';
import { submitApplicantQuestionAction } from '@/app/applicants/actions';
import ApplicantsCategoryToggle from '@/components/applicants-category-toggle';
import { formatRuDateTime } from '@/lib/format';
import {
  getApplicantAdmissionStats,
  getApplicantMaterials,
  getSiteSettings,
} from '@/lib/site-data';

type ApplicantsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type StaticApplicantFaq = {
  id: string;
  question: string;
  questionAuthor: string | null;
  answerAuthor: string | null;
  answeredAt: Date | null;
  answer: React.ReactNode;
};

const APPLICANT_FAQS: StaticApplicantFaq[] = [
  {
    id: 'static-admission',
    question: 'Поступление',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: (
      <>
        <p>Поступление возможно двумя способами:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            по результатам олимпиад (перечень олимпиад, дающих льготы при поступлении, доступен
            на сайте МГТУ им. Н.Э. Баумана:{' '}
            <Link
              href="https://mirror.bmstu.ru/documents"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 transition hover:text-cyan-200"
            >
              mirror.bmstu.ru/documents
            </Link>
            );
          </li>
          <li>по результатам ЕГЭ при наборе необходимого количества баллов.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'static-career',
    question: 'Кем вы станете после обучения',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: (
      <>
        <p>
          Кафедра «Системы обработки информации и управления» готовит специалистов в области
          разработки систем управления для экономических и организационных структур различного
          масштаба — от малых и средних предприятий до отраслевых и государственных систем.
        </p>
        <p className="mt-4">В процессе обучения студенты осваивают:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>архитектуру информационных систем;</li>
          <li>разработку прикладного программного обеспечения для бизнес-процессов;</li>
          <li>
            работу с базами данных, хранилищами и озёрами данных, графами знаний и
            блокчейн-технологиями;
          </li>
          <li>создание и поддержку серверных платформ, систем интеграции и IoT-решений;</li>
          <li>технологии виртуальной и дополненной реальности.</li>
        </ul>
        <p className="mt-4">
          Особое внимание уделяется технологиям искусственного интеллекта: нейросетям, машинному
          обучению, обработке речи, изображений и видео, а также интеллектуальным системам
          принятия решений.
        </p>
        <p className="mt-4">
          В результате выпускники становятся востребованными IT-специалистами, разработчиками и
          архитекторами интеллектуальных систем управления.
        </p>
      </>
    ),
  },
  {
    id: 'static-practice',
    question: 'Практика и научная деятельность',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: (
      <>
        <p>Во время обучения студенты проходят практику у партнёров кафедры.</p>
        <p className="mt-4">
          Также каждый студент участвует в научных конференциях и проектах — это является
          обязательной частью образовательного процесса.
        </p>
      </>
    ),
  },
  {
    id: 'static-classes',
    question: 'Где проходят занятия',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: (
      <>
        <p>Занятия проходят в разных корпусах университета, преимущественно:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>в Главном учебном корпусе (ГУК);</li>
          <li>в новых учебных корпусах (новом кампусе).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'static-employment',
    question: 'Трудоустройство',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: (
      <p>
        Выпускники кафедры успешно работают в ведущих компаниях, таких как +IT, Роскосмос, BaseALT, Газпром, Яндекс,
        Mail.ru Group, РЖД, RTSoft, ВКонтакте, Ozon Tech, КРОК, Роснефть, Ростех, ОАК.
      </p>
    ),
  },
  {
    id: 'static-military',
    question: 'Военная кафедра',
    questionAuthor: null,
    answerAuthor: null,
    answeredAt: null,
    answer: <p>Да, на нашей кафедре предусмотрена возможность обучения на военной кафедре.</p>,
  },
];

export default async function ApplicantsPage({ searchParams }: ApplicantsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [settings, materials, admissionStats] = await Promise.all([
    getSiteSettings(),
    getApplicantMaterials(),
    getApplicantAdmissionStats(),
  ]);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {settings.applicantsBadge}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {settings.applicantsTitle}
          </h1>
          <div className="mt-6 whitespace-pre-line text-lg leading-8 text-white/70">
            {settings.applicantsDescription}
          </div>
        </div>

        {resolvedSearchParams.questionSent ? (
          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
            Вопрос отправлен. Мы передали его администратору. После обработки ответ появится в разделе FAQ.
          </div>
        ) : null}

        {resolvedSearchParams.questionError ? (
          <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
            Вопрос должен содержать минимум 5 символов.
          </div>
        ) : null}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {materials.map((material) => (
            <article
              key={material.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              {material.imageUrl ? (
                <div className="relative aspect-[16/9] border-b border-white/10 bg-black/20">
                  <Image
                    src={material.imageUrl}
                    alt={material.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-4"
                  />
                </div>
              ) : null}

              {material.videoUrl ? (
                <div className="border-b border-white/10 bg-black/30 p-4">
                  <video
                    src={material.videoUrl}
                    controls
                    preload="metadata"
                    className="aspect-video w-full rounded-2xl border border-white/10 bg-black"
                  />
                </div>
              ) : null}

              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-semibold text-white">{material.title}</h2>
                <div className="mt-4 whitespace-pre-line text-white/72">{material.description}</div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {material.linkUrl ? (
                    <Link
                      href={material.linkUrl}
                      target="_blank"
                      className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
                    >
                      {material.buttonLabel || 'Открыть материал'}
                    </Link>
                  ) : null}

                  {material.fileUrl ? (
                    <Link
                      href={material.fileUrl}
                      target="_blank"
                      className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Скачать файл
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        {!materials.length ? <ApplicantsCategoryToggle stats={admissionStats} /> : null}

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Часто задаваемые вопросы</h2>
            <div className="mt-8 grid gap-4">
              {APPLICANT_FAQS.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-white/80 transition open:bg-black/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white marker:hidden">
                    <span>{faq.question}</span>
                    <span className="text-2xl leading-none text-cyan-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-white/10 pt-4 leading-7 text-white/72">
                    {faq.questionAuthor || faq.answeredAt ? (
                      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <span>Вопрос от: {faq.questionAuthor?.trim() || 'Не указано'}</span>
                          {faq.answeredAt ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                              Обработан
                            </span>
                          ) : null}
                        </div>
                        <span>
                          Дата ответа: {faq.answeredAt ? formatRuDateTime(faq.answeredAt) : 'не указана'}
                        </span>
                      </div>
                    ) : null}
                    {faq.answer}
                    {faq.answerAuthor ? (
                      <p className="mt-3 text-sm text-cyan-200">Ответил: {faq.answerAuthor}</p>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Не нашли ответ?
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Задайте вопрос</h2>
            <form action={submitApplicantQuestionAction} className="mt-6 grid gap-4">
              <textarea
                name="question"
                rows={6}
                placeholder="Например: какие предметы нужны для поступления и есть ли проходные баллы за прошлые годы?"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                required
              />
              <button
                type="submit"
                className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
              >
                Отправить вопрос
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}

