"use client"

import { FC, useEffect } from 'react'
import { FlightCard, FlightData } from '../flight-card'
import { toast } from "@/hooks/use-toast"

interface MessageParserProps {
  content: string;
  isFlightCard: (isCard: boolean) => void;
}

const MessageParser: FC<MessageParserProps> = ({ content, isFlightCard }) => {
  // Use effect to signal whether this is a flight card after rendering
  useEffect(() => {
    const isCardContent = content.includes('<flight-card data=');
    isFlightCard(isCardContent);
  }, [content, isFlightCard]);

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
              theme="light"
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
