"use client"

import { useRef, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useChatState } from "@/hooks/use-chat-state"
import { renderStructuredContent } from "@/lib/ai/content-renderer"

export function ChatMessages() {
  const { messages, isLoading } = useChatState()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4 px-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8 mr-2 mt-1">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
              <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              "max-w-[80%] rounded-2xl p-4 shadow-sm",
              message.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted rounded-tl-none",
            )}
          >
            {message.role === "assistant" ? (
              renderStructuredContent(message.content)
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
          {message.role === "user" && (
            <Avatar className="h-8 w-8 ml-2 mt-1">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">MD</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
          </Avatar>
          <div className="max-w-[80%] rounded-2xl p-4 bg-muted rounded-tl-none shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <span
                  className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </CardContent>
  )
}

