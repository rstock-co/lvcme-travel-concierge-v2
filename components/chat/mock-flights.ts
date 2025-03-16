import { FlightData } from "../flight-card"

// Airport info as returned from the API
export interface AirportInfo {
  correctedCity: string
  region: string
  country: string
  airportName: string
  iataCode: string
}

// Generate mock flight data based on the user's preferences
export function getMockFlights(
  preferences: Record<string, string>,
  courseDetails: { startDate?: string; endDate?: string } | null,
  departureAirportInfo?: AirportInfo // Now accepting airport info from API
): FlightData[] {
  // Default airports and cities
  const arrivalCity = "Las Vegas"
  const arrivalState = "NV"
  const arrivalAirport = "Harry Reid International Airport"
  const arrivalCode = "LAS"

  // Use the API-provided airport info if available
  const departureCity = departureAirportInfo?.correctedCity || "Vancouver"
  const departureState = departureAirportInfo?.region || "British Columbia"
  const departureAirport = departureAirportInfo?.airportName || "Vancouver International Airport"
  const departureCode = departureAirportInfo?.iataCode || "YVR"

  // Get cabin class from preferences
  const cabinClass = preferences.cabin_class || "Economy"

  // Generate appropriate dates based on course dates
  const departureDate = courseDetails?.startDate
    ? new Date(new Date(courseDetails.startDate).getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : "9 April, 2024"

  const returnDate = courseDetails?.endDate
    ? new Date(new Date(courseDetails.endDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : "16 April, 2024"

  // Generate different flight options with variations
  return [
    {
      id: "UA2458",
      airline: {
        name: "United Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 458,
        currency: "USD",
      },
      departure: {
        date: departureDate,
        time: "7:45 AM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      arrival: {
        date: departureDate,
        time: "9:30 AM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      stops: [],
      cabin: cabinClass,
      passengers: 1,
      duration: "1h 45m",
      tripType: "Round Trip",
    },
    {
      id: "DL1932",
      airline: {
        name: "Delta Air Lines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 379,
        currency: "USD",
      },
      departure: {
        date: departureDate,
        time: "10:15 AM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      arrival: {
        date: departureDate,
        time: "12:05 PM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      stops: [],
      cabin: cabinClass,
      passengers: 1,
      duration: "1h 50m",
      tripType: "Round Trip",
    },
    {
      id: "AA4587",
      airline: {
        name: "American Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 324,
        currency: "USD",
      },
      departure: {
        date: departureDate,
        time: "2:30 PM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      arrival: {
        date: departureDate,
        time: "4:20 PM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      stops: [
        {
          airport: "Los Angeles International Airport",
          code: "LAX",
          duration: "1h 15m"
        }
      ],
      cabin: cabinClass,
      passengers: 1,
      duration: "3h 50m",
      tripType: "Round Trip",
    },
    {
      id: "WN1234",
      airline: {
        name: "Southwest Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 299,
        currency: "USD",
      },
      departure: {
        date: departureDate,
        time: "6:40 AM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      arrival: {
        date: departureDate,
        time: "8:35 AM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      stops: [],
      cabin: cabinClass,
      passengers: 1,
      duration: "1h 55m",
      tripType: "Round Trip",
    },
    // Return flights
    {
      id: "UA2459",
      airline: {
        name: "United Airlines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 462,
        currency: "USD",
      },
      departure: {
        date: returnDate,
        time: "10:15 AM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      arrival: {
        date: returnDate,
        time: "12:00 PM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      stops: [],
      cabin: cabinClass,
      passengers: 1,
      duration: "1h 45m",
      tripType: "Round Trip",
    },
    {
      id: "DL1933",
      airline: {
        name: "Delta Air Lines",
        logo: "/placeholder.svg?height=40&width=40",
      },
      price: {
        amount: 382,
        currency: "USD",
      },
      departure: {
        date: returnDate,
        time: "3:30 PM",
        city: arrivalCity,
        state: arrivalState,
        airport: arrivalAirport,
        code: arrivalCode,
      },
      arrival: {
        date: returnDate,
        time: "5:25 PM",
        city: departureCity,
        state: departureState,
        airport: departureAirport,
        code: departureCode,
      },
      stops: [],
      cabin: cabinClass,
      passengers: 1,
      duration: "1h 55m",
      tripType: "Round Trip",
    }
  ]
}
