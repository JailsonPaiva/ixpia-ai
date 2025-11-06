# Assistente de Relatórios - Gestão de Projetos

Uma aplicação moderna de chat com IA para auxiliar gestores de projetos na geração de relatórios e acompanhamento do progresso dos projetos.

## 🚀 Funcionalidades

- 💬 **Chat Interativo**: Converse com um agente de IA especializado em gestão de projetos
- 📊 **Geração de Relatórios**: Gere relatórios executivos completos baseados nas conversas
- 📚 **Histórico de Conversas**: Mantenha todas as suas conversas salvas e acessíveis
- 📁 **Carregamento de Dados**: Carregue dados dos seus projetos via JSON para respostas mais precisas
- 🎨 **Interface Moderna**: UI/UX intuitiva e visualmente agradável
- 💾 **Persistência Local**: Todos os dados são salvos localmente no navegador
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias

- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Dialogflow CX Messenger** - Widget de chat integrado do Google
- **OpenAI API** - Geração de relatórios (opcional)
- **React Markdown** - Renderização de markdown
- **Lucide React** - Ícones modernos
- **date-fns** - Formatação de datas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local e adicionar sua chave da OpenAI
# OPENAI_API_KEY=sua_chave_api_aqui

# Executar em desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### 1. Integração com Dialogflow CX

A aplicação está configurada para usar um Conversational Agent do Google Dialogflow CX. As credenciais já estão configuradas no componente `DialogflowMessenger.tsx`:

- **Project ID**: `iasm-governadoria-prod`
- **Agent ID**: `f13baa59-1f3d-4699-98aa-88eed213b838`
- **Language Code**: `pt-br`

Para usar um agente diferente, edite o arquivo `components/DialogflowMessenger.tsx` e atualize as propriedades do componente `<df-messenger>`.

### 2. Chave da OpenAI (Opcional - apenas para geração de relatórios)

Se desejar usar a geração automática de relatórios via IA, crie um arquivo `.env.local` na raiz do projeto com:

```
OPENAI_API_KEY=sua_chave_api_aqui
```

Você pode obter uma chave em: https://platform.openai.com/api-keys

**Nota**: A integração com Dialogflow funciona independentemente da OpenAI. A chave da OpenAI é necessária apenas para gerar relatórios baseados nas conversas.

### 3. Carregar Dados de Projetos

A aplicação permite carregar dados dos seus projetos em formato JSON. Exemplo:

```json
[
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
]
```

## 🎯 Como Usar

1. **Iniciar Nova Conversa**: Clique em "Nova Conversa" na sidebar
2. **Abrir Chat do Dialogflow**: Clique no widget de chat no canto inferior direito da tela
3. **Converse com o Agente**: Todas as mensagens serão capturadas automaticamente e aparecerão no histórico
4. **Visualizar Histórico**: Veja todas as mensagens capturadas na área principal da tela
5. **Gerar Relatório**: Após a conversa, clique em "Gerar Relatório" para criar um relatório executivo baseado nas mensagens
6. **Baixar Relatório**: O relatório pode ser baixado em formato Markdown

## 💡 Exemplos de Perguntas

- "Qual o status atual dos projetos?"
- "Quais projetos estão atrasados?"
- "Qual o progresso geral da equipe?"
- "Quais são os principais riscos identificados?"
- "Quais projetos precisam de mais atenção?"

## 🚀 Deploy

A aplicação está pronta para deploy na Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Ou conecte seu repositório GitHub diretamente na Vercel.

## 📝 Estrutura do Projeto

```
assistente-relatorio/
├── app/
│   ├── api/
│   │   └── generate-report/ # API de geração de relatórios
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/
│   ├── ChatInterface.tsx  # Interface principal com histórico
│   ├── DialogflowMessenger.tsx # Integração com Dialogflow CX
│   ├── MessageBubble.tsx  # Componente de mensagem
│   ├── Sidebar.tsx        # Sidebar com histórico
│   ├── ReportGenerator.tsx # Geração de relatórios
│   └── ProjectDataLoader.tsx # Carregador de dados
├── types/
│   └── conversation.ts    # Tipos TypeScript
└── package.json
```

## 🔒 Segurança

- A chave da OpenAI é armazenada apenas no servidor (variáveis de ambiente)
- Dados de conversas são armazenados localmente no navegador
- Não há transmissão de dados sensíveis para terceiros

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

