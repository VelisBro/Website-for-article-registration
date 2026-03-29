import AdminShell from '@/components/admin-shell-v2';
import NewsEditorForm from '@/components/news-editor-form';

export default function AdminNewsNewPage() {
  return (
    <AdminShell
      title="Новая новость"
      description="Создайте материал, загрузите изображение и опубликуйте его сразу или сохраните как черновик."
    >
      <NewsEditorForm />
    </AdminShell>
  );
}
