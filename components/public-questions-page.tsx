import { formatRuDateTime } from '@/lib/format';
import { getPublicApplicantQuestions } from '@/lib/site-data';
import PublicQuestionsList from '@/components/public-questions-list';

export default async function PublicQuestionsPage() {
  const faqs = await getPublicApplicantQuestions();
  const renderedQuestions = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    answerAuthor: faq.answerAuthor,
    answeredAt: faq.answeredAt ? faq.answeredAt.toISOString() : null,
    statusLabel: faq.answeredAt && faq.answerAuthor ? 'Обработан' as const : 'Необработан' as const,
    statusTone: faq.answeredAt && faq.answerAuthor ? 'processed' as const : 'pending' as const,
    answeredAtLabel: faq.answeredAt ? formatRuDateTime(faq.answeredAt) : null,
  }));

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Вопросы</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Вопросы и ответы
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Здесь отображаются отправленные вопросы и ответы администрации по мере обработки.
          </p>
        </div>

        {renderedQuestions.length ? (
          <PublicQuestionsList questions={renderedQuestions} />
        ) : (
          <div className="mt-12 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
            Пока вопросов нет.
          </div>
        )}
      </section>
    </main>
  );
}
