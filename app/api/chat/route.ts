import { type NextRequest } from "next/server"
import { streamText } from "ai"
import { openai } from '@ai-sdk/openai'
import { MOCK_COURSE_DATA } from "@/hooks/use-course-data"
import { SYSTEM_PROMPT } from "@/constants/system-prompts"
import { fetchCourse, formatDate } from "@/lib/supabase"

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

    // Fetch course data from Supabase
    const course = await fetchCourse()

    // Use course data if available, otherwise fall back to mock data
    const courseDetails = course || MOCK_COURSE_DATA

    if (course) {
      console.log("Using course data from Supabase:", JSON.stringify(course, null, 2))
    } else {
      console.log("Using mock course data:", JSON.stringify(MOCK_COURSE_DATA, null, 2))
    }

    // Create the system prompt with course data
    const systemPrompt = SYSTEM_PROMPT(courseDetails)
    console.log("System prompt:", systemPrompt)

    // Ensure messages are in the correct format
    if (!Array.isArray(messages) || messages.length === 0) {
      // If no valid messages, create a welcome message with course details
      const startDate = course?.start_date ? formatDate(course.start_date) : "the scheduled dates"
      const endDate = course?.end_date ? formatDate(course.end_date) : ""
      const venue = course?.venue || "the venue"
      const courseName = course?.name || "your course"

      const dateRange = endDate ? `from ${startDate} to ${endDate}` : `starting on ${startDate}`

      messages = [{
        role: "user",
        content: `I just booked "${courseName}" at ${venue} ${dateRange}. Can you help me with travel arrangements?`
      }]
      console.log("Using welcome message with course details:", JSON.stringify(messages, null, 2))
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
