// Session persistence using localStorage
// IndexedDB is not type-safe in this environment; localStorage is used instead

export interface ActiveSession {
  sessionId: string;
  userId: string;
  dayNumber: number;
  currentExercise: number;
  mode: 'auto' | 'manual';
  startTime: number;
  pauseTime?: number;
  exerciseTimings: Record<number, { start: number; end?: number }>;
}

const SESSION_KEY = 'nutmeg-active-session';

export function saveSession(session: ActiveSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    console.warn('Failed to save session');
  }
}

export function getSession(): ActiveSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as ActiveSession;
    // Expire after 24 hours
    if (Date.now() - session.startTime > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
