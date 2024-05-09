export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/publish/',
      ],
    },
    sitemap: 'https://blog.iistw.com/sitemap.xml',
  }
}