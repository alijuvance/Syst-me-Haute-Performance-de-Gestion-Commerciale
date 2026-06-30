import { useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';

export const useStocks = () => {
  const [data, setData] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [stocksRes, depotsRes, productsRes] = await Promise.all([
        api.get('/api/stock-levels'),
        api.get('/api/depots'),
        api.get('/api/products')
      ]);
      setData(stocksRes.data);
      setDepots(depotsRes.data);
      setProducts(productsRes.data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addStock = async (productId: string, depotId: string, quantityChanged: number, reference: string) => {
    try {
      await api.post('/api/stock-movements', {
        type: 'IN',
        productId,
        depotId,
        quantityChanged,
        reference
      });
      await fetchData(); // Refresh data after adding
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Erreur lors de l\'ajout au stock');
    }
  };

  return { data, depots, products, isLoading, error, addStock, refresh: fetchData };
};
