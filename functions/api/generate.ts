export interface Env {
  API_KEY: string
  API_URL: string
  MODEL: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { image, prompt } = await context.request.json()
    
    const response = await fetch(context.env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': context.env.API_KEY,
      },
      body: JSON.stringify({
        model: context.env.MODEL,
        prompt,
        image,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return new Response(JSON.stringify({
        success: false,
        error: error.error?.message || `API 错误: ${response.status}`
      }), { status: 500 })
    }

    const data = await response.json()
    return new Response(JSON.stringify({
      success: true,
      resultUrl: data.data?.[0]?.url || data.url || data.image_url || data.output?.url
    }))
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '生成失败'
    }), { status: 500 })
  }
}
