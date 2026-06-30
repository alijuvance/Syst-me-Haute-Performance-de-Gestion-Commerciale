'use client';
import React, { useState, useMemo } from 'react';
import { useStocks } from '../hooks/useStocks';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { AddStockModal } from './AddStockModal';
import { formatDate } from '@/utils/formatters';

export function StocksTable() {
  const { data, depots, products, isLoading, error, addStock } = useStocks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepot, setSelectedDepot] = useState<string>('');

  const filteredData = useMemo(() => {
    return data.filter((stock) => {
      const matchesSearch = !searchQuery || 
        stock.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.product?.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepot = !selectedDepot || stock.depotId === selectedDepot;
      
      return matchesSearch && matchesDepot;
    });
  }, [data, searchQuery, selectedDepot]);

  const columns: ColumnDef<any>[] = [
    { key: 'product', header: 'Produit', cell: (s) => <span className="font-medium text-slate-900">{s.product?.name || '—'}</span> },
    { key: 'sku', header: 'Réf (SKU)', cell: (s) => <span className="text-slate-500 text-xs">{s.product?.sku || '—'}</span> },
    { key: 'depot', header: 'Dépôt', cell: (s) => s.depot?.name || '—' },
    { key: 'qty', header: 'Quantité', align: 'right', cell: (s) => <span className="tabular-nums font-semibold">{s.quantity}</span> },
    { 
      key: 'firstAdded', 
      header: '1er ajout', 
      cell: (s) => <span className="text-slate-500 text-xs">{s.firstStockAddedAt ? formatDate(s.firstStockAddedAt) : '—'}</span> 
    },
    { 
      key: 'lastAdded', 
      header: 'Dernier ajout', 
      cell: (s) => <span className="text-slate-500 text-xs">{s.lastStockAddedAt ? formatDate(s.lastStockAddedAt) : '—'}</span> 
    },
    {
      key: 'status', header: 'État',
      cell: (s) => {
        const alert = s.product?.minimumStockAlert || 0;
        const isLow = s.quantity <= alert && alert > 0;
        return (
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${isLow ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
            {isLow ? 'Stock bas' : 'Normal'}
          </span>
        );
      }
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200 m-6 rounded-lg">{error}</div>;

  return (
    <>
      <PageHeader 
        title="Niveaux de Stock & Catalogue" 
        description="Vue globale de l'inventaire. Ajoutez et suivez vos stocks par dépôt."
        actions={
          <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Ajouter au stock
          </Button>
        }
      />

      <div className="px-6 pb-2">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un produit ou SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Tous les dépôts</option>
              {depots.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable 
        data={filteredData} 
        columns={columns} 
        keyExtractor={(s) => s.id} 
        isLoading={isLoading} 
      />

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        products={products}
        depots={depots}
        onSubmit={addStock}
      />
    </>
  );
}
