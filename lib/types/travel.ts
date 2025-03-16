export type Flight = {
  id: string
  airline: string
  flightNumber: string
  departureCity: string
  departureAirport: string
  departureTime: string
  arrivalCity: string
  arrivalAirport: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  date: string
}

export type HotelType = {
  id?: string
  name: string
  stars: number
  distance: number
  distanceText: string
  pricePerNight: number
  totalPrice: number
  nights: number
  amenities: string[]
}

export type Entertainment = {
  id?: string
  name: string
  type: string
  price: number
  location: string
  rating: number
  description: string
}

export type TravelPlan = {
  departureFlight: Flight | null
  returnFlight: Flight | null
  hotel: HotelType | null
  entertainment: Entertainment[]
  totalBudget?: number
  currentSpend: number
}

// Helper functions
export const renderStars = (count: number) => {
  return "★".repeat(count) + "☆".repeat(5 - count)
}

// Mock data for development
export const MOCK_FLIGHTS = {
  departureFlights: [
    {
      id: "DF1",
      airline: "Delta",
      flightNumber: "DL1234",
      departureCity: "New York",
      departureAirport: "JFK International Airport",
      departureTime: "08:30",
      arrivalCity: "Las Vegas",
      arrivalAirport: "Harry Reid International Airport (LAS)",
      arrivalTime: "11:45",
      duration: "3h 15m",
      price: 349,
      stops: 0,
      date: "2025-04-14",
    },
    {
      id: "DF2",
      airline: "American",
      flightNumber: "AA5678",
      departureCity: "New York",
      departureAirport: "JFK International Airport",
      departureTime: "11:15",
      arrivalCity: "Las Vegas",
      arrivalAirport: "Harry Reid International Airport (LAS)",
      arrivalTime: "13:45",
      duration: "3h 30m",
      price: 279,
      stops: 0,
      date: "2025-04-14",
    },
    {
      id: "DF3",
      airline: "United",
      flightNumber: "UA9012",
      departureCity: "New York",
      departureAirport: "JFK International Airport",
      departureTime: "14:20",
      arrivalCity: "Las Vegas",
      arrivalAirport: "Harry Reid International Airport (LAS)",
      arrivalTime: "17:05",
      duration: "3h 45m",
      price: 329,
      stops: 1,
      date: "2025-04-14",
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
      arrivalCity: "New York",
      arrivalAirport: "JFK International Airport",
      arrivalTime: "11:30",
      duration: "3h 15m",
      price: 319,
      stops: 0,
      date: "2025-04-19",
    },
    {
      id: "RF2",
      airline: "American",
      flightNumber: "AA9012",
      departureCity: "Las Vegas",
      departureAirport: "Harry Reid International Airport (LAS)",
      departureTime: "12:45",
      arrivalCity: "New York",
      arrivalAirport: "JFK International Airport",
      arrivalTime: "15:15",
      duration: "3h 30m",
      price: 289,
      stops: 0,
      date: "2025-04-19",
    },
    {
      id: "RF3",
      airline: "United",
      flightNumber: "UA1234",
      departureCity: "Las Vegas",
      departureAirport: "Harry Reid International Airport (LAS)",
      departureTime: "16:30",
      arrivalCity: "New York",
      arrivalAirport: "JFK International Airport",
      arrivalTime: "19:15",
      duration: "3h 45m",
      price: 309,
      stops: 1,
      date: "2025-04-19",
    },
  ],
}

export const MOCK_HOTELS = [
  {
    id: "h1",
    name: "Bellagio",
    stars: 5,
    distance: 0.1,
    distanceText: "0.1 miles from venue",
    pricePerNight: 299,
    totalPrice: 1495,
    nights: 5,
    amenities: ["Pool", "Spa", "Casino", "Fine Dining"],
  },
  {
    id: "h2",
    name: "Caesars Palace",
    stars: 5,
    distance: 0.5,
    distanceText: "0.5 miles from venue",
    pricePerNight: 249,
    totalPrice: 1245,
    nights: 5,
    amenities: ["Pool", "Spa", "Casino", "Shopping"],
  },
  {
    id: "h3",
    name: "The Venetian",
    stars: 5,
    distance: 1.2,
    distanceText: "1.2 miles from venue",
    pricePerNight: 219,
    totalPrice: 1095,
    nights: 5,
    amenities: ["Pool", "Spa", "Casino", "Gondola Rides"],
  },
  {
    id: "h4",
    name: "MGM Grand",
    stars: 4,
    distance: 1.5,
    distanceText: "1.5 miles from venue",
    pricePerNight: 189,
    totalPrice: 945,
    nights: 5,
    amenities: ["Pool", "Spa", "Casino", "Shows"],
  },
]

export const MOCK_ENTERTAINMENT = [
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

