import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WKResource, User } from "@/lib/wanikani/types";

interface AppState {
  // Auth
  apiKey: string | null;
  storagePreference: "session" | "local";
  user: WKResource<User> | null;

  // Loading states
  isLoading: boolean;
  isValidating: boolean;

  // Actions
  setApiKey: (key: string, storage: "session" | "local") => void;
  setUser: (user: WKResource<User> | null) => void;
  setIsValidating: (isValidating: boolean) => void;
  clearAuth: () => void;
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
        }),
    }),
    {
      name: "crabigator-stats-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        apiKey: state.apiKey,
        storagePreference: state.storagePreference,
        user: state.user,
      }),
    }
  )
);
