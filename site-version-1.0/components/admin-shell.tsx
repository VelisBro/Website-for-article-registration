import Link from 'next/link';
import type { ReactNode } from 'react';
import { logoutAction } from '@/app/admin/actions';

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const navigation = [
  { href: '/admin', label: 'Обзор' },
  { href: '/admin/news', label: 'Новости' },
  { href: '/admin/settings', label: 'Настройки сайта' },
];

export default function AdminShell({ title, description, children }: AdminShellProps) {
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
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-10">{children}</div>
    </main>
  );
}
