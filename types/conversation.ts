export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  report?: string
}

export interface ProjectData {
  id: string
  name: string
  status: string
  progress: number
  startDate: string
  endDate: string
  team: string[]
  description: string
}

