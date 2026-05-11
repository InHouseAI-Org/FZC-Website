'use client';

import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await onLogin(username, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b2a29] via-[#1a1918] to-[#2b2a29] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-[#e31e24] rounded-2xl mb-4">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Inmarco Analytics Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#2b2a29] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-transparent transition-all"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#2b2a29] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#e31e24]/20 border border-[#e31e24] rounded-lg text-red-300 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e31e24] hover:bg-[#c41a20] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:ring-offset-2 focus:ring-offset-[#1a1918]"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Secure admin access for authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
