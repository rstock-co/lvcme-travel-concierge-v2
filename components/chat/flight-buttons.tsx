import { Button } from "@/components/ui/button"
import {
  Plane,
  Check,
  Calendar,
  User,
  Users,
  Clock,
  ArrowRight,
  Armchair,
  Briefcase,
  Crown,
  MapPin
} from "lucide-react"
import { FlightStep } from "./flight-conversation"

type FlightButtonsProps = {
  step: FlightStep | null
  onSelect: (step: FlightStep, choice: string) => void
}

export function FlightButtons({ step, onSelect }: FlightButtonsProps) {
  if (!step) return null

  switch(step) {
    case "departure_location":
      // No buttons for this step, user needs to type their departure location
      return null
    case "confirm_departure":
      return (
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300"
            onClick={() => onSelect("confirm_departure", "Yes, that's correct")}
          >
            <Check className="h-4 w-4" />
            <span>Yes, that&apos;s correct</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300"
            onClick={() => onSelect("confirm_departure", "No, let me clarify")}
          >
            <ArrowRight className="h-4 w-4" />
            <span>No, let me clarify</span>
          </Button>
        </div>
      )
    case "arrival_timing":
      return (
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("arrival_timing", "Arrive the day before my course")}
          >
            <Calendar className="h-4 w-4" />
            <span>Arrive the day before my course</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("arrival_timing", "Arrive as late as 2hrs before my course")}
          >
            <Clock className="h-4 w-4" />
            <span>Arrive as late as 2hrs before my course</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("arrival_timing", "Stay extra days before or after my course")}
          >
            <Calendar className="h-4 w-4" />
            <span>Stay extra days before or after my course</span>
          </Button>
        </div>
      )
    case "companions":
      return (
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300"
            onClick={() => onSelect("companions", "Alone")}
          >
            <User className="h-4 w-4" />
            <span>Alone</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300"
            onClick={() => onSelect("companions", "With companions")}
          >
            <Users className="h-4 w-4" />
            <span>With companions</span>
          </Button>
        </div>
      )
    case "cabin_class":
      return (
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("cabin_class", "Economy")}
          >
            <Armchair className="h-4 w-4" />
            <span>Economy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("cabin_class", "Business Class")}
          >
            <Briefcase className="h-4 w-4" />
            <span>Business Class</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("cabin_class", "First Class")}
          >
            <Crown className="h-4 w-4" />
            <span>First Class</span>
          </Button>
        </div>
      )
    case "layovers":
      return (
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("layovers", "Direct flights only")}
          >
            <Plane className="h-4 w-4" />
            <span>Direct flights only</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("layovers", "1 stop")}
          >
            <MapPin className="h-4 w-4" />
            <span>1 stop</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("layovers", "Doesn't matter")}
          >
            <Check className="h-4 w-4" />
            <span>Doesn&apos;t matter</span>
          </Button>
        </div>
      )
    case "departure_time":
      return (
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("departure_time", "Early AM (before 9AM)")}
          >
            <Clock className="h-4 w-4" />
            <span>Early AM (before 9AM)</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("departure_time", "Daytime (9 AM - 5 PM)")}
          >
            <Clock className="h-4 w-4" />
            <span>Daytime (9 AM - 5 PM)</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 hover:bg-gray-300 justify-start"
            onClick={() => onSelect("departure_time", "Evening (after 5PM)")}
          >
            <Clock className="h-4 w-4" />
            <span>Evening (after 5PM)</span>
          </Button>
        </div>
      )
    default:
      return null
  }
}
