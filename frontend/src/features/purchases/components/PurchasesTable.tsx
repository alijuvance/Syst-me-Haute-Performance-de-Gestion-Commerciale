'use client';
import React, { useState, useEffect } from 'react';
import { usePurchases } from '../hooks/usePurchases';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CheckCircle, Truck, DollarSign, PackageCheck, AlertCircle } from 'lucide-react';
import { getDepots } from '@/features/stocks/api/getStocks';

export function PurchasesTable() {
  const { data, isLoading, error, recordPayment, receiveOrder } = usePurchases();
  const [depots, setDepots] = useState<any[]>([]);

  // Action Modals State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Form State
  const [amountInput, setAmountInput] = useState<number | string>('');
  const [depotIdInput, setDepotIdInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDepots().then(setDepots).catch(console.error);
  }, []);

  const openPayModal = (order: any) => {
    setSelectedOrder(order);
    setAmountInput(order.totalAmount - (order.amountPaid || 0));
    setPayModalOpen(true);
  };

  const openReceiveModal = (order: any) => {
    setSelectedOrder(order);
    setDepotIdInput(depots.length > 0 ? depots[0].id : '');
    setReceiveModalOpen(true);
  };

  const handlePay = async () => {
    if (!selectedOrder || !amountInput) return;
    setIsSubmitting(true);
    const success = await recordPayment(selectedOrder.id, Number(amountInput));
    setIsSubmitting(false);
    if (success) setPayModalOpen(false);
  };

  const handleReceive = async () => {
    if (!selectedOrder || !depotIdInput) return;
    setIsSubmitting(true);
    const success = await receiveOrder(selectedOrder.id, depotIdInput);
    setIsSubmitting(false);
    if (success) setReceiveModalOpen(false);
  };

  const columns: ColumnDef<any>[] = [
    { key: 'ref', header: 'Référence', cell: (p) => <span className="font-medium text-slate-900">{p.orderNumber || p.id?.slice(0, 8)}</span> },
    { key: 'date', header: 'Date', cell: (p) => formatDate(p.date || p.createdAt) },
    { key: 'supplier', header: 'Fournisseur', cell: (p) => p.supplier?.name || '—' },
    { key: 'total', header: 'Montant (MGA)', align: 'right', cell: (p) => formatCurrency(p.totalAmount) },
    { 
      key: 'financial_status', header: 'Paiement',
      cell: (p) => {
        const remaining = p.totalAmount - (p.amountPaid || 0);
        if (remaining <= 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border text-emerald-700 bg-emerald-50 border-emerald-200"><CheckCircle className="w-3 h-3"/> Payé</span>;
        if (p.amountPaid > 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border text-amber-700 bg-amber-50 border-amber-200"><DollarSign className="w-3 h-3"/> Partiel</span>;
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border text-red-700 bg-red-50 border-red-200"><AlertCircle className="w-3 h-3"/> Impayé</span>;
      }
    },
    {
      key: 'logistics_status', header: 'Logistique',
      cell: (p) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded border ${p.status === 'RECEIVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : p.status === 'SENT' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
          {p.status === 'RECEIVED' ? <PackageCheck className="w-3 h-3"/> : p.status === 'SENT' ? <Truck className="w-3 h-3"/> : null}
          {p.status === 'RECEIVED' ? 'Reçu' : p.status === 'SENT' ? 'En transit' : p.status === 'DRAFT' ? 'Brouillon' : p.status}
        </span>
      )
    },
    {
      key: 'actions', header: '', align: 'right',
      cell: (p) => (
        <div className="flex gap-2 justify-end">
          {p.totalAmount - (p.amountPaid || 0) > 0 && p.status !== 'CANCELLED' && (
            <button 
              onClick={() => openPayModal(p)}
              className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition"
            >
              Payer
            </button>
          )}
          {p.status !== 'RECEIVED' && p.status !== 'CANCELLED' && (
            <button 
              onClick={() => openReceiveModal(p)}
              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition"
            >
              Réceptionner
            </button>
          )}
        </div>
      )
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl mb-4">{error}</div>;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable data={data} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} emptyMessage="Aucune commande d'achat pour le moment." />
      </div>

      {/* Payment Modal */}
      {payModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Enregistrer un paiement</h3>
              <p className="text-slate-500 text-sm mt-1">Commande {selectedOrder.orderNumber} ({selectedOrder.supplier?.name})</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Montant à payer (MGA)</label>
                <input 
                  type="number" 
                  value={amountInput} 
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  max={selectedOrder.totalAmount - (selectedOrder.amountPaid || 0)}
                />
                <p className="text-xs text-slate-500 mt-2">Reste à payer : {formatCurrency(selectedOrder.totalAmount - (selectedOrder.amountPaid || 0))}</p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setPayModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                onClick={handlePay} 
                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-2"
                disabled={isSubmitting || !amountInput || Number(amountInput) <= 0}
              >
                {isSubmitting ? 'Traitement...' : 'Confirmer le paiement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {receiveModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Réception de Marchandises</h3>
              <p className="text-slate-500 text-sm mt-1">Commande {selectedOrder.orderNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-4 bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                La réception mettra automatiquement à jour les niveaux de stock dans le dépôt sélectionné.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Dépôt de réception</label>
                <select 
                  value={depotIdInput} 
                  onChange={(e) => setDepotIdInput(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Sélectionnez un dépôt</option>
                  {depots.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setReceiveModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                onClick={handleReceive} 
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                disabled={isSubmitting || !depotIdInput}
              >
                {isSubmitting ? 'Traitement...' : 'Réceptionner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
