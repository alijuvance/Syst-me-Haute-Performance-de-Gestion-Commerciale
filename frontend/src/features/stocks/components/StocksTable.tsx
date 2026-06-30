'use client';
import React, { useState } from 'react';
import { useStocks } from '../hooks/useStocks';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import SearchSelect from '@/components/shared/SearchSelect';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Warehouse, AlertCircle } from 'lucide-react';

export function StocksTable() {
  const {
    data, depots, products, categories,
    selectedDepotId, setSelectedDepotId,
    searchTerm, setSearchTerm,
    isLoading, error,
    handleAddStock,
  } = useStocks();

  // Add stock modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addDepotId, setAddDepotId] = useState('');
  const [addProductId, setAddProductId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addReference, setAddReference] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const depotOptions = depots.map((d: any) => ({
    id: d.id,
    label: d.name,
    sublabel: d.location || '',
  }));

  const productOptions = products.map((p: any) => {
    const catName = categories.find((c: any) => c.id === p.categoryId)?.name || '';
    return {
      id: p.id,
      label: p.name,
      sublabel: `${p.sku} — ${catName}`,
    };
  });

  const handleSubmitAdd = async () => {
    if (!addDepotId || !addProductId || addQuantity < 1) {
      setAddError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      setIsAdding(true);
      setAddError(null);
      await handleAddStock(addProductId, addDepotId, addQuantity, addReference || undefined);
      setIsModalOpen(false);
      setAddDepotId('');
      setAddProductId('');
      setAddQuantity(1);
      setAddReference('');
    } catch (err: any) {
      setAddError(err?.response?.data?.message || err?.message || "Erreur lors de l'ajout.");
    } finally {
      setIsAdding(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: 'product',
      header: 'Produit',
      cell: (s) => (
        <div>
          <span className="font-medium text-slate-900">{s.product?.name || '—'}</span>
          <p className="text-xs text-slate-500">{s.product?.sku || ''}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      cell: (s) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {s.product?.category?.name || '—'}
        </span>
      ),
    },
    {
      key: 'depot',
      header: 'Dépôt',
      cell: (s) => (
        <span className="flex items-center gap-1.5 text-sm">
          <Warehouse className="w-3.5 h-3.5 text-slate-400" />
          {s.depot?.name || '—'}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Quantité',
      align: 'right' as const,
      cell: (s) => <span className="tabular-nums font-semibold text-slate-900">{s.quantity}</span>,
    },
    {
      key: 'status',
      header: 'État',
      cell: (s) => {
        const alert = s.minAlertQuantity || 0;
        const isLow = s.quantity <= alert && alert > 0;
        return (
          <span
            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
              isLow
                ? 'text-red-700 bg-red-50 border border-red-200'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            }`}
          >
            {isLow ? 'Stock bas' : 'Normal'}
          </span>
        );
      },
    },
    {
      key: 'firstAdded',
      header: '1er ajout',
      cell: (s) => <span className="text-xs text-slate-500 tabular-nums">{formatDate(s.firstAddedAt)}</span>,
    },
    {
      key: 'lastAdded',
      header: 'Dernier ajout',
      cell: (s) => <span className="text-xs text-slate-500 tabular-nums">{formatDate(s.lastAddedAt)}</span>,
    },
  ];

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-2">
        <AlertCircle className="w-4 h-4" /> {error}
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Catalogue & Stock" description="Gérez vos stocks par dépôt. Recherchez, filtrez et ajoutez des produits." />

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <SearchSelect
            label="Filtrer par dépôt"
            placeholder="Tous les dépôts..."
            options={depotOptions}
            value={selectedDepotId}
            onChange={setSelectedDepotId}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Rechercher</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nom du produit, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Ajouter au stock
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyMessage="Aucun stock trouvé. Ajoutez des produits à un dépôt."
      />

      {/* Add Stock Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un produit au stock">
        <div className="space-y-4">
          {addError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {addError}
            </div>
          )}

          <SearchSelect
            label="Dépôt de destination"
            placeholder="Choisir un dépôt..."
            options={depotOptions}
            value={addDepotId}
            onChange={setAddDepotId}
            required
          />

          <SearchSelect
            label="Produit"
            placeholder="Rechercher un produit..."
            options={productOptions}
            value={addProductId}
            onChange={setAddProductId}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quantité <span className="text-red-500">*</span></label>
            <input
              type="number"
              min={1}
              value={addQuantity}
              onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Référence / Motif</label>
            <input
              type="text"
              placeholder="Ex: Réception fournisseur, Inventaire initial..."
              value={addReference}
              onChange={(e) => setAddReference(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmitAdd} isLoading={isAdding}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
