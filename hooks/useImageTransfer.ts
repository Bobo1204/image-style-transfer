'use client';

import { useState, useCallback } from 'react';
import { submitGenerateTask, pollTaskUntilComplete } from '@/lib/api';

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
    setProgress(5);

    try {
      // 步骤 1: 提交生成任务
      setProgress(10);
      const submitResult = await submitGenerateTask(originalImage, style.prompt);

      if (!submitResult.success) {
        throw new Error(submitResult.error || '提交任务失败');
      }

      // 同步返回结果：直接使用，无需轮询
      if (submitResult.isSync && submitResult.resultUrl) {
        setResultImage(submitResult.resultUrl);
        setProgress(100);
        return;
      }

      // 异步返回：轮询等待结果
      if (!submitResult.taskId) {
        throw new Error('提交任务失败：未返回任务 ID');
      }

      setProgress(20);
      const resultUrl = await pollTaskUntilComplete(
        submitResult.taskId,
        (p) => setProgress(20 + p * 0.75), // 20% - 95%
        60,  // 最多 60 次尝试
        2000 // 每 2 秒查询一次
      );

      if (resultUrl) {
        setResultImage(resultUrl);
        setProgress(100);
      } else {
        throw new Error('生成结果为空');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
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
