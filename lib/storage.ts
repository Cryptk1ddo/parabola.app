/**
 * Data persistence utilities for Parabola productivity OS
 * Handles localStorage and IndexedDB for storing user data
 */

import { useCallback, useEffect, useState } from "react"

// Types for different data stores
export interface UserPreferences {
  theme: "light" | "dark" | "system"
  soundEnabled: boolean
  notificationsEnabled: boolean
  focusReminders: boolean
  pomodoroPreset: string
  binauralEnabled: boolean
  binauralType: string
}

export interface FocusSession {
  id: string
  duration: number
  completed: boolean
  startTime: Date
  endTime?: Date
  breaks: number
  type: "focus" | "break"
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: Date
  updatedAt: Date
  pinned: boolean
  archived: boolean
}

export interface Habit {
  id: string
  name: string
  description: string
  category: string
  streak: number
  completedDates: string[]
  target: number
  frequency: "daily" | "weekly"
  color: string
  icon: string
}

// Storage keys
const STORAGE_KEYS = {
  PREFERENCES: "parabola_preferences",
  FOCUS_SESSIONS: "parabola_focus_sessions",
  NOTES: "parabola_notes",
  HABITS: "parabola_habits",
  ANALYTICS: "parabola_analytics",
} as const

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  soundEnabled: true,
  notificationsEnabled: true,
  focusReminders: true,
  pomodoroPreset: "25/5",
  binauralEnabled: false,
  binauralType: "focus",
}

// Generic localStorage hook
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  const updateValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      setValue((prevValue) => {
        const valueToStore = typeof newValue === "function" ? (newValue as Function)(prevValue) : newValue
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
          console.warn(`Error saving ${key} to localStorage:`, error)
        }
        return valueToStore
      })
    },
    [key]
  )

  return [value, updateValue, isLoading] as const
}

// Specialized hooks for different data types
export function usePreferences() {
  return useLocalStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES)
}

export function useFocusSessions() {
  return useLocalStorage<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, [])
}

export function useNotes() {
  return useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, [])
}

export function useHabits() {
  return useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, [])
}

// Analytics data hook
export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useLocalStorage(STORAGE_KEYS.ANALYTICS, {
    totalFocusTime: 0,
    completedSessions: 0,
    averageSessionDuration: 0,
    streaks: {},
    dailyStats: {},
    weeklyStats: {},
    monthlyStats: {},
  })

  const updateAnalytics = useCallback(
    (session: FocusSession) => {
      if (session.completed) {
        const today = new Date().toISOString().split('T')[0]
        
        setAnalyticsData((prev: any) => ({
          ...prev,
          totalFocusTime: prev.totalFocusTime + session.duration,
          completedSessions: prev.completedSessions + 1,
          dailyStats: {
            ...prev.dailyStats,
            [today]: {
              focusTime: (prev.dailyStats[today]?.focusTime || 0) + session.duration,
              sessions: (prev.dailyStats[today]?.sessions || 0) + 1,
            },
          },
        }))
      }
    },
    [setAnalyticsData]
  )

  return [analyticsData, updateAnalytics] as const
}

// Export/Import functionality
export const exportData = () => {
  const data = {
    preferences: localStorage.getItem(STORAGE_KEYS.PREFERENCES),
    focusSessions: localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS),
    notes: localStorage.getItem(STORAGE_KEYS.NOTES),
    habits: localStorage.getItem(STORAGE_KEYS.HABITS),
    analytics: localStorage.getItem(STORAGE_KEYS.ANALYTICS),
    exportedAt: new Date().toISOString(),
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `parabola-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        // Validate data structure
        if (!data.preferences || !data.exportedAt) {
          throw new Error("Invalid data format")
        }
        
        // Import data
        if (data.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, data.preferences)
        if (data.focusSessions) localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, data.focusSessions)
        if (data.notes) localStorage.setItem(STORAGE_KEYS.NOTES, data.notes)
        if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, data.habits)
        if (data.analytics) localStorage.setItem(STORAGE_KEYS.ANALYTICS, data.analytics)
        
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Clear all data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  window.location.reload()
}