"use client"

import { CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { useChatState } from "@/hooks/use-chat-state"

export function ChatInput() {
  const { input, handleInputChange, handleSubmit, isLoading } = useChatState()

  return (
    <CardFooter className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about flights, hotels, or entertainment..."
          className="flex-1 bg-background border-border focus-visible:ring-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </CardFooter>
  )
}

