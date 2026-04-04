import PublicNewsDetailPage from '@/components/public-news-detail-page';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicNewsDetailPage slug={slug} />;
}
