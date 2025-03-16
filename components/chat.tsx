"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCourse, formatDate } from "@/lib/supabase"
import { Message } from "ai"
import { RefreshCw } from "lucide-react"
import { FlightStep, simulateDepartureConfirmation, simulateAIResponse, displayFlightSummary } from "./chat/flight-conversation"
import { MessageList } from "./chat/message-list"

export function Chat() {
  const [courseDetails, setCourseDetails] = useState<{
    name?: string;
    venue?: string;
    startDate?: string;
    endDate?: string;
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  // Track conversation flow for flights
  const [flightStep, setFlightStep] = useState<FlightStep | null>(null)

  // Store flight preferences
  const [flightPreferences, setFlightPreferences] = useState<Partial<Record<FlightStep, string>>>({})

  // Initialize chat with empty messages until course data is loaded
  const [initialMessages, setInitialMessages] = useState<Message[]>([])

  // Use our own version of chat
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

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
        const welcomeMsg = `Hey there! I noticed you just booked "${details.name}" at ${details.venue} from ${details.startDate} to ${details.endDate}. Would you like assistance with booking any of the following?`

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

  // Set initial messages when course data is loaded
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  // Fetch course details on component mount
  useEffect(() => {
    loadCourseDetails()
  }, [])

  // Reset the chat
  const resetChat = () => {
    window.location.reload()
  }

  // Handle quick option selection
  const handleQuickOption = (option: string) => {
    const optionMessages = {
      flights: "I need help booking flights to Las Vegas for my course.",
      hotel: "I need help finding a hotel near the venue.",
      entertainment: "What entertainment options are available during my stay?"
    }

    const message = optionMessages[option as keyof typeof optionMessages]

    // Create a user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message
    }

    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage])

    // If flights option is selected, start the flight conversation flow
    if (option === "flights") {
      // Simulate typing effect for AI response
      setTimeout(() => {
        const typingMessage: Message = {
          id: `typing-${Date.now()}`,
          role: "assistant",
          content: "..."
        }

        // Add typing indicator
        setMessages(prev => [...prev, typingMessage])

        // After a delay, replace with the actual message
        setTimeout(() => {
          // Create a new assistant message
          const newMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: "I'd be happy to help you book flights to Las Vegas for your course. Let me ask you a few questions to find the best options for you."
          }

          // Replace typing indicator with the actual message
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== typingMessage.id)
            return [...filtered, newMessage]
          })

          // Start the flight conversation flow
          setTimeout(() => {
            setFlightStep("departure_location")
            simulateAIResponse("departure_location", setMessages, courseDetails)
          }, 1000)
        }, 1500)
      }, 1000)
    }
  }

  // Handle flight conversation flow
  const handleFlightOption = (step: FlightStep, choice: string) => {
    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: choice
    }

    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage])

    // Store the user's choice for this step
    setFlightPreferences(prev => ({
      ...prev,
      [step]: choice
    }))

    // Handle different flight steps
    switch(step) {
      case "departure_location":
        // For departure_location, we need to simulate the AI understanding the location
        // and providing a confirmation with the full details
        simulateDepartureConfirmation(choice, setMessages, setFlightStep)
        return // Exit early as we're handling this specially

      case "confirm_departure":
        setTimeout(() => {
          setFlightStep("arrival_timing")
          simulateAIResponse("arrival_timing", setMessages, courseDetails)
        }, 1000)
        break

      case "arrival_timing":
        if (choice.includes("extra days")) {
          setTimeout(() => {
            setFlightStep("travel_dates")
            simulateAIResponse("travel_dates", setMessages, courseDetails)
          }, 1000)
        } else {
          setTimeout(() => {
            setFlightStep("companions")
            simulateAIResponse("companions", setMessages, courseDetails)
          }, 1000)
        }
        break

      case "travel_dates":
        setTimeout(() => {
          setFlightStep("companions")
          simulateAIResponse("companions", setMessages, courseDetails)
        }, 1000)
        break

      case "companions":
        if (choice === "With companions") {
          // Ask follow-up question about number of companions
          setTimeout(() => {
            const followUpMessage: Message = {
              id: `assistant-followup-${Date.now()}`,
              role: "assistant",
              content: "How many people will be traveling with you? This helps me find flights with enough available seats."
            }
            setMessages(prev => [...prev, followUpMessage])
          }, 1000)
          return // Exit early
        }

        setTimeout(() => {
          setFlightStep("cabin_class")
          simulateAIResponse("cabin_class", setMessages, courseDetails)
        }, 1000)
        break

      case "cabin_class":
        setTimeout(() => {
          setFlightStep("layovers")
          simulateAIResponse("layovers", setMessages, courseDetails)
        }, 1000)
        break

      case "layovers":
        setTimeout(() => {
          setFlightStep("departure_time")
          simulateAIResponse("departure_time", setMessages, courseDetails)
        }, 1000)
        break

      case "departure_time":
        setTimeout(() => {
          setFlightStep("summary")
          simulateAIResponse("summary", setMessages, courseDetails)

          // Display flight summary after a delay
          setTimeout(() => {
            displayFlightSummary(flightPreferences, setMessages)
            setFlightStep(null)
          }, 2000)
        }, 1000)
        break
    }
  }

  // Custom handleSubmit function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input
    }

    // Add user message to chat
    setMessages(prev => [...prev, userMessage])

    // Clear input
    setInput("")

    // Handle user input based on the current flight step
    if (flightStep === "departure_location") {
      // Process the location input
      setTimeout(() => {
        simulateDepartureConfirmation(userMessage.content, setMessages, setFlightStep)
      }, 1000)
    } else {
      // For other inputs, just simulate a generic response
      setIsChatLoading(true)
      setTimeout(() => {
        const aiMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "I understand. Let me help you with that."
        }
        setMessages(prev => [...prev, aiMessage])
        setIsChatLoading(false)
      }, 1500)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Travel Concierge</CardTitle>
          <CardDescription>
            {courseDetails
              ? `Planning your trip to ${courseDetails.venue} |  ${courseDetails.startDate} - ${courseDetails.endDate}`
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
          {isLoading ? (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <p className="text-sm">Loading course information...</p>
                </div>
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              flightStep={flightStep}
              isLoading={isChatLoading}
              onQuickOptionSelect={handleQuickOption}
              onFlightOptionSelect={handleFlightOption}
            />
          )}
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
