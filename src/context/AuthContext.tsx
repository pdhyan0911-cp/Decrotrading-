import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
}

const GUEST_USER: User = {
  id: 'guest-user',
  name: 'Guest Learner',
  email: 'guest@decrotrade.local',
  role: 'user',
  createdAt: new Date().toISOString(),
  tradingStyle: 'Beginner Learner',
  virtualBalance: 100000,
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  completedLessons: [],
  completedCourses: [],
  quizAttempts: [],
  earnedBadges: ['badge-first-step'],
  dailyGoalXP: 100,
  todayXP: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('decrotrade_token'));
  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem('decrotrade_guest') === 'true');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsGuest(false);
        fetchNotifications(authToken);
      } else {
        // Token invalid
        localStorage.removeItem('decrotrade_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async (authToken: string) => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else if (isGuest) {
      const savedGuest = localStorage.getItem('decrotrade_guest_user');
      setUser(savedGuest ? JSON.parse(savedGuest) : GUEST_USER);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [token, isGuest]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('decrotrade_token', data.token);
      localStorage.removeItem('decrotrade_guest');
      setToken(data.token);
      setUser(data.user);
      setIsGuest(false);
      fetchNotifications(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      localStorage.setItem('decrotrade_token', data.token);
      localStorage.removeItem('decrotrade_guest');
      setToken(data.token);
      setUser(data.user);
      setIsGuest(false);
      fetchNotifications(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // ignore network error on logout
      }
    }
    localStorage.removeItem('decrotrade_token');
    localStorage.removeItem('decrotrade_guest');
    localStorage.removeItem('decrotrade_guest_user');
    setToken(null);
    setUser(null);
    setIsGuest(false);
    setNotifications([]);
  };

  const continueAsGuest = () => {
    localStorage.setItem('decrotrade_guest', 'true');
    localStorage.setItem('decrotrade_guest_user', JSON.stringify(GUEST_USER));
    setIsGuest(true);
    setUser(GUEST_USER);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (isGuest && user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('decrotrade_guest_user', JSON.stringify(updated));
      return;
    }

    if (!token) return;
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (token) {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isGuest,
        login,
        signup,
        logout,
        continueAsGuest,
        updateProfile,
        refreshUser,
        notifications,
        markNotificationRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
