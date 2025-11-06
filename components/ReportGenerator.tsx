'use client'

import { useState } from 'react'
import { Conversation } from '@/types/conversation'
import { FileText, Download, Loader2, X } from 'lucide-react'

interface ReportGeneratorProps {
  conversation: Conversation
  onUpdate: (conversation: Conversation) => void
}

export default function ReportGenerator({
  conversation,
  onUpdate,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          messages: conversation.messages,
        }),
      })

      if (!response.ok) throw new Error('Erro ao gerar relatório')

      const data = await response.json()
      const updatedConversation: Conversation = {
        ...conversation,
        report: data.report,
        updatedAt: new Date().toISOString(),
      }

      onUpdate(updatedConversation)
      setShowReport(true)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar relatório. Por favor, tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = () => {
    if (!conversation.report) return

    const blob = new Blob([conversation.report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <button
        onClick={generateReport}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Gerando...
          </>
        ) : (
          <>
            <FileText size={16} />
            Gerar Relatório
          </>
        )}
      </button>

      {showReport && conversation.report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Relatório Gerado</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadReport}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                {conversation.report}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

