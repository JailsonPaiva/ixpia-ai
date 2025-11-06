'use client'

import { useState, useEffect, useRef } from 'react'
import { Conversation, Message, ProjectData } from '@/types/conversation'
import { MessageSquare, FileText } from 'lucide-react'
import MessageBubble from './MessageBubble'
import ReportGenerator from './ReportGenerator'
import ProjectDataLoader from './ProjectDataLoader'
import DialogflowMessenger from './DialogflowMessenger'

interface ChatInterfaceProps {
  conversation: Conversation
  onUpdate: (conversation: Conversation) => void
  projectData?: ProjectData[]
  chatWidth?: number
  onChatWidthChange?: (width: number) => void
  showChatOnly?: boolean
}

export default function ChatInterface({
  conversation,
  onUpdate,
  projectData = [],
  chatWidth = 400,
  onChatWidthChange,
  showChatOnly = false,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (conversation?.messages) {
      scrollToBottom()
    }
  }, [conversation?.messages])

  const handleMessage = (message: Message) => {
    if (!conversation) return
    
    const updatedMessages = [...(conversation.messages || []), message]
    
    // Atualizar título se for a primeira mensagem do usuário
    let newTitle = conversation.title
    if (conversation.title === 'Nova Conversa' && message.role === 'user' && updatedMessages.length === 1) {
      newTitle = message.content.slice(0, 50)
    }

    const updatedConversation: Conversation = {
      ...conversation,
      messages: updatedMessages,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedConversation)
  }

  const handleConversationStart = () => {
    // Marcar que a conversa foi iniciada
    if (conversation && conversation.title === 'Nova Conversa') {
      const updatedConversation: Conversation = {
        ...conversation,
        updatedAt: new Date().toISOString(),
      }
      onUpdate(updatedConversation)
    }
  }

  if (showChatOnly) {
    return (
      <div className="h-full w-full">
        <DialogflowMessenger
          conversation={conversation}
          onMessage={handleMessage}
          onConversationStart={handleConversationStart}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {conversation?.title || 'Nova Conversa'}
          </h2>
            <p className="text-sm text-gray-500">
              {conversation?.messages?.length || 0} mensagens capturadas
              {projectData.length > 0 && ` • ${projectData.length} projetos carregados`}
            </p>
        </div>
        <div className="flex items-center gap-3">
          <ProjectDataLoader onDataLoad={(data) => {
            localStorage.setItem('projectData', JSON.stringify(data))
            window.location.reload()
          }} />
            {(conversation?.messages?.length || 0) > 0 && (
              <ReportGenerator conversation={conversation} onUpdate={onUpdate} />
            )}
        </div>
      </header>

      {/* Messages area - Histórico das mensagens capturadas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {!conversation?.messages || conversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="text-primary-600" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Conversa com Dialogflow
                </h3>
                <p className="text-gray-600 mb-4">
                  Use o painel de chat à direita para conversar com o agente.
                  Todas as mensagens serão capturadas automaticamente aqui.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Como usar:</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Use o painel de chat à direita da tela</li>
                    <li>Inicie uma conversa com o agente</li>
                    <li>As mensagens aparecerão aqui automaticamente</li>
                    <li>Gere um relatório após a conversa</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💬 Histórico da conversa com o Dialogflow. Use o painel de chat à direita para continuar conversando.
                </p>
              </div>
              {(conversation?.messages || []).map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} className="border border-red-500" />
            </>
          )}
      </div>
    </div>
  )
}

