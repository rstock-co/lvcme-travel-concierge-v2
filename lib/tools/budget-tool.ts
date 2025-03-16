import { StructuredTool } from "@langchain/core/tools"
import { z } from "zod"

export function manageBudget() {
  return new StructuredTool({
    name: "manageBudget",
    description: "Manage and track the user's travel budget",
    schema: z.object({
      totalBudget: z.number().describe("The user's total budget for the trip"),
      expenses: z
        .object({
          flights: z.number().optional().describe("Total cost of flights"),
          hotel: z.number().optional().describe("Total cost of hotel"),
          entertainment: z.number().optional().describe("Total cost of entertainment"),
        })
        .describe("Current expenses"),
    }),
    func: async ({ totalBudget, expenses }) => {
      try {
        const totalExpenses = (expenses.flights || 0) + (expenses.hotel || 0) + (expenses.entertainment || 0)
        const remainingBudget = totalBudget - totalExpenses
        const isOverBudget = remainingBudget < 0

        // Calculate percentage of budget used
        const percentUsed = Math.round((totalExpenses / totalBudget) * 100)

        let budgetStatus = "on track"
        if (isOverBudget) {
          budgetStatus = "over budget"
        } else if (percentUsed > 90) {
          budgetStatus = "near limit"
        } else if (percentUsed < 50) {
          budgetStatus = "well under budget"
        }

        return JSON.stringify({
          success: true,
          budgetSummary: {
            totalBudget,
            totalExpenses,
            remainingBudget,
            percentUsed,
            budgetStatus,
            breakdown: {
              flights: expenses.flights || 0,
              hotel: expenses.hotel || 0,
              entertainment: expenses.entertainment || 0,
            },
          },
          message: isOverBudget
            ? `You are $${Math.abs(remainingBudget)} over your budget of $${totalBudget}.`
            : `You have $${remainingBudget} remaining from your budget of $${totalBudget}.`,
        })
      } catch (error) {
        console.error("Error managing budget:", error)
        return JSON.stringify({
          success: false,
          message: "Unable to manage budget at this time. Please try again later.",
        })
      }
    },
  })
}

