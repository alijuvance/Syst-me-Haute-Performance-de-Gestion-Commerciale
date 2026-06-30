import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';

interface PayablesTableProps {
  payables: any[];
  isLoading: boolean;
}

export const PayablesTable: React.FC<PayablesTableProps> = ({ payables, isLoading }) => {
  const columns: ColumnDef<any>[] = [
    { key: 'orderNumber', header: 'Commande N°', cell: (p) => <span className="font-medium text-slate-900">{p.orderNumber}</span> },
    { key: 'date', header: 'Date', cell: (p) => formatDate(p.date) },
    { key: 'supplier', header: 'Fournisseur', cell: (p) => p.supplier?.name || '—' },
    { key: 'total', header: 'Total (MGA)', align: 'right', cell: (p) => formatCurrency(p.totalAmount) },
    { key: 'paid', header: 'Déjà Payé', align: 'right', cell: (p) => formatCurrency(p.amountPaid) },
    {
      key: 'remaining', header: 'Reste à payer', align: 'right',
      cell: (p) => (
        <span className="font-semibold text-red-600">
          {formatCurrency(p.totalAmount - p.amountPaid)}
        </span>
      )
    },
  ];

  return <DataTable data={payables} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} emptyMessage="Aucune dette fournisseur en attente." />;
};
