import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { ChatOpenAI } from "@langchain/openai"
import type { BaseMessage } from "@langchain/core/messages"
import { SYSTEM_PROMPT } from "@/constants/system-prompts"

// Define types for course data
interface CourseData {
  courseName: string
  venue: string
  startDate: string
  endDate: string
  [key: string]: unknown
}

// Define types for chat messages
interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export function createTravelAgent(courseData: CourseData) {
  // Create the system prompt with course data
  const systemPrompt = SYSTEM_PROMPT(courseData)

  // Initialize the LLM with gpt-3.5-turbo
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  })

  return {
    systemPrompt,

    // For non-streaming operations
    invoke: async ({ messages, input }: { messages: BaseMessage[], input: string }) => {
      try {
        const response = await llm.invoke([
          new SystemMessage(systemPrompt),
          ...messages,
          new HumanMessage(input)
        ])

        return { content: response.content }
      } catch (error) {
        console.error("Error in travel agent:", error)
        return { content: "I'm sorry, I encountered an error while processing your request." }
      }
    }
  }
}

// Helper function to convert chat history to LangChain message format
export function convertMessagesToLangChainFormat(messages: ChatMessage[]): BaseMessage[] {
  return messages.map((message) => {
    if (message.role === "user") {
      return new HumanMessage(message.content)
    } else if (message.role === "assistant") {
      return new AIMessage(message.content)
    } else {
      return new SystemMessage(message.content)
    }
  })
}
