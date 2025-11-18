"use client";

import { useAppStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProgressData } from "@/hooks/use-progress-data";
import { LevelProgressionChart } from "@/components/charts/level-progression-chart";
import { SRSDistributionChart } from "@/components/charts/srs-distribution-chart";
import { AccuracyChart } from "@/components/charts/accuracy-chart";
import { StatsCards } from "@/components/charts/stats-cards";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const router = useRouter();
  const { user, apiKey } = useAppStore();
  const {
    levelProgressions,
    assignments,
    reviewStatistics,
    summary,
    isLoading,
  } = useProgressData();

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
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Welcome, {user.data.username}! 🦀
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          You are currently level {user.data.level}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {levelProgressions &&
            assignments &&
            reviewStatistics &&
            summary && (
              <>
                <StatsCards
                  levelProgressions={levelProgressions}
                  assignments={assignments}
                  summary={summary}
                  currentLevel={user.data.level}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LevelProgressionChart progressions={levelProgressions} />
                  <SRSDistributionChart assignments={assignments} />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <AccuracyChart reviewStatistics={reviewStatistics} />
                </div>
              </>
            )}

          {(!levelProgressions ||
            !assignments ||
            !reviewStatistics ||
            !summary) && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                No data available yet. Please wait while we fetch your progress
                data...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
