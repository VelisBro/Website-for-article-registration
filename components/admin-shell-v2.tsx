import Link from 'next/link';
import type { ReactNode } from 'react';
import { logoutAction } from '@/app/admin/actions';
import { prisma } from '@/lib/prisma';

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  activeHref?: string;
};

const navigation = [
  { href: '/admin', label: 'Обзор' },
  { href: '/admin/news', label: 'Новости' },
  { href: '/admin/teachers', label: 'Преподаватели' },
  { href: '/admin/applicants', label: 'Абитуриентам' },
  { href: '/admin/questions', label: 'Вопросы' },
  { href: '/admin/settings', label: 'Настройки сайта' },
];

export default async function AdminShellV2({
  title,
  description,
  children,
  activeHref,
}: AdminShellProps) {
  const pendingQuestions = await prisma.applicantFaq.count({
    where: {
      adminArchived: false,
      OR: [{ answer: null }, { answer: '' }, { answerAuthor: null }, { answeredAt: null }],
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Админ-панель
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">{description}</p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            Выйти
          </button>
        </form>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'rounded-full border px-4 py-2 text-sm font-medium transition',
              activeHref === item.href
                ? 'border-cyan-400/40 bg-cyan-400/12 text-cyan-200'
                : 'border-white/10 bg-white/5 text-white/80 hover:border-cyan-400/30 hover:text-cyan-300',
              item.href === '/admin/questions' && pendingQuestions > 0
                ? 'border-amber-400/40 bg-amber-400/12 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.14)] hover:border-amber-300/50 hover:text-amber-50'
                : '',
            ].join(' ')}
          >
              <span className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.href === '/admin/questions' ? (
                  <>
                    {pendingQuestions > 0 ? (
                      <span className="rounded-full border border-amber-300/30 bg-amber-300/15 px-2 py-0.5 text-xs font-semibold text-amber-100">
                        {pendingQuestions} new
                      </span>
                    ) : null}
                  </>
                ) : null}
              </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">{children}</div>
    </main>
  );
}
