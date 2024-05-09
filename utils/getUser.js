import { cookies } from 'next/headers';

export function getUser() {
  if (!cookies().get('token')) return null;
  const tokenData = JSON.parse(cookies().get('token').value);
  const data = {
    ...tokenData.user,
    token: tokenData.token,
  }
  return data;
}