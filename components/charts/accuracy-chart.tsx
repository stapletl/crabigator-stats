"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { WKResource, ReviewStatistic } from "@/lib/wanikani/types";

interface AccuracyChartProps {
  reviewStatistics: WKResource<ReviewStatistic>[];
}

export function AccuracyChart({ reviewStatistics }: AccuracyChartProps) {
  // Group statistics by subject type
  const statsByType: Record<
    string,
    {
      meaningCorrect: number;
      meaningIncorrect: number;
      readingCorrect: number;
      readingIncorrect: number;
    }
  > = {
    radical: {
      meaningCorrect: 0,
      meaningIncorrect: 0,
      readingCorrect: 0,
      readingIncorrect: 0,
    },
    kanji: {
      meaningCorrect: 0,
      meaningIncorrect: 0,
      readingCorrect: 0,
      readingIncorrect: 0,
    },
    vocabulary: {
      meaningCorrect: 0,
      meaningIncorrect: 0,
      readingCorrect: 0,
      readingIncorrect: 0,
    },
  };

  reviewStatistics.forEach((stat) => {
    const type = stat.data.subject_type.toLowerCase();
    if (statsByType[type]) {
      statsByType[type].meaningCorrect += stat.data.meaning_correct;
      statsByType[type].meaningIncorrect += stat.data.meaning_incorrect;
      statsByType[type].readingCorrect += stat.data.reading_correct;
      statsByType[type].readingIncorrect += stat.data.reading_incorrect;
    }
  });

  // Calculate accuracy percentages
  const chartData = Object.entries(statsByType).map(([type, stats]) => {
    const meaningTotal = stats.meaningCorrect + stats.meaningIncorrect;
    const readingTotal = stats.readingCorrect + stats.readingIncorrect;

    const meaningAccuracy =
      meaningTotal > 0 ? (stats.meaningCorrect / meaningTotal) * 100 : 0;

    const readingAccuracy =
      readingTotal > 0 ? (stats.readingCorrect / readingTotal) * 100 : 0;

    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      meaning: Math.round(meaningAccuracy),
      reading: Math.round(readingAccuracy),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accuracy by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar dataKey="meaning" fill="#a855f7" name="Meaning" />
            <Bar dataKey="reading" fill="#3b82f6" name="Reading" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
