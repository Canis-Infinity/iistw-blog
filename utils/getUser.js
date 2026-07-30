import 'server-only';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  if (!tokenCookie?.value) return null;

  let tokenData;
  try {
    tokenData = JSON.parse(tokenCookie.value);
  } catch {
    return null;
  }

  return {
    ...tokenData.user,
    token: tokenData.token,
  };
}
