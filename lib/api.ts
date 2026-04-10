export interface GenerateRequest {
  image: string
  prompt: string
}

export interface GenerateResponse {
  success: boolean
  resultUrl?: string
  error?: string
}

export async function generateImage(
  imageBase64: string,
  stylePrompt: string
): Promise<GenerateResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        prompt: stylePrompt,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    }
  }
}

// 兼容旧版 API 调用
export async function submitGenerateTask(
  imageBase64: string,
  stylePrompt: string
) {
  const result = await generateImage(imageBase64, stylePrompt)
  return {
    success: result.success,
    taskId: result.success ? 'sync-task' : undefined,
    resultUrl: result.resultUrl,
    status: result.success ? 'completed' : 'failed',
    isSync: true,
    error: result.error,
  }
}

export async function pollTaskUntilComplete(
  taskId: string,
  onProgress?: (progress: number) => void,
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<string | null> {
  if (onProgress) {
    for (let i = 0; i <= 10; i++) {
      onProgress(i * 10)
      await new Promise(resolve => setTimeout(resolve, intervalMs / 10))
    }
  }
  return 'completed'
}
