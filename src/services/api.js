import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use proxy in development
  : 'https://api-mpl.vercel.app/api';

console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Development mode:', import.meta.env.DEV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions
export const fetchTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const fetchTeamById = async (id) => {
  const response = await api.get(`/teams/${id}`);
  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await api.post('/teams', teamData);
  return response.data;
};

export const updateTeam = async (id, teamData) => {
  const response = await api.patch(`/teams/${id}`, teamData);
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await api.delete(`/teams/${id}`);
  return response.data;
};

export default api;
