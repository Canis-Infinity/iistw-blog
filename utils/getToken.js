import Cookies from 'js-cookie';

export function getToken() {
  if (!Cookies.get('token')) return null;
  const tokenData = JSON.parse(Cookies.get('token'));
  const data = {
    ...tokenData.user,
    token: tokenData.token,
  }
  return data;
}