import Image from 'next/image';
import { getPublishedTeachers } from '@/lib/site-data';

function splitTags(value: string) {
  return value
    .split(/\n|,/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function TeachersPage() {
  const teachers = await getPublishedTeachers();

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Преподаватели
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Преподавательский состав кафедры
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Здесь собраны преподаватели кафедры с краткой информацией, фотографиями и
            ключевыми направлениями работы.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => {
            const tags = splitTags(teacher.tags);

            return (
              <article
                key={teacher.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div className="relative aspect-[3/4] border-b border-white/10 bg-black/25">
                  <Image
                    src={teacher.photoUrl || '/images/placeholder.jpg'}
                    alt={teacher.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain p-4"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-tight text-white">{teacher.name}</h2>
                  <p className="mt-2 text-sm text-cyan-300">{teacher.role}</p>
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/72">{teacher.bio}</p>

                  {tags.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {!teachers.length ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
            Список преподавателей пока не заполнен.
          </div>
        ) : null}
      </section>
    </main>
  );
}
