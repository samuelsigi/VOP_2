import { apiCall } from './apiUtils';

export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const fetchProtectedData = async (token: string) => {
  return apiCall('http://localhost:5000/api/protected', token, { method: 'GET' });
};
