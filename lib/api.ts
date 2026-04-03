export interface GenerateRequest {
  prompt: string;
  images: string[];
  model: string;
}

export interface GenerateResponse {
  success: boolean;
  resultUrl?: string;
  taskId?: string;
  error?: string;
  isSync?: boolean;
}

export interface TaskStatusResponse {
  success: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
}

/**
 * 提交异步生成任务
 */
export async function submitGenerateTask(
  imageBase64: string,
  stylePrompt: string
): Promise<GenerateResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const MODEL = process.env.NEXT_PUBLIC_MODEL;

  console.log('[API] Environment check:', {
    hasUrl: !!API_URL,
    hasKey: !!API_KEY,
    model: MODEL,
  });

  // 检查环境变量
  if (!API_URL || !API_KEY) {
    return {
      success: false,
      error: 'API 配置缺失，请检查 .env.local 文件',
    };
  }

  // 检查参数
  if (!imageBase64 || imageBase64.length < 100) {
    return {
      success: false,
      error: '图片数据无效',
    };
  }

  if (!stylePrompt || stylePrompt.trim().length === 0) {
    return {
      success: false,
      error: '风格描述不能为空',
    };
  }

  try {
    const requestBody: GenerateRequest = {
      prompt: stylePrompt.trim(),
      images: [imageBase64],
      model: MODEL || 'dall-e-3',
    };

    console.log('[API] Request:', {
      url: API_URL,
      promptLength: requestBody.prompt.length,
      imageLength: requestBody.images[0].length,
      model: requestBody.model,
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[API] Response status:', response.status);

    const responseText = await response.text();
    console.log('[API] Response raw text (first 500 chars):', responseText.slice(0, 500));

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      return {
        success: false,
        error: `接口返回非 JSON: ${responseText.slice(0, 200)}`,
      };
    }

    console.log('[API] Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || data.message || `API 错误: ${response.status}`,
      };
    }

    // 优先尝试异步任务 ID
    const taskId = data.task_id || data.id || data.data?.task_id;
    if (taskId) {
      return {
        success: true,
        taskId,
        isSync: false,
      };
    }

    // 兼容同步直返图片（OpenAI / DALL-E 格式）
    const b64Image = data.data?.[0]?.b64_json;
    if (b64Image) {
      return {
        success: true,
        resultUrl: `data:image/png;base64,${b64Image}`,
        isSync: true,
      };
    }

    const imageUrl = data.data?.[0]?.url || data.image_url || data.url;
    if (imageUrl) {
      return {
        success: true,
        resultUrl: imageUrl,
        isSync: true,
      };
    }

    return {
      success: false,
      error: '接口返回格式异常，未找到 task_id 或图片数据',
    };
  } catch (error) {
    console.error('[API] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '提交任务失败',
    };
  }
}

/**
 * 查询任务状态
 */
export async function checkTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  if (!API_URL || !API_KEY) {
    return {
      success: false,
      status: 'failed',
      error: 'API 配置缺失',
    };
  }

  try {
    // 构建查询 URL（假设查询接口为 /task/{taskId}）
    const queryUrl = API_URL.replace('/task/async', `/task/${taskId}`);
    
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        status: 'failed',
        error: `查询失败: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      status: data.status || 'pending',
      resultUrl: data.result_url || data.image_url || data.data?.url,
    };
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: error instanceof Error ? error.message : '查询失败',
    };
  }
}

/**
 * 轮询等待任务完成
 */
export async function pollTaskUntilComplete(
  taskId: string,
  onProgress?: (progress: number) => void,
  maxAttempts: number = 60,
  interval: number = 2000
): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkTaskStatus(taskId);
    
    if (!status.success) {
      throw new Error(status.error || '查询失败');
    }

    // 更新进度
    if (onProgress) {
      const progress = Math.min((i / maxAttempts) * 100, 95);
      onProgress(progress);
    }

    if (status.status === 'completed' && status.resultUrl) {
      return status.resultUrl;
    }

    if (status.status === 'failed') {
      throw new Error(status.error || '任务执行失败');
    }

    // 等待后重试
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('任务超时，请稍后重试');
}
