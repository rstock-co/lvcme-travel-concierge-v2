import { Message } from "ai"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FlightButtons } from "./flight-buttons"
import { QuickOptions } from "./quick-options"
import { FlightStep } from "./flight-conversation"
import { MessageParser } from "./message-parser"
import { useState } from "react"

// Single message component to handle the useState hook properly
function ChatMessage({
  message,
  index,
  isLastMessage,
  totalMessages,
  flightStep,
  onQuickOptionSelect,
  onFlightOptionSelect,
  setMessages
}: {
  message: Message,
  index: number,
  isLastMessage: boolean,
  totalMessages: number,
  flightStep: FlightStep | null,
  onQuickOptionSelect: (option: string) => void,
  onFlightOptionSelect: (step: FlightStep, choice: string) => void,
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}) {
  const [isCurrentMessageFlightCard, setIsCurrentMessageFlightCard] = useState(false);

  // For flight cards, flight preferences, and headings, render them without a chat bubble
  const isHeading = message.content.includes('<h3 class=') &&
                   (message.content.includes('Outbound Flights') ||
                    message.content.includes('Return Flights'));

  const isFlightPreferences = message.content.includes('<flight-preferences data=');

  if (message.role === "assistant" && (isCurrentMessageFlightCard || isHeading || isFlightPreferences)) {
    return (
      <div className="w-full max-w-[90%] mx-auto">
        <MessageParser
          content={message.content}
          isFlightCard={setIsCurrentMessageFlightCard}
          setMessages={setMessages}
        />

        {/* Show flight conversation buttons based on current step */}
        {isLastMessage && flightStep && (
          <FlightButtons
            step={flightStep}
            onSelect={onFlightOptionSelect}
          />
        )}
      </div>
    );
  }

  // Regular message rendering with chat bubbles
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex items-start gap-3 max-w-[80%]">
        {message.role !== "user" && (
          <Avatar>
            <AvatarFallback>AI</AvatarFallback>
            <AvatarImage src="/bot-avatar.png" />
          </Avatar>
        )}
        <div
          className={`rounded-lg px-4 py-2 ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <div className="text-sm">
            <MessageParser
              content={message.content}
              isFlightCard={setIsCurrentMessageFlightCard}
              setMessages={setMessages}
            />
          </div>

          {/* Show quick option buttons after the first assistant message */}
          {message.role === "assistant" && index === 0 && totalMessages === 1 && (
            <QuickOptions onSelect={onQuickOptionSelect} />
          )}

          {/* Show flight conversation buttons based on current step */}
          {message.role === "assistant" &&
            isLastMessage &&
            flightStep && (
            <FlightButtons
              step={flightStep}
              onSelect={onFlightOptionSelect}
            />
          )}
        </div>
        {message.role === "user" && (
          <Avatar>
            <AvatarFallback>You</AvatarFallback>
            <AvatarImage src="/user-avatar.png" />
          </Avatar>
        )}
      </div>
    </div>
  );
}

type MessageListProps = {
  messages: Message[]
  flightStep: FlightStep | null
  isLoading: boolean
  onQuickOptionSelect: (option: string) => void
  onFlightOptionSelect: (step: FlightStep, choice: string) => void
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}

export function MessageList({
  messages,
  flightStep,
  isLoading,
  onQuickOptionSelect,
  onFlightOptionSelect,
  setMessages
}: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          index={index}
          isLastMessage={index === messages.length - 1}
          totalMessages={messages.length}
          flightStep={flightStep}
          onQuickOptionSelect={onQuickOptionSelect}
          onFlightOptionSelect={onFlightOptionSelect}
          setMessages={setMessages}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-start gap-3 max-w-[80%]">
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
              <AvatarImage src="/bot-avatar.png" />
            </Avatar>
            <div className="rounded-lg px-4 py-2 bg-muted">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
