export function sanitizeHtml(dirty: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return dirty.replace(/[&<>"'/]/g, (char) => map[char]);
}

export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:';
}

export function checkSecurityWarnings(): void {
  if (import.meta.env.PROD && !isSecureConnection()) {
    // eslint-disable-next-line no-console
    console.warn(
      '⚠️ Security Warning: Application is running on an insecure connection (HTTP). ' +
      'Please use HTTPS in production to protect user data.'
    );
  }
}

export function generateNonce(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export function detectIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function preventClickjacking(): void {
  if (detectIframe() && window.top) {
    window.top.location.href = window.self.location.href;
  }
}

export function clearSensitiveData(): void {
  sessionStorage.clear();
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
}

const FAILED_ATTEMPTS_KEY = 'its_failed_attempts';
const MAX_LOCAL_ATTEMPTS = 10;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export function recordFailedAttempt(): boolean {
  const data = JSON.parse(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '{"count":0,"timestamp":0}');
  
  if (Date.now() - data.timestamp > LOCKOUT_DURATION) {
    data.count = 0;
  }
  
  data.count++;
  data.timestamp = Date.now();
  sessionStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(data));
  
  return data.count >= MAX_LOCAL_ATTEMPTS;
}

export function isLockedOut(): boolean {
  const data = JSON.parse(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '{"count":0,"timestamp":0}');
  
  if (data.count >= MAX_LOCAL_ATTEMPTS) {
    const timeRemaining = LOCKOUT_DURATION - (Date.now() - data.timestamp);
    return timeRemaining > 0;
  }
  
  return false;
}

export function clearFailedAttempts(): void {
  sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
}

export function logSecurityEvent(event: string, details?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[Security Event] ${event}`, details);
  }
}

