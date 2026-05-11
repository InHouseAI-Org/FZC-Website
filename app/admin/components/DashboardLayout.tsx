'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Users,
  Eye,
  FileText,
  Globe,
  Monitor,
  RefreshCw,
  Download
} from 'lucide-react';
import { AnalyticsData } from '../../lib/analytics';
import { StatsCard } from './StatsCard';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { TopItemsList } from './TopItemsList';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2b2a29] via-[#1a1918] to-[#2b2a29] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#e31e24] animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b2a29] via-[#1a1918] to-[#2b2a29]">
      {/* Header */}
      <header className="bg-[#1a1918]/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e31e24] rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Inmarco Admin</h1>
                <p className="text-xs text-gray-400">Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Last updated</p>
                <p className="text-sm font-medium text-white">{formatTime(lastUpdated)}</p>
              </div>

              <button
                onClick={fetchAnalytics}
                className="p-2 hover:bg-[#2b2a29] rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#e31e24] hover:bg-[#c41a20] text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Page Views"
            value={analyticsData.pageViews.total.toLocaleString()}
            trend={analyticsData.pageViews.trend}
            icon={Eye}
            color="blue"
          />
          <StatsCard
            title="Unique Visitors"
            value={analyticsData.uniqueVisitors.total.toLocaleString()}
            trend={analyticsData.uniqueVisitors.trend}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Quote Requests"
            value={analyticsData.conversionMetrics.quoteRequests.toString()}
            icon={FileText}
            color="purple"
          />
          <StatsCard
            title="Bounce Rate"
            value={`${analyticsData.performanceMetrics.bounceRate}%`}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart
            title="Page Views Trend (Last 30 Days)"
            data={analyticsData.pageViews.data}
            dataKey="views"
            color="#e31e24"
          />
          <LineChart
            title="Unique Visitors Trend (Last 30 Days)"
            data={analyticsData.uniqueVisitors.data}
            dataKey="visitors"
            color="#c41a20"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PieChart
            title="Traffic Sources"
            data={analyticsData.trafficSources}
          />
          <PieChart
            title="Device Distribution"
            data={analyticsData.deviceData}
          />
          <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#e31e24]" />
              Conversions
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Contact Forms</span>
                  <span className="text-white font-medium">{analyticsData.conversionMetrics.contactForms}</span>
                </div>
                <div className="w-full bg-[#2b2a29] rounded-full h-2">
                  <div className="bg-[#e31e24] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Quote Requests</span>
                  <span className="text-white font-medium">{analyticsData.conversionMetrics.quoteRequests}</span>
                </div>
                <div className="w-full bg-[#2b2a29] rounded-full h-2">
                  <div className="bg-[#e31e24]/80 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Product Inquiries</span>
                  <span className="text-white font-medium">{analyticsData.conversionMetrics.productInquiries}</span>
                </div>
                <div className="w-full bg-[#2b2a29] rounded-full h-2">
                  <div className="bg-[#e31e24]/60 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Downloads</span>
                  <span className="text-white font-medium">{analyticsData.conversionMetrics.downloads}</span>
                </div>
                <div className="w-full bg-[#2b2a29] rounded-full h-2">
                  <div className="bg-[#e31e24]/40 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Items Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TopItemsList
            title="Top Pages"
            items={analyticsData.topPages.map(page => ({
              name: page.path,
              value: page.views.toLocaleString(),
              percentage: page.percentage
            }))}
            icon={FileText}
          />
          <TopItemsList
            title="Top Products"
            items={analyticsData.topProducts.map(product => ({
              name: product.name,
              value: product.views.toLocaleString(),
              percentage: product.percentage
            }))}
            icon={Monitor}
          />
          <TopItemsList
            title="Top Industries"
            items={analyticsData.topIndustries.map(industry => ({
              name: industry.name,
              value: industry.views.toLocaleString(),
              percentage: industry.percentage
            }))}
            icon={TrendingUp}
          />
        </div>

        {/* Geographic Data */}
        <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#e31e24]" />
            Geographic Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analyticsData.geographicData.map((country, index) => (
              <div key={index} className="p-4 bg-[#2b2a29] rounded-lg border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">{country.country}</p>
                <p className="text-2xl font-bold text-white mb-1">{country.visitors.toLocaleString()}</p>
                <p className="text-xs text-[#e31e24]">{country.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Avg Load Time</p>
            <p className="text-3xl font-bold text-white">{analyticsData.performanceMetrics.avgLoadTime}s</p>
          </div>
          <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Bounce Rate</p>
            <p className="text-3xl font-bold text-white">{analyticsData.performanceMetrics.bounceRate}%</p>
          </div>
          <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Avg Session</p>
            <p className="text-3xl font-bold text-white">{Math.floor(analyticsData.performanceMetrics.avgSessionDuration / 60)}m {analyticsData.performanceMetrics.avgSessionDuration % 60}s</p>
          </div>
          <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Pages/Session</p>
            <p className="text-3xl font-bold text-white">{analyticsData.performanceMetrics.pagesPerSession}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Inmarco Admin Dashboard © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
