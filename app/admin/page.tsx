'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <DashboardLayout onLogout={handleLogout} />;
}
