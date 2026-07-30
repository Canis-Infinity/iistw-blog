import UnAuth from '@/components/UnAuth';
import { getUser } from '@/utils/getUser';
import '@/styles/root.css';
import '@/styles/globals.css';

export default async function LoginLayout({ children }) {
  const user = await getUser();
  const role = user?.role || 'guest';

  if (!['admin'].includes(role))  return <UnAuth/>;

  return (
    <>
      {children}
    </>
  );
}