import type { LLMResponse } from '../types/chat'

export async function sendMessageToLLM(message: string): Promise<LLMResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    let errorMessage = 'Something went wrong'

    try {
      const data = await response.json()
      errorMessage = data?.error ?? data?.message ?? 'Something went wrong'
    } catch {
      errorMessage = 'Server error occurred'
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<LLMResponse>
}
