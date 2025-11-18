import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  WKResource,
  User,
  LevelProgression,
  Assignment,
  ReviewStatistic,
  Summary,
} from "@/lib/wanikani/types";

interface AppState {
  // Auth
  apiKey: string | null;
  storagePreference: "session" | "local";
  user: WKResource<User> | null;

  // Cached WaniKani data
  levelProgressions: WKResource<LevelProgression>[] | null;
  assignments: WKResource<Assignment>[] | null;
  reviewStatistics: WKResource<ReviewStatistic>[] | null;
  summary: WKResource<Summary> | null;

  // Loading states
  isLoading: boolean;
  isValidating: boolean;
  isLoadingProgressions: boolean;
  isLoadingAssignments: boolean;
  isLoadingStatistics: boolean;
  isLoadingSummary: boolean;

  // Last sync timestamps
  lastProgressionsSync: number | null;
  lastAssignmentsSync: number | null;
  lastStatisticsSync: number | null;
  lastSummarySync: number | null;

  // Actions
  setApiKey: (key: string, storage: "session" | "local") => void;
  setUser: (user: WKResource<User> | null) => void;
  setIsValidating: (isValidating: boolean) => void;
  clearAuth: () => void;
  setLevelProgressions: (data: WKResource<LevelProgression>[]) => void;
  setAssignments: (data: WKResource<Assignment>[]) => void;
  setReviewStatistics: (data: WKResource<ReviewStatistic>[]) => void;
  setSummary: (data: WKResource<Summary>) => void;
  setIsLoadingProgressions: (isLoading: boolean) => void;
  setIsLoadingAssignments: (isLoading: boolean) => void;
  setIsLoadingStatistics: (isLoading: boolean) => void;
  setIsLoadingSummary: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      apiKey: null,
      storagePreference: "session",
      user: null,
      isLoading: false,
      isValidating: false,

      // Cached data
      levelProgressions: null,
      assignments: null,
      reviewStatistics: null,
      summary: null,

      // Loading states
      isLoadingProgressions: false,
      isLoadingAssignments: false,
      isLoadingStatistics: false,
      isLoadingSummary: false,

      // Last sync timestamps
      lastProgressionsSync: null,
      lastAssignmentsSync: null,
      lastStatisticsSync: null,
      lastSummarySync: null,

      // Actions
      setApiKey: (key, storage) =>
        set({ apiKey: key, storagePreference: storage }),

      setUser: (user) => set({ user }),

      setIsValidating: (isValidating) => set({ isValidating }),

      clearAuth: () =>
        set({
          apiKey: null,
          user: null,
          isValidating: false,
          levelProgressions: null,
          assignments: null,
          reviewStatistics: null,
          summary: null,
          lastProgressionsSync: null,
          lastAssignmentsSync: null,
          lastStatisticsSync: null,
          lastSummarySync: null,
        }),

      setLevelProgressions: (data) =>
        set({
          levelProgressions: data,
          lastProgressionsSync: Date.now(),
        }),

      setAssignments: (data) =>
        set({
          assignments: data,
          lastAssignmentsSync: Date.now(),
        }),

      setReviewStatistics: (data) =>
        set({
          reviewStatistics: data,
          lastStatisticsSync: Date.now(),
        }),

      setSummary: (data) =>
        set({
          summary: data,
          lastSummarySync: Date.now(),
        }),

      setIsLoadingProgressions: (isLoading) =>
        set({ isLoadingProgressions: isLoading }),

      setIsLoadingAssignments: (isLoading) =>
        set({ isLoadingAssignments: isLoading }),

      setIsLoadingStatistics: (isLoading) =>
        set({ isLoadingStatistics: isLoading }),

      setIsLoadingSummary: (isLoading) =>
        set({ isLoadingSummary: isLoading }),
    }),
    {
      name: "crabigator-stats-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        apiKey: state.apiKey,
        storagePreference: state.storagePreference,
        user: state.user,
        levelProgressions: state.levelProgressions,
        assignments: state.assignments,
        reviewStatistics: state.reviewStatistics,
        summary: state.summary,
        lastProgressionsSync: state.lastProgressionsSync,
        lastAssignmentsSync: state.lastAssignmentsSync,
        lastStatisticsSync: state.lastStatisticsSync,
        lastSummarySync: state.lastSummarySync,
      }),
    }
  )
);
