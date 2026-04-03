export async function transferStyle(
  imageBase64: string,
  styleId: string
): Promise<string> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const response = await fetch(API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      image: imageBase64,
      style: styleId,
    }),
  });

  if (!response.ok) {
    throw new Error('Style transfer failed');
  }

  const data = await response.json();
  return data.resultUrl;
}
