"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for demo charts
const levelProgressionData = [
  { date: "Jan", level: 10 },
  { date: "Feb", level: 15 },
  { date: "Mar", level: 22 },
  { date: "Apr", level: 28 },
  { date: "May", level: 35 },
  { date: "Jun", level: 42 },
];

const srsStageData = [
  { name: "Apprentice", value: 120, color: "#ec4899" },
  { name: "Guru", value: 280, color: "#a855f7" },
  { name: "Master", value: 450, color: "#3b82f6" },
  { name: "Enlightened", value: 380, color: "#06b6d4" },
  { name: "Burned", value: 850, color: "#eab308" },
];

const accuracyData = [
  { name: "Radicals", accuracy: 95 },
  { name: "Kanji", accuracy: 88 },
  { name: "Vocabulary", accuracy: 92 },
];

const charts = [
  {
    title: "Level Progression",
    component: (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={levelProgressionData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: "#a855f7" }}
          />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
  {
    title: "SRS Stage Distribution",
    component: (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={srsStageData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {srsStageData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    ),
  },
  {
    title: "Accuracy by Type",
    component: (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={accuracyData}>
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
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="accuracy" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    ),
  },
];

export function DemoCarousel() {
  const [currentChart, setCurrentChart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChart((prev) => (prev + 1) % charts.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">{charts[currentChart].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="transition-opacity duration-500">
          {charts[currentChart].component}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {charts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentChart(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentChart
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30"
              }`}
              aria-label={`View chart ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
