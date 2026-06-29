// src/pages/Checkout.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Checkout from "./Checkout";

const cartItem = {
  product: { id: 1, name: "Cement", display_price: 5000 },
  variant: null,
  quantity: 2,
  unitPrice: 5000,
};

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ items: [cartItem], subtotal: 10000, clearCart: vi.fn() }),
}));
vi.mock("@/api/apiClient", () => ({ submitOrder: vi.fn().mockResolvedValue({ success: true, orderId: "ORD-TEST123" }) }));
vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

describe("Checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens a prefilled WhatsApp chat with the order details after placing the order", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<MemoryRouter><Checkout /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: "Ada Obi" } });
    fireEvent.change(screen.getByPlaceholderText(/801/i), { target: { value: "08011112222" } });
    fireEvent.change(screen.getByPlaceholderText(/adeola odeku/i), { target: { value: "Jabi, Abuja" } });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => expect(openSpy).toHaveBeenCalled());
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("https://wa.me/2348186927183");
    expect(decodeURIComponent(url)).toContain("ORD-TEST123");
    expect(decodeURIComponent(url)).toContain("Cement");
    openSpy.mockRestore();
  });
});
