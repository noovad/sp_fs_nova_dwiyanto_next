"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ProjectStatusSummary = {
  name: string;
  todo: number;
  inProgress: number;
  done: number;
};

type TaskAnalyticsChartProps = {
  data: ProjectStatusSummary[];
};

export default function TaskAnalyticsChart({ data }: TaskAnalyticsChartProps) {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="w-full mx-auto mb-6">
      <Button
        variant="outline"
        onClick={() => setShowChart((prev) => !prev)}
        className="mb-4"
      >
        {showChart ? "Hide" : "Show"} Task Analytics
      </Button>

      {showChart && (
        <Card className="w-full rounded-2xl shadow p-6 bg-background">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Task Analytics per Project
          </h2>
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="todo"
                  fill="#3b82f6"
                  name="To-do"
                  radius={[12, 12, 0, 0]}
                />
                <Bar
                  dataKey="inProgress"
                  fill="#facc15"
                  name="In Progress"
                  radius={[12, 12, 0, 0]}
                />
                <Bar
                  dataKey="done"
                  fill="#22c55e"
                  name="Done"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
