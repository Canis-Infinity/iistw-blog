'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return (
    <ThemeProvider
      enableSystem={false}
      themes={['dark', 'light']}
    >
      {children}
    </ThemeProvider>
  );
}