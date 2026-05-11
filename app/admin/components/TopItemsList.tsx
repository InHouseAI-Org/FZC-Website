'use client';

import { LucideIcon } from 'lucide-react';

interface TopItemsListProps {
  title: string;
  items: { name: string; value: string; percentage: number }[];
  icon: LucideIcon;
}

export function TopItemsList({ title, items, icon: Icon }: TopItemsListProps) {
  return (
    <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#e31e24]" />
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[#2b2a29]/50 rounded-lg hover:bg-[#2b2a29] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{item.name}</p>
              <div className="w-full bg-[#2b2a29] rounded-full h-1.5 mt-2">
                <div
                  className="bg-[#e31e24] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-white">{item.value}</p>
              <p className="text-xs text-gray-400">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
