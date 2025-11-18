"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { WKResource, Assignment } from "@/lib/wanikani/types";

interface SRSDistributionChartProps {
  assignments: WKResource<Assignment>[];
}

const SRS_STAGES = {
  apprentice: { name: "Apprentice", color: "#ec4899", stages: [1, 2, 3, 4] },
  guru: { name: "Guru", color: "#a855f7", stages: [5, 6] },
  master: { name: "Master", color: "#3b82f6", stages: [7] },
  enlightened: { name: "Enlightened", color: "#06b6d4", stages: [8] },
  burned: { name: "Burned", color: "#eab308", stages: [9] },
};

export function SRSDistributionChart({
  assignments,
}: SRSDistributionChartProps) {
  // Count assignments by SRS stage
  const stageCounts = {
    apprentice: 0,
    guru: 0,
    master: 0,
    enlightened: 0,
    burned: 0,
  };

  assignments.forEach((assignment) => {
    const stage = assignment.data.srs_stage;
    if (SRS_STAGES.apprentice.stages.includes(stage)) {
      stageCounts.apprentice++;
    } else if (SRS_STAGES.guru.stages.includes(stage)) {
      stageCounts.guru++;
    } else if (SRS_STAGES.master.stages.includes(stage)) {
      stageCounts.master++;
    } else if (SRS_STAGES.enlightened.stages.includes(stage)) {
      stageCounts.enlightened++;
    } else if (SRS_STAGES.burned.stages.includes(stage)) {
      stageCounts.burned++;
    }
  });

  const chartData = Object.entries(stageCounts)
    .map(([key, value]) => ({
      name: SRS_STAGES[key as keyof typeof SRS_STAGES].name,
      value,
      color: SRS_STAGES[key as keyof typeof SRS_STAGES].color,
    }))
    .filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SRS Stage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
