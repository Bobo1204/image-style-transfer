'use client';

import { useImageTransfer, STYLES } from '@/hooks/useImageTransfer';
import { ImageUploader } from '@/components/ImageUploader';
import { StyleSelector } from '@/components/StyleSelector';
import { ResultViewer } from '@/components/ResultViewer';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { UserAuth } from '@/components/UserAuth';
import { Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Home() {
  const {
    originalImage,
    resultImage,
    loading,
    error,
    progress,
    selectImage,
    generate,
    reset,
  } = useImageTransfer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Image Style Transfer
                </h1>
                <p className="text-xs text-gray-500">AI 服装风格转换</p>
              </div>
            </div>
            
            <UserAuth />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 步骤 1: 上传图片 */}
          {!originalImage && (
            <section className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">上传您的照片</h2>
                <p className="text-gray-500">AI 将为您生成多种风格的服装效果</p>
              </div>
              <ImageUploader onImageSelect={selectImage} />
            </section>
          )}

          {/* 步骤 2: 选择风格 */}
          {originalImage && !resultImage && !loading && (
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">选择风格</h2>
                <p className="text-gray-500">选择您喜欢的服装风格</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    重新上传
                  </button>
                </div>
                
                <img
                  src={originalImage}
                  alt="原始图片"
                  className="max-h-64 mx-auto rounded-lg mb-6"
                />
                <StyleSelector
                  styles={STYLES}
                  onSelect={generate}
                />
              </div>
            </section>
          )}

          {/* 加载中 */}
          {loading && (
            <LoadingOverlay progress={progress} />
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">生成失败</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={reset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                重试
              </button>
            </div>
          )}

          {/* 步骤 3: 查看结果 */}
          {resultImage && (
            <ResultViewer
              original={originalImage!}
              result={resultImage}
              onReset={reset}
            />
          )}
        </div>
      </main>
    </div>
  );
}
