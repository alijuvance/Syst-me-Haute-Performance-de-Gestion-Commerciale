import api from '@/api/axios';

export const getFormReferenceData = async () => {
  const [custRes, prodRes, depRes, catRes] = await Promise.all([
    api.get('/api/customers'),
    api.get('/api/products'),
    api.get('/api/depots'),
    api.get('/api/categories'),
  ]);

  return {
    customers: (custRes.data || []).filter((c: any) => c.type === 'B2B'),
    products: prodRes.data || [],
    depots: depRes.data || [],
    categories: catRes.data || [],
  };
};
