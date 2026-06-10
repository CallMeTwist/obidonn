import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

vi.mock("@/context/CartContext", () => ({ useCart: () => ({ totalItems: 0 }) }));

function renderNav() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("shows the primary links including Services", () => {
    renderNav();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
  });

  it("reveals the two service links when Services is opened", () => {
    renderNav();
    fireEvent.click(screen.getByRole("button", { name: /services/i }));
    expect(screen.getByText("Architectural Consultation")).toBeInTheDocument();
    expect(screen.getByText("Interior Design")).toBeInTheDocument();
  });
});
