export const extractFlightData = (content: string, courseDetails: any) => {
  // This is a simplified extraction - in a real app, you'd use a more robust approach
  // or have the AI return structured data directly

  // For demo purposes, we'll create some mock flight data if the message mentions flights
  if (content.includes("flight")) {
    const departureCity = content.match(/from\s+([A-Za-z\s]+)(?:\s+to|\s+on)/i)?.[1] || "New York"

    // Generate departure date based on course start date
    const courseStart = new Date(courseDetails.startDate || new Date())
    const departureDate = new Date(courseStart)
    departureDate.setDate(courseStart.getDate() - 1) // Day before course

    // Generate return date based on course end date
    const courseEnd = new Date(courseDetails.endDate || new Date())
    const returnDate = new Date(courseEnd)
    returnDate.setDate(courseEnd.getDate() + 1) // Day after course

    // Call our mock flight search function
    return {
      departureFlights: [
        {
          id: "DF1",
          airline: "Delta",
          flightNumber: "DL1234",
          departureCity,
          departureAirport: `${departureCity} International Airport`,
          departureTime: "08:30",
          arrivalCity: "Las Vegas",
          arrivalAirport: "Harry Reid International Airport (LAS)",
          arrivalTime: "11:45",
          duration: "3h 15m",
          price: 349,
          stops: 0,
          date: departureDate.toISOString().split("T")[0],
        },
        {
          id: "DF2",
          airline: "American",
          flightNumber: "AA5678",
          departureCity,
          departureAirport: `${departureCity} International Airport`,
          departureTime: "11:15",
          arrivalCity: "Las Vegas",
          arrivalAirport: "Harry Reid International Airport (LAS)",
          arrivalTime: "13:45",
          duration: "3h 30m",
          price: 279,
          stops: 0,
          date: departureDate.toISOString().split("T")[0],
        },
        {
          id: "DF3",
          airline: "United",
          flightNumber: "UA9012",
          departureCity,
          departureAirport: `${departureCity} International Airport`,
          departureTime: "14:20",
          arrivalCity: "Las Vegas",
          arrivalAirport: "Harry Reid International Airport (LAS)",
          arrivalTime: "17:05",
          duration: "3h 45m",
          price: 329,
          stops: 1,
          date: departureDate.toISOString().split("T")[0],
        },
      ],
      returnFlights: [
        {
          id: "RF1",
          airline: "Delta",
          flightNumber: "DL5678",
          departureCity: "Las Vegas",
          departureAirport: "Harry Reid International Airport (LAS)",
          departureTime: "09:15",
          arrivalCity: departureCity,
          arrivalAirport: `${departureCity} International Airport`,
          arrivalTime: "11:30",
          duration: "3h 15m",
          price: 319,
          stops: 0,
          date: returnDate.toISOString().split("T")[0],
        },
        {
          id: "RF2",
          airline: "American",
          flightNumber: "AA9012",
          departureCity: "Las Vegas",
          departureAirport: "Harry Reid International Airport (LAS)",
          departureTime: "12:45",
          arrivalCity: departureCity,
          arrivalAirport: `${departureCity} International Airport`,
          arrivalTime: "15:15",
          duration: "3h 30m",
          price: 289,
          stops: 0,
          date: returnDate.toISOString().split("T")[0],
        },
        {
          id: "RF3",
          airline: "United",
          flightNumber: "UA1234",
          departureCity: "Las Vegas",
          departureAirport: "Harry Reid International Airport (LAS)",
          departureTime: "16:30",
          arrivalCity: departureCity,
          arrivalAirport: `${departureCity} International Airport`,
          arrivalTime: "19:15",
          duration: "3h 45m",
          price: 309,
          stops: 1,
          date: returnDate.toISOString().split("T")[0],
        },
      ],
    }
  }
  return null
}

