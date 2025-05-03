'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/src/theme';

interface MUIProviderProps {
  children: ReactNode;
}

export default function MUIProvider({ children }: MUIProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaselineはMUIの基本スタイルリセットを提供しますが、 */}
      {/* Tailwindとの併用を考慮して慎重に使用します */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}