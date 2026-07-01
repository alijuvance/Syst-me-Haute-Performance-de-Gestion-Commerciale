'use client';
import { useState } from 'react';
import { Download, LayoutDashboard, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useFinance } from '@/features/finance/hooks/useFinance';
import { useDebts } from '@/features/finance/hooks/useDebts';
import { DebtsTable } from '@/features/finance/components/DebtsTable';
import { PayablesTable } from '@/features/finance/components/PayablesTable';
import { FinanceOverview } from '@/features/finance/components/FinanceOverview';
import { Debt } from '@/features/finance/types';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'receivables' | 'payables'>('overview');
  
  // Data hooks
  const { kpis, cashflow, payables, isLoading: financeLoading, error: financeError } = useFinance();
  const { debts, loading: debtsLoading, error: debtsError, totalDebt } = useDebts();

  const exportCSV = () => {
    if (activeTab === 'receivables' && debts.length > 0) {
      const headers = ['Facture', 'Date', 'Client', 'Total (MGA)', 'Payé (MGA)', 'Reste à Payer (MGA)'];
      const rows = debts.map((d: Debt) => [
        d.invoiceNumber,
        new Date(d.date).toLocaleDateString(),
        d.customer?.companyName || d.customer?.fullName || 'Inconnu',
        d.totalAmount,
        d.amountPaid,
        d.totalAmount - d.amountPaid
      ]);
      triggerDownload(headers, rows, 'creances_clients');
    } else if (activeTab === 'payables' && payables.length > 0) {
      const headers = ['Commande', 'Date', 'Fournisseur', 'Total (MGA)', 'Payé (MGA)', 'Reste à Payer (MGA)'];
      const rows = payables.map((p: any) => [
        p.orderNumber,
        new Date(p.date).toLocaleDateString(),
        p.supplier?.name || 'Inconnu',
        p.totalAmount,
        p.amountPaid,
        p.totalAmount - p.amountPaid
      ]);
      triggerDownload(headers, rows, 'dettes_fournisseurs');
    }
  };

  const triggerDownload = (headers: string[], rows: any[][], filename: string) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasError = financeError || debtsError;
  const isLoading = financeLoading || debtsLoading;

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Trésorerie</h1>
          <p className="text-slate-500 text-sm mt-1">Tableau de bord financier et suivi des créances/dettes.</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl flex-1 lg:flex-none overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('receivables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'receivables' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Créances Clients
            </button>
            <button
              onClick={() => setActiveTab('payables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'payables' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <TrendingDown className="w-4 h-4" />
              Dettes Fournisseurs
            </button>
          </div>

          {(activeTab === 'receivables' || activeTab === 'payables') && (
            <button 
              onClick={exportCSV} 
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-800 transition"
            >
              <Download className="w-4 h-4" /> 
              <span className="hidden sm:inline">Exporter</span>
            </button>
          )}
        </div>
      </div>

      {hasError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {financeError || debtsError}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1">
        {isLoading && activeTab === 'overview' ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Chargement des données financières...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <FinanceOverview kpis={kpis} cashflow={cashflow} />
            )}
            
            {activeTab === 'receivables' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <DebtsTable debts={debts} loading={debtsLoading} totalDebt={totalDebt} />
              </div>
            )}
            
            {activeTab === 'payables' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <PayablesTable payables={payables} isLoading={financeLoading} />
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
