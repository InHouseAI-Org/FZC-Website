'use client';

interface PieChartProps {
  title: string;
  data: { source?: string; device?: string; visitors: number; percentage: number }[];
}

const COLORS = ['#e31e24', '#c41a20', '#ff4d4d', '#b31419', '#d91c22', '#a71318'];

export function PieChart({ title, data }: PieChartProps) {
  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const percentage = item.percentage;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = startAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');

    return { path, color: COLORS[index % COLORS.length], ...item };
  });

  return (
    <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 100" className="w-48 h-48 mb-4">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.path}
              fill={slice.color}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
        </svg>

        <div className="w-full space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-400">
                  {slice.source || slice.device}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{slice.visitors.toLocaleString()}</span>
                <span className="text-gray-500">({slice.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
