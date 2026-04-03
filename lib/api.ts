export interface GenerateRequest {
  prompt: string;
  images: string[];
  model: string;
}

export interface GenerateResponse {
  success: boolean;
  resultUrl?: string;
  error?: string;
}

export async function generateImage(
  imageBase64: string,
  stylePrompt: string
): Promise<GenerateResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const MODEL = process.env.NEXT_PUBLIC_MODEL;

  // 检查环境变量
  if (!API_URL || !API_KEY) {
    return {
      success: false,
      error: 'API 配置缺失，请检查环境变量',
    };
  }

  try {
    const requestBody: GenerateRequest = {
      prompt: stylePrompt,
      images: [imageBase64],
      model: MODEL || 'doubao-seedance-1-5-pro-251215',
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
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
      resultUrl: data.data?.[0]?.url || data.url || data.image_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    };
  }
}
