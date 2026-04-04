'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'public_questions_hidden_all';
const HIDDEN_IDS_STORAGE_KEY = 'public_questions_hidden_ids';

const menuItems = [
  { label: 'Главная', href: '/' },
  { label: 'Абитуриентам', href: '/applicants' },
  { label: 'Вопросы', href: '/questions' },
  { label: 'О кафедре', href: '/about' },
  { label: 'Новости', href: '/news' },
  { label: 'Сотрудники', href: '/teachers' },
  { label: 'Контакты', href: '/contacts' },
];

export default function SiteHeaderClient({
  freshAnsweredQuestionIds,
  latestAnsweredAt,
  pendingQuestionIds,
}: {
  freshAnsweredQuestionIds: string[];
  latestAnsweredAt: string | null;
  pendingQuestionIds: string[];
}) {
  const pathname = usePathname();
  const [seenAnsweredAt, setSeenAnsweredAt] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hiddenAll, setHiddenAll] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    setSeenAnsweredAt(window.localStorage.getItem('questions_last_seen_answered_at'));
    setHiddenAll(window.localStorage.getItem(STORAGE_KEY) === '1');
    const storedIds = window.localStorage.getItem(HIDDEN_IDS_STORAGE_KEY);
    setHiddenIds(storedIds ? JSON.parse(storedIds) : []);
    setReady(true);
  }, []);

  useEffect(() => {
    const syncHiddenState = () => {
      setHiddenAll(window.localStorage.getItem(STORAGE_KEY) === '1');
      const storedIds = window.localStorage.getItem(HIDDEN_IDS_STORAGE_KEY);
      setHiddenIds(storedIds ? JSON.parse(storedIds) : []);
    };

    window.addEventListener('storage', syncHiddenState);
    window.addEventListener('focus', syncHiddenState);

    return () => {
      window.removeEventListener('storage', syncHiddenState);
      window.removeEventListener('focus', syncHiddenState);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/questions') {
      if (latestAnsweredAt) {
        window.localStorage.setItem('questions_last_seen_answered_at', latestAnsweredAt);
        setSeenAnsweredAt(latestAnsweredAt);
      }
    }
  }, [pathname, latestAnsweredAt]);

  const visiblePendingQuestionsCount = useMemo(() => {
    if (!ready) {
      return 0;
    }

    if (hiddenAll) {
      return 0;
    }

    return pendingQuestionIds.filter((id) => !hiddenIds.includes(id)).length;
  }, [hiddenAll, hiddenIds, pendingQuestionIds, ready]);

  const visibleFreshAnswersCount = useMemo(() => {
    if (!ready) {
      return 0;
    }

    if (hiddenAll) {
      return 0;
    }

    return freshAnsweredQuestionIds.filter((id) => !hiddenIds.includes(id)).length;
  }, [freshAnsweredQuestionIds, hiddenAll, hiddenIds, ready]);

  const pendingHighlight = useMemo(() => {
    if (visiblePendingQuestionsCount <= 0) {
      return false;
    }

    return true;
  }, [visiblePendingQuestionsCount]);

  const answeredHighlight = useMemo(() => {
    if (!latestAnsweredAt || visibleFreshAnswersCount <= 0) {
      return false;
    }

    if (pathname === '/questions') {
      return false;
    }

    return seenAnsweredAt !== latestAnsweredAt;
  }, [latestAnsweredAt, pathname, seenAnsweredAt, visibleFreshAnswersCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-white/5 text-sm font-bold text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.16)] transition group-hover:scale-105">
            ИУ-5
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
              МГТУ им. Н.Э. Баумана
            </p>
            <p className="text-sm font-semibold text-white">
              Системы обработки информации и управления
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center justify-end gap-2 md:flex">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const isQuestions = item.href === '/questions';
              const showPendingHighlight = isQuestions && pendingHighlight;
              const showAnsweredHighlight = isQuestions && !showPendingHighlight && answeredHighlight;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    showPendingHighlight
                      ? 'border border-amber-400/35 bg-amber-400/10 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.18)] hover:border-amber-300/50 hover:bg-amber-400/12'
                      : isActive
                        ? 'bg-cyan-400 text-[#050816] shadow-[0_0_25px_rgba(34,211,238,0.35)]'
                        : showAnsweredHighlight
                        ? 'border border-emerald-400/35 bg-emerald-400/10 text-emerald-100 shadow-[0_0_25px_rgba(52,211,153,0.18)] hover:border-emerald-300/50 hover:bg-emerald-400/12'
                        : 'border border-white/10 bg-white/5 text-white/80 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span>{item.label}</span>
                    {showPendingHighlight ? (
                      <span className="rounded-full border border-amber-300/30 bg-black/20 px-2 py-0.5 text-xs font-semibold text-amber-100">
                        {visiblePendingQuestionsCount}
                      </span>
                    ) : null}
                    {showAnsweredHighlight ? (
                      <span className="rounded-full border border-emerald-300/30 bg-black/20 px-2 py-0.5 text-xs font-semibold text-emerald-100">
                        {visibleFreshAnswersCount}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
