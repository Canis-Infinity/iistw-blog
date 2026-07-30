import { getApiData } from '@/lib/getApiData';

export default async function sitemap() {
  const blogBaseUrl = 'https://blog.iistw.com';

  const posts = await getApiData('/api/blog');

  const postsUrls = posts?.data.map((post) => {
    return {
      url: `${blogBaseUrl}/article/${post._id}`,
      lastModified: new Date(),
      changeFrequency: 'always',
    };
  }) ?? [];

  return [
    {
      url: blogBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
    },
    {
      url: `${blogBaseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'always',
    },
    {
      url: `${blogBaseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'always',
    },
    ...postsUrls,
  ];
}
