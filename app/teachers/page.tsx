import PageInProgress from '@/components/page-in-progress';

export default function TeachersPage() {
  return <PageInProgress title="Сотрудники" />;
}

// import Image from 'next/image';

// const teachers = [
//   {
//     name: 'Терехов Валерий Игоревич',
//     role: 'Заведующий кафедрой, д.т.н., профессор',
//     image: null,
//     tags: ['ИИ', 'Аналитика', 'Проектирование систем'],
//     bio: 'Работает над современными подходами к обработке информации, аналитическим системам и цифровым инженерным решениям.',
//   },
//   {
//     name: 'Артамонов Юрий Николаевич',
//     role: 'д.т.н., профессор',
//     image: null,
//     tags: ['Системы управления', 'Исследования', 'Моделирование'],
//     bio: 'Профиль связан с инженерными системами, научной работой и развитием фундаментальной базы кафедры.',
//   },
//   {
//     name: 'Григорьев Юрий Александрович',
//     role: 'д.т.н., профессор',
//     image: null,
//     tags: ['Информационные системы', 'Архитектура', 'Управление'],
//     bio: 'Занимается вопросами проектирования и развития сложных информационных и управляющих систем.',
//   },
//   {
//     name: 'Виноградова Мария Валерьевна',
//     role: 'к.т.н., доцент',
//     image: null,
//     tags: ['Данные', 'Разработка', 'Обучение'],
//     bio: 'Участвует в образовательной и научной деятельности кафедры, развивает прикладные учебные направления.',
//   },
// ];

// export default function TeachersPage() {
//   return (
//     <main>
//       <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
//         <div className="max-w-4xl">
//           <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
//             Преподаватели
//           </p>
//           <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
//             Преподавательский состав
//             <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
//               кафедры ИУ-5
//             </span>
//           </h1>
//           <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
//             Современная визуальная подача преподавателей: фотографии, профиль,
//             направления работы и ключевые компетенции.
//           </p>
//         </div>

//         <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
//           {teachers.map((teacher) => (
//             <article
//               key={teacher.name}
//               className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.08]"
//             >
//               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_24%)] opacity-70" />

//               <div className="relative flex h-full flex-col">
//                 <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-black/20">
//                   <Image
//                     src={teacher.image || '/images/placeholder.jpg'}
//                     alt={teacher.name}
//                     fill
//                     sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
//                     className="object-cover transition duration-700 group-hover:scale-105"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/25 to-transparent" />

//                   <div className="absolute bottom-4 left-4 right-4">
//                     {(() => {
//                       const parts = teacher.name.split(' ');
//                       const lastName = parts[0];
//                       const firstMiddle = parts.slice(1).join(' ');

//                       return (
//                         <div>
//                           <div className="text-2xl font-semibold leading-tight">
//                              <div className="text-white">{lastName}</div>
//                             <div className="text-white/80">{firstMiddle}</div>
//                             </div>  
//                         </div>
//                       );
//                     })()}

//                     <p className="mt-2 text-sm text-cyan-300">{teacher.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex flex-1 flex-col p-6">
//                   <p className="text-sm leading-7 text-white/72">{teacher.bio}</p>

//                   <div className="mt-5 flex flex-wrap gap-2">
//                     {teacher.tags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* ↓ БЛОК УДАЛЁН */}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }