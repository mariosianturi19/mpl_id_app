import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://api-mpl-indonesia-s16.vercel.app/api';

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

// --- MVP API Functions ---

export const fetchMVPs = async () => {
  console.log('🔄 Fetching MVPs from:', `${API_BASE_URL}/mvp`);
  try {
    const response = await api.get('/mvp');
    console.log('✅ MVPs fetched:', response.data?.length || 0, 'players');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching MVPs:', error.message);
    throw error;
  }
};

export const createMVP = async (mvpData) => {
  console.log('🔄 Creating MVP:', mvpData.ign);
  try {
    const response = await api.post('/mvp', mvpData);
    console.log('✅ MVP created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating MVP:', error.message);
    throw error;
  }
};

export const updateMVP = async (id, mvpData) => {
  console.log('🔄 Updating MVP:', id, mvpData);
  try {
    const response = await api.patch(`/mvp/${id}`, mvpData);
    console.log('✅ MVP updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating MVP:', error.message);
    throw error;
  }
};

export const deleteMVP = async (id) => {
  console.log('🔄 Deleting MVP:', id);
  try {
    const response = await api.delete(`/mvp/${id}`);
    console.log('✅ MVP deleted');
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting MVP:', error.message);
    throw error;
  }
};

export default api;