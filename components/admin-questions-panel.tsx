'use client';

import { formatRuDateTime } from '@/lib/format';
import AdminQuestionFormReset from '@/components/admin-question-form-reset';
import { useState } from 'react';

type ApplicantFaqItem = {
  id: string;
  question: string;
  questionAuthor: string | null;
  answer: string | null;
  answerAuthor: string | null;
  answeredAt: Date | null;
  sortOrder: number;
  isPublished: boolean;
};

function ApplicantFaqForm({
  faq,
  clearAfterSave = false,
}: {
  faq?: ApplicantFaqItem;
  clearAfterSave?: boolean;
}) {
  const isProcessed = Boolean(faq?.answer && faq?.answerAuthor && faq?.answeredAt);
  const [questionExpanded, setQuestionExpanded] = useState(false);
  const [answerExpanded, setAnswerExpanded] = useState(false);

  return (
    <form
      action="/admin/applicants/faq"
      method="post"
      data-question-form-id={faq?.id}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {faq?.id && clearAfterSave ? <AdminQuestionFormReset formId={faq.id} /> : null}
      <input type="hidden" name="id" defaultValue={faq?.id} />

      <div className="grid gap-5">
        {faq ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {isProcessed ? (
                <>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                    Обработан
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/75">
                    {formatRuDateTime(faq.answeredAt!)}
                  </span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                    Ответил: {faq.answerAuthor}
                  </span>
                </>
              ) : (
                <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-sm font-medium text-amber-200">
                  Ожидает обработки
                </span>
              )}
            </div>

            {isProcessed ? (
              <button
                type="submit"
                name="intent"
                value="delete"
                formNoValidate
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 text-rose-200 transition hover:bg-rose-500/15"
                aria-label="Удалить вопрос из админки"
                title="Удалить вопрос из админки"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                  <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm text-white/70">Вопрос</label>
          <textarea
            name="question"
            defaultValue={faq?.question}
            rows={questionExpanded ? 8 : 3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none break-all"
            required
          />
          {faq?.question && faq.question.length > 120 ? (
            <button
              type="button"
              onClick={() => setQuestionExpanded((current) => !current)}
              className="mt-3 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              {questionExpanded ? 'Свернуть вопрос' : 'Показать вопрос полностью'}
            </button>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Ответ</label>
          <textarea
            name="answer"
            defaultValue={faq?.answer || ''}
            rows={answerExpanded ? 10 : 5}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none break-all"
          />
          <p className="mt-2 text-xs text-white/45">Если ответа нет, вопрос можно сохранить как черновик и ответить позже.</p>
          {faq?.answer && faq.answer.length > 180 ? (
            <button
              type="button"
              onClick={() => setAnswerExpanded((current) => !current)}
              className="mt-3 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              {answerExpanded ? 'Свернуть ответ' : 'Показать ответ полностью'}
            </button>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Имя администратора</label>
          <input
            name="answerAuthor"
            defaultValue={faq?.answerAuthor || ''}
            placeholder="Например: И.И. Петров"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            required
          />
          <p className="mt-2 text-xs text-white/45">
            Дата и время ответа проставляются автоматически при сохранении ответа.
            {faq?.answeredAt ? ` Сейчас сохранено: ${formatRuDateTime(faq.answeredAt)}` : ''}
          </p>
        </div>

        <input type="hidden" name="sortOrder" value={String(faq?.sortOrder ?? 0)} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          Отправить
        </button>
      </div>
    </form>
  );
}

export default function AdminQuestionsPanel({
  faqs,
  pendingCount,
  totalCount,
  recentlySavedFaqId,
}: {
  faqs: ApplicantFaqItem[];
  pendingCount?: number;
  totalCount?: number;
  recentlySavedFaqId?: string | null;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold text-white">Вопросы</h2>
          {typeof totalCount === 'number' ? (
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
              Всего: {totalCount}
            </span>
          ) : null}
          {pendingCount ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-sm font-medium text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
              Новые и необработанные: {pendingCount}
            </span>
          ) : (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              Новых вопросов нет
            </span>
          )}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">
          Здесь можно просматривать вопросы с сайта, отвечать на них, указывать имя администратора и публиковать ответы.
        </p>
      </div>

      <section className="grid gap-4">
        <h3 className="text-2xl font-semibold text-white">Вопросы и ответы</h3>
        {faqs.length ? (
          faqs.map((faq) => (
            <ApplicantFaqForm
              key={faq.id}
              faq={faq}
              clearAfterSave={faq.id === recentlySavedFaqId}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
            Пока нет вопросов. Когда посетители отправят вопрос с сайта, он появится здесь.
          </div>
        )}
      </section>
    </div>
  );
}
