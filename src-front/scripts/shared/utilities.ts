export function getFromCookie(name: string) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(name));
  if (cookie) {
    return cookie.split('=')[1];
  }
  return null;
}

export function getFromUrl() {
  const url = window.location.pathname;
  const parts = url.split('/');
  return parts[parts.length - 1];
}