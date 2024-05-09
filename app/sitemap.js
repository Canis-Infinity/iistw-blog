export default async function sitemap() {
  const blogBaseUrl = 'https://blog.iistw.com';

  const getAllPosts = await fetch(`${process.env.baseUrl}/api/blog`);

  const posts = await getAllPosts.json();

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
