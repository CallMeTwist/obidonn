import { describe, it, expect } from "vitest";
import { BUSINESS, waLink } from "./business";

describe("business config", () => {
  it("exposes the WhatsApp number in E.164 form", () => {
    expect(BUSINESS.whatsapp).toBe("2348186927183");
  });

  it("builds an encoded wa.me link", () => {
    expect(waLink("Hi there & welcome")).toBe(
      "https://wa.me/2348186927183?text=Hi%20there%20%26%20welcome",
    );
  });

  it("lists both addresses and the real email", () => {
    expect(BUSINESS.addresses).toHaveLength(2);
    expect(BUSINESS.email).toBe("donnsproperties@gmail.com");
  });
});
