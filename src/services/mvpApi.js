import axios from 'axios';

// Use Vercel API for MVP data
const MVP_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://api-mpl.vercel.app/api';

const mvpApi = axios.create({
  baseURL: MVP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions for MVP
export const fetchMVPs = async () => {
  const response = await mvpApi.get('/mvp');
  return response.data;
};

export const createMVP = async (mvpData) => {
  const response = await mvpApi.post('/mvp', mvpData);
  return response.data;
};

export const updateMVP = async (id, mvpData) => {
  const response = await mvpApi.patch(`/mvp/${id}`, mvpData);
  return response.data;
};

export const deleteMVP = async (id) => {
  const response = await mvpApi.delete(`/mvp/${id}`);
  return response.data;
};

export default mvpApi;
