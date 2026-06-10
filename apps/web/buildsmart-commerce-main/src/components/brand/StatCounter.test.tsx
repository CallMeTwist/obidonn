import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatCounter } from "./StatCounter";

vi.mock("@/lib/animation/useReducedMotion", () => ({ useReducedMotion: () => true }));

describe("StatCounter", () => {
  it("renders the final value immediately under reduced motion", () => {
    render(<StatCounter value={240} suffix="+" label="Projects" />);
    expect(screen.getByText("240+")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
