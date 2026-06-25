import React, { useState, useMemo } from 'react';
import { Search, Package2, Tag } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { formatCurrency } from '@/utils/formatters';

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  defaultPrice: number;
  costPrice: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onSelectProduct: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryId ? product.categoryId === selectedCategoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);

  const handleSelect = (id: string) => {
    onSelectProduct(id);
    onClose();
    setSearchTerm('');
    setSelectedCategoryId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sélectionner un produit">
      <div className="flex flex-col gap-4 h-[60vh] max-h-[600px] w-full min-w-[300px]">
        {/* Recherche et Filtres */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou référence (SKU)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Filtres par catégories */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategoryId === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toutes les catégories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategoryId === category.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Package2 className="w-8 h-8 opacity-50" />
              <p className="text-sm">Aucun produit trouvé</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'Non classé';
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product.id)}
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-900 text-sm group-hover:text-slate-700">
                      {product.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {product.sku}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                        {categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(product.defaultPrice)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
