'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import SearchSelect from '@/components/shared/SearchSelect';
import { AlertCircle } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  depots: any[];
  onSubmit: (productId: string, depotId: string, qty: number, ref: string) => Promise<void>;
}

export function AddStockModal({ isOpen, onClose, products, depots, onSubmit }: AddStockModalProps) {
  const [productId, setProductId] = useState('');
  const [depotId, setDepotId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productOptions = products.map((p) => ({
    id: p.id,
    label: p.name,
    sublabel: p.sku,
  }));

  const depotOptions = depots.map((d) => ({
    id: d.id,
    label: d.name,
    sublabel: d.location || '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('Veuillez sélectionner un produit.');
      return;
    }
    if (!depotId) {
      setError('Veuillez sélectionner un dépôt.');
      return;
    }
    if (quantity <= 0) {
      setError('La quantité doit être supérieure à 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(productId, depotId, quantity, reference);
      // Reset form on success
      setProductId('');
      setDepotId('');
      setQuantity(1);
      setReference('');
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout au stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter au stock">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <SearchSelect
          label="Produit"
          placeholder="Rechercher un produit..."
          options={productOptions}
          value={productId}
          onChange={setProductId}
          required
        />

        <SearchSelect
          label="Dépôt de destination"
          placeholder="Rechercher un dépôt..."
          options={depotOptions}
          value={depotId}
          onChange={setDepotId}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Quantité à ajouter <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full border p-2 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Référence / Motif
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Arrivage fournisseur..."
              className="w-full border p-2 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 border-slate-300"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Ajouter le stock</Button>
        </div>
      </form>
    </Modal>
  );
}
