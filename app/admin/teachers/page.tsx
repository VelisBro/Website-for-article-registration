import Image from 'next/image';
import AdminShell from '@/components/admin-shell-v2';
import { deleteTeacherAction, saveTeacherAction } from '@/app/admin/actions';
import { prisma } from '@/lib/prisma';

function TeacherForm({
  teacher,
}: {
  teacher?: {
    id: string;
    name: string;
    role: string;
    bio: string;
    tags: string;
    photoUrl: string | null;
    sortOrder: number;
    isPublished: boolean;
  };
}) {
  return (
    <form
      action={saveTeacherAction}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <input type="hidden" name="id" defaultValue={teacher?.id} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-white/70">ФИО</label>
            <input
              name="name"
              defaultValue={teacher?.name}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Должность</label>
            <input
              name="role"
              defaultValue={teacher?.role}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Информация</label>
            <textarea
              name="bio"
              defaultValue={teacher?.bio}
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              required
            />
            <p className="mt-2 text-xs text-white/45">Переносы строк сохраняются на сайте.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Теги через новую строку или запятую
            </label>
            <textarea
              name="tags"
              defaultValue={teacher?.tags}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100/85">
            Для фото преподавателей лучше использовать портрет 3:4. На сайте карточка теперь показывается без обрезания, но при другом формате могут появиться поля сверху или по бокам.
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Ссылка на фото</label>
            <input
              name="photoUrl"
              defaultValue={teacher?.photoUrl || ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Или загрузить фото</label>
            <input
              type="file"
              name="photoFile"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#050816]"
            />
          </div>

          {teacher?.photoUrl ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <Image src={teacher.photoUrl} alt={teacher.name} fill className="object-contain p-4" />
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Порядок</label>
              <input
                type="number"
                min="0"
                max="999"
                name="sortOrder"
                defaultValue={teacher?.sortOrder ?? 0}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={teacher ? teacher.isPublished : true}
                className="h-4 w-4 accent-cyan-400"
              />
              Показывать на сайте
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#050816]"
        >
          {teacher ? 'Сохранить преподавателя' : 'Добавить преподавателя'}
        </button>

        {teacher ? (
          <button
            formAction={deleteTeacherAction}
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100"
          >
            Удалить
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <AdminShell
      title="Преподаватели"
      description="Добавляйте карточки преподавателей с фотографиями, должностями, описанием и порядком вывода."
      activeHref="/admin/teachers"
    >
      <div className="grid gap-8">
        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Новый преподаватель</h2>
          <TeacherForm />
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold text-white">Текущий список</h2>
          {teachers.length ? (
            teachers.map((teacher) => <TeacherForm key={teacher.id} teacher={teacher} />)
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-white/65">
              Пока нет преподавателей. Добавьте первую карточку выше.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
