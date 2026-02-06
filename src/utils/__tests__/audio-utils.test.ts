import { describe, it, expect } from "vitest";
import { formatTime } from "../audio-utils";

describe("formatTime", () => {
  it("returns 0:00 for undefined", () => {
    expect(formatTime(undefined)).toBe("0:00");
  });

  it("returns 0:00 for 0", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats seconds correctly", () => {
    expect(formatTime(5)).toBe("0:05");
  });

  it("formats minutes correctly", () => {
    expect(formatTime(60)).toBe("1:00");
  });

  it("formats minutes and seconds correctly", () => {
    expect(formatTime(125)).toBe("2:05");
  });

  it("pads single-digit seconds", () => {
    expect(formatTime(61)).toBe("1:01");
  });

  it("handles fractional seconds by flooring", () => {
    expect(formatTime(65.7)).toBe("1:05");
  });

  it("handles large values", () => {
    expect(formatTime(3661)).toBe("61:01");
  });
});
