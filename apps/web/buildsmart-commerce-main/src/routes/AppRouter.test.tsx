import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import AppRouter from "./AppRouter";

vi.mock("@/pages/Home", () => ({ default: () => <div>home</div> }));
vi.mock("@/pages/Products", () => ({ default: () => <div>products</div> }));
vi.mock("@/pages/ProductDetails", () => ({ default: () => <div>details</div> }));
vi.mock("@/pages/Cart", () => ({ default: () => <div>cart</div> }));
vi.mock("@/pages/Checkout", () => ({ default: () => <div>checkout</div> }));
vi.mock("@/pages/About", () => ({ default: () => <div>about</div> }));
vi.mock("@/pages/Contact", () => ({ default: () => <div>contact</div> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <div>notfound</div> }));

describe("AppRouter", () => {
  it("renders the architectural service page at /services/architectural", () => {
    render(
      <MemoryRouter initialEntries={["/services/architectural"]}>
        <AppRouter />
      </MemoryRouter>,
    );
    expect(screen.getByText("Architectural Consultation")).toBeInTheDocument();
  });

  it("renders the interior service page at /services/interior", () => {
    render(
      <MemoryRouter initialEntries={["/services/interior"]}>
        <AppRouter />
      </MemoryRouter>,
    );
    expect(screen.getByText("Interior Design")).toBeInTheDocument();
  });
});