// Helper function to extract hotel data from message content
export const extractHotelData = (content: string, courseDetails: any) => {
  // For demo purposes, we'll create some mock hotel data if the message mentions hotels
  if (content.includes("hotel") || content.includes("accommodation")) {
    // Generate check-in date based on course start date
    const courseStart = new Date(courseDetails.startDate || new Date())
    const checkIn = new Date(courseStart)
    checkIn.setDate(courseStart.getDate() - 1) // Day before course

    // Generate check-out date based on course end date
    const courseEnd = new Date(courseDetails.endDate || new Date())
    const checkOut = new Date(courseEnd)
    checkOut.setDate(courseEnd.getDate() + 1) // Day after course

    // Calculate number of nights
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return [
      {
        id: "h1",
        name: "Bellagio",
        stars: 5,
        distance: 0.1,
        distanceText: "0.1 miles from venue",
        pricePerNight: 299,
        totalPrice: 299 * nights,
        nights,
        amenities: ["Pool", "Spa", "Casino", "Fine Dining"],
      },
      {
        id: "h2",
        name: "Caesars Palace",
        stars: 5,
        distance: 0.5,
        distanceText: "0.5 miles from venue",
        pricePerNight: 249,
        totalPrice: 249 * nights,
        nights,
        amenities: ["Pool", "Spa", "Casino", "Shopping"],
      },
      {
        id: "h3",
        name: "The Venetian",
        stars: 5,
        distance: 1.2,
        distanceText: "1.2 miles from venue",
        pricePerNight: 219,
        totalPrice: 219 * nights,
        nights,
        amenities: ["Pool", "Spa", "Casino", "Gondola Rides"],
      },
      {
        id: "h4",
        name: "MGM Grand",
        stars: 4,
        distance: 1.5,
        distanceText: "1.5 miles from venue",
        pricePerNight: 189,
        totalPrice: 189 * nights,
        nights,
        amenities: ["Pool", "Spa", "Casino", "Shows"],
      },
    ]
  }
  return []
}

// Helper function to extract entertainment data from message content
export const extractEntertainmentData = (content: string) => {
  // For demo purposes, we'll create some mock entertainment data if the message mentions entertainment
  if (content.includes("entertainment") || content.includes("activity") || content.includes("show")) {
    return [
      {
        id: "e1",
        name: "Cirque du Soleil - O",
        type: "Show",
        price: 150,
        location: "Bellagio",
        rating: 4.9,
        description: "Aquatic masterpiece with synchronized swimming, diving and aerial acrobatics",
      },
      {
        id: "e2",
        name: "Blue Man Group",
        type: "Show",
        price: 99,
        location: "Luxor",
        rating: 4.7,
        description: "Combination of music, comedy and multimedia theatrics",
      },
      {
        id: "e3",
        name: "Grand Canyon Helicopter Tour",
        type: "Excursion",
        price: 399,
        location: "Departs from Las Vegas Strip",
        rating: 4.8,
        description: "Breathtaking aerial views of the Grand Canyon with landing on the canyon floor",
      },
      {
        id: "e4",
        name: "Gordon Ramsay Hell's Kitchen",
        type: "Dining",
        price: 120,
        location: "Caesars Palace",
        rating: 4.7,
        description: "Signature restaurant from the celebrity chef featuring his classic dishes",
      },
    ]
  }
  return []
}

