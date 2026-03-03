/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthData = [
  { date: "3 Oct", thisMonth: 1600, lastMonth: 0 },
  { date: "10 Oct", thisMonth: 2600, lastMonth: 1100 },
  { date: "14 Oct", thisMonth: 1950, lastMonth: 900 },
  { date: "20 Oct", thisMonth: 3900, lastMonth: 2800 },
  { date: "23 Oct", thisMonth: 1750, lastMonth: 3600 },
  { date: "27 Oct", thisMonth: 750, lastMonth: 2900 },
  { date: "30 Oct", thisMonth: 3700, lastMonth: 1800 },
];

const weekData = [
  { date: "Mon", thisMonth: 1200, lastMonth: 800 },
  { date: "Tue", thisMonth: 2100, lastMonth: 1500 },
  { date: "Wed", thisMonth: 1800, lastMonth: 2200 },
  { date: "Thu", thisMonth: 3200, lastMonth: 1900 },
  { date: "Fri", thisMonth: 2800, lastMonth: 3100 },
  { date: "Sat", thisMonth: 3500, lastMonth: 2400 },
  { date: "Sun", thisMonth: 1600, lastMonth: 2800 },
];

const dayData = [
  { date: "6am", thisMonth: 400, lastMonth: 200 },
  { date: "9am", thisMonth: 1100, lastMonth: 700 },
  { date: "12pm", thisMonth: 2400, lastMonth: 1800 },
  { date: "3pm", thisMonth: 3100, lastMonth: 2600 },
  { date: "6pm", thisMonth: 2700, lastMonth: 3200 },
  { date: "9pm", thisMonth: 1800, lastMonth: 2100 },
];

const yearData = [
  { date: "Jan", thisMonth: 3200, lastMonth: 2800 },
  { date: "Mar", thisMonth: 2600, lastMonth: 3400 },
  { date: "May", thisMonth: 4100, lastMonth: 2900 },
  { date: "Jul", thisMonth: 3700, lastMonth: 3800 },
  { date: "Sep", thisMonth: 2900, lastMonth: 4200 },
  { date: "Nov", thisMonth: 4500, lastMonth: 3100 },
];

type FilterType = "Day" | "Week" | "Month" | "Year";

const dataMap: Record<FilterType, typeof monthData> = {
  Day: dayData,
  Week: weekData,
  Month: monthData,
  Year: yearData,
};

const formatYAxis = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${value / 1000}k`;
  return `${value}`;
};

const CustomDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="white"
      stroke={stroke}
      strokeWidth={2}
    />
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-medium text-gray-800">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function SellReport() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Month");
  const filters: FilterType[] = ["Day", "Week", "Month", "Year"];
  const data = dataMap[activeFilter];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full my-10">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">Sell Report</h2>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 ml-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
          <span className="text-sm text-gray-500">This Month</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
          <span className="text-sm text-gray-500">Last Month</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray=""
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            dy={10}
          />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            ticks={[0, 1000, 2000, 3000, 4000]}
            dx={-5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="thisMonth"
            name="This Month"
            stroke="#16a34a"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "white", stroke: "#16a34a", strokeWidth: 2 }}
          />
          <Line
            type="linear"
            dataKey="lastMonth"
            name="Last Month"
            stroke="#7dd3fc"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "white", stroke: "#7dd3fc", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SellReport;