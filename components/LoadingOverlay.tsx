'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  progress?: number;
}

export function LoadingOverlay({ progress = 0 }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">AI 生成中...</p>
            <p className="text-sm text-gray-500 mt-1">正在为您转换风格</p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-400">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  );
}
