'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'
import WelcomePage from '@/components/WelcomePage'
import ProjectDataLoader from '@/components/ProjectDataLoader'
import { Conversation, ProjectData } from '@/types/conversation'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [projectData, setProjectData] = useState<ProjectData[]>([])

  // Função para limpar dados do Dialogflow no sessionStorage
  const clearDialogflowSessionData = () => {
    const dialogflowKeys = [
      'df-messenger-messages',
      'df-messenger-sessionID',
      'df-messenger-welcomeIntentTriggered',
      'df-messenger-lastResponseInstant'
    ]
    
    dialogflowKeys.forEach(key => {
      try {
        sessionStorage.removeItem(key)
      } catch (error) {
        console.log(`Erro ao remover ${key}:`, error)
      }
    })
  }

  // Função auxiliar para salvar conversas em ambos os storages
  const saveConversations = (conversationsToSave: Conversation[], activeId: string | null = null) => {
    // Salvar todas as conversas no localStorage (histórico permanente)
    localStorage.setItem('conversations', JSON.stringify(conversationsToSave))
    
    // Salvar conversa ativa no sessionStorage (sessão atual)
    if (activeId) {
      const activeConv = conversationsToSave.find(c => c.id === activeId)
      if (activeConv) {
        sessionStorage.setItem('activeConversationId', activeId)
        sessionStorage.setItem(`conversation_${activeId}`, JSON.stringify(activeConv))
      }
    }
  }

  useEffect(() => {
    // Carregar conversas do localStorage (histórico completo)
    const savedConversations = localStorage.getItem('conversations')
    let allConversations: Conversation[] = []
    
    if (savedConversations) {
      allConversations = JSON.parse(savedConversations)
    }

    // Carregar conversa ativa do sessionStorage (sessão atual)
    const activeConversationKey = sessionStorage.getItem('activeConversationId')
    let sessionConversation: Conversation | null = null
    
    if (activeConversationKey) {
      const savedSessionConversation = sessionStorage.getItem(`conversation_${activeConversationKey}`)
      if (savedSessionConversation) {
        sessionConversation = JSON.parse(savedSessionConversation)
        
        // Mesclar mensagens da sessão com o histórico permanente
        if (sessionConversation && sessionConversation.id) {
          const convId = sessionConversation.id
          const existingIndex = allConversations.findIndex(c => c.id === convId)
          if (existingIndex >= 0) {
            // Atualizar conversa existente com mensagens da sessão (priorizar sessionStorage)
            allConversations[existingIndex] = {
              ...sessionConversation,
              // Manter alguns campos do localStorage se necessário
              createdAt: allConversations[existingIndex].createdAt,
            }
          } else {
            // Adicionar nova conversa da sessão
            allConversations = [sessionConversation, ...allConversations]
          }
        }
      }
    }

    setConversations(allConversations)
    
    // Definir conversa ativa: priorizar sessionStorage, depois localStorage
    if (activeConversationKey && allConversations.find(c => c.id === activeConversationKey)) {
      setActiveConversationId(activeConversationKey)
    } else if (allConversations.length > 0 && !activeConversationId) {
      setActiveConversationId(allConversations[0].id)
    }

    // Carregar dados de projetos do localStorage
    const savedProjects = localStorage.getItem('projectData')
    if (savedProjects) {
      setProjectData(JSON.parse(savedProjects))
    }

  }, [])

  const handleProjectDataLoad = (data: ProjectData[]) => {
    setProjectData(data)
    localStorage.setItem('projectData', JSON.stringify(data))
  }

  const handleNewConversation = () => {
    // Limpar dados do Dialogflow para forçar nova sessão
    clearDialogflowSessionData()
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newConversation, ...conversations]
    setConversations(updated)
    setActiveConversationId(newConversation.id)
    
    // Salvar em ambos os storages
    saveConversations(updated, newConversation.id)
    
    // Limpar sessionStorage de conversas antigas
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('conversation_') && key !== `conversation_${newConversation.id}`) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
  }

  const handleSelectConversation = (id: string) => {
    // Limpar dados do Dialogflow para forçar nova sessão quando trocar de conversa
    clearDialogflowSessionData()
    
    setActiveConversationId(id)
    
    // Salvar ID da conversa ativa no sessionStorage
    sessionStorage.setItem('activeConversationId', id)
    
    // Salvar a conversa completa no sessionStorage
    const selectedConversation = conversations.find(c => c.id === id)
    if (selectedConversation) {
      sessionStorage.setItem(`conversation_${id}`, JSON.stringify(selectedConversation))
    }
  }

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id)
    setConversations(updated)
    
    // Remover do sessionStorage
    sessionStorage.removeItem(`conversation_${id}`)
    
    const newActiveId = updated.length > 0 ? updated[0].id : null
    if (newActiveId) {
      setActiveConversationId(newActiveId)
      sessionStorage.setItem('activeConversationId', newActiveId)
      const activeConv = updated.find(c => c.id === newActiveId)
      if (activeConv) {
        sessionStorage.setItem(`conversation_${newActiveId}`, JSON.stringify(activeConv))
      }
    } else {
      setActiveConversationId(null)
      sessionStorage.removeItem('activeConversationId')
    }
    
    // Salvar em ambos os storages
    saveConversations(updated, newActiveId)
  }

  const handleUpdateConversation = (updatedConversation: Conversation) => {
    const updated = conversations.map(c =>
      c.id === updatedConversation.id ? updatedConversation : c
    )
    setConversations(updated)
    
    // Salvar em ambos os storages
    saveConversations(updated, activeConversationId)
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 flex">
        {activeConversation ? (
          <>
            {/* Área do chat Dialogflow - Full Width */}
            <div className="flex-1 w-full h-full">
              <ChatInterface
                conversation={activeConversation}
                onUpdate={handleUpdateConversation}
                projectData={projectData}
                showChatOnly
              />
            </div>
          </>
        ) : (
          <WelcomePage 
            onNewConversation={handleNewConversation}
            projectData={projectData}
          />
        )}
      </div>
    </div>
  )
}

