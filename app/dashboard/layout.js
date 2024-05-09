import UnAuth from '@/components/UnAuth';
import { getUser } from '@/utils/getUser';
import pageStyles from '@/styles/page.module.css';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Layout({ children }) {
  const user = getUser();
  const role = user?.role || 'guest';

  if (!['admin'].includes(role)) {
    return (
      <main className={pageStyles.wrapper}>
        <UnAuth/>
      </main>
    )
  }

  return (
    <>
      <main className={pageStyles.wrapper}>
        {children}
      </main>
    </>
  )
}