// Process AI message for travel selections
export const processAIMessage = (message: any) => {
  const updates = {
    departureFlight: null as any,
    returnFlight: null as any,
    hotel: null as any,
    entertainment: null as any,
    budget: null as number | null,
  }

  try {
    // Check for flight selections
    if (message.content.includes("flight") || message.content.includes("airline")) {
      const flightMatch = message.content.match(/flight (\w+\d+)/i)
      const priceMatch = message.content.match(/\$(\d+)/)

      if (flightMatch && priceMatch) {
        const flightNumber = flightMatch[1]
        const price = Number.parseInt(priceMatch[1])

        // Determine if it's a departure or return flight
        if (
          message.content.toLowerCase().includes("to las vegas") ||
          message.content.toLowerCase().includes("outbound") ||
          message.content.toLowerCase().includes("departure")
        ) {
          updates.departureFlight = {
            id: `df-${Date.now()}`,
            airline: message.content.includes("Delta")
              ? "Delta"
              : message.content.includes("American")
                ? "American"
                : message.content.includes("Southwest")
                  ? "Southwest"
                  : "United",
            flightNumber,
            departureCity: message.content.match(/from ([A-Za-z\s]+) to/i)?.[1] || "Origin City",
            departureAirport: "Origin Airport",
            departureTime: message.content.match(/(\d+:\d+\s*[AP]M)/i)?.[1] || "9:00 AM",
            arrivalCity: "Las Vegas",
            arrivalAirport: "LAS",
            arrivalTime: message.content.match(/arrives? (?:at )?(\d+:\d+\s*[AP]M)/i)?.[1] || "11:00 AM",
            duration: message.content.match(/(\d+h \d+m)/i)?.[1] || "3h 0m",
            price,
            stops:
              message.content.toLowerCase().includes("non-stop") || message.content.toLowerCase().includes("nonstop")
                ? 0
                : 1,
            date: message.content.match(/on ([A-Za-z]+ \d+)/i)?.[1] || new Date().toLocaleDateString(),
          }
        } else if (
          message.content.toLowerCase().includes("from las vegas") ||
          message.content.toLowerCase().includes("return") ||
          message.content.toLowerCase().includes("inbound")
        ) {
          updates.returnFlight = {
            id: `rf-${Date.now()}`,
            airline: message.content.includes("Delta")
              ? "Delta"
              : message.content.includes("American")
                ? "American"
                : message.content.includes("Southwest")
                  ? "Southwest"
                  : "United",
            flightNumber,
            departureCity: "Las Vegas",
            departureAirport: "LAS",
            departureTime: message.content.match(/(\d+:\d+\s*[AP]M)/i)?.[1] || "9:00 AM",
            arrivalCity: message.content.match(/to ([A-Za-z\s]+)/i)?.[1] || "Destination City",
            arrivalAirport: "Destination Airport",
            arrivalTime: message.content.match(/arrives? (?:at )?(\d+:\d+\s*[AP]M)/i)?.[1] || "11:00 AM",
            duration: message.content.match(/(\d+h \d+m)/i)?.[1] || "3h 0m",
            price,
            stops:
              message.content.toLowerCase().includes("non-stop") || message.content.toLowerCase().includes("nonstop")
                ? 0
                : 1,
            date: message.content.match(/on ([A-Za-z]+ \d+)/i)?.[1] || new Date().toLocaleDateString(),
          }
        }
      }
    }

    // Check for hotel selections
    if (message.content.includes("hotel") || message.content.includes("stay")) {
      const hotelMatch =
        message.content.match(/hotel (?:called |named )?["']?([A-Za-z\s']+)["']?/i) ||
        message.content.match(/at the ([A-Za-z\s']+) hotel/i) ||
        message.content.match(/stay at (?:the )?([A-Za-z\s']+)/i)
      const priceMatch = message.content.match(/\$(\d+)(?:\/night| per night)?/)

      if (hotelMatch && priceMatch) {
        const hotelName = hotelMatch[1].trim()
        const pricePerNight = Number.parseInt(priceMatch[1])
        const nightsMatch = message.content.match(/for (\d+) nights?/i)
        const nights = nightsMatch ? Number.parseInt(nightsMatch[1]) : 3

        updates.hotel = {
          id: `h-${Date.now()}`,
          name: hotelName,
          stars:
            message.content.includes("5-star") || message.content.includes("five star")
              ? 5
              : message.content.includes("4-star") || message.content.includes("four star")
                ? 4
                : message.content.includes("3-star") || message.content.includes("three star")
                  ? 3
                  : 4,
          distance: Number.parseFloat(message.content.match(/(\d+\.\d+) miles?/i)?.[1] || "0.5"),
          distanceText: message.content.match(/(\d+\.\d+ miles? from [A-Za-z\s]+)/i)?.[1] || "0.5 miles from venue",
          pricePerNight,
          totalPrice: pricePerNight * nights,
          nights,
          amenities: ["Pool", "Spa", "Free Wi-Fi"],
        }
      }
    }

    // Check for entertainment selections
    if (
      message.content.includes("entertainment") ||
      message.content.includes("show") ||
      message.content.includes("tour") ||
      message.content.includes("activity")
    ) {
      const entertainmentMatch =
        message.content.match(/["']([A-Za-z\s\-']+)["']/i) ||
        message.content.match(/the ([A-Za-z\s\-']+) show/i) ||
        message.content.match(/the ([A-Za-z\s\-']+) tour/i) ||
        message.content.match(/([A-Za-z\s\-']+) experience/i)
      const priceMatch = message.content.match(/\$(\d+)/)

      if (entertainmentMatch && priceMatch) {
        const name = entertainmentMatch[1].trim()
        const price = Number.parseInt(priceMatch[1])

        updates.entertainment = {
          id: `e-${Date.now()}`,
          name,
          type: message.content.toLowerCase().includes("show")
            ? "Show"
            : message.content.toLowerCase().includes("tour")
              ? "Excursion"
              : message.content.toLowerCase().includes("dining") || message.content.toLowerCase().includes("restaurant")
                ? "Dining"
                : "Activity",
          price,
          location: message.content.match(/at (?:the )?([A-Za-z\s']+)/i)?.[1] || "Las Vegas Strip",
          rating: 4.7,
          description: message.content.match(/featuring ([^.]+)/i)?.[1] || "An exciting Las Vegas experience",
        }
      }
    }

    // Check for budget
    const budgetMatch = message.content.match(/budget (?:of |is )?\$(\d+(?:,\d+)?)/i)
    if (budgetMatch) {
      updates.budget = Number.parseInt(budgetMatch[1].replace(",", ""))
    }
  } catch (error) {
    console.error("Error processing AI message:", error)
  }

  return updates
}

