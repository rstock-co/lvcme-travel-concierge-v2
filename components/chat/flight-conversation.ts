import { Message } from "ai"
import { Dispatch, SetStateAction } from "react"

// Flight conversation flow steps
export type FlightStep =
  | "departure_location"
  | "confirm_departure"
  | "arrival_timing"
  | "travel_dates"
  | "companions"
  | "cabin_class"
  | "layovers"
  | "departure_time"
  | "summary"

// Map common city inputs to their full details
// In a real app, this would use an API or database
export const locationMap: Record<string, { city: string, state: string, country: string, airport: string, code: string }> = {
  'winnipeg': {
    city: 'Winnipeg',
    state: 'Manitoba',
    country: 'Canada',
    airport: 'Winnipeg James Armstrong Richardson International Airport',
    code: 'YWG'
  },
  'vancouver': {
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
    airport: 'Vancouver International Airport',
    code: 'YVR'
  },
  'vncover': { // Handle common misspelling
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
    airport: 'Vancouver International Airport',
    code: 'YVR'
  },
  'toronto': {
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    airport: 'Toronto Pearson International Airport',
    code: 'YYZ'
  },
  'new york': {
    city: 'New York City',
    state: 'NY',
    country: 'USA',
    airport: 'John F. Kennedy International Airport',
    code: 'JFK'
  },
  'los angeles': {
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    airport: 'Los Angeles International Airport',
    code: 'LAX'
  },
  'chicago': {
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    airport: "O'Hare International Airport",
    code: 'ORD'
  },
  'london': {
    city: 'London',
    state: 'England',
    country: 'UK',
    airport: 'Heathrow Airport',
    code: 'LHR'
  },
  'paris': {
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    airport: 'Charles de Gaulle Airport',
    code: 'CDG'
  },
  'tokyo': {
    city: 'Tokyo',
    state: '',
    country: 'Japan',
    airport: 'Narita International Airport',
    code: 'NRT'
  },
  'sydney': {
    city: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    airport: 'Sydney Airport',
    code: 'SYD'
  }
}

// Simulate AI understanding the departure location and providing a confirmation
export const simulateDepartureConfirmation = (
  location: string,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  setFlightStep: Dispatch<SetStateAction<FlightStep | null>>
) => {
  // Simulate typing effect
  const typingMessage: Message = {
    id: `typing-${Date.now()}`,
    role: "assistant",
    content: "..."
  }

  // Add typing indicator
  setMessages(prev => [...prev, typingMessage])

  // After a delay, replace with the confirmation message
  setTimeout(() => {
    // Normalize the input to handle case and common typos
    const normalizedInput = location.toLowerCase().trim()

    // Find the closest match in our map
    // In a real app, this would use fuzzy matching or an API
    let match = null
    for (const [key, value] of Object.entries(locationMap)) {
      if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
        match = value
        break
      }
    }

    // Default to a generic response if no match is found
    if (!match) {
      // For demo purposes, we'll use Vancouver as a fallback
      match = locationMap['vancouver']
    }

    // Create the confirmation message - EXACT format as required
    const confirmationMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: `To confirm, you'd like to fly from ${match.city}, ${match.state}, ${match.country} from ${match.airport} (${match.code})?`
    }

    // Replace typing indicator with the confirmation message
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.id !== typingMessage.id)
      return [...filtered, confirmationMessage]
    })

    // Set the next step to confirm_departure
    setFlightStep("confirm_departure")
  }, 1500) // Simulate typing for 1.5 seconds
}

// Simulate AI response for the current flight step
export const simulateAIResponse = (
  step: FlightStep,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  courseDetails: { startDate?: string; endDate?: string } | null
) => {
  // Determine the next question based on the current flight step
  let nextQuestion = ""

  switch(step) {
    case "departure_location":
      nextQuestion = "Where will you be departing from? You can provide your city or preferred departure airport."
      break
    case "arrival_timing":
      nextQuestion = `Based on your course schedule, you'll need to arrive in Las Vegas before ${courseDetails?.startDate} and can depart after ${courseDetails?.endDate}. Would you like to:`
      break
    case "travel_dates":
      nextQuestion = "What are your preferred departure and return dates?"
      break
    case "companions":
      nextQuestion = "Will you be traveling alone or with companions?"
      break
    case "cabin_class":
      nextQuestion = "What cabin class would you prefer to travel in?"
      break
    case "layovers":
      nextQuestion = "What flexibility do you have for layovers?"
      break
    case "departure_time":
      nextQuestion = "Do you have any preferences for departure times?"
      break
    case "summary":
      nextQuestion = "Thank you for sharing your preferences. I'll search for flight options that meet these criteria, one moment please..."
      break
  }

  if (nextQuestion) {
    // Simulate typing effect
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
        content: nextQuestion
      }

      // Replace typing indicator with the actual message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessage.id)
        return [...filtered, newMessage]
      })
    }, 1500) // Simulate typing for 1.5 seconds
  }
}

// Display a summary of flight preferences
export const displayFlightSummary = (
  flightPreferences: Partial<Record<FlightStep, string>>,
  setMessages: Dispatch<SetStateAction<Message[]>>
) => {
  setTimeout(() => {
    // Create a summary message with all the preferences
    const summaryMessage: Message = {
      id: `summary-${Date.now()}`,
      role: "assistant",
      content: `
        <div class="flight-summary">
          <h3>Flight Preferences</h3>
          <h4>To summarize, you're looking for:</h4>
          <ul>
            ${flightPreferences.departure_location ? `<li>Departure: ${flightPreferences.departure_location}</li>` : ''}
            ${flightPreferences.arrival_timing ? `<li>Arrival: ${flightPreferences.arrival_timing}</li>` : ''}
            ${flightPreferences.travel_dates ? `<li>Travel dates: ${flightPreferences.travel_dates}</li>` : ''}
            ${flightPreferences.companions ? `<li>Traveling: ${flightPreferences.companions}</li>` : ''}
            ${flightPreferences.cabin_class ? `<li>Cabin class: ${flightPreferences.cabin_class}</li>` : ''}
            ${flightPreferences.layovers ? `<li>Layover preference: ${flightPreferences.layovers}</li>` : ''}
            ${flightPreferences.departure_time ? `<li>Departure time: ${flightPreferences.departure_time}</li>` : ''}
          </ul>
        </div>
      `
    }

    // Add the summary message
    setMessages(prev => [...prev, summaryMessage])

    // After showing the summary, display flight options
    setTimeout(() => {
      const flightOptionsMessage: Message = {
        id: `flight-options-${Date.now()}`,
        role: "assistant",
        content: "I've found several flight options that match your preferences. Here are the top recommendations:"
      }

      setMessages(prev => [...prev, flightOptionsMessage])
    }, 2000)
  }, 1500)
}
