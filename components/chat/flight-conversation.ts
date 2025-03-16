import { Message } from "ai"
import { Dispatch, SetStateAction } from "react"
import { getMockFlights, AirportInfo } from "./mock-flights"

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

// Mock airport identification for development/demo purposes
async function mockIdentifyAirport(location: string): Promise<{ message: string, airportInfo: AirportInfo }> {
  // Simple implementation to parse common airport codes and cities
  const normalizedInput = location.toLowerCase().trim()

  // Default to Vancouver if we can't match
  let airportInfo: AirportInfo = {
    correctedCity: 'Vancouver',
    region: 'British Columbia',
    country: 'Canada',
    airportName: 'Vancouver International Airport',
    iataCode: 'YVR'
  }

  // Simple matching for demo purposes
  if (normalizedInput.includes('new york') || normalizedInput.includes('jfk')) {
    airportInfo = {
      correctedCity: 'New York City',
      region: 'New York',
      country: 'USA',
      airportName: 'John F. Kennedy International Airport',
      iataCode: 'JFK'
    }
  } else if (normalizedInput.includes('los angeles') || normalizedInput.includes('lax')) {
    airportInfo = {
      correctedCity: 'Los Angeles',
      region: 'California',
      country: 'USA',
      airportName: 'Los Angeles International Airport',
      iataCode: 'LAX'
    }
  } else if (normalizedInput.includes('toronto') || normalizedInput.includes('yyz')) {
    airportInfo = {
      correctedCity: 'Toronto',
      region: 'Ontario',
      country: 'Canada',
      airportName: 'Toronto Pearson International Airport',
      iataCode: 'YYZ'
    }
  } else if (normalizedInput.includes('london') || normalizedInput.includes('lhr')) {
    airportInfo = {
      correctedCity: 'London',
      region: 'England',
      country: 'United Kingdom',
      airportName: 'Heathrow Airport',
      iataCode: 'LHR'
    }
  }

  // Create the formatted message
  const message = `To confirm, you'd like to fly from ${airportInfo.correctedCity}, ${airportInfo.region}, ${airportInfo.country} from ${airportInfo.airportName} (${airportInfo.iataCode})?`

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { message, airportInfo }
}

// Simulate AI understanding the departure location and providing a confirmation
export const simulateDepartureConfirmation = async (
  location: string,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  setFlightStep: Dispatch<SetStateAction<FlightStep | null>>,
  setAirportInfo?: Dispatch<SetStateAction<AirportInfo | null>>
) => {
  // Simulate typing effect
  const typingMessage: Message = {
    id: `typing-${Date.now()}`,
    role: "assistant",
    content: "..."
  }

  // Add typing indicator
  setMessages(prev => [...prev, typingMessage])

  try {
    let data;

    try {
      // Try to use the real API first
      const response = await fetch('/api/identify-airport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      data = await response.json();
    } catch (apiError) {
      console.log('Using mock airport identification due to API error:', apiError);
      // Fall back to mock implementation if API is not available
      data = await mockIdentifyAirport(location);
    }

    // Create the confirmation message using the AI-provided format
    const confirmationMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: data.message
    }

    // Replace typing indicator with the confirmation message
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.id !== typingMessage.id)
      return [...filtered, confirmationMessage]
    })

    // Store the airport info if provided
    if (setAirportInfo && data.airportInfo) {
      setAirportInfo(data.airportInfo);
    }

    // Set the next step after a small delay to ensure the message is rendered first
    setTimeout(() => {
      setFlightStep("confirm_departure")
    }, 150) // Small delay to ensure the message renders before buttons
  } catch (error) {
    console.error('Error identifying airport:', error);

    // Fallback message if the API call fails
    const fallbackMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "I'm having trouble identifying that location. Could you please provide the full city name or airport code?"
    }

    // Replace typing indicator with the fallback message
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.id !== typingMessage.id)
      return [...filtered, fallbackMessage]
    })

    // Keep the step as departure_location to let the user try again
    setTimeout(() => {
      setFlightStep("departure_location")
    }, 150)
  }
}

// Simulate AI response for the current flight step
export const simulateAIResponse = (
  step: FlightStep,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  courseDetails: { startDate?: string; endDate?: string } | null,
  setFlightStep?: Dispatch<SetStateAction<FlightStep | null>>, // Optional as we don't always need to change step
  nextStep?: FlightStep // Optional next step to set after message is displayed
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

      // If we have a nextStep and setFlightStep function, set it after a small delay
      if (nextStep && setFlightStep) {
        setTimeout(() => {
          setFlightStep(nextStep)
        }, 150) // Small delay to ensure the message renders before buttons
      }
    }, 1500) // Simulate typing for 1.5 seconds
  }
}

// Display a summary of flight preferences
export const displayFlightSummary = (
  flightPreferences: Partial<Record<FlightStep, string>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  courseDetails: { startDate?: string; endDate?: string } | null,
  airportInfo?: AirportInfo | null
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

      // Generate mock flight data based on preferences
      const mockFlights = getMockFlights(flightPreferences as Record<string, string>, courseDetails, airportInfo || undefined)

      // Show outbound flights
      setTimeout(() => {
        const outboundMessage: Message = {
          id: `outbound-flights-${Date.now()}`,
          role: "assistant",
          content: "<h3 class='text-md font-semibold mt-4 mb-2'>✈️ Outbound Flights</h3>"
        }

        setMessages(prev => [...prev, outboundMessage])

        // Add outbound flights (first 4 flights in the array)
        const outboundFlights = mockFlights.slice(0, 4)
        outboundFlights.forEach((flight, index) => {
          setTimeout(() => {
            const flightCardMessage: Message = {
              id: `flight-${flight.id}-${Date.now()}`,
              role: "assistant",
              content: `<flight-card data='${JSON.stringify(flight)}' />`
            }

            setMessages(prev => [...prev, flightCardMessage])
          }, index * 300) // Stagger the flight cards for a nicer visual effect
        })

        // After outbound flights, show return flights
        setTimeout(() => {
          const returnMessage: Message = {
            id: `return-flights-${Date.now()}`,
            role: "assistant",
            content: "<h3 class='text-md font-semibold mt-4 mb-2'>✈️ Return Flights</h3>"
          }

          setMessages(prev => [...prev, returnMessage])

          // Add return flights (last flights in the array)
          const returnFlights = mockFlights.slice(4)
          returnFlights.forEach((flight, index) => {
            setTimeout(() => {
              const flightCardMessage: Message = {
                id: `flight-${flight.id}-${Date.now()}`,
                role: "assistant",
                content: `<flight-card data='${JSON.stringify(flight)}' />`
              }

              setMessages(prev => [...prev, flightCardMessage])
            }, index * 300) // Stagger the flight cards
          })

          // Final message after all flights are shown
          setTimeout(() => {
            const finalMessage: Message = {
              id: `final-message-${Date.now()}`,
              role: "assistant",
              content: "Would you like to select one of these flights or see more options? I can also apply additional filters based on your preferences."
            }

            setMessages(prev => [...prev, finalMessage])
          }, returnFlights.length * 300 + 500)
        }, outboundFlights.length * 300 + 500)
      }, 1000)
    }, 2000)
  }, 1500)
}
