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
    
    // 根据实际 API 响应结构调整
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
