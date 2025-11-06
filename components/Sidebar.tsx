'use client'

import { useState } from 'react'
import { Conversation } from '@/types/conversation'
import { Plus, MessageSquare, Trash2, Menu, X, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

interface SidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Tem certeza que deseja excluir esta conversa?')) {
      onDeleteConversation(id)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-40 lg:translate-x-0`}
      >
        {/* Header - Blue bar */}
        <div className="bg-primary-600 p-[18px] border-b  flex items-center gap-2">
          <div className="relative">
            <MessageSquare className="text-white" size={20} />
            <Plus className="text-white absolute -top-1 -right-1" size={12} />
          </div>
          <h1 className="text-white font-semibold text-base">
            Ixpia AI
          </h1>
        </div>

        {/* New conversation button */}
        <div className="p-4">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
          >
            <div className="relative">
              <MessageSquare size={18} />
              <Plus className="absolute -top-1 -right-1" size={10} />
            </div>
            Nova Conversa
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
          {conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <MessageSquare className="text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 text-sm font-medium mb-1">
                Nenhuma conversa ainda
              </p>
              <p className="text-gray-400 text-xs text-center">
                Inicie uma nova conversa para começar
              </p>
            </div>
          ) : ( 
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation.id)
                    setIsOpen(false)
                  }}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors group ${
                    activeConversationId === conversation.id
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <MessageSquare
                        size={18}
                        className={`mt-0.5 flex-shrink-0 ${
                          activeConversationId === conversation.id
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(
                            new Date(conversation.updatedAt),
                            "dd 'de' MMM, HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, conversation.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                      title="Excluir conversa"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 font-medium mb-1">
            Assistente de Gestão de Projetos
          </p>
          <p className="text-xs text-gray-400">
            Powered by AI
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

