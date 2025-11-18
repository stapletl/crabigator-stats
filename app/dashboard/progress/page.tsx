"use client";

import { useAppStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProgressPage() {
  const router = useRouter();
  const { user, apiKey } = useAppStore();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!apiKey || !user) {
      router.push("/");
    }
  }, [apiKey, user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Welcome, {user.data.username}! 🦀
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          You are currently level {user.data.level}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Dashboard coming soon...
        </p>
      </div>
    </div>
  );
}
