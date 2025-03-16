import { type NextRequest } from "next/server"
import { streamText } from "ai"
import { openai } from '@ai-sdk/openai'
import { MOCK_COURSE_DATA } from "@/hooks/use-course-data"
import { SYSTEM_PROMPT } from "@/constants/system-prompts"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { messages } = body

    console.log("Received messages:", JSON.stringify(messages, null, 2))

    // Check if OpenAI API key is set
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key is not set")
    }
    console.log("OpenAI API Key available:", !!apiKey)

    // Use mock data for now
    const courseDetails = MOCK_COURSE_DATA

    // Create the system prompt with course data
    const systemPrompt = SYSTEM_PROMPT(courseDetails)
    console.log("System prompt:", systemPrompt)

    // Ensure messages are in the correct format
    if (!Array.isArray(messages) || messages.length === 0) {
      // If no valid messages, use a test message
      messages = [{ role: "user", content: "Tell me about flights to Las Vegas" }]
      console.log("Using test message:", JSON.stringify(messages, null, 2))
    }

    console.log("Creating streamText with model and messages")

    // Use streamText to create a streaming text response
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      system: systemPrompt
    })

    console.log("StreamText result created, returning toDataStreamResponse")

    // Return the data stream response that the useChat hook can consume
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(
      JSON.stringify({ error: "There was an error processing your request", details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
