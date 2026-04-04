import Image from 'next/image';
import Link from 'next/link';
import AdminQuestionsPanel from '@/components/admin-questions-panel';
import AdminShell from '@/components/admin-shell-v2';
import { formatRuDateTime } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/site-data';

function ApplicantMaterialForm({
  material,
}: {
  material?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    videoUrl: string | null;
    fileUrl: string | null;
    linkUrl: string | null;
    buttonLabel: string | null;
    sortOrder: number;
    isPublished: boolean;
  };
}) {
  return (
    <form
      action="/admin/applicants/material"
      method="post"
      encType="multipart/form-data"
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <input type="hidden" name="id" defaultValue={material?.id} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-white/70">Заголовок</label>
            <input
              name="title"
              defaultValue={material?.title}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Текст</label>
            <textarea
              name="description"
              defaultValue={material?.description}
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
            <p className="mt-2 text-xs text-white/45">Переносы строк сохраняются на сайте.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Ссылка на материал</label>
              <input
                name="linkUrl"
                defaultValue={material?.linkUrl || ''}
                placeholder="https://..."
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Текст кнопки</label>
              <input
                name="buttonLabel"
                defaultValue={material?.buttonLabel || ''}
                placeholder="Открыть"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-white/70">Ссылка на изображение</label>
            <input
              name="imageUrl"
              defaultValue={material?.imageUrl || ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Или загрузить изображение</label>
            <input
              type="file"
              name="imageFile"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Ссылка на видео</label>
            <input
              name="videoUrl"
              defaultValue={material?.videoUrl || ''}
              placeholder="https://... или /uploads/videos/..."
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Или загрузить видео</label>
            <input
              type="file"
              name="videoFile"
              accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Ссылка на файл</label>
            <input
              name="fileUrl"
              defaultValue={material?.fileUrl || ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Или загрузить файл</label>
            <input
              type="file"
              name="attachmentFile"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/zip,application/x-zip-compressed,application/vnd.rar"
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
            />
          </div>

          {material?.imageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image src={material.imageUrl} alt={material.title} fill className="object-contain p-4" />
            </div>
          ) : null}

          {material?.videoUrl ? (
            <div className="grid gap-3">
              <video
                src={material.videoUrl}
                controls
                preload="metadata"
                className="aspect-video w-full rounded-3xl border border-white/10 bg-black"
              />
              <Link
                href={material.videoUrl}
                target="_blank"
                className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/75"
              >
                Сохранённое видео
              </Link>
            </div>
          ) : null}

          {material?.fileUrl ? (
            <Link
              href={material.fileUrl}
              target="_blank"
              className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/75"
            >
              Сохранённый файл
            </Link>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Порядок</label>
              <input
                type="number"
                min="0"
                max="999"
                name="sortOrder"
                defaultValue={material?.sortOrder ?? 0}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={material ? material.isPublished : true}
                className="h-4 w-4 accent-cyan-400"
              />
              Показывать на сайте
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          {material ? 'Сохранить материал' : 'Добавить материал'}
        </button>

        {material ? (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100"
          >
            Удалить
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ApplicantFaqForm({
  faq,
}: {
  faq?: {
    id: string;
    question: string;
    questionAuthor: string | null;
    answer: string | null;
    answerAuthor: string | null;
    answeredAt: Date | null;
    sortOrder: number;
    isPublished: boolean;
  };
}) {
  return (
    <form
      action="/admin/applicants/faq"
      method="post"
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <input type="hidden" name="id" defaultValue={faq?.id} />

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm text-white/70">Вопрос</label>
          <textarea
            name="question"
            defaultValue={faq?.question}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Имя отправителя вопроса</label>
          <input
            name="questionAuthor"
            defaultValue={faq?.questionAuthor || ''}
            placeholder="Например: Олег"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Ответ</label>
          <textarea
            name="answer"
            defaultValue={faq?.answer || ''}
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <p className="mt-2 text-xs text-white/45">Если ответа нет, вопрос можно сохранить как черновик и ответить позже.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Имя администратора</label>
          <input
            name="answerAuthor"
            defaultValue={faq?.answerAuthor || ''}
            placeholder="Например: И.И. Петров"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <p className="mt-2 text-xs text-white/45">
            Дата и время ответа проставляются автоматически при сохранении ответа.
            {faq?.answeredAt ? ` Сейчас сохранено: ${formatRuDateTime(faq.answeredAt)}` : ''}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/70">Порядок</label>
            <input
              type="number"
              min="0"
              max="999"
              name="sortOrder"
              defaultValue={faq?.sortOrder ?? 0}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={faq ? faq.isPublished : true}
              className="h-4 w-4 accent-cyan-400"
            />
            Показывать на сайте
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          {faq ? 'Сохранить вопрос' : 'Добавить FAQ'}
        </button>

        {faq ? (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100"
          >
            Удалить
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ApplicantAdmissionStatForm({
  stat,
  category,
}: {
  stat?: {
    id: string;
    category: string;
    year: number;
    passingScore: number;
    averageScore: number | null;
  };
  category: 'budget' | 'paid';
}) {
  const isBudget = category === 'budget';

  return (
    <form
      action="/admin/applicants/stat"
      method="post"
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <input type="hidden" name="id" defaultValue={stat?.id} />
      <input type="hidden" name="category" value={category} />

      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">
            {stat ? `Точка ${stat.year}` : isBudget ? 'Новая точка графика бюджета' : 'Новая точка графика платного'}
          </h3>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            {isBudget ? 'budget' : 'paid'}
          </span>
        </div>

        <div className={`grid gap-5 ${isBudget ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <div>
            <label className="mb-2 block text-sm text-white/70">Год</label>
            <input
              type="number"
              min="2000"
              max="2100"
              name="year"
              defaultValue={stat?.year ?? ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              {isBudget ? 'ОК / проходной балл' : 'Проходной балл'}
            </label>
            <input
              type="number"
              min="0"
              max="400"
              name="passingScore"
              defaultValue={stat?.passingScore ?? ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          {isBudget ? (
            <div>
              <label className="mb-2 block text-sm text-white/70">Средний балл</label>
              <input
                type="number"
                min="0"
                max="400"
                name="averageScore"
                defaultValue={stat?.averageScore ?? ''}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                required
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          {stat ? 'Сохранить точку' : 'Добавить точку'}
        </button>

        {stat ? (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100"
          >
            Удалить
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default async function AdminApplicantsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [settings, materials, faqs, admissionStats] = await Promise.all([
    getSiteSettings(),
    prisma.applicantMaterial.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.applicantFaq.findMany({
      where: {
        adminArchived: false,
      },
      orderBy: [{ isPublished: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.applicantAdmissionStat.findMany({
      orderBy: [{ category: 'asc' }, { year: 'desc' }],
    }),
  ]);

  const budgetStats = admissionStats.filter((item) => item.category === 'budget');
  const paidStats = admissionStats.filter((item) => item.category === 'paid');

  return (
    <AdminShell
      title="Абитуриентам"
      description="Настройте плашку на главной, материалы, FAQ и данные графиков для блоков Бюджет и Платное."
      activeHref="/admin/applicants"
    >
      <div className="grid gap-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Плашка на главной</h2>
          <form action="/admin/applicants/banner" method="post" className="mt-6 grid gap-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-white/70">Бейдж</label>
                <input
                  name="applicantsBadge"
                  defaultValue={settings.applicantsBadge}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm text-white/70">Заголовок</label>
                <input
                  name="applicantsTitle"
                  defaultValue={settings.applicantsTitle}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Описание</label>
              <textarea
                name="applicantsDescription"
                defaultValue={settings.applicantsDescription}
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                required
              />
              <p className="mt-2 text-xs text-white/45">Переносы строк сохраняются на сайте.</p>
            </div>

            <button
              type="submit"
              className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
            >
              Сохранить плашку
            </button>
          </form>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Статистика графика — Бюджет</h2>
          <ApplicantAdmissionStatForm category="budget" />
          {budgetStats.length ? (
            budgetStats.map((stat) => (
              <ApplicantAdmissionStatForm key={stat.id} stat={stat} category="budget" />
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
              Для бюджета пока нет точек графика.
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Статистика графика — Платное</h2>
          <ApplicantAdmissionStatForm category="paid" />
          {paidStats.length ? (
            paidStats.map((stat) => (
              <ApplicantAdmissionStatForm key={stat.id} stat={stat} category="paid" />
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
              Для платного пока нет точек графика.
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Новый материал</h2>
          <ApplicantMaterialForm />
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Опубликованные карточки</h2>
          {materials.length ? (
            materials.map((material) => <ApplicantMaterialForm key={material.id} material={material} />)
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
              Пока нет материалов для абитуриентов. Добавьте первую карточку выше.
            </div>
          )}
        </section>

        <AdminQuestionsPanel
          faqs={faqs}
          pendingCount={faqs.filter((faq) => !faq.answer || !faq.answerAuthor || !faq.answeredAt).length}
          totalCount={faqs.length}
          recentlySavedFaqId={typeof resolvedSearchParams.faqId === 'string' ? resolvedSearchParams.faqId : null}
        />
      </div>
    </AdminShell>
  );
}
