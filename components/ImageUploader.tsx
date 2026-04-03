'use client';

import { useCallback } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  className?: string;
}

export function ImageUploader({ onImageSelect, className }: ImageUploaderProps) {
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onImageSelect(base64);
    };
    reader.onerror = () => {
      alert('图片读取失败');
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center',
        'hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300',
        'cursor-pointer group',
        className
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id="image-input"
      />
      <label htmlFor="image-input" className="cursor-pointer block">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">点击或拖拽上传图片</p>
            <p className="text-sm text-gray-400 mt-1">支持 JPG、PNG、WebP，最大 10MB</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <ImageIcon className="w-4 h-4" />
            <span>AI 将为您生成多种风格的服装</span>
          </div>
        </div>
      </label>
    </div>
  );
}
