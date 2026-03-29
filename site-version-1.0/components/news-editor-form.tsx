import { saveNewsPostAction, deleteNewsPostAction } from '@/app/admin/actions';

type NewsEditorFormProps = {
  post?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    featured: boolean;
    featuredRank: number | null;
    isPublished: boolean;
    publishedAt: Date;
  } | null;
};

function toDateTimeLocal(value: Date) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function NewsEditorForm({ post }: NewsEditorFormProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form
        action={saveNewsPostAction}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        <input type="hidden" name="id" value={post?.id || ''} />

        <div className="grid gap-6">
          <div>
            <label className="mb-2 block text-sm text-white/70">Заголовок</label>
            <input
              name="title"
              defaultValue={post?.title || ''}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              required
              minLength={3}
              title="Заголовок должен содержать минимум 3 символа."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Slug</label>
              <input
                name="slug"
                defaultValue={post?.slug || ''}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="можно оставить пустым"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Категория</label>
              <input
                name="category"
                defaultValue={post?.category || 'Новость'}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                required
                minLength={2}
                title="Категория должна содержать минимум 2 символа."
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Краткое описание</label>
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt || ''}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              required
              minLength={10}
              title="Краткое описание должно содержать минимум 10 символов."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Полный текст</label>
            <textarea
              name="content"
              defaultValue={post?.content || ''}
              rows={12}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              required
              title="Полный текст новости не должен быть пустым."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">URL изображения</label>
              <input
                name="imageUrl"
                defaultValue={post?.imageUrl || ''}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="/images/placeholder.jpg"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Загрузить файл</label>
              <input
                type="file"
                name="imageFile"
                accept=".jpg,.jpeg,.png,.webp"
                className="w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/75"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Дата публикации</label>
              <input
                type="datetime-local"
                name="publishedAt"
                defaultValue={toDateTimeLocal(post?.publishedAt || new Date())}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Приоритет главной новости</label>
              <input
                type="number"
                name="featuredRank"
                min={1}
                max={20}
                defaultValue={post?.featuredRank || ''}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <label className="flex items-center gap-3 text-sm text-white/80">
              <input type="checkbox" name="featured" defaultChecked={post?.featured || false} />
              Показывать как главную новость
            </label>

            <label className="flex items-center gap-3 text-sm text-white/80">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={post ? post.isPublished : true}
              />
              Опубликовано
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] transition hover:scale-[1.01]"
            >
              Сохранить новость
            </button>
          </div>
        </div>
      </form>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">Подсказки</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/70">
            <p>Если загрузить файл, он заменит URL изображения.</p>
            <p>Для абзацев в полном тексте оставляйте пустую строку между блоками.</p>
            <p>Если отметить новость как главную, задайте приоритет: чем меньше число, тем выше блок.</p>
          </div>
        </div>

        {post ? (
          <form
            action={deleteNewsPostAction}
            className="rounded-[2rem] border border-rose-400/20 bg-rose-400/10 p-6 backdrop-blur-xl"
          >
            <input type="hidden" name="id" value={post.id} />
            <h2 className="text-xl font-semibold text-white">Удаление</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Удаление уберёт новость из сайта и админ-панели.
            </p>
            <button
              type="submit"
              className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400/30"
            >
              Удалить новость
            </button>
          </form>
        ) : null}
      </aside>
    </div>
  );
}
