import { TryoutDetail } from '@/src/features/cbt/components/TryoutDetail';

export default async function TryoutDetailPage({ params }) {
  const { id } = await params;
  return <TryoutDetail tryoutId={id} />;
}
