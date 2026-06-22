import api from '@/api/axios';

export const getStocks = async (): Promise<any[]> => {
  const response = await api.get('/api/stock-levels');
  return response.data;
};
