'use client'

import { Message } from '@/types/conversation'
import { User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        {isUser ? (
          <User className="text-white" size={18} />
        ) : (
          <Bot className="text-gray-700" size={18} />
        )}
      </div>
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[80%] rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm max-w-none"
            components={{
              p: ({ children }) => (
                <p className={`mb-2 last:mb-0 ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className={`list-disc list-inside mb-2 space-y-1 ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className={`list-decimal list-inside mb-2 space-y-1 ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className={isUser ? 'text-white' : 'text-gray-800'}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className={`font-semibold ${isUser ? 'text-white' : 'text-gray-900'}`}>
                  {children}
                </strong>
              ),
              code: ({ children }) => (
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${
                    isUser
                      ? 'bg-primary-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

