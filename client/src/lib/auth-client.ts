// Custom fetch wrapper to inject JWT token
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401 && window.location.pathname !== '/auth') {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  }
  
  return res;
}
