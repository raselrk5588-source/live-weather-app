"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  location: { lat: number; lon: number; city: string } | null;
  setLocation: (loc: { lat: number; lon: number; city: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [location, setLocation] = useState<{ lat: number; lon: number; city: string } | null>(null);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, setTheme, location, setLocation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
