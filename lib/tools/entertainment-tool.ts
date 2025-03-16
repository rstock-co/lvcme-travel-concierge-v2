import { StructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { MOCK_ENTERTAINMENT } from "@/lib/types/travel"

// In a real application, this would call an actual entertainment API
async function fetchEntertainment(preferences: string[], dates: string[], budget?: number) {
  console.log(`Searching for entertainment options in Las Vegas`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter mock data based on parameters
  let activities = [...MOCK_ENTERTAINMENT]

  // Filter by preferences if provided
  if (preferences && preferences.length > 0) {
    activities = activities.filter((activity) =>
      preferences.some(
        (pref) =>
          activity.type.toLowerCase().includes(pref.toLowerCase()) ||
          activity.name.toLowerCase().includes(pref.toLowerCase()) ||
          activity.description.toLowerCase().includes(pref.toLowerCase()),
      ),
    )
  }

  // Filter by budget if provided
  if (budget) {
    activities = activities.filter((activity) => activity.price <= budget)
  }

  // Sort by rating (highest first)
  activities = activities.sort((a, b) => b.rating - a.rating)

  return activities
}

export function searchEntertainment() {
  return new StructuredTool({
    name: "searchEntertainment",
    description: "Search for entertainment options in Las Vegas based on user preferences",
    schema: z.object({
      preferences: z.array(z.string()).describe("User entertainment preferences (e.g., shows, dining, excursions)"),
      dates: z.array(z.string()).describe("Dates when the user is available (YYYY-MM-DD)"),
      budget: z.number().optional().describe("Maximum budget for entertainment"),
    }),
    func: async ({ preferences, dates, budget }) => {
      try {
        const activities = await fetchEntertainment(preferences, dates, budget)

        return JSON.stringify({
          success: true,
          activities: activities.slice(0, 4), // Limit to top 4 options
          message: `Found ${activities.length} entertainment options in Las Vegas.`,
        })
      } catch (error) {
        console.error("Error searching entertainment:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to search for entertainment at this time. Please try again later.",
        })
      }
    },
  })
}

export function selectEntertainment() {
  return new StructuredTool({
    name: "selectEntertainment",
    description: "Select an entertainment option for the user's travel plan",
    schema: z.object({
      entertainmentId: z.string().describe("The ID of the selected entertainment option"),
    }),
    func: async ({ entertainmentId }) => {
      try {
        // Find the entertainment in our mock data
        const selectedEntertainment = MOCK_ENTERTAINMENT.find((e) => e.id === entertainmentId)

        if (!selectedEntertainment) {
          return JSON.stringify({
            success: false,
            message: `Entertainment option with ID ${entertainmentId} not found.`,
          })
        }

        return JSON.stringify({
          success: true,
          selectedEntertainment,
          message: `Successfully selected ${selectedEntertainment.name} for your entertainment.`,
        })
      } catch (error) {
        console.error("Error selecting entertainment:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to select entertainment at this time. Please try again later.",
        })
      }
    },
  })
}

