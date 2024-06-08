import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Maintenence from '@/components/Maintenence';
import '@/styles/root.css';
import '@/styles/globals.css';
import 'remixicon/fonts/remixicon.css';

export const metadata = {
  metadataBase: new URL('https://blog.iistw.com'),
  title: '部落格｜Infinity 資訊',
  description: '這是我的部落格，我會不定期在這裡分享自己的學習歷程、見聞等等',
  manifest: "https://blog.iistw.com/manifest.json",
  keywords: [
    '部落格｜Infinity 資訊',
    '電腦',
    '筆電',
    '零組件',
    '周邊',
    '維修',
    '設計',
    'UI',
    'UX',
    '前端工程師',
    '部落格',
  ],
  authors: [{ name: '張永昌' }],
  creator: '張永昌',
  publisher: '張永昌',
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: '部落格｜Infinity 資訊',
    url: 'https://blog.iistw.com/',
    siteName: '部落格｜Infinity 資訊',
    description: '這是我的部落格，我會不定期在這裡分享自己的學習歷程、見聞等等',
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: '部落格｜Infinity 資訊',
    description: '這是我的部落格，我會不定期在這裡分享自己的學習歷程、見聞等等',
    creator: "@iistw22788",
    siteId: '@iistw22788',
  },
  appleWebApp: {
    title: '部落格｜Infinity 資訊',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/favicon.png',
      },
      {
        url: '/icon-192x192.png',
        size: '192x192',
      },
      {
        url: '/icon-256x256.png',
        size: '256x256',
      },
      {
        url: '/icon-364x364.png',
        size: '364x364',
      },
      {
        url: '/icon-512x512.png',
        size: '512x512',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

global.self = global;

export default function RootLayout({ children }) {
  const isMaintenence = false;
  // const isMaintenence = true;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ToastContainer limit={5} />
          <NextTopLoader />
          {
            isMaintenence ? (
              <Maintenence />
            ) : (
              <>
                <Header />
                {children}
                <Footer />
                <BackToTop />
              </>
            )
          }
        </Providers>
      </body>
    </html>
  )
}
