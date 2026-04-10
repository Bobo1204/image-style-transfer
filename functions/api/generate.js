export async function onRequestPost(context) {
  try {
    const { image, prompt } = await context.request.json()
    
    // 尝试多种方式读取环境变量
    const API_URL = context.env?.API_URL 
    const API_KEY = context.env?.API_KEY 
    const MODEL = context.env?.MODEL 
    
    console.log('Debug - API_URL:', API_URL)
    console.log('Debug - MODEL:', MODEL)
    console.log('Debug - API_KEY exists:', !!API_KEY)
    
    if (!API_URL) {
      return new Response(JSON.stringify({
        success: false,
        error: 'API_URL not configured. Please check environment variables.'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
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
