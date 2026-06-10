import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingForm } from "./BookingForm";
import * as api from "@/api/consultations";

vi.mock("@/api/consultations", () => ({ submitConsultation: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));

describe("BookingForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits the form with the given service_type", async () => {
    (api.submitConsultation as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1, name: "Ada", email: "a@b.com", service_type: "interior", message: "hi", status: "new",
    });

    render(<BookingForm serviceType="interior" />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Ada Obi" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "I want a cozy living room." } });
    fireEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    await waitFor(() =>
      expect(api.submitConsultation).toHaveBeenCalledWith(
        expect.objectContaining({ service_type: "interior", name: "Ada Obi", email: "ada@example.com", message: "I want a cozy living room." }),
      ),
    );
  });

  it("shows a validation error when required fields are empty", async () => {
    render(<BookingForm serviceType="architectural" />);
    fireEvent.click(screen.getByRole("button", { name: /request a consultation/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(api.submitConsultation).not.toHaveBeenCalled();
  });
});
