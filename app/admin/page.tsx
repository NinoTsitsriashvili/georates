'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Header from '@/components/Header'

const AUTH_STORAGE_KEY = 'georates_admin_auth'

export default function AdminPage() {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs')
      const data = await response.json()
      if (data.success) {
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (storedAuth) {
        try {
          // Verify the stored auth is still valid
          const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: storedAuth }),
          })
          const data = await response.json()
          
          if (data.success) {
            setAuthenticated(true)
            fetchLogs()
          } else {
            // Invalid stored password, clear it
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
      // Store password in localStorage for persistent auth
      localStorage.setItem(AUTH_STORAGE_KEY, password)
      setAuthenticated(true)
      fetchLogs()
    } else {
      setMessage('Invalid password')
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    
    setLoading(false)
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs')
      const data = await response.json()
      if (data.success) {
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setMessage('')

    try {
      const storedPassword = localStorage.getItem(AUTH_STORAGE_KEY) || password
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedPassword}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(`Data refreshed successfully! Updated: ${data.exchangeRates} rates, ${data.petrolPrices} prices, ${data.electricityTariffs} tariffs`)
        fetchLogs()
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setRefreshing(false)
    }
  }

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
              {t('admin.title')}
            </h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.password')}
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
                {loading ? t('common.loading') : t('admin.login')}
              </button>
            </form>
            {message && (
              <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('admin.title')}
          </h1>

          <div className="mb-6 flex gap-4 items-center">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {refreshing ? t('common.loading') : t('admin.refreshData')}
            </button>
            <a
              href="/admin/analytics"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              View Analytics
            </a>
            <button
              onClick={() => {
                localStorage.removeItem(AUTH_STORAGE_KEY)
                setAuthenticated(false)
              }}
              className="ml-auto text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Logout
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.logs')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Records</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2">{log.data_type}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.status === 'success'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{log.records_updated}</td>
                      <td className="px-4 py-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-red-600 dark:text-red-400">
                        {log.error_message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

