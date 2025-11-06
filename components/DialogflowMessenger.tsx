"use client";

import { useEffect, useRef } from "react";
import { Conversation, Message } from "@/types/conversation";
import Script from "next/script";

interface DialogflowMessengerProps {
  conversation: Conversation;
  onMessage: (message: Message) => void;
  onConversationStart?: () => void;
}

declare global {
  interface Window {
    dfMessenger?: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      "df-messenger": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "project-id"?: string;
        "agent-id"?: string;
        "language-code"?: string;
        "max-query-length"?: string;
      };
      "df-messenger-chat": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "chat-title"?: string;
      };
    }
  }
}

export default function DialogflowMessenger({
  conversation,
  onMessage,
  onConversationStart,
}: DialogflowMessengerProps) {
  const messengerRef = useRef<HTMLElement | null>(null);
  const isInitialized = useRef(false);
  const previousConversationId = useRef<string>(conversation.id);

  // Limpar dados do Dialogflow quando mudar de conversa
  useEffect(() => {
    if (previousConversationId.current !== conversation.id) {
      // Limpar dados do Dialogflow no sessionStorage
      const dialogflowKeys = [
        'df-messenger-messages',
        'df-messenger-sessionID',
        'df-messenger-welcomeIntentTriggered',
        'df-messenger-lastResponseInstant'
      ];
      
      dialogflowKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (error) {
          console.log(`Erro ao remover ${key}:`, error);
        }
      });
      
      // Resetar flag de inicialização para forçar nova inicialização
      isInitialized.current = false;
      previousConversationId.current = conversation.id;
    }
  }, [conversation.id]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    // Usar o ID da conversa para criar um Set único por conversa
    const conversationId = conversation.id;
    const processedMessages = new Set<string>();

    // Limpar o histórico visual do Dialogflow quando mudar de conversa
    const clearDialogflowHistory = () => {
      const messengerElement = document.querySelector('df-messenger') as any;
      if (messengerElement) {
        // Tentar limpar o histórico do chat
        try {
          // Usar a API do Dialogflow para limpar o histórico se disponível
          if (messengerElement.clearHistory) {
            messengerElement.clearHistory();
          }
          // Alternativa: remover e recriar o elemento
          const chatContainer = messengerElement.shadowRoot?.querySelector('df-messenger-chat');
          if (chatContainer) {
            const chatWindow = chatContainer.shadowRoot?.querySelector('[class*="chat"]');
            if (chatWindow) {
              chatWindow.innerHTML = '';
            }
          }
        } catch (error) {
          console.log('Não foi possível limpar o histórico do Dialogflow:', error);
        }
      }
    };

    // Função para capturar mensagens do Dialogflow
    const setupEventListeners = () => {
      // Evento quando o usuário envia uma mensagem (baseado na documentação)
      const handleUserSent = (event: CustomEvent) => {
        const userText =
          event.detail?.text ||
          event.detail?.query ||
          event.detail?.input?.text ||
          event.detail?.message?.text ||
          "";
        // Verificar se a mensagem pertence à conversa atual
        const messageKey = `${conversationId}-user-${userText}`;
        if (userText && !processedMessages.has(messageKey)) {
          processedMessages.add(messageKey);
          const userMessage: Message = {
            id: `user-${Date.now()}-${Math.random()}`,
            role: "user",
            content: String(userText),
            timestamp: new Date().toISOString(),
          };
          onMessage(userMessage);
        }
      };

      // Evento quando o agente responde
      const handleAgentResponse = (event: CustomEvent) => {
        const responseText =
          event.detail?.response ||
          event.detail?.text ||
          event.detail?.message?.text?.text?.[0] ||
          event.detail?.fulfillmentText ||
          "";
        // Verificar se a mensagem pertence à conversa atual
        const messageKey = `${conversationId}-assistant-${responseText}`;
        if (responseText && !processedMessages.has(messageKey)) {
          processedMessages.add(messageKey);
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}-${Math.random()}`,
            role: "assistant",
            content: String(responseText),
            timestamp: new Date().toISOString(),
          };
          onMessage(assistantMessage);
        }
      };

      // Evento quando o messenger é carregado
      const handleMessengerLoaded = () => {
        if (onConversationStart && !isInitialized.current) {
          isInitialized.current = true;
          onConversationStart();
        }
      };

      // Evento quando o chat é aberto
      const handleMessengerOpened = () => {
        if (onConversationStart) {
          onConversationStart();
        }
      };

      // Adicionar listeners para eventos customizados do Dialogflow
      document.addEventListener(
        "df-user-sent",
        handleUserSent as EventListener
      );
      document.addEventListener(
        "df-agent-response",
        handleAgentResponse as EventListener
      );
      document.addEventListener("df-messenger-loaded", handleMessengerLoaded);
      document.addEventListener("df-messenger-opened", handleMessengerOpened);

      // MutationObserver como fallback para capturar mensagens do DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              const text = element.textContent?.trim();

              if (!text) return;

              // Identificar mensagens do usuário (bubble à direita)
              const isUserMessage =
                element.classList?.contains("message") &&
                (element.querySelector(".user-message") ||
                  element.getAttribute("data-message-type") === "user" ||
                  element.style.marginLeft === "auto");

              // Identificar mensagens do bot
              const isBotMessage =
                element.classList?.contains("message") &&
                (element.querySelector(".bot-message") ||
                  element.getAttribute("data-message-type") === "bot" ||
                  !element.style.marginLeft);

              // Verificar se a mensagem pertence à conversa atual
              const userMessageKey = `${conversationId}-user-${text}`;
              const botMessageKey = `${conversationId}-assistant-${text}`;
              
              if (isUserMessage && !processedMessages.has(userMessageKey)) {
                processedMessages.add(userMessageKey);
                const userMessage: Message = {
                  id: `user-${Date.now()}-${Math.random()}`,
                  role: "user",
                  content: text,
                  timestamp: new Date().toISOString(),
                };
                onMessage(userMessage);
              } else if (
                isBotMessage &&
                !processedMessages.has(botMessageKey)
              ) {
                processedMessages.add(botMessageKey);
                const assistantMessage: Message = {
                  id: `assistant-${Date.now()}-${Math.random()}`,
                  role: "assistant",
                  content: text,
                  timestamp: new Date().toISOString(),
                };
                onMessage(assistantMessage);
              }
            }
          });
        });
      });

      // Observar mudanças no DOM do messenger
      const messengerElement = document.querySelector("df-messenger");
      if (messengerElement) {
        observer.observe(messengerElement, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }

      // Cleanup
      return () => {
        document.removeEventListener(
          "df-user-sent",
          handleUserSent as EventListener
        );
        document.removeEventListener(
          "df-agent-response",
          handleAgentResponse as EventListener
        );
        document.removeEventListener(
          "df-messenger-loaded",
          handleMessengerLoaded
        );
        document.removeEventListener(
          "df-messenger-opened",
          handleMessengerOpened
        );
        observer.disconnect();
      };
    };

    // Aguardar o carregamento do script
    const initMessenger = () => {
      if (typeof window !== "undefined") {
        cleanup = setupEventListeners();
      }
    };

    // Limpar dados do Dialogflow no sessionStorage quando mudar de conversa
    const clearDialogflowSessionStorage = () => {
      const dialogflowKeys = [
        'df-messenger-messages',
        'df-messenger-sessionID',
        'df-messenger-welcomeIntentTriggered',
        'df-messenger-lastResponseInstant'
      ];
      
      dialogflowKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (error) {
          console.log(`Erro ao remover ${key}:`, error);
        }
      });
    };

    // Limpar histórico quando mudar de conversa
    clearDialogflowHistory();
    clearDialogflowSessionStorage();

    // Aguardar o script carregar
    const checkScript = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        document.querySelector("df-messenger")
      ) {
        clearInterval(checkScript);
        clearDialogflowHistory();
        clearDialogflowSessionStorage();
        initMessenger();
      }
    }, 200);

    // Timeout de segurança
    setTimeout(() => {
      clearInterval(checkScript);
      clearDialogflowHistory();
      clearDialogflowSessionStorage();
      initMessenger();
    }, 5000);

    return () => {
      clearInterval(checkScript);
      if (cleanup) {
        cleanup();
      }
    };
  }, [conversation.id, onMessage, onConversationStart]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
      />
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        df-messenger {
          z-index: 10;
          position: relative;
          --df-messenger-font-color: #000;
          --df-messenger-font-family: Google Sans;
          --df-messenger-chat-background: #f3f6fc;
          --df-messenger-message-user-background: #d3e3fd;
          --df-messenger-message-bot-background: #fff;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div className="relative h-full w-full flex flex-col">
        <df-messenger
          key={conversation.id}
          project-id="iasm-governadoria-prod"
          agent-id="f13baa59-1f3d-4699-98aa-88eed213b838"
          language-code="pt-br"
          max-query-length="-1"
        >
          <df-messenger-chat chat-title="Faça perguntas sobre os projetos" />
        </df-messenger>
      </div>
    </>
  );
}
