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
    <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-white/10 flex flex-col fixed h-full z-20 shadow-sm`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
        <div className={`font-bold text-xl text-primary overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
          ERP Pro
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary transition-colors"}`} />
              <span className={`font-medium whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <Link href="/login" className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className={`font-medium whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Déconnexion
          </span>
        </Link>
      </div>
    </aside>
  );
}
