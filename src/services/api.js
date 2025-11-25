import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://api-mpl.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API Functions ---

export const fetchTeams = async () => {
  console.log('🔄 Fetching teams from:', `${API_BASE_URL}/teams`);
  try {
    const response = await api.get('/teams');
    console.log('✅ Teams fetched:', response.data?.length || 0, 'teams');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching teams:', error.message);
    throw error;
  }
};

export const fetchTeamById = async (id) => {
  console.log('🔄 Fetching team by ID:', id);
  try {
    const response = await api.get(`/teams/${id}`);
    console.log('✅ Team fetched:', response.data?.name);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching team:', error.message);
    throw error;
  }
};

export const createTeam = async (teamData) => {
  console.log('🔄 Creating team:', teamData.name);
  try {
    const response = await api.post('/teams', teamData);
    console.log('✅ Team created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating team:', error.message);
    throw error;
  }
};

// [Perbaikan] Pastikan menggunakan PATCH untuk update parsial
export const updateTeam = async (id, teamData) => {
  console.log('🔄 Updating team:', id, teamData);
  try {
    const response = await api.patch(`/teams/${id}`, teamData);
    console.log('✅ Team updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating team:', error.message);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  console.log('🔄 Deleting team:', id);
  try {
    const response = await api.delete(`/teams/${id}`);
    console.log('✅ Team deleted');
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting team:', error.message);
    throw error;
  }
};

export default api;