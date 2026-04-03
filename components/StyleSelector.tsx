'use client';

import { Style } from '@/hooks/useImageTransfer';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface StyleSelectorProps {
  styles: Style[];
  selectedId?: string;
  onSelect: (style: Style) => void;
}

export function StyleSelector({ styles, selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="font-medium">选择风格</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all duration-200',
              'hover:shadow-md hover:scale-[1.02]',
              selectedId === style.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300'
            )}
          >
            <div className="font-medium text-gray-800 mb-1">{style.name}</div>
            <div className="text-xs text-gray-500 line-clamp-2">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
