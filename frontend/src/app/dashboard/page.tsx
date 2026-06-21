'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [kpiRes, chartRes] = await Promise.all([
        fetch('/api/analytics/kpis', { headers }),
        fetch('/api/analytics/sales-chart', { headers })
      ]);
      
      if (kpiRes.ok) setKpis(await kpiRes.json());
      if (chartRes.ok) setChartData(await chartRes.json());
    };
    fetchAnalytics();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(val || 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Voici ce qui se passe dans votre entreprise aujourd'hui.</p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Chiffre d'Affaires</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-800 dark:text-white mt-2">{formatCurrency(kpis?.totalRevenue)}</div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center">
               <span className="text-green-500 mr-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>+12.5%</span> par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Marge Commerciale</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{formatCurrency(kpis?.commercialMargin)}</div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              Revenus déduits des coûts d'achats
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Créances Clients</CardTitle>
            <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl">
              <Users className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">{formatCurrency(kpis?.totalReceivables)}</div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              Restant à recouvrer
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Coût d'Achat (COGS)</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-800 dark:text-white mt-2">{formatCurrency(kpis?.totalCogs)}</div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              Valeur totale des sorties
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Chart */}
      <Card className="p-8 pb-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
          <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
          Évolution des Ventes
        </h2>
        <div className="h-96 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} tickFormatter={(value) => new Intl.NumberFormat('fr-MG', { notation: "compact", compactDisplay: "short" }).format(value)} />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), "Ventes"]}
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', color: 'white' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <LineChart className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">Aucune donnée de vente pour le graphique</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
