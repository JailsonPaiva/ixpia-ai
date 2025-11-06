'use client'

import { useState } from 'react'
import { ProjectData } from '@/types/conversation'
import { Upload, FileText, X } from 'lucide-react'

interface ProjectDataLoaderProps {
  onDataLoad: (data: ProjectData[]) => void
}

export default function ProjectDataLoader({ onDataLoad }: ProjectDataLoaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState('')

  const handleLoad = () => {
    try {
      const data = JSON.parse(jsonInput)
      if (Array.isArray(data)) {
        onDataLoad(data)
        setIsOpen(false)
        setJsonInput('')
        alert('Dados carregados com sucesso!')
      } else {
        alert('O arquivo JSON deve conter um array de projetos.')
      }
    } catch (error) {
      alert('Erro ao processar JSON. Verifique o formato do arquivo.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setJsonInput(content)
      }
      reader.readAsText(file)
    }
  }

  const exampleData = `[
  {
    "id": "1",
    "name": "Sistema de Gestão",
    "status": "Em Andamento",
    "progress": 65,
    "startDate": "2024-01-15",
    "endDate": "2024-06-30",
    "team": ["João Silva", "Maria Santos"],
    "description": "Desenvolvimento de sistema completo de gestão"
  },
  {
    "id": "2",
    "name": "Portal do Cliente",
    "status": "Atrasado",
    "progress": 40,
    "startDate": "2024-02-01",
    "endDate": "2024-05-15",
    "team": ["Pedro Costa", "Ana Lima"],
    "description": "Portal web para clientes"
  }
]`

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <Upload size={16} />
        Carregar Dados de Projetos
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Carregar Dados de Projetos</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload de Arquivo JSON
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ou cole o JSON aqui:
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Cole o JSON dos projetos aqui..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Formato Esperado:</span>
                </div>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {exampleData}
                </pre>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLoad}
                disabled={!jsonInput.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Carregar Dados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

