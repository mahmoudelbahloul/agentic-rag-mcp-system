export type Role = 'user' | 'bot'

export interface Message {
  id: string
  role: Role
  text: string
}

export interface LLMResponse {
  reply: string
}
