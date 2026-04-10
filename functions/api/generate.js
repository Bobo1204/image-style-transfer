// 临时硬编码环境变量（生产环境应使用 Cloudflare Dashboard 配置）
const ENV = {
  API_KEY: 'sk-zAJCqOxm3vgTLgVVfAcXOmpL6jHoVRTqPjwxnBohLaiueIdk',
  API_URL: 'https://llm-service.polymas.com/api/openai/v1/images/generations',
  MODEL: 'doubao-seedream-3-0-t2i-250415'
}

export async function onRequestPost(context) {
  try {
    const { image, prompt } = await context.request.json()
    
    // 优先使用 context.env，如果不存在则使用硬编码
    const API_URL = context.env?.API_URL || ENV.API_URL
    const API_KEY = context.env?.API_KEY || ENV.API_KEY
    const MODEL = context.env?.MODEL || ENV.MODEL
    
    console.log('Using API_URL:', API_URL)
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        image,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return new Response(JSON.stringify({
        success: false,
        error: error.error?.message || `API 错误: ${response.status}`
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify({
      success: true,
      resultUrl: data.data?.[0]?.url || data.url || data.image_url || data.output?.url
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '生成失败'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
