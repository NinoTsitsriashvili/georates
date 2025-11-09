'use client'

import { useState } from 'react'
import { useLanguage } from './LanguageProvider'
import { useTheme } from './ThemeProvider'
import Link from 'next/link'

export default function Header() {
  const { locale, t, setLocale } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[var(--color-card-bg)] shadow-card sticky top-0 z-50 border-b border-[var(--color-border)]">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors duration-base"
          >
            {t('common.title')}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
            >
              {t('nav.exchangeRates')}
            </Link>
            <Link 
              href="/#petrol" 
              className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
            >
              {t('nav.petrolPrices')}
            </Link>
            <Link 
              href="/#electricity" 
              className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
            >
              {t('nav.electricity')}
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden sm:flex items-center space-x-1 bg-[var(--color-neutral-light)] rounded-lg p-1">
              <button
                onClick={() => setLocale('ka')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-3 py-1.5 rounded text-[15px] font-medium transition-all duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  locale === 'ka'
                    ? 'bg-primary text-white shadow-card'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)]'
                }`}
                aria-label="Georgian"
              >
                🇬🇪
              </button>
              <button
                onClick={() => setLocale('en')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-3 py-1.5 rounded text-[15px] font-medium transition-all duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  locale === 'en'
                    ? 'bg-primary text-white shadow-card'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)]'
                }`}
                aria-label="English"
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLocale('ru')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-3 py-1.5 rounded text-[15px] font-medium transition-all duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  locale === 'ru'
                    ? 'bg-primary text-white shadow-card'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)]'
                }`}
                aria-label="Russian"
              >
                🇷🇺
              </button>
            </div>

            {/* Language Switcher - Mobile */}
            <div className="sm:hidden flex items-center space-x-1">
              <button
                onClick={() => setLocale('ka')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-2 py-1.5 rounded text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  locale === 'ka' 
                    ? 'bg-primary text-white' 
                    : 'bg-[var(--color-neutral-light)] text-[var(--color-text-secondary)]'
                }`}
                aria-label="Georgian"
              >
                🇬🇪
              </button>
              <button
                onClick={() => setLocale('en')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-2 py-1.5 rounded text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  locale === 'en' 
                    ? 'bg-primary text-white' 
                    : 'bg-[var(--color-neutral-light)] text-[var(--color-text-secondary)]'
                }`}
                aria-label="English"
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLocale('ru')}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-2 py-1.5 rounded text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  locale === 'ru' 
                    ? 'bg-primary text-white' 
                    : 'bg-[var(--color-neutral-light)] text-[var(--color-text-secondary)]'
                }`}
                aria-label="Russian"
              >
                🇷🇺
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              onMouseDown={(e) => e.preventDefault()}
              className="p-2 rounded-lg bg-[var(--color-neutral-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)] transition-all duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseDown={(e) => e.preventDefault()}
              className="md:hidden p-2 rounded-lg bg-[var(--color-neutral-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)] transition-all duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-[var(--color-border)] pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
              >
                {t('nav.exchangeRates')}
              </Link>
              <Link 
                href="/#petrol" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
              >
                {t('nav.petrolPrices')}
              </Link>
              <Link 
                href="/#electricity" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-[var(--color-text-secondary)] hover:text-primary transition-colors duration-base"
              >
                {t('nav.electricity')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
