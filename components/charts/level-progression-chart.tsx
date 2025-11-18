"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WKResource, LevelProgression } from "@/lib/wanikani/types";

interface LevelProgressionChartProps {
  progressions: WKResource<LevelProgression>[];
}

export function LevelProgressionChart({
  progressions,
}: LevelProgressionChartProps) {
  // Filter and sort progressions that have been passed
  const passedProgressions = progressions
    .filter((p) => p.data.passed_at)
    .sort(
      (a, b) =>
        new Date(a.data.passed_at!).getTime() -
        new Date(b.data.passed_at!).getTime()
    );

  // Transform data for chart
  const chartData = passedProgressions.map((p) => ({
    date: new Date(p.data.passed_at!).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    level: p.data.level,
    fullDate: new Date(p.data.passed_at!),
  }));

  // Sample data points if there are too many
  const sampledData =
    chartData.length > 20
      ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 20) === 0)
      : chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              domain={[0, 60]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
