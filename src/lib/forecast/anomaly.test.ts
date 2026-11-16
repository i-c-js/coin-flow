import { describe, expect, it } from "vitest";
import { isUnusualWeek } from "./anomaly";

describe("unusual spending", () => {
  const past = [300, 250, 320, 280]; // average 287.5, standard deviation ≈ 26

  it("flags a week that is much higher than normal", () => {
    expect(isUnusualWeek(past, 600)).toBe(true);
  });
  it("does not flag a normal week", () => {
    expect(isUnusualWeek(past, 310)).toBe(false);
  });
  it("does not flag low spending", () => {
    expect(isUnusualWeek(past, 50)).toBe(false);
  });
  it("needs at least 4 past weeks", () => {
    expect(isUnusualWeek([300, 250, 320], 2000)).toBe(false);
  });
  it("handles weeks that were all the same", () => {
    expect(isUnusualWeek([200, 200, 200, 200], 201)).toBe(true);
    expect(isUnusualWeek([200, 200, 200, 200], 200)).toBe(false);
  });
});
