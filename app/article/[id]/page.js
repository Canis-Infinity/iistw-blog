import NoPost from '@/components/atricle/NoPost';
import Wrapper from '@/components/atricle/Wrapper';
import axios from 'axios';

export default async function Article({ params }) {
  const { id } = params;

  const handleFetch = await axios.get(`${process.env.baseUrl}/api/blog/${id}`);

  const result = handleFetch.data;
  const { message, data } = result;

  if (Object.keys(data).length === 0) {
    return (
      <NoPost />
    );
  }

  return (
    <Wrapper articleId={id} data={data} />
  );
}
