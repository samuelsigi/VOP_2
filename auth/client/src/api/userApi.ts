import { apiCall } from './apiUtils';

export const getUserProfile = async (token: string) => {
  return apiCall('http://localhost:5000/api/users/profile', token, { method: 'GET' });
};
