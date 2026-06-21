'use client';
import { Bell, Search } from "lucide-react";

export function Header({ title }: { title: string }) {
  return (
    <div className="px-8 pt-6 pb-2">
      <header className="h-16 glass-panel rounded-2xl sticky top-6 z-10 flex items-center justify-between px-6 shadow-sm">
        <h2 className="font-bold text-gray-800 dark:text-white text-xl tracking-tight">
          {title}
        </h2>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-gray-100/50 dark:bg-black/20 rounded-full px-4 py-2 border border-gray-200/50 dark:border-white/5 backdrop-blur-sm">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-sm w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400" />
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-white/10 text-gray-500 transition-all hover-glow relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30 cursor-pointer hover:scale-105 transition-all ring-2 ring-white/20">
            AD
          </div>
        </div>
      </header>
    </div>
  );
}
