import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  xp: number;
  streak: number;
  last_active_date?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  continueAsGuest: () => void;
  awardXP: (amount: number, reason?: string) => Promise<void>;
  completeLesson: (lessonId: string, unitId: string) => Promise<void>;
  submitQuiz: (quizId: string, score: number, maxScore: number) => Promise<void>;
  submitChallenge: (challengeId: string, difficulty: string, score: number, maxScore: number, timeSeconds: number, mistakes?: any[]) => Promise<void>;
  saveLabState: (topic: string, state: any) => Promise<void>;
  loadLabState: (topic: string) => Promise<any>;
  refreshProgress: () => Promise<void>;
  progressData: {
    completedLessons: string[];
    quizAttempts: any[];
    challengeAttempts: any[];
    achievements: string[];
    quizAverage: number;
    challengesCompleted: number;
    bestChallengeScore: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'ds_playground_auth_token';
const GUEST_STORAGE_KEY = 'ds_playground_guest_progress';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isGuest, setIsGuest] = useState<boolean>(!localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState<boolean>(true);

  const [progressData, setProgressData] = useState<{
    completedLessons: string[];
    quizAttempts: any[];
    challengeAttempts: any[];
    achievements: string[];
    quizAverage: number;
    challengesCompleted: number;
    bestChallengeScore: number;
  }>({
    completedLessons: [],
    quizAttempts: [],
    challengeAttempts: [],
    achievements: ['welcome_explorer'],
    quizAverage: 0,
    challengesCompleted: 0,
    bestChallengeScore: 0
  });

  // Verify token on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (savedToken) {
        try {
          const resp = await fetch('http://127.0.0.1:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (resp.ok) {
            const userData = await resp.json();
            setUser(userData);
            setToken(savedToken);
            setIsGuest(false);
            await fetchUserProgress(savedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken(null);
            setIsGuest(true);
          }
        } catch (err) {
          console.warn('Backend offline or unreachable, falling back to guest mode', err);
          setIsGuest(true);
        }
      } else {
        // Load guest state if any
        loadGuestProgress();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loadGuestProgress = () => {
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgressData(parsed);
      }
    } catch {
      // ignore
    }
  };

  const saveGuestProgress = (data: typeof progressData) => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  const fetchUserProgress = async (authToken: string) => {
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/user/progress', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        setProgressData({
          completedLessons: data.completed_lessons || [],
          quizAttempts: data.quiz_attempts || [],
          challengeAttempts: data.challenge_attempts || [],
          achievements: data.achievements || [],
          quizAverage: data.quiz_average || 0,
          challengesCompleted: data.challenges_completed || 0,
          bestChallengeScore: data.best_challenge_score || 0
        });
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.detail || 'Sign in failed.' };
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      setIsGuest(false);
      await fetchUserProgress(data.access_token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to auth service.' };
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const resp = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.detail || 'Registration failed.' };
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      setIsGuest(false);
      await fetchUserProgress(data.access_token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to auth service.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setIsGuest(true);
    loadGuestProgress();
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  const awardXP = async (amount: number) => {
    if (token && user) {
      setUser(prev => prev ? { ...prev, xp: prev.xp + amount } : null);
    } else {
      // Guest mode
      // progress state
    }
  };

  const completeLesson = async (lessonId: string, unitId: string) => {
    if (token) {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/user/lesson-complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ lesson_id: lessonId, unit_id: unitId })
        });
        if (resp.ok) {
          await fetchUserProgress(token);
        }
      } catch (err) {
        console.error('Failed to sync lesson completion:', err);
      }
    } else {
      // Guest mode
      if (!progressData.completedLessons.includes(lessonId)) {
        const updated = {
          ...progressData,
          completedLessons: [...progressData.completedLessons, lessonId]
        };
        setProgressData(updated);
        saveGuestProgress(updated);
      }
    }
  };

  const submitQuiz = async (quizId: string, score: number, maxScore: number) => {
    if (token) {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/user/quiz-attempt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quiz_id: quizId, score, max_score: maxScore })
        });
        if (resp.ok) {
          await fetchUserProgress(token);
        }
      } catch (err) {
        console.error('Failed to submit quiz attempt:', err);
      }
    } else {
      const attempt = { quiz_id: quizId, score, max_score: maxScore, created_at: new Date().toISOString() };
      const updated = {
        ...progressData,
        quizAttempts: [attempt, ...progressData.quizAttempts]
      };
      setProgressData(updated);
      saveGuestProgress(updated);
    }
  };

  const submitChallenge = async (
    challengeId: string,
    difficulty: string,
    score: number,
    maxScore: number,
    timeSeconds: number,
    mistakes: any[] = []
  ) => {
    if (token) {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/user/challenge-attempt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            challenge_id: challengeId,
            difficulty,
            score,
            max_score: maxScore,
            time_seconds: timeSeconds,
            mistakes
          })
        });
        if (resp.ok) {
          await fetchUserProgress(token);
        }
      } catch (err) {
        console.error('Failed to submit challenge attempt:', err);
      }
    } else {
      const attempt = {
        challenge_id: challengeId,
        difficulty,
        score,
        max_score: maxScore,
        time_seconds: timeSeconds,
        mistakes,
        created_at: new Date().toISOString()
      };
      const best = Math.max(progressData.bestChallengeScore, score);
      const updated = {
        ...progressData,
        challengeAttempts: [attempt, ...progressData.challengeAttempts],
        challengesCompleted: progressData.challengesCompleted + 1,
        bestChallengeScore: best
      };
      setProgressData(updated);
      saveGuestProgress(updated);
    }
  };

  const saveLabState = async (topic: string, state: any) => {
    if (token) {
      try {
        await fetch('http://127.0.0.1:8000/api/user/lab-state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ topic, state_json: state })
        });
      } catch (err) {
        console.error('Failed to save lab state:', err);
      }
    } else {
      try {
        localStorage.setItem(`ds_lab_state_${topic}`, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  };

  const loadLabState = async (topic: string) => {
    if (token) {
      try {
        const resp = await fetch(`http://127.0.0.1:8000/api/user/lab-state/${topic}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
          return await resp.json();
        }
      } catch (err) {
        console.error('Failed to load lab state:', err);
      }
    }
    try {
      const saved = localStorage.getItem(`ds_lab_state_${topic}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const refreshProgress = async () => {
    if (token) {
      await fetchUserProgress(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !isGuest,
        isGuest,
        loading,
        login,
        register,
        logout,
        continueAsGuest,
        awardXP,
        completeLesson,
        submitQuiz,
        submitChallenge,
        saveLabState,
        loadLabState,
        refreshProgress,
        progressData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
