"use client"

import { useRef, useEffect, useState } from "react"
import { CardContent } from "@/components/ui/card"
import { useChatState } from "@/hooks/use-chat-state"
import { MessageList } from "./message-list"
import { FlightStep } from "./flight-conversation"
import { Message } from "ai"

export function ChatMessages() {
  const { messages, isLoading, setMessages } = useChatState()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [flightStep, setFlightStep] = useState<FlightStep | null>(null)

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle quick option selection
  const handleQuickOptionSelect = (option: string) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: option
    }
    setMessages((prev: Message[]) => [...prev, userMessage])
  }

  // Handle flight option selection
  const handleFlightOptionSelect = (step: FlightStep, choice: string) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: choice
    }
    setMessages((prev: Message[]) => [...prev, userMessage])
  }

  return (
    <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4 px-6">
      <MessageList
        messages={messages}
        flightStep={flightStep}
        isLoading={isLoading}
        onQuickOptionSelect={handleQuickOptionSelect}
        onFlightOptionSelect={handleFlightOptionSelect}
        setMessages={setMessages}
      />
      <div ref={messagesEndRef} />
    </CardContent>
  )
}
