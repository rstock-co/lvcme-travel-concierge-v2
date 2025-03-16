import { Button } from "@/components/ui/button"
import { Plane, Building, Ticket } from "lucide-react"

type QuickOptionsProps = {
  onSelect: (option: string) => void
}

export function QuickOptions({ onSelect }: QuickOptionsProps) {
  return (
    <div className="flex gap-2 mt-3">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 hover:bg-gray-300"
        onClick={() => onSelect("flights")}
      >
        <Plane className="h-4 w-4" />
        <span>Flights</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 hover:bg-gray-300"
        onClick={() => onSelect("hotel")}
      >
        <Building className="h-4 w-4" />
        <span>Hotel</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 hover:bg-gray-300"
        onClick={() => onSelect("entertainment")}
      >
        <Ticket className="h-4 w-4" />
        <span>Entertainment</span>
      </Button>
    </div>
  )
}
