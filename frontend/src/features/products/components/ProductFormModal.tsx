import React, { useState, useEffect } from 'react';
import { useProductForm } from '../hooks/useProductForm';
import { Product } from '../schemas/productSchema';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import SearchSelect from '@/components/shared/SearchSelect';
import api from '@/api/axios';
import { Package, Tag, DollarSign } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Product;
}

export function ProductFormModal({ isOpen, onClose, onSuccess, initialData }: ProductFormModalProps) {
  const { form, onSubmit, submitError } = useProductForm(() => {
    onSuccess();
    onClose();
  }, initialData);

  const { register, setValue, watch, formState: { errors, isSubmitting } } = form;
  const categoryId = watch('categoryId');

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/categories').then((res) => {
      setCategories(res.data);
    }).catch(console.error);
  }, []);

  const categoryOptions = categories.map(c => ({
    id: c.id,
    label: c.name,
  }));

  const inputClass = (error: any) => 
    `w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${error ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'} rounded-xl text-sm focus:outline-none transition-all`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le produit" : "Nouveau produit"}>
      <form onSubmit={onSubmit} className="space-y-5">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Référence / SKU <span className="text-red-500">*</span></label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('sku')}
                placeholder="Ex: PROD-001"
                className={inputClass(errors.sku)}
              />
            </div>
            {errors.sku && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du produit <span className="text-red-500">*</span></label>
            <div className="relative">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('name')}
                placeholder="Ex: Ordinateur Portable"
                className={inputClass(errors.name)}
              />
            </div>
            {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message}</p>}
          </div>
        </div>

        <div>
          <SearchSelect
            label="Catégorie"
            placeholder="Sélectionnez une catégorie..."
            options={categoryOptions}
            value={categoryId}
            onChange={(val) => setValue('categoryId', val, { shouldValidate: true })}
            required
          />
          {errors.categoryId && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.categoryId.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix Unitaire <span className="text-slate-400 font-normal">(Vente)</span> <span className="text-red-500">*</span></label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={0}
                step="0.01"
                {...register('defaultPrice', { valueAsNumber: true })}
                className={inputClass(errors.defaultPrice)}
              />
            </div>
            {errors.defaultPrice && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.defaultPrice.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Coût d'achat <span className="text-slate-400 font-normal">(Achat)</span> <span className="text-red-500">*</span></label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={0}
                step="0.01"
                {...register('costPrice', { valueAsNumber: true })}
                className={inputClass(errors.costPrice)}
              />
            </div>
            {errors.costPrice && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.costPrice.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer le produit</Button>
        </div>
      </form>
    </Modal>
  );
}
