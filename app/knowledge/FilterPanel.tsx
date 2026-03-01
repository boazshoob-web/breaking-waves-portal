'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tag } from 'lucide-react';

interface FilterPanelProps {
  tags: { id: string; name: string; _count: { items: number } }[];
}

export default function FilterPanel({ tags }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') || '';
  const activeType = searchParams.get('type') || '';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && params.get(key) !== value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/knowledge?${params.toString()}`);
  };

  const typeFilters = [
    { value: 'PDF', label: 'PDF', icon: '📄' },
    { value: 'VIDEO', label: 'וידאו', icon: '🎬' },
    { value: 'LINK', label: 'קישור', icon: '🔗' },
  ];

  return (
    <div className="space-y-4">
      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter('type', type.value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeType === type.value
                ? 'bg-ocean-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
        {activeType && (
          <button
            onClick={() => setFilter('type', '')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            נקה סינון
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-600">תגיות:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilter('tag', tag.name)}
              className={`badge cursor-pointer transition-colors ${
                activeTag === tag.name
                  ? 'bg-ocean-blue text-white'
                  : 'badge-info hover:bg-ocean-blue hover:text-white'
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
