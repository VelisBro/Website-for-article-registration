'use client';

import { useEffect, useState } from 'react';

type Props = {
  title: string;
};

type BinaryParticle = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  value: '0' | '1';
  glow: boolean;
};

function seededValue(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function createParticles(): BinaryParticle[] {
  return Array.from({ length: 56 }, (_, i) => {
    const base = i + 1;
    return {
      id: i,
      left: seededValue(base * 1.1) * 100,
      top: seededValue(base * 1.7) * 100,
      size: 12 + seededValue(base * 2.3) * 10,
      duration: 8 + seededValue(base * 2.9) * 12,
      delay: seededValue(base * 3.7) * 6,
      value: seededValue(base * 4.1) > 0.5 ? ('0' as const) : ('1' as const),
      glow: seededValue(base * 4.9) > 0.72,
    };
  });
}

export default function PageInProgress({ title }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [particles] = useState<BinaryParticle[]>(createParticles);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <main className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${mouse.x * 0.7}px, ${mouse.y * 0.7}px)` }}
        />
        <div
          className="absolute right-[10%] top-[18%] h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${mouse.x * -0.6}px, ${mouse.y * -0.6}px)` }}
        />
        <div
          className="absolute bottom-[12%] left-[18%] h-52 w-52 rounded-full bg-blue-500/10 blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${mouse.x * 0.45}px, ${mouse.y * 0.45}px)` }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className={`absolute select-none font-mono animate-[binaryFloat_linear_infinite] ${
                particle.glow
                  ? 'text-cyan-300/35 [text-shadow:0_0_12px_rgba(34,211,238,0.8)]'
                  : 'text-cyan-300/12'
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                fontSize: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                transform: `translate(${mouse.x * 0.12}px, ${mouse.y * 0.12}px)`,
              }}
            >
              {particle.value}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        {/* полностью чистый фон внутри бокса */}

        <div className="relative z-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
            {title}
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white sm:text-5xl">
            Эта страница
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              обновляется
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Мы дорабатываем раздел, улучшаем структуру и подготавливаем материалы.
            Страница скоро станет доступна.
          </p>
        </div>
      </div>
    </main>
  );
}
