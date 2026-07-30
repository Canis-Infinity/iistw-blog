import NoPost from '@/components/atricle/NoPost';
import Wrapper from '@/components/atricle/Wrapper';
import { getApiData } from '@/lib/getApiData';

export default async function Article({ params }) {
  const { id } = await params;

  if (!id) {
    return <NoPost />;
  }

  const { data } = await getApiData(`/api/blog/${id}`, { data: null });

  if (!data || Object.keys(data).length === 0) {
    return <NoPost />;
  }

  if (id) return <Wrapper articleId={id} data={data} />;
}
