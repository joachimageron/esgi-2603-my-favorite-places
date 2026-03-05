import { describe, it, expect } from "vitest";
import { getDistance } from "./getDistance";

describe("getDistance", () => {
  it("should return 0 for the same point", () => {
    const point = { lat: 48.8566, lng: 2.3522 };
    expect(getDistance(point, point)).toBe(0);
  });

  it("should return approximately 340 km between Paris and London", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const london = { lat: 51.5074, lng: -0.1278 };
    const distance = getDistance(paris, london);
    expect(distance).toBeGreaterThan(330);
    expect(distance).toBeLessThan(360);
  });

  it("should be symmetric", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const london = { lat: 51.5074, lng: -0.1278 };
    expect(getDistance(paris, london)).toBeCloseTo(getDistance(london, paris), 5);
  });

  it("should return a positive distance for two different points", () => {
    const bordeaux = { lat: 44.8378, lng: -0.5792 };
    const lyon = { lat: 45.7640, lng: 4.8357 };
    expect(getDistance(bordeaux, lyon)).toBeGreaterThan(0);
  });
});
