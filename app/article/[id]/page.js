import NoPost from '@/components/atricle/NoPost';
import Wrapper from '@/components/atricle/Wrapper';
import axios from 'axios';

export default async function Article({ params }) {
  const { id } = await params;

  if (!id) {
    return <NoPost />;
  }

  const res = await axios.get(`${process.env.baseUrl}/api/blog/${id}`);

  const { message, data } = res.data;

  if (!data || Object.keys(data).length === 0) {
    return <NoPost />;
  }

  if (id) return <Wrapper articleId={id} data={data} />;
}
