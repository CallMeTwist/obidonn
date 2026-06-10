import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { toast } from "@/hooks/use-toast";

const BUSINESS_EMAIL    = "hello@donns.com";
const BUSINESS_WHATSAPP = "2348000000000";
const BUSINESS_PHONE    = "+234 800 000 0000";
const BUSINESS_ADDRESS  = "Lagos, Nigeria";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`[DONNS Enquiry] ${form.subject}`);
    const body    = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
    toast({ title: "Email client opened!", description: "Your message has been pre-filled. Just hit Send." });
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  const handleWhatsApp = () => {
    if (!form.name || !form.message) {
      toast({ title: "Fill in your name and message first", variant: "destructive" });
      return;
    }
    const text = encodeURIComponent(
      `Hello, I'm ${form.name}.\n\n*Subject:* ${form.subject || "General Enquiry"}\n\n${form.message}\n\nReply to: ${form.email}`
    );
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${text}`, "_blank");
  };

  const inputClass = "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  const iconBox = "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <Eyebrow>Get in touch</Eyebrow>
        <h1 className="mt-3 font-heading text-3xl md:text-4xl font-semibold text-foreground">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">Get in touch with our team</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Left column — contact info */}
        <div>
          <div className="space-y-6">

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className={iconBox}>
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">Phone / WhatsApp</h3>
                <p className="text-sm text-foreground">{BUSINESS_PHONE}</p>
                <p className="text-xs text-muted-foreground">Mon–Sat 8am–6pm</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className={iconBox}>
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">Email</h3>
                <p className="text-sm text-foreground">{BUSINESS_EMAIL}</p>
                <p className="text-xs text-muted-foreground">We reply within 24 hours</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className={iconBox}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">Address</h3>
                <p className="text-sm text-foreground">{BUSINESS_ADDRESS}</p>
                <p className="text-xs text-muted-foreground">Visit us in person</p>
              </div>
            </div>

          </div>

          {/* Map */}
          <div className="mt-8 overflow-hidden rounded-lg border border-border">
            <iframe
              title="Store Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_ADDRESS)}&output=embed`}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right column — form */}
        <form
          onSubmit={handleEmail}
          className="space-y-5 rounded-lg border border-border bg-card p-6 card-shadow"
        >
          <h2 className="font-heading text-xl font-semibold text-foreground">Send a Message</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Your Name"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="Your Email"
            />
          </div>

          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={inputClass}
            placeholder="Subject"
          />

          <textarea
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} min-h-[120px]`}
            placeholder="Your message..."
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="flex-1 gap-2 btn-gold border-0 font-semibold" disabled={sending}>
              <Send className="h-4 w-4" />
              Send via Email
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <MessageCircle className="h-4 w-4" />
              Send via WhatsApp
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Email opens your mail client · WhatsApp opens the chat directly
          </p>
        </form>

      </div>
    </div>
  );
};

export default Contact;
