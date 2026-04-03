'use client';

import { useState, useCallback } from 'react';
import { generateImage, GenerateResponse } from '@/lib/api';

export interface Style {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const STYLES: Style[] = [
  {
    id: 'vintage-lace',
    name: '复古蕾丝',
    prompt: '将服装换成一件复古风格的蕾丝长裙，领口和袖口有精致的刺绣细节，优雅浪漫',
    description: '复古蕾丝长裙，精致刺绣',
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    prompt: '将服装换成赛博朋克风格的未来战衣，霓虹灯光效果，金属质感，高科技感',
    description: '未来科技，霓虹灯光',
  },
  {
    id: 'hanfu',
    name: '汉服古风',
    prompt: '将服装换成传统汉服，飘逸的裙摆，精致的刺绣花纹，古典优雅',
    description: '传统汉服，古典优雅',
  },
  {
    id: 'business',
    name: '商务正装',
    prompt: '将服装换成高级定制商务正装，剪裁合体，面料高级，专业干练',
    description: '商务正装，专业干练',
  },
  {
    id: 'bohemian',
    name: '波西米亚',
    prompt: '将服装换成波西米亚风格长裙，民族风图案，流苏装饰，自由浪漫',
    description: '波西米亚，自由浪漫',
  },
];

export function useImageTransfer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const selectImage = useCallback((base64: string) => {
    setOriginalImage(base64);
    setResultImage(null);
    setError(null);
    setProgress(0);
  }, []);

  const generate = useCallback(async (style: Style) => {
    if (!originalImage) return;

    setLoading(true);
    setError(null);
    setProgress(10);

    // 模拟进度
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 15;
      });
    }, 1000);

    try {
      const result: GenerateResponse = await generateImage(
        originalImage,
        style.prompt
      );

      clearInterval(progressInterval);

      if (result.success && result.resultUrl) {
        setResultImage(result.resultUrl);
        setProgress(100);
      } else {
        setError(result.error || '生成失败');
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : '未知错误');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }, [originalImage]);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    originalImage,
    resultImage,
    loading,
    error,
    progress,
    selectImage,
    generate,
    reset,
  };
}
