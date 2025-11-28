"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import type { CognitionScores } from "@/lib/hcs-generator";

interface ProfileChartProps {
  cognition: CognitionScores;
}

export function ProfileChart({ cognition }: ProfileChartProps) {
  const data = [
    { dimension: "Form", value: cognition.form },
    { dimension: "Logic", value: cognition.logic },
    { dimension: "Visual", value: cognition.visual },
    { dimension: "Synthesis", value: cognition.synthesis },
    { dimension: "Creativity", value: cognition.creativity },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Radar
            name="Cognition"
            dataKey="value"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
