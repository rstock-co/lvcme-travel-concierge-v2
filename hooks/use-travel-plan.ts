"use client"

import { useTravelState } from "./use-travel-state"

export function useTravelPlan() {
  const { travelPlan } = useTravelState()

  return {
    travelPlan,
  }
}

