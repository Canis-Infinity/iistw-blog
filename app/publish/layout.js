import UnAuth from '@/components/UnAuth';
import { getUser } from '@/utils/getUser';
import '@/styles/root.css';
import '@/styles/globals.css';

export default function LoginLayout({ children }) {
  const user = getUser();
  const role = user?.role || 'guest';

  if (!['admin'].includes(role))  return <UnAuth/>;

  return (
    <>
      {children}
    </>
  );
}
