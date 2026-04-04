'use client';

import { useEffect, useMemo, useState } from 'react';

type PublicQuestionItem = {
  id: string;
  question: string;
  answer: string | null;
  answerAuthor: string | null;
  answeredAt: string | null;
  statusLabel: 'Обработан' | 'Необработан';
  statusTone: 'processed' | 'pending';
  answeredAtLabel: string | null;
};

const STORAGE_KEY = 'public_questions_hidden_all';
const HIDDEN_IDS_STORAGE_KEY = 'public_questions_hidden_ids';

export default function PublicQuestionsList({
  questions,
}: {
  questions: PublicQuestionItem[];
}) {
  const [hidden, setHidden] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHidden(window.localStorage.getItem(STORAGE_KEY) === '1');
    const storedIds = window.localStorage.getItem(HIDDEN_IDS_STORAGE_KEY);
    setHiddenIds(storedIds ? JSON.parse(storedIds) : []);
    setReady(true);
  }, []);

  const visibleQuestions = useMemo(() => {
    if (hidden) {
      return [];
    }

    return questions.filter((question) => !hiddenIds.includes(question.id));
  }, [hidden, hiddenIds, questions]);

  const clearQuestions = () => {
    window.localStorage.setItem(STORAGE_KEY, '1');
    setHidden(true);
  };

  const restoreQuestions = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(HIDDEN_IDS_STORAGE_KEY);
    setHidden(false);
    setHiddenIds([]);
  };

  const hideSingleQuestion = (id: string) => {
    const nextIds = [...new Set([...hiddenIds, id])];
    window.localStorage.setItem(HIDDEN_IDS_STORAGE_KEY, JSON.stringify(nextIds));
    setHiddenIds(nextIds);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="mt-12 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/55">{hidden ? 'Список скрыт только в вашем браузере.' : ''}</p>
        {ready ? (
          hidden ? (
            <button
              type="button"
              onClick={restoreQuestions}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              Вернуть вопросы
            </button>
          ) : (
            <button
              type="button"
              onClick={clearQuestions}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            >
              Очистить список
            </button>
          )
        ) : null}
      </div>

      {visibleQuestions.length ? (
        visibleQuestions.map((faq) => (
          <article
            key={faq.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={
                    faq.statusTone === 'processed'
                      ? 'rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200'
                      : 'rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200'
                  }
                >
                  {faq.statusLabel}
                </span>
                {faq.answeredAtLabel ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/75">
                    {faq.answeredAtLabel}
                  </span>
                ) : null}
                {faq.answerAuthor ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                    Ответил: {faq.answerAuthor}
                  </span>
                ) : null}
              </div>

              {faq.statusTone === 'processed' ? (
                <button
                  type="button"
                  onClick={() => hideSingleQuestion(faq.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 text-rose-200 transition hover:bg-rose-500/15"
                  aria-label="Удалить вопрос из списка"
                  title="Удалить вопрос из списка"
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

            <div className="mt-5">
              <h2
                className={`text-2xl font-semibold text-white ${
                  expandedIds.includes(faq.id) ? 'break-all' : 'line-clamp-2 break-all'
                }`}
              >
                {faq.question}
              </h2>
              {faq.question.length > 120 ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(faq.id)}
                  className="mt-3 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  {expandedIds.includes(faq.id) ? 'Свернуть' : 'Показать полностью'}
                </button>
              ) : null}
            </div>
            {faq.answer ? (
              <div className="mt-4 whitespace-pre-line leading-7 text-white/75">{faq.answer}</div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-3 text-white/55">
                Ответ пока не опубликован. Вопрос передан администрации.
              </div>
            )}
          </article>
        ))
      ) : (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
          Вопросы скрыты. При желании список можно вернуть кнопкой выше.
        </div>
      )}
    </div>
  );
}
