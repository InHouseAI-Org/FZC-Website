'use client';

interface BarChartProps {
  title: string;
  data: { name: string; value: number }[];
  color?: string;
}

export function BarChart({ title, data, color = '#e31e24' }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{item.name}</span>
              <span className="text-sm font-medium text-white">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#2b2a29] rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
