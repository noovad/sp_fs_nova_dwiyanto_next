"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

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

  const chartData = {
    labels: data.map((project) => project.name),
    datasets: [
      {
        label: "To-do",
        data: data.map((project) => project.todo),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "In Progress",
        data: data.map((project) => project.inProgress),
        backgroundColor: "rgba(250, 204, 21, 0.8)",
        borderColor: "rgb(250, 204, 21)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Done",
        data: data.map((project) => project.done),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Task Analytics per Project",
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Projects",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Number of Tasks",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

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
          <div className="w-full h-[360px]">
            <Bar data={chartData} options={options} />
          </div>
        </Card>
      )}
    </div>
  );
}