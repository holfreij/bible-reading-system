import { describe, it, expect } from "vitest";
import {
  getBookInfo,
  getTodaysReading,
  getGlobalChapterNumber,
} from "../scripture-utils";

describe("getBookInfo", () => {
  it("returns correct info for Genesis", () => {
    const info = getBookInfo("GEN");
    expect(info).toEqual({
      shortName: "GEN",
      fullName: "Genesis",
      chapters: 50,
    });
  });

  it("returns correct info for Revelation", () => {
    const info = getBookInfo("REV");
    expect(info).toEqual({
      shortName: "REV",
      fullName: "Revelation",
      chapters: 22,
    });
  });

  it("throws for unknown book", () => {
    expect(() => getBookInfo("INVALID")).toThrow(
      "Unknown book! The shortName 'INVALID' is not valid."
    );
  });
});

describe("getTodaysReading", () => {
  it("returns first chapter on day 1", () => {
    const reading = getTodaysReading(1, ["GEN", "EXO"]);
    expect(reading).toEqual({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 1,
    });
  });

  it("returns correct chapter mid-book", () => {
    const reading = getTodaysReading(25, ["GEN", "EXO"]);
    expect(reading).toEqual({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 25,
    });
  });

  it("transitions to next book correctly", () => {
    const reading = getTodaysReading(51, ["GEN", "EXO"]);
    expect(reading).toEqual({
      shortName: "EXO",
      fullName: "Exodus",
      chapter: 1,
    });
  });

  it("wraps around when exceeding total chapters", () => {
    // GEN=50 + EXO=40 = 90 total, day 91 should wrap to chapter 1
    const reading = getTodaysReading(91, ["GEN", "EXO"]);
    expect(reading).toEqual({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 1,
    });
  });

  it("handles single-chapter books", () => {
    const reading = getTodaysReading(1, ["OBA"]);
    expect(reading).toEqual({
      shortName: "OBA",
      fullName: "Obadiah",
      chapter: 1,
    });
  });

  it("wraps correctly on single-chapter book", () => {
    const reading = getTodaysReading(2, ["OBA"]);
    expect(reading).toEqual({
      shortName: "OBA",
      fullName: "Obadiah",
      chapter: 1,
    });
  });

  it("handles last chapter of last book", () => {
    // GEN=50 + EXO=40 = 90 total, day 90 should be Exodus 40
    const reading = getTodaysReading(90, ["GEN", "EXO"]);
    expect(reading).toEqual({
      shortName: "EXO",
      fullName: "Exodus",
      chapter: 40,
    });
  });
});

describe("getGlobalChapterNumber", () => {
  it("returns 1 for Genesis chapter 1", () => {
    const result = getGlobalChapterNumber({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 1,
    });
    expect(result).toBe(1);
  });

  it("returns 50 for Genesis chapter 50", () => {
    const result = getGlobalChapterNumber({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 50,
    });
    expect(result).toBe(50);
  });

  it("returns 51 for Exodus chapter 1", () => {
    const result = getGlobalChapterNumber({
      shortName: "EXO",
      fullName: "Exodus",
      chapter: 1,
    });
    expect(result).toBe(51);
  });

  it("returns undefined for invalid chapter number", () => {
    const result = getGlobalChapterNumber({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 51,
    });
    expect(result).toBeUndefined();
  });

  it("returns undefined for chapter 0", () => {
    const result = getGlobalChapterNumber({
      shortName: "GEN",
      fullName: "Genesis",
      chapter: 0,
    });
    expect(result).toBeUndefined();
  });

  it("returns undefined for unknown book", () => {
    const result = getGlobalChapterNumber({
      shortName: "FAKE",
      fullName: "Fake",
      chapter: 1,
    });
    expect(result).toBeUndefined();
  });

  it("returns correct number for Revelation 22 (last chapter)", () => {
    // Total chapters in Bible = 1189
    const result = getGlobalChapterNumber({
      shortName: "REV",
      fullName: "Revelation",
      chapter: 22,
    });
    expect(result).toBe(1189);
  });
});
