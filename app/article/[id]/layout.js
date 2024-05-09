import axios from 'axios';

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  let title = null;
  let cover = null;
  let intro = null;

  const res = await axios.get(`${process.env.baseUrl}/api/blog/${id}?type=metadata`);
  const { message, data } = res.data;
  if (res.status === 200) {
    title = data.title;
    cover = data.cover;
    intro = data.intro;
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${title || '部落格'}｜Infinity 資訊`,
    openGraph: {
      title: `${title || '部落格'}｜Infinity 資訊`,
      description: `${intro || '這是我的部落格，我會不定期在這裡分享自己的學習歷程、見聞等等'}`,
      images: cover ? [`${process.env.baseUrl}${cover}`, ...previousImages] : [...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title || '部落格'}｜Infinity 資訊`,
      description: `${intro || '這是我的部落格，我會不定期在這裡分享自己的學習歷程、見聞等等'}`,
      creator: "@iistw22788",
      images: cover ? [`${process.env.baseUrl}${cover}`] : [...previousImages],
      siteId: '@iistw22788',
    },
    appleWebApp: {
      title: `${title || '部落格'}｜Infinity 資訊`,
    },
  }
}

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
