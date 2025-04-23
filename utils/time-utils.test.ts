import { formatTime, calculateTotalBlocks } from "./time-utils"
import { describe, expect, test } from "vitest"

describe("formatTime", () => {
  test("formats seconds correctly", () => {
    expect(formatTime(0)).toBe("00:00")
    expect(formatTime(30)).toBe("00:30")
    expect(formatTime(60)).toBe("01:00")
    expect(formatTime(90)).toBe("01:30")
    expect(formatTime(3600)).toBe("60:00")
  })
})

describe("calculateTotalBlocks", () => {
  test("calculates correct number of blocks for part-time (4 hours)", () => {
    const blocks = calculateTotalBlocks(4)
    // 4 hours = 240 minutes
    // 240 minutes should fit approximately 8 work blocks (24 min each)
    expect(blocks).toBeGreaterThanOrEqual(8)
  })

  test("calculates correct number of blocks for regular (6 hours)", () => {
    const blocks = calculateTotalBlocks(6)
    // 6 hours = 360 minutes
    // 360 minutes should fit approximately 12 work blocks (24 min each)
    expect(blocks).toBeGreaterThanOrEqual(12)
  })

  test("calculates correct number of blocks for full-time (8 hours)", () => {
    const blocks = calculateTotalBlocks(8)
    // 8 hours = 480 minutes
    // 480 minutes should fit approximately 16 work blocks (24 min each)
    expect(blocks).toBeGreaterThanOrEqual(16)
  })
})
