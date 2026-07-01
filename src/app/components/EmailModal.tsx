'use client';

import React, { useState } from 'react';
import { X, Mail, Download, Share2 } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  mode: 'download' | 'share';
  productName: string;
  isLoading?: boolean;
}

export default function EmailModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  productName,
  isLoading = false,
}: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(email);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {mode === 'download' ? (
              <div className="p-2 bg-red-50 rounded-lg">
                <Download className="w-5 h-5 text-[#e31e24]" />
              </div>
            ) : (
              <div className="p-2 bg-red-50 rounded-lg">
                <Share2 className="w-5 h-5 text-[#e31e24]" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'download' ? 'Download Datasheet' : 'Share Datasheet'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              {mode === 'download'
                ? `Please enter your email address to download the datasheet for ${productName}.`
                : `Please enter the recipient's email address to share the datasheet for ${productName}.`
              }
            </p>

            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'download' ? 'Your Email Address' : 'Recipient Email Address'}
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="example@company.com"
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e31e24] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                autoFocus
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-600">
              {mode === 'download'
                ? 'We collect your email to provide you with product updates and technical support. Your information will not be shared with third parties.'
                : 'The datasheet will be sent to the provided email address with your contact information.'
              }
            </p>
          </div>

          {/* Footer */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {mode === 'download' ? <Download className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{mode === 'download' ? 'Download' : 'Share'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
