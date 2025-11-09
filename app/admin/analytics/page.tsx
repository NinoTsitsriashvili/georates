'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Header from '@/components/Header'

const AUTH_STORAGE_KEY = 'georates_admin_auth'

interface PageView {
  page_path: string
  view_count: number
  unique_visitors: number
  last_viewed: string
}

interface LanguageStat {
  language: string
  usage_count: number
  unique_sessions: number
  percentage: number
}

interface DailyStat {
  date: string
  total_views: number
  unique_visitors: number
  pages_viewed: number
}

interface Overview {
  totalViews: number
  uniqueVisitors: number
  uniquePages: number
  topLanguage: string
  languageBreakdown: Record<string, number>
}

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(30)
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'languages' | 'daily' | 'visitors'>('overview')
  
  const [overview, setOverview] = useState<Overview | null>(null)
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [visitors, setVisitors] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (storedAuth) {
        try {
          const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: storedAuth }),
          })
          const data = await response.json()
          
          if (data.success) {
            setAuthenticated(true)
            fetchAnalytics()
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        } catch (error) {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      }
      setCheckingAuth(false)
    }
    
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem(AUTH_STORAGE_KEY, password)
      setAuthenticated(true)
      fetchAnalytics()
    }
    
    setLoading(false)
  }

  const fetchAnalytics = async () => {
    setLoadingData(true)
    
    try {
      // Fetch overview
      const overviewRes = await fetch(`/api/analytics/stats?days=${days}&type=overview`)
      const overviewData = await overviewRes.json()
      if (overviewData.success) setOverview(overviewData.data)
      
      // Fetch page views
      const pagesRes = await fetch(`/api/analytics/stats?days=${days}&type=page_views`)
      const pagesData = await pagesRes.json()
      if (pagesData.success) setPageViews(pagesData.data)
      
      // Fetch language stats
      const langRes = await fetch(`/api/analytics/stats?days=${days}&type=language`)
      const langData = await langRes.json()
      if (langData.success) setLanguageStats(langData.data)
      
      // Fetch daily stats
      const dailyRes = await fetch(`/api/analytics/stats?days=${days}&type=daily`)
      const dailyData = await dailyRes.json()
      if (dailyData.success) setDailyStats(dailyData.data)
      
      // Fetch visitors
      const visitorsRes = await fetch(`/api/analytics/visitors?days=${days}&limit=100`)
      const visitorsData = await visitorsRes.json()
      if (visitorsData.success) setVisitors(visitorsData.visitors)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchAnalytics()
    }
  }, [days, authenticated])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Checking authentication...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Analytics Dashboard
            </h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <a
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Admin
            </a>
            <button
              onClick={() => {
                localStorage.removeItem(AUTH_STORAGE_KEY)
                setAuthenticated(false)
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            {(['overview', 'pages', 'languages', 'daily', 'visitors'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loadingData ? (
          <div className="text-center py-12 text-gray-500">Loading analytics...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && overview && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">Total Views</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {overview.totalViews.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">Unique Visitors</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {overview.uniqueVisitors.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Unique Pages</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {overview.uniquePages.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 dark:text-orange-400">Top Language</div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {overview.topLanguage.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Language Breakdown
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(overview.languageBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([lang, count]) => {
                        const percentage = (count / overview.totalViews) * 100
                        return (
                          <div key={lang} className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {lang.toUpperCase()}
                            </div>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                              <div
                                className="bg-primary-600 h-6 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-xs text-white font-medium">
                                  {count.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Page</th>
                      <th className="px-4 py-2 text-right">Views</th>
                      <th className="px-4 py-2 text-right">Unique Visitors</th>
                      <th className="px-4 py-2 text-left">Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews.map((page, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 font-mono text-sm">{page.page_path}</td>
                        <td className="px-4 py-2 text-right">{page.view_count.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{page.unique_visitors.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(page.last_viewed).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Languages Tab */}
            {activeTab === 'languages' && (
              <div className="space-y-4">
                {languageStats.map((stat, idx) => (
                  <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.language.toUpperCase()}
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {stat.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Usage: {stat.usage_count.toLocaleString()}</span>
                      <span>Sessions: {stat.unique_sessions.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily Tab */}
            {activeTab === 'daily' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-right">Total Views</th>
                      <th className="px-4 py-2 text-right">Unique Visitors</th>
                      <th className="px-4 py-2 text-right">Pages Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((stat, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2">{new Date(stat.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-right">{stat.total_views.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{stat.unique_visitors.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{stat.pages_viewed.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Visitors Tab */}
            {activeTab === 'visitors' && (
              <div className="overflow-x-auto">
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {visitors.length} unique visitors
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">Device</th>
                      <th className="px-4 py-2 text-left">OS</th>
                      <th className="px-4 py-2 text-left">Browser</th>
                      <th className="px-4 py-2 text-left">Language</th>
                      <th className="px-4 py-2 text-right">Pages</th>
                      <th className="px-4 py-2 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(visitor.last_visit).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(visitor.last_visit).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{visitor.country}</div>
                          {visitor.city && visitor.city !== 'Unknown' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{visitor.city}</div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{visitor.device_type}</div>
                          {visitor.device_brand && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{visitor.device_brand}</div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{visitor.os_name}</div>
                          {visitor.os_version && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{visitor.os_version}</div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{visitor.browser_name}</div>
                          {visitor.browser_version && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{visitor.browser_version}</div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                            {visitor.language.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="font-medium">{visitor.pages.length}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {visitor.pages.slice(0, 2).join(', ')}
                            {visitor.pages.length > 2 && '...'}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right font-medium">{visitor.page_views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visitors.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No visitors found for the selected period
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

