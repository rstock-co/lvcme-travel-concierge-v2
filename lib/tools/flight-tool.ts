import { StructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { MOCK_FLIGHTS } from "@/lib/types/travel"

// In a real application, this would call an actual flight API
async function fetchFlights(departureCity: string, departureDate: string, returnDate: string, budget?: number) {
  console.log(`Searching for flights from ${departureCity} to Las Vegas`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter mock data based on parameters
  let departureFlights = MOCK_FLIGHTS.departureFlights
  let returnFlights = MOCK_FLIGHTS.returnFlights

  // Filter by departure city if provided
  if (departureCity) {
    departureFlights = departureFlights.filter((flight) =>
      flight.departureCity.toLowerCase().includes(departureCity.toLowerCase()),
    )
  }

  // Filter by budget if provided
  if (budget) {
    departureFlights = departureFlights.filter((flight) => flight.price <= budget / 2)
    returnFlights = returnFlights.filter((flight) => flight.price <= budget / 2)
  }

  // Sort by price (lowest first)
  departureFlights = departureFlights.sort((a, b) => a.price - b.price)
  returnFlights = returnFlights.sort((a, b) => a.price - b.price)

  return {
    departureFlights,
    returnFlights,
  }
}

export function searchFlights(courseData: any) {
  return new StructuredTool({
    name: "searchFlights",
    description: "Search for flights to Las Vegas based on user preferences",
    schema: z.object({
      departureCity: z.string().describe("The city the user is departing from"),
      departureDate: z.string().describe("The date the user needs to depart (YYYY-MM-DD)"),
      returnDate: z.string().describe("The date the user needs to return (YYYY-MM-DD)"),
      budget: z.number().optional().describe("Maximum budget for flights (round trip)"),
    }),
    func: async ({ departureCity, departureDate, returnDate, budget }) => {
      try {
        const flights = await fetchFlights(departureCity, departureDate, returnDate, budget)

        return JSON.stringify({
          success: true,
          departureFlights: flights.departureFlights.slice(0, 3), // Limit to top 3 options
          returnFlights: flights.returnFlights.slice(0, 3),
          message: `Found ${flights.departureFlights.length} outbound and ${flights.returnFlights.length} return flights from ${departureCity} to Las Vegas.`,
        })
      } catch (error) {
        console.error("Error searching flights:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to search for flights at this time. Please try again later.",
        })
      }
    },
  })
}

export function selectFlight() {
  return new StructuredTool({
    name: "selectFlight",
    description: "Select a flight for the user's travel plan",
    schema: z.object({
      flightId: z.string().describe("The ID of the selected flight"),
      flightType: z.enum(["departure", "return"]).describe("Whether this is a departure or return flight"),
    }),
    func: async ({ flightId, flightType }) => {
      try {
        // Find the flight in our mock data
        const flights = flightType === "departure" ? MOCK_FLIGHTS.departureFlights : MOCK_FLIGHTS.returnFlights

        const selectedFlight = flights.find((f) => f.id === flightId)

        if (!selectedFlight) {
          return JSON.stringify({
            success: false,
            message: `Flight with ID ${flightId} not found.`,
          })
        }

        return JSON.stringify({
          success: true,
          selectedFlight,
          flightType,
          message: `Successfully selected ${selectedFlight.airline} flight ${selectedFlight.flightNumber} from ${selectedFlight.departureCity} to ${selectedFlight.arrivalCity} for ${flightType === "departure" ? "outbound" : "return"} journey.`,
        })
      } catch (error) {
        console.error("Error selecting flight:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to select flight at this time. Please try again later.",
        })
      }
    },
  })
}

