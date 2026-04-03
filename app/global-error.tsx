'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>出错了</h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>{error.message}</p>
            <button
              onClick={reset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              重试
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
