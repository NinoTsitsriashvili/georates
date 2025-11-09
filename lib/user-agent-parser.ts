/**
 * Simple user agent parser
 * Extracts device, OS, and browser information
 */

export interface ParsedUserAgent {
  deviceType: string
  deviceBrand?: string
  osName: string
  osVersion: string
  browserName: string
  browserVersion: string
}

export function parseUserAgent(userAgent?: string): ParsedUserAgent {
  if (!userAgent) {
    return {
      deviceType: 'Unknown',
      osName: 'Unknown',
      osVersion: '',
      browserName: 'Unknown',
      browserVersion: '',
    }
  }

  const ua = userAgent.toLowerCase()
  
  // Detect device type
  let deviceType = 'Desktop'
  let deviceBrand: string | undefined
  
  if (ua.includes('mobile') || ua.includes('android')) {
    deviceType = 'Mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'Tablet'
  }
  
  // Detect device brand
  if (ua.includes('iphone')) deviceBrand = 'Apple'
  else if (ua.includes('ipad')) deviceBrand = 'Apple'
  else if (ua.includes('android')) deviceBrand = 'Android'
  else if (ua.includes('samsung')) deviceBrand = 'Samsung'
  else if (ua.includes('huawei')) deviceBrand = 'Huawei'
  else if (ua.includes('xiaomi')) deviceBrand = 'Xiaomi'
  
  // Detect OS
  let osName = 'Unknown'
  let osVersion = ''
  
  if (ua.includes('windows')) {
    osName = 'Windows'
    const match = ua.match(/windows nt (\d+\.\d+)/)
    if (match) {
      const version = match[1]
      if (version === '10.0') osVersion = '10/11'
      else if (version === '6.3') osVersion = '8.1'
      else if (version === '6.2') osVersion = '8'
      else if (version === '6.1') osVersion = '7'
      else osVersion = version
    }
  } else if (ua.includes('mac os') || ua.includes('macintosh')) {
    osName = 'macOS'
    const match = ua.match(/mac os x (\d+[._]\d+)/)
    if (match) {
      osVersion = match[1].replace('_', '.')
    }
  } else if (ua.includes('iphone os') || ua.includes('ios')) {
    osName = 'iOS'
    const match = ua.match(/os (\d+[._]\d+)/)
    if (match) {
      osVersion = match[1].replace('_', '.')
    }
  } else if (ua.includes('android')) {
    osName = 'Android'
    const match = ua.match(/android (\d+\.\d+)/)
    if (match) {
      osVersion = match[1]
    }
  } else if (ua.includes('linux')) {
    osName = 'Linux'
  } else if (ua.includes('ubuntu')) {
    osName = 'Ubuntu'
  }
  
  // Detect browser
  let browserName = 'Unknown'
  let browserVersion = ''
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browserName = 'Chrome'
    const match = ua.match(/chrome\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (ua.includes('firefox')) {
    browserName = 'Firefox'
    const match = ua.match(/firefox\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browserName = 'Safari'
    const match = ua.match(/version\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (ua.includes('edg')) {
    browserName = 'Edge'
    const match = ua.match(/edg\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browserName = 'Opera'
    const match = ua.match(/(?:opera|opr)\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  }
  
  return {
    deviceType,
    deviceBrand,
    osName,
    osVersion,
    browserName,
    browserVersion,
  }
}

