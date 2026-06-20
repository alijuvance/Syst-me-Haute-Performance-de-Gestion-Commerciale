'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSalePage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [depots, setDepots] = useState([]);
  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [depotId, setDepotId] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [lines, setLines] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [custRes, prodRes, depRes] = await Promise.all([
        fetch('/api/customers', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/depots', { headers })
      ]);
      if (custRes.ok) setCustomers((await custRes.json()).filter((c:any) => c.type === 'B2B'));
      if (prodRes.ok) setProducts(await prodRes.json());
      if (depRes.ok) setDepots(await depRes.json());
    };
    fetchData();
  }, []);

  const addLine = () => setLines([...lines, { productId: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [field]: value };
    
    // Auto-fill price if product changes
    if (field === 'productId') {
      const prod = products.find((p:any) => p.id === value);
      if (prod) newLines[idx].unitPrice = (prod as any).defaultPrice;
    }
    
    setLines(newLines);
  };

  const totalAmount = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !depotId || lines.some(l => !l.productId || l.quantity <= 0)) {
      return alert("Veuillez remplir correctement la facture.");
    }

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        type: 'B2B', 
        customerId, 
        depotId,
        amountPaid: Number(amountPaid),
        lines 
      })
    });

    if (res.ok) {
      router.push('/dashboard/sales');
    } else {
      const err = await res.json();
      alert(`Erreur: ${err.message || 'Problème de stock ou serveur'}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle Facture B2B</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Client B2B *</label>
            <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full border rounded p-2">
              <option value="">Sélectionner un client...</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.companyName || c.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dépôt d'expédition *</label>
            <select required value={depotId} onChange={e => setDepotId(e.target.value)} className="w-full border rounded p-2">
              <option value="">Dépôt source...</option>
              {depots.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lignes de la facture</h2>
            <button type="button" onClick={addLine} className="text-blue-600 text-sm font-medium">+ Ajouter produit</button>
          </div>

          <table className="min-w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Produit</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-24">Quantité</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-40">Prix Unitaire</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2 w-32">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lines.map((line, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2">
                    <select required value={line.productId} onChange={e => updateLine(idx, 'productId', e.target.value)} className="w-full border rounded p-2 text-sm">
                      <option value="">Choisir...</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} className="w-full border rounded p-2 text-sm" />
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="0" value={line.unitPrice} onChange={e => updateLine(idx, 'unitPrice', Number(e.target.value))} className="w-full border rounded p-2 text-sm" />
                  </td>
                  <td className="py-2 font-medium text-gray-900 text-sm">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(line.quantity * line.unitPrice)}
                  </td>
                  <td className="py-2 text-right">
                    {lines.length > 1 && (
                      <button type="button" onClick={() => removeLine(idx)} className="text-red-500 text-xl font-bold">&times;</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col items-end pt-4 border-t gap-2">
            <div className="text-xl font-bold">
              Total à payer : {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(totalAmount)}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">Acompte reçu (MGA) :</label>
              <input type="number" min="0" max={totalAmount} value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} className="border rounded p-2 w-32 text-right font-medium" />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.push('/dashboard/sales')} className="px-6 py-2 border rounded text-gray-700 bg-white">Annuler</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium">Valider la Facture</button>
        </div>
      </form>
    </div>
  );
}
