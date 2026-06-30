import { useState, useEffect, useCallback } from 'react';
import { getStocks, getDepots, addStockMovement } from '../api/getStocks';
import api from '@/api/axios';

export const useStocks = () => {
  const [data, setData] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedDepotId, setSelectedDepotId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const depotFilter = selectedDepotId || undefined;
      const result = await getStocks(depotFilter);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepotId]);

  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [depRes, prodRes, catRes] = await Promise.all([
          getDepots(),
          api.get('/api/products'),
          api.get('/api/categories'),
        ]);
        setDepots(depRes);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (e) {
        console.error('Erreur chargement refs:', e);
      }
    };
    loadRefs();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.product?.name?.toLowerCase().includes(term) ||
      item.product?.sku?.toLowerCase().includes(term) ||
      item.depot?.name?.toLowerCase().includes(term)
    );
  });

  const handleAddStock = async (productId: string, depotId: string, quantity: number, reference?: string) => {
    await addStockMovement({
      type: 'IN',
      productId,
      depotId,
      quantityChanged: quantity,
      reference,
    });
    await fetchData();
  };

  return {
    data: filteredData,
    depots,
    products,
    categories,
    selectedDepotId,
    setSelectedDepotId,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    handleAddStock,
    refreshData: fetchData,
  };
};
