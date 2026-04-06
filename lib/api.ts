export interface GenerateRequest {
  model: string;
  prompt: string;
  image?: string;
}

export interface GenerateResponse {
  success: boolean;
  resultUrl?: string;
  error?: string;
}

export interface TaskResponse {
  success: boolean;
  taskId?: string;
  resultUrl?: string;
  status?: string;
  error?: string;
}

const API_URL = 'https://llm-service.polymas.com/api/openai/v1/images/generations';
const API_KEY = 'sk-zAJCqOxm3vgTLgVVfAcXOmpL6jHoVRTqPjwxnBohLaiueIdk';
const MODEL = 'doubao-seedream-3-0-t2i-250415';

export async function generateImage(
  imageBase64: string,
  stylePrompt: string
): Promise<GenerateResponse> {
  try {
    const requestBody: GenerateRequest = {
      model: MODEL,
      prompt: stylePrompt,
      image: imageBase64,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `API 错误: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      resultUrl: data.data?.[0]?.url || data.url || data.image_url || data.output?.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    };
  }
}

// 兼容旧版 API 调用
export async function submitGenerateTask(
  imageBase64: string,
  stylePrompt: string
): Promise<TaskResponse> {
  const result = await generateImage(imageBase64, stylePrompt);
  return {
    success: result.success,
    taskId: result.success ? 'sync-task' : undefined,
    resultUrl: result.resultUrl,
    status: result.success ? 'completed' : 'failed',
    error: result.error,
  };
}

export async function pollTaskUntilComplete(
  taskId: string
): Promise<TaskResponse> {
  // 同步调用，直接返回
  return {
    success: true,
    taskId,
    status: 'completed',
  };
}
