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
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <Radar
            name="Cognition"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
