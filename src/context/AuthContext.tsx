"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userMobile: string | null;
  subscriptionStatus: string | null;
  login: (mobile: string, status: string) => void;
  logout: () => void;
  setSubscriptionStatus: (status: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatusState] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const storedAuth = localStorage.getItem('auth_data');
    if (storedAuth) {
      try {
        const { isAuthenticated, userMobile, subscriptionStatus } = JSON.parse(storedAuth);
        setIsAuthenticated(isAuthenticated);
        setUserMobile(userMobile);
        setSubscriptionStatusState(subscriptionStatus);
      } catch (e) {
        console.error("Failed to parse auth data", e);
      }
    }
  }, []);

  const login = (mobile: string, status: string) => {
    setIsAuthenticated(true);
    setUserMobile(mobile);
    setSubscriptionStatusState(status);
    
    localStorage.setItem('auth_data', JSON.stringify({
      isAuthenticated: true,
      userMobile: mobile,
      subscriptionStatus: status
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserMobile(null);
    setSubscriptionStatusState(null);
    localStorage.removeItem('auth_data');
  };

  const setSubscriptionStatus = (status: string) => {
    setSubscriptionStatusState(status);
    const storedAuth = localStorage.getItem('auth_data');
    if (storedAuth) {
      try {
        const data = JSON.parse(storedAuth);
        data.subscriptionStatus = status;
        localStorage.setItem('auth_data', JSON.stringify(data));
      } catch (e) {
        console.error("Failed to update subscription status in storage", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userMobile,
      subscriptionStatus,
      login,
      logout,
      setSubscriptionStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
