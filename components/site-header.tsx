import SiteHeaderClient from '@/components/site-header-client';
import {
  getFreshAnsweredQuestionIds,
  getLatestAnsweredQuestionAt,
  getPendingQuestionIds,
} from '@/lib/site-data';

export default async function SiteHeader() {
  const [freshAnsweredQuestionIds, latestAnsweredAt, pendingQuestionIds] = await Promise.all([
    getFreshAnsweredQuestionIds(),
    getLatestAnsweredQuestionAt(),
    getPendingQuestionIds(),
  ]);

  return (
    <SiteHeaderClient
      freshAnsweredQuestionIds={freshAnsweredQuestionIds}
      latestAnsweredAt={latestAnsweredAt ? latestAnsweredAt.toISOString() : null}
      pendingQuestionIds={pendingQuestionIds}
    />
  );
}
