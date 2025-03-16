"use client"

import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchCourse, formatDate } from "@/lib/supabase"
import { Message } from "ai"
import { RefreshCw } from "lucide-react"

export function Chat() {
  const [courseDetails, setCourseDetails] = useState<{
    name?: string;
    venue?: string;
    startDate?: string;
    endDate?: string;
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  // Generate a unique ID for this chat session
  const [chatId] = useState(`chat-${Date.now()}`)

  // Initialize chat with empty messages until course data is loaded
  const [initialMessages, setInitialMessages] = useState<Message[]>([])

  // Function to load course details
  const loadCourseDetails = async () => {
    try {
      setIsLoading(true)
      const course = await fetchCourse()

      if (course) {
        const details = {
          name: course.name || '',
          venue: course.venue || 'Las Vegas',
          startDate: course.start_date ? formatDate(course.start_date) : 'TBD',
          endDate: course.end_date ? formatDate(course.end_date) : 'TBD'
        }

        setCourseDetails(details)
        console.log("Course details set:", details)

        // Create welcome message after course data is loaded
        const welcomeMsg = `Hey there! I noticed you just booked "${details.name}" at ${details.venue} from ${details.startDate} to ${details.endDate}. Would you like assistance with booking flights, hotels, or entertainment during your stay in Vegas?`

        // Set initial messages with the welcome message
        setInitialMessages([{
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: welcomeMsg
        }])
      } else {
        console.log("No course data returned from fetchCourse")
        // Fallback welcome message if no course data
        const welcomeMsg = "Hey there! Would you like assistance with booking flights, hotels, or entertainment during your stay in Vegas?"

        // Set initial messages with the fallback welcome message
        setInitialMessages([{
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: welcomeMsg
        }])
      }
    } catch (error) {
      console.error("Error fetching course details:", error)
      // Fallback welcome message on error
      const welcomeMsg = "Hey there! Would you like assistance with booking flights, hotels, or entertainment during your stay in Vegas?"

      // Set initial messages with the fallback welcome message
      setInitialMessages([{
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: welcomeMsg
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Reset the chat
  const resetChat = () => {
    window.location.reload()
  }

  // Fetch course details on component mount
  useEffect(() => {
    loadCourseDetails()
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading: isChatLoading } = useChat({
    id: chatId,
    initialMessages
  })

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Travel Concierge</CardTitle>
          <CardDescription>
            {courseDetails
              ? `Planning your trip to ${courseDetails.venue} for ${courseDetails.name}`
              : "Your AI-powered travel assistant"}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={resetChat}
          title="Start a new conversation"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] pr-4 overflow-y-auto">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/bot-avatar.png" />
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <p className="text-sm">Loading course information...</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
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
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarFallback>You</AvatarFallback>
                        <AvatarImage src="/user-avatar.png" />
                      </Avatar>
                    )}
                  </div>
                </div>
              ))
            )}
            {isChatLoading && (
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
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about flights, hotels, or things to do..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || isChatLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
