'use client';

import { TrendingUp } from 'lucide-react';

interface LineChartProps {
  title: string;
  data: { date: string; [key: string]: any }[];
  dataKey: string;
  color: string;
}

export function LineChart({ title, data, dataKey, color }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const minValue = Math.min(...data.map(d => d[dataKey]));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item[dataKey] - minValue) / range) * 80 - 10; // 10% padding top and bottom
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#e31e24]" />
        {title}
      </h3>

      <div className="relative h-64">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.2"
            />
          ))}

          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`${color}33`}
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-400">{data[0]?.date}</span>
        <span className="text-white font-medium">
          {data[data.length - 1]?.[dataKey].toLocaleString()} {dataKey}
        </span>
        <span className="text-gray-400">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
