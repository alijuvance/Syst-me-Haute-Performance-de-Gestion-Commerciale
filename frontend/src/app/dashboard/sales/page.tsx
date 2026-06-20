'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch('/api/sales', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setSales(await res.json());
      setLoading(false);
    };
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ventes & Factures</h1>
        <div className="space-x-3">
          <Link href="/dashboard/pos" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
            Caisse POS
          </Link>
          <Link href="/dashboard/sales/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + Nouvelle Facture B2B
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture N°</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payé</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? <tr><td colSpan={7} className="p-4 text-center">Chargement...</td></tr> : 
             sales.map((s: any) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(s.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.type === 'POS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {s.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{s.customer?.companyName || s.customer?.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(s.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(s.amountPaid)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${s.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                      s.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
