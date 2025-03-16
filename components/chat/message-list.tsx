import { Message } from "ai"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FlightButtons } from "./flight-buttons"
import { QuickOptions } from "./quick-options"
import { FlightStep } from "./flight-conversation"

type MessageListProps = {
  messages: Message[]
  flightStep: FlightStep | null
  isLoading: boolean
  onQuickOptionSelect: (option: string) => void
  onFlightOptionSelect: (step: FlightStep, choice: string) => void
}

export function MessageList({
  messages,
  flightStep,
  isLoading,
  onQuickOptionSelect,
  onFlightOptionSelect
}: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
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
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.content }}></p>

              {/* Show quick option buttons after the first assistant message */}
              {message.role === "assistant" && index === 0 && messages.length === 1 && (
                <QuickOptions onSelect={onQuickOptionSelect} />
              )}

              {/* Show flight conversation buttons based on current step */}
              {message.role === "assistant" &&
                index === messages.length - 1 &&
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
