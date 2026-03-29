// import Image from 'next/image';
// import Link from 'next/link';
// import { submitApplicantQuestionAction } from '@/app/applicants/actions';
// import { getApplicantMaterials, getPublishedApplicantFaqs, getSiteSettings } from '@/lib/site-data';

// type ApplicantsPageProps = {
//   searchParams?: Promise<Record<string, string | string[] | undefined>>;
// };

// export default async function ApplicantsPage({ searchParams }: ApplicantsPageProps) {
//   const resolvedSearchParams = searchParams ? await searchParams : {};
//   const [settings, materials, faqs] = await Promise.all([
//     getSiteSettings(),
//     getApplicantMaterials(),
//     getPublishedApplicantFaqs(),
//   ]);

//   return (
//     <main>
//       <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
//         <div className="max-w-4xl">
//           <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
//             {settings.applicantsBadge}
//           </p>
//           <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
//             {settings.applicantsTitle}
//           </h1>
//           <div className="mt-6 whitespace-pre-line text-lg leading-8 text-white/70">
//             {settings.applicantsDescription}
//           </div>
//         </div>

//         {resolvedSearchParams.questionSent ? (
//           <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
//             Вопрос отправлен. Администратор сможет ответить на него из админ-панели.
//           </div>
//         ) : null}

//         <div className="mt-12 grid gap-8 lg:grid-cols-2">
//           {materials.map((material) => (
//             <article
//               key={material.id}
//               className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
//             >
//               {material.imageUrl ? (
//                 <div className="relative aspect-[16/9] border-b border-white/10 bg-black/20">
//                   <Image
//                     src={material.imageUrl}
//                     alt={material.title}
//                     fill
//                     sizes="(max-width: 1024px) 100vw, 50vw"
//                     className="object-contain p-4"
//                   />
//                 </div>
//               ) : null}

//               {material.videoUrl ? (
//                 <div className="border-b border-white/10 bg-black/30 p-4">
//                   <video
//                     src={material.videoUrl}
//                     controls
//                     preload="metadata"
//                     className="aspect-video w-full rounded-2xl border border-white/10 bg-black"
//                   />
//                 </div>
//               ) : null}

//               <div className="p-6 lg:p-8">
//                 <h2 className="text-2xl font-semibold text-white">{material.title}</h2>
//                 <div className="mt-4 whitespace-pre-line text-white/72">{material.description}</div>

//                 <div className="mt-6 flex flex-wrap gap-4">
//                   {material.linkUrl ? (
//                     <Link
//                       href={material.linkUrl}
//                       target="_blank"
//                       className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
//                     >
//                       {material.buttonLabel || 'Открыть материал'}
//                     </Link>
//                   ) : null}

//                   {material.fileUrl ? (
//                     <Link
//                       href={material.fileUrl}
//                       target="_blank"
//                       className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
//                     >
//                       Скачать файл
//                     </Link>
//                   ) : null}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>

//         {!materials.length ? (
//           <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
//             Материалы для абитуриентов пока не добавлены.
//           </div>
//         ) : null}

//         <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
//           <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
//             <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">FAQ</p>
//             <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Часто задаваемые вопросы</h2>
//             <div className="mt-8 grid gap-4">
//               {faqs.length ? (
//                 faqs.map((faq) => (
//                   <details
//                     key={faq.id}
//                     className="rounded-3xl border border-white/10 bg-black/20 p-5 text-white/80"
//                   >
//                     <summary className="cursor-pointer list-none text-lg font-semibold text-white">
//                       {faq.question}
//                     </summary>
//                     <div className="mt-4 whitespace-pre-line leading-7 text-white/72">{faq.answer}</div>
//                   </details>
//                 ))
//               ) : (
//                 <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5 text-white/60">
//                   Ответы пока не опубликованы.
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
//             <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
//               Не нашли ответ?
//             </p>
//             <h2 className="mt-3 text-3xl font-bold text-white">Задайте вопрос</h2>
//             <p className="mt-4 text-base leading-8 text-white/70">
//               Вопрос попадёт в админ-панель, и администратор сможет добавить ответ и опубликовать его в FAQ.
//             </p>

//             <form action={submitApplicantQuestionAction} className="mt-6 grid gap-4">
//               <textarea
//                 name="question"
//                 rows={6}
//                 placeholder="Например: какие предметы нужны для поступления и есть ли проходные баллы за прошлые годы?"
//                 className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
//               >
//                 Отправить вопрос
//               </button>
//             </form>
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// }
export default function ApplicantsPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-20 lg:px-8">
      <section className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 px-8 py-14 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-12">
        
        <div className="mx-auto inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          • Абитуриентам
        </div>

        <h1 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-6xl">
          Эта страница
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
            обновляется
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/70 sm:text-2xl">
          Мы дорабатываем раздел, улучшаем структуру и подготавливаем материалы.
        </p>

        <p className="mt-3 text-lg leading-8 text-white/55 sm:text-2xl">
          Страница скоро станет доступна.
        </p>

      </section>
    </main>
  );
}
