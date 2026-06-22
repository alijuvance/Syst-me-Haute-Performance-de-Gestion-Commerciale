import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Le nom du produit doit contenir au moins 2 caractères.'),
  sku: z.string().min(2, 'La référence/SKU est obligatoire.'),
  categoryId: z.string().min(1, 'La catégorie est requise.'),
  defaultPrice: z.number().min(0, 'Le prix ne peut pas être négatif.'),
  costPrice: z.number().min(0, 'Le coût ne peut pas être négatif.'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
  defaultPrice: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
}
