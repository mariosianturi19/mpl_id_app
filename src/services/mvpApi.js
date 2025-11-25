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
  console.log('🔄 Fetching MVPs from:', `${MVP_BASE_URL}/mvp`);
  try {
    const response = await mvpApi.get('/mvp');
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
    const response = await mvpApi.post('/mvp', mvpData);
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
    const response = await mvpApi.patch(`/mvp/${id}`, mvpData);
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
    const response = await mvpApi.delete(`/mvp/${id}`);
    console.log('✅ MVP deleted');
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting MVP:', error.message);
    throw error;
  }
};

export default mvpApi;
