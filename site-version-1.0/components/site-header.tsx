'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Главная', href: '/' },
  { label: 'Абитуриентам', href: '/applicants' },
  { label: 'О кафедре', href: '/about' },
  { label: 'Новости', href: '/news' },
  { label: 'Сотрудники', href: '/teachers' },
  { label: 'Контакты', href: '/contacts' },
];

export default function SiteHeader() {
  const pathname = usePathname();

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
          <nav className="hidden flex-wrap items-center justify-end gap-2 md:flex">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-400 text-[#050816] shadow-[0_0_25px_rgba(34,211,238,0.35)]'
                      : 'border border-white/10 bg-white/5 text-white/80 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/login"
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 hover:text-white"
          >
            Вход
          </Link>
        </div>
      </div>
    </header>
  );
}