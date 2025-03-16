"use client"

import { FC, useEffect, useState } from 'react'
import { FlightCard, FlightData } from '../flight-card'
import { FlightPreferences } from '../flight-preferences'
import { toast } from "@/hooks/use-toast"
import { Message } from "ai"
import { displayFlightResults } from './flight-conversation'

interface MessageParserProps {
  content: string;
  isFlightCard: (isCard: boolean) => void;
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageParser: FC<MessageParserProps> = ({ content, isFlightCard, setMessages }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [flightsFound, setFlightsFound] = useState<number | null>(null);
  const [hasDisplayedResults, setHasDisplayedResults] = useState(false);

  // Use effect to signal whether this is a flight card or preferences after rendering
  useEffect(() => {
    const isCardContent = content.includes('<flight-card data=') || content.includes('<flight-preferences data=');
    isFlightCard(isCardContent);
  }, [content, isFlightCard]);

  // Check if we need to render flight preferences
  if (content.includes('<flight-preferences data=')) {
    try {
      // Extract the flight preferences data JSON from the message
      const match = content.match(/<flight-preferences data='(.+?)'>/)

      if (match && match[1]) {
        const preferencesData = JSON.parse(match[1])

        const handleSearch = () => {
          if (isSearching) return; // Prevent multiple clicks

          setIsSearching(true);
          setHasDisplayedResults(false);

          // If setMessages is provided, we can add the flight results after a delay
          if (setMessages) {
            // Wait for the loading to complete (7 seconds)
            setTimeout(() => {
              // Set a random number of flights found between 20-40
              const numFlights = Math.floor(Math.random() * 21) + 20;
              setFlightsFound(numFlights);
              setIsSearching(false);

              // Convert preferences to the format expected by displayFlightResults
              const flightPrefs: Record<string, string> = {
                departure_location: `${preferencesData.preferences.departure.city}, ${preferencesData.preferences.departure.state}, ${preferencesData.preferences.departure.country}`,
                arrival_timing: preferencesData.preferences.arrivalPreference === 'day-before'
                  ? 'day before'
                  : preferencesData.preferences.arrivalPreference === '2hrs-before'
                    ? '2hrs before'
                    : 'extra days',
                travel_dates: preferencesData.preferences.dates
                  ? `${preferencesData.preferences.dates.departure} to ${preferencesData.preferences.dates.return}`
                  : '',
                companions: `${preferencesData.preferences.travelers} travelers`,
                cabin_class: preferencesData.preferences.cabinClass,
                layovers: preferencesData.preferences.layoverPreference === 'direct'
                  ? 'direct'
                  : preferencesData.preferences.layoverPreference === 'one-stop'
                    ? 'one stop'
                    : 'no preference',
                departure_time: preferencesData.preferences.departureTimePreference === 'early-am'
                  ? 'early'
                  : preferencesData.preferences.departureTimePreference === 'daytime'
                    ? 'daytime'
                    : preferencesData.preferences.departureTimePreference === 'evening'
                      ? 'evening'
                      : 'no preference'
              };

              // Get airport info from preferences
              const airportInfo = preferencesData.preferences.departure.code ? {
                correctedCity: preferencesData.preferences.departure.city,
                region: preferencesData.preferences.departure.state || '',
                country: preferencesData.preferences.departure.country || '',
                airportName: preferencesData.preferences.departure.airport,
                iataCode: preferencesData.preferences.departure.code
              } : undefined;

              // Get course details from preferences
              const courseDetails = preferencesData.preferences.courseInfo ? {
                startDate: preferencesData.preferences.courseInfo.startDate,
                endDate: preferencesData.preferences.courseInfo.endDate
              } : null;

              // Only display flight results if we haven't already
              if (!hasDisplayedResults) {
                setHasDisplayedResults(true);
                // Display flight results - ensure this is called
                displayFlightResults(flightPrefs, setMessages, courseDetails, airportInfo);
              }
            }, 7000);
          } else {
            // Fallback to toast if setMessages is not provided
            toast({
              title: "Searching Flights",
              description: "Searching for flights based on your preferences...",
            })

            // Reset searching state after a delay
            setTimeout(() => {
              setIsSearching(false);
              setFlightsFound(Math.floor(Math.random() * 21) + 20);
            }, 7000);
          }
        }

        const handleEdit = () => {
          toast({
            title: "Edit Preferences",
            description: "You can modify your flight preferences here.",
          })
          // In a real app, this would open an edit modal or navigate to an edit page
        }

        return (
          <div className="w-full mb-3 flex flex-col items-center">
            <FlightPreferences
              preferences={preferencesData.preferences}
              onSearch={handleSearch}
              onEdit={handleEdit}
              isSearching={isSearching}
              flightsFound={flightsFound}
            />
          </div>
        )
      }
    } catch (error) {
      console.error('Error parsing flight preferences data:', error)
    }
  }

  // Check if we need to render a flight card
  if (content.includes('<flight-card data=')) {
    try {
      // Extract the flight data JSON from the message
      const match = content.match(/<flight-card data='(.+?)' \/>/)

      if (match && match[1]) {
        const flightData: FlightData = JSON.parse(match[1])

        // Handle flight selection
        const handleSelectFlight = (flight: FlightData) => {
          toast({
            title: "Flight Selected",
            description: `You've selected ${flight.airline.name} flight #${flight.id} from ${flight.departure.city} to ${flight.arrival.city}`,
          })
        }

        return (
          <div className="w-full mb-3">
            <FlightCard
              flight={flightData}
              onSelect={handleSelectFlight}
            />
          </div>
        )
      }
    } catch (error) {
      console.error('Error parsing flight card data:', error)
    }
  }

  // For regular content or fallback, render as HTML
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

export { MessageParser }
