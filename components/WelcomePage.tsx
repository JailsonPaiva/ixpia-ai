"use client";

import {
    MessageSquare,
    TrendingUp,
    FileText,
    Clock,
    Sparkles,
    Plus,
} from "lucide-react";
import { ProjectData } from "@/types/conversation";

interface WelcomePageProps {
    onNewConversation: () => void;
    projectData?: ProjectData[];
}

export default function WelcomePage({
    onNewConversation,
    projectData = [],
}: WelcomePageProps) {
    // Calcular estatísticas dos projetos
    const activeProjects = projectData.filter(
        (p) => p.status !== "Concluído" && p.status !== "Cancelado"
    ).length;
    const completedProjects = projectData.filter(
        (p) => p.status === "Concluído"
    ).length;
    const averageProgress =
        projectData.length > 0
            ? Math.round(
                projectData.reduce((sum, p) => sum + (p.progress || 0), 0) /
                projectData.length
            )
            : 0;

    return (
        <div className="flex-1 bg-white relative overflow-y-hidden">
            {/* Header */}
            <div className="mx-auto px-6 py-4 border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-2 ml-80">
                    <div className="relative">
                        <Sparkles className="text-primary-600" size={24} />
                        <MessageSquare
                            className="text-primary-600 absolute -bottom-1 -right-1"
                            size={16}
                        />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Ixpia AI
                    </h1>
                </div>
            </div>

            {/* Welcome Section */}
            <div className="max-w-4xl mx-auto px-6 py-12 mt-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Sparkles className="text-primary-600" size={80} />
                            <MessageSquare
                                className="text-primary-600 absolute -bottom-2 -right-2"
                                size={32}
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Bem-vindo ao seu Assistente de Projetos
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        Gerencie seus projetos de forma inteligente. Faça perguntas,
                        acompanhe o progresso, identifique problemas e gere relatórios
                        profissionais automaticamente.
                    </p>
                    <button
                        onClick={onNewConversation}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                    >
                        <div className="relative">
                            <MessageSquare size={18} />
                            <Plus className="absolute -top-1 -right-1" size={10} />
                        </div>
                        Iniciar Nova Conversa
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-blue-100 rounded-full p-2 relative">
                                <FileText className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {activeProjects}
                        </p>
                        <p className="text-sm text-gray-600">Projetos Ativos</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-green-100 rounded-full p-2 relative">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {averageProgress}%
                        </p>
                        <p className="text-sm text-gray-600">Progresso Médio</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-purple-100 rounded-full p-2 relative">
                                <Clock className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {completedProjects}
                        </p>
                        <p className="text-sm text-gray-600">Projetos Concluídos</p>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                                <div className="relative">
                                    <MessageSquare className="text-blue-600" size={24} />
                                    <Plus
                                        className="text-blue-600 absolute -top-1 -right-1"
                                        size={12}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Conversas Inteligentes
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Faça perguntas em linguagem natural e obtenha respostas
                                    precisas sobre seus projetos.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Acompanhamento em Tempo Real
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Monitore o progresso de todos os seus projetos em um só lugar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                                <FileText className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Relatórios Automáticos
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Gere relatórios profissionais com um clique, prontos para
                                    compartilhar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                                <Clock className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Histórico Completo
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Acesse todas as suas conversas anteriores e consulte
                                    informações quando precisar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
