'use client';
import { Bell } from "lucide-react";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-10 flex items-center justify-between px-8">
      <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
        {title}
      </h2>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0f172a]"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform">
          AD
        </div>
      </div>
    </header>
  );
}
