import { describe, expect, it } from "vitest";
import { addDays, formatBani, parseDate, parseLeiInput, startOfWeek, toDateString } from "./money";

describe("reading amounts typed by the user", () => {
  it("accepts a comma or a dot", () => {
    expect(parseLeiInput("12,50")).toBe(1250);
    expect(parseLeiInput("12.5")).toBe(1250);
    expect(parseLeiInput(" 7 ")).toBe(700);
  });
  it("rejects empty, zero, negative and silly amounts", () => {
    expect(parseLeiInput("")).toBeNull();
    expect(parseLeiInput("0")).toBeNull();
    expect(parseLeiInput("-5")).toBeNull();
    expect(parseLeiInput("abc")).toBeNull();
    expect(parseLeiInput("999999999")).toBeNull();
  });
});

describe("formatting", () => {
  it("shows negative amounts and small bani", () => {
    expect(formatBani(-75000)).toBe("-750");
    expect(formatBani(5)).toBe("0,05");
  });
});

describe("dates", () => {
  it("finds Monday of the week", () => {
    expect(toDateString(startOfWeek(new Date(2026, 9, 7)))).toBe("2026-10-05"); // Wednesday -> Monday
    expect(toDateString(startOfWeek(new Date(2026, 9, 11)))).toBe("2026-10-05"); // Sunday -> Monday
    expect(toDateString(startOfWeek(new Date(2026, 9, 5)))).toBe("2026-10-05"); // Monday stays
  });
  it("reads YYYY-MM-DD as a local date", () => {
    expect(toDateString(parseDate("2027-03-01"))).toBe("2027-03-01");
    expect(toDateString(addDays(parseDate("2026-12-30"), 3))).toBe("2027-01-02");
  });
});
