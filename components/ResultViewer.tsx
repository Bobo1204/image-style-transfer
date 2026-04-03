'use client';

import { Download, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultViewerProps {
  original: string;
  result: string;
  onReset: () => void;
}

export function ResultViewer({ original, result, onReset }: ResultViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result;
    link.download = `styled-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-green-600 justify-center">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-4 h-4" />
        </div>
        <span className="font-medium">生成完成！</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 text-center">原图</p>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={original}
              alt="Original"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 text-center">生成结果</p>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-lg">
            <img
              src={result}
              alt="Result"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownload}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
            'hover:shadow-lg hover:scale-105 transition-all duration-200',
            'font-medium'
          )}
        >
          <Download className="w-5 h-5" />
          下载图片
        </button>

        <button
          onClick={onReset}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'border-2 border-gray-300 text-gray-700',
            'hover:border-gray-400 hover:bg-gray-50',
            'transition-all duration-200 font-medium'
          )}
        >
          <RotateCcw className="w-5 h-5" />
          再来一张
        </button>
      </div>
    </div>
  );
}
