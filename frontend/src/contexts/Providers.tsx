'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from '@/components/providers/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
