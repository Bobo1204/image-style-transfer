'use client';

import { useImageTransfer, STYLES } from '@/hooks/useImageTransfer';
import { ImageUploader } from '@/components/ImageUploader';
import { StyleSelector } from '@/components/StyleSelector';
import { ResultViewer } from '@/components/ResultViewer';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Sparkles, ImageIcon } from 'lucide-react';

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
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <img
                    src={originalImage}
                    alt="Preview"
                    className="max-h-48 rounded-xl border border-gray-200"
                  />
                </div>
                <button
                  onClick={reset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  重新上传
                </button>
              </div>

              <StyleSelector
                styles={STYLES}
                onSelect={generate}
              />
            </section>
          )}

          {/* 步骤 3: 结果展示 */}
          {resultImage && originalImage && (
            <section>
              <ResultViewer
                original={originalImage}
                result={resultImage}
                onReset={reset}
              />
            </section>
          )}

          {/* 错误提示 */}
          {error && (
            <ErrorMessage message={error} onClose={() => {}} />
          )}
        </div>
      </main>

      {/* 加载遮罩 */}
      {loading && <LoadingOverlay progress={progress} />}

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>© 2026 Image Style Transfer. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
