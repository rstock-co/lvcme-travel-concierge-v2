import { StructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { MOCK_HOTELS } from "@/lib/types/travel"

// In a real application, this would call an actual hotel API
async function fetchHotels(
  venueLocation: string,
  checkIn: string,
  checkOut: string,
  budget?: number,
  amenities?: string[],
) {
  console.log(`Searching for hotels near ${venueLocation} in Las Vegas`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter mock data based on parameters
  let hotels = [...MOCK_HOTELS]

  // Calculate number of nights
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  // Update total price based on nights
  hotels = hotels.map((hotel) => ({
    ...hotel,
    nights,
    totalPrice: hotel.pricePerNight * nights,
  }))

  // Filter by budget if provided
  if (budget) {
    const maxPerNight = budget / nights
    hotels = hotels.filter((hotel) => hotel.pricePerNight <= maxPerNight)
  }

  // Filter by amenities if provided
  if (amenities && amenities.length > 0) {
    hotels = hotels.filter((hotel) =>
      amenities.every((amenity) => hotel.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))),
    )
  }

  // Sort by distance to venue (closest first)
  hotels = hotels.sort((a, b) => a.distance - b.distance)

  return hotels
}

export function searchHotels(courseData: any) {
  return new StructuredTool({
    name: "searchHotels",
    description: "Search for hotels near the venue in Las Vegas based on user preferences",
    schema: z.object({
      venueLocation: z.string().describe("The location of the course venue"),
      checkIn: z.string().describe("Check-in date (YYYY-MM-DD)"),
      checkOut: z.string().describe("Check-out date (YYYY-MM-DD)"),
      budget: z.number().optional().describe("Maximum budget for the entire stay"),
      amenities: z.array(z.string()).optional().describe("Desired amenities (e.g., pool, spa, etc.)"),
    }),
    func: async ({ venueLocation, checkIn, checkOut, budget, amenities }) => {
      try {
        const hotels = await fetchHotels(venueLocation, checkIn, checkOut, budget, amenities)

        return JSON.stringify({
          success: true,
          hotels: hotels.slice(0, 4), // Limit to top 4 options
          message: `Found ${hotels.length} hotels near ${venueLocation} in Las Vegas.`,
        })
      } catch (error) {
        console.error("Error searching hotels:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to search for hotels at this time. Please try again later.",
        })
      }
    },
  })
}

export function selectHotel() {
  return new StructuredTool({
    name: "selectHotel",
    description: "Select a hotel for the user's travel plan",
    schema: z.object({
      hotelId: z.string().describe("The ID of the selected hotel"),
    }),
    func: async ({ hotelId }) => {
      try {
        // Find the hotel in our mock data
        const selectedHotel = MOCK_HOTELS.find((h) => h.id === hotelId)

        if (!selectedHotel) {
          return JSON.stringify({
            success: false,
            message: `Hotel with ID ${hotelId} not found.`,
          })
        }

        return JSON.stringify({
          success: true,
          selectedHotel,
          message: `Successfully selected ${selectedHotel.name} hotel for your stay.`,
        })
      } catch (error) {
        console.error("Error selecting hotel:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to select hotel at this time. Please try again later.",
        })
      }
    },
  })
}

