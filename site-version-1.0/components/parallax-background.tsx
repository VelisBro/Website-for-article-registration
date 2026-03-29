'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Жидкие большие пятна */}
      <div
        className="absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-400/12 blur-[120px] animate-[liquidFloatOne_18s_ease-in-out_infinite]"
        style={{ transform: `translateY(${offset * 0.05}px)` }}
      />

      <div
        className="absolute right-[-10%] top-[6%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[120px] animate-[liquidFloatTwo_22s_ease-in-out_infinite]"
        style={{ transform: `translateY(${offset * 0.09}px)` }}
      />

      <div
        className="absolute bottom-[-16%] left-[14%] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[130px] animate-[liquidFloatThree_24s_ease-in-out_infinite]"
        style={{ transform: `translateY(${offset * 0.14}px)` }}
      />

      <div
        className="absolute right-[12%] top-[55%] h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px] animate-[liquidFloatFour_20s_ease-in-out_infinite]"
        style={{ transform: `translateY(${offset * 0.18}px)` }}
      />

      <div
        className="absolute left-[38%] top-[18%] h-[240px] w-[240px] rounded-full bg-cyan-300/8 blur-[90px] animate-[liquidFloatFive_16s_ease-in-out_infinite]"
        style={{ transform: `translateY(${offset * 0.07}px)` }}
      />

      {/* Мягкое свечение сверху */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_36%)]" />

      {/* Лёгкая сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Общий тон */}
      <div className="absolute inset-0 bg-[#050816]/78" />
    </div>
  );
}