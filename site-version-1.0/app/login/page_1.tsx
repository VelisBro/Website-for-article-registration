import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';

const errorMessages: Record<string, string> = {
  empty: 'Введите логин и пароль.',
  invalid: 'Неверный логин или пароль.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect('/admin');
  }

  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : null;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-20 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Вход
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Панель администратора
        </h1>

        <p className="mt-4 text-white/70">
          Вход доступен только модераторам сайта Регистрация на сайте отсутствует
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form method="post" action="/login/submit" className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Логин</label>
            <input
              type="text"
              name="username"
              placeholder="Введите логин"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816] transition hover:scale-[1.01]"
          >
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}
