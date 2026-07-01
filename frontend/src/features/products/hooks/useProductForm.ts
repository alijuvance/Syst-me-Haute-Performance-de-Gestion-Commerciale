import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData, Product } from '../schemas/productSchema';
import { createProduct, updateProduct } from '../api/productApi';
import { useToast } from '@/components/providers/ToastProvider';

export const useProductForm = (
  onSuccess: () => void,
  initialData?: Product
) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      sku: initialData.sku,
      categoryId: initialData.categoryId,
      defaultPrice: initialData.defaultPrice,
      costPrice: initialData.costPrice,
    } : {
      name: '',
      sku: '',
      categoryId: '',
      defaultPrice: 0,
      costPrice: 0,
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      if (initialData) {
        await updateProduct(initialData.id, data);
        toast.success('Produit modifié avec succès');
      } else {
        await createProduct(data);
        toast.success('Produit ajouté avec succès');
      }
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  });

  return { form, onSubmit, submitError };
};
