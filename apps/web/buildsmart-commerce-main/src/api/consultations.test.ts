import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "./apiClient";
import { submitConsultation, type ConsultationPayload } from "./consultations";

vi.mock("./apiClient", () => ({ default: { post: vi.fn() } }));

const payload: ConsultationPayload = {
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "08030000000",
  service_type: "architectural",
  project_type: "New build",
  message: "Build a duplex",
};

describe("submitConsultation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts to /consultations and returns the created booking", async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { message: "ok", data: { id: 1, ...payload, status: "new" } },
    });

    const result = await submitConsultation(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/consultations", payload);
    expect(result.id).toBe(1);
    expect(result.status).toBe("new");
  });
});
