import { useState, useEffect } from 'react';
import api from '@/api/axios';

export interface FinanceKPIs {
  netCash: number;
  totalReceivables: number;
  totalPayables: number;
  commercialMargin: number;
}

export interface CashflowData {
  date: string;
  inflows: number;
  outflows: number;
}

export const useFinance = () => {
  const [kpis, setKpis] = useState<FinanceKPIs | null>(null);
  const [cashflow, setCashflow] = useState<CashflowData[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setIsLoading(true);
        const [kpiRes, cashflowRes, payablesRes] = await Promise.all([
          api.get('/api/analytics/finance-kpis'),
          api.get('/api/analytics/cashflow'),
          api.get('/api/analytics/payables')
        ]);
        
        setKpis(kpiRes.data);
        setCashflow(cashflowRes.data);
        setPayables(payablesRes.data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des données financières.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  return { kpis, cashflow, payables, isLoading, error };
};
