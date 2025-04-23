import { render, screen, fireEvent } from "@testing-library/react"
import { PlanSelector } from "./plan-selector"
import { PomodoroProvider } from "@/context/PomodoroContext"

// Mock the context
jest.mock("@/context/PomodoroContext", () => ({
  ...jest.requireActual("@/context/PomodoroContext"),
  usePomodoroContext: () => ({
    createSession: jest.fn(),
  }),
  PLAN_OPTIONS: [
    { id: "part-time", label: "Part-time", hours: 4, description: "4 hours of focused work" },
    { id: "regular", label: "Regular", hours: 6, description: "6 hours of focused work" },
    { id: "full-time", label: "Full-time", hours: 8, description: "8 hours of focused work" },
  ],
}))

describe("PlanSelector", () => {
  test("renders all plan options", () => {
    render(
      <PomodoroProvider>
        <PlanSelector />
      </PomodoroProvider>,
    )

    expect(screen.getByText("Part-time")).toBeInTheDocument()
    expect(screen.getByText("Regular")).toBeInTheDocument()
    expect(screen.getByText("Full-time")).toBeInTheDocument()

    expect(screen.getByText("4h")).toBeInTheDocument()
    expect(screen.getByText("6h")).toBeInTheDocument()
    expect(screen.getByText("8h")).toBeInTheDocument()
  })

  test("calls createSession when a plan is selected", () => {
    const { usePomodoroContext } = require("@/context/PomodoroContext")
    const createSessionMock = jest.fn()
    usePomodoroContext.mockReturnValue({ createSession: createSessionMock })

    render(
      <PomodoroProvider>
        <PlanSelector />
      </PomodoroProvider>,
    )

    fireEvent.click(screen.getByText("Part-time"))
    expect(createSessionMock).toHaveBeenCalledWith("part-time")
  })
})
