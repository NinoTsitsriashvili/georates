/**
 * Analytics tracking system
 * Tracks page views, language preferences, and user behavior
 */

export interface AnalyticsEvent {
  event_type: 'page_view' | 'language_change' | 'theme_change' | 'custom'
  page_path: string
  page_title?: string
  language?: string
  referrer?: string
  user_agent?: string
  screen_width?: number
  screen_height?: number
  session_id?: string
  user_id?: string
  metadata?: Record<string, any>
}

/**
 * Generate or retrieve session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  const storageKey = 'georates_session_id'
  let sessionId = sessionStorage.getItem(storageKey)
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem(storageKey, sessionId)
  }
  
  return sessionId
}

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // Get session ID
    const sessionId = getSessionId()
    
    // Get screen dimensions
    const screenWidth = typeof window !== 'undefined' ? window.screen.width : undefined
    const screenHeight = typeof window !== 'undefined' ? window.screen.height : undefined
    
    // Get referrer
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined
    
    // Get user agent
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    
    // Prepare event data
    const eventData: AnalyticsEvent = {
      ...event,
      session_id: sessionId,
      screen_width: screenWidth,
      screen_height: screenHeight,
      referrer: referrer,
      user_agent: userAgent,
    }
    
    // Send to API
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Analytics tracking failed:', response.status, errorData)
    }
  } catch (error) {
    // Log error for debugging
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Track page view
 */
export async function trackPageView(
  path: string,
  title?: string,
  language?: string
): Promise<void> {
  await trackEvent({
    event_type: 'page_view',
    page_path: path,
    page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
    language: language,
  })
}

/**
 * Track language change
 */
export async function trackLanguageChange(
  fromLanguage: string,
  toLanguage: string,
  pagePath: string
): Promise<void> {
  await trackEvent({
    event_type: 'language_change',
    page_path: pagePath,
    language: toLanguage,
    metadata: {
      from_language: fromLanguage,
      to_language: toLanguage,
    },
  })
}

/**
 * Track theme change
 */
export async function trackThemeChange(
  theme: 'light' | 'dark',
  pagePath: string
): Promise<void> {
  await trackEvent({
    event_type: 'theme_change',
    page_path: pagePath,
    metadata: {
      theme: theme,
    },
  })
}

