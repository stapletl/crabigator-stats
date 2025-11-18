"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  WKResource,
  LevelProgression,
  Assignment,
  Summary,
} from "@/lib/wanikani/types";

interface StatsCardsProps {
  levelProgressions: WKResource<LevelProgression>[];
  assignments: WKResource<Assignment>[];
  summary: WKResource<Summary> | null;
  currentLevel: number;
}

function formatDuration(milliseconds: number): string {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
}

export function StatsCards({
  levelProgressions,
  assignments,
  summary,
  currentLevel,
}: StatsCardsProps) {
  // Calculate current level time
  const currentLevelProgression = levelProgressions.find(
    (p) => p.data.level === currentLevel
  );
  const currentLevelTime = currentLevelProgression?.data.started_at
    ? Date.now() - new Date(currentLevelProgression.data.started_at).getTime()
    : 0;

  // Calculate average level-up time
  const passedProgressions = levelProgressions.filter(
    (p) => p.data.started_at && p.data.passed_at
  );
  const averageLevelTime =
    passedProgressions.length > 0
      ? passedProgressions.reduce((sum, p) => {
          const start = new Date(p.data.started_at!).getTime();
          const end = new Date(p.data.passed_at!).getTime();
          return sum + (end - start);
        }, 0) / passedProgressions.length
      : 0;

  // Calculate predicted level-up date
  const predictedLevelUp = averageLevelTime
    ? new Date(Date.now() + (averageLevelTime - currentLevelTime))
    : null;

  // Count items by SRS stage
  const apprenticeCount = assignments.filter((a) =>
    [1, 2, 3, 4].includes(a.data.srs_stage)
  ).length;
  const guruCount = assignments.filter((a) =>
    [5, 6].includes(a.data.srs_stage)
  ).length;
  const masterCount = assignments.filter(
    (a) => a.data.srs_stage === 7
  ).length;
  const enlightenedCount = assignments.filter(
    (a) => a.data.srs_stage === 8
  ).length;
  const burnedCount = assignments.filter(
    (a) => a.data.srs_stage === 9
  ).length;

  // Count available reviews and lessons
  const availableReviews = summary?.data.reviews.reduce(
    (sum, review) => sum + review.subject_ids.length,
    0
  ) || 0;

  const availableLessons = summary?.data.lessons.reduce(
    (sum, lesson) => sum + lesson.subject_ids.length,
    0
  ) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Level Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(currentLevelTime)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Level Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(averageLevelTime)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Predicted Level Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {predictedLevelUp
              ? predictedLevelUp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableReviews}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableLessons}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Apprentice Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{apprenticeCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Guru Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{guruCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Burned Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{burnedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
