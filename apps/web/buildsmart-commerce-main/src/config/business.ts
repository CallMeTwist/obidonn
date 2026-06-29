export const BUSINESS = {
  phones: ["08186927183", "08033153475", "08035620015"],
  whatsapp: "2348186927183",
  email: "donnsproperties@gmail.com",
  addresses: [
    "Eda Plaza, Jabi, Abuja, Nigeria",
    "Abari Shopping Complex, Wuse Zone 5, Abuja, Nigeria",
  ],
  mapAddress: "Eda Plaza, Jabi, Abuja, Nigeria",
  hours: "Mon–Sat 8am–6pm",
  socials: {
    instagram:
      "https://www.instagram.com/donns_designs?igsh=dHVtNG1zdzRlamh6&utm_source=qr",
  },
} as const;

export const waLink = (text: string): string =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
