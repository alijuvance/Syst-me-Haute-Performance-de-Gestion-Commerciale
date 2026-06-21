'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Truck,
  FileText,
  LineChart
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Finance & Trésorerie", href: "/dashboard/finance", icon: LineChart },
    { name: "Catalogue & Stocks", href: "/dashboard/products", icon: Package },
    { name: "Achats (Commandes)", href: "/dashboard/purchases", icon: FileText },
    { name: "Fournisseurs", href: "/dashboard/suppliers", icon: Truck },
    { name: "Ventes & Factures", href: "/dashboard/sales", icon: ShoppingCart },
    { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className={`${sidebarOpen ? "w-72" : "w-20"} transition-all duration-300 glass dark:glass-panel flex flex-col fixed h-full z-20`}>
      <div className="h-24 flex items-center justify-between px-6">
        <div className={`font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
          ERP Pro
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all hover-glow">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 transform scale-[1.02]" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}`} />
              <span className={`font-semibold whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <Link href="/login" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all hover-glow">
          <LogOut className="w-5 h-5" />
          <span className={`font-bold whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Déconnexion
          </span>
        </Link>
      </div>
    </aside>
  );
}
